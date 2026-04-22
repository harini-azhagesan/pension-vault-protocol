// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PensionLedger {
    struct Contribution {
        string upid;
        string contributionHash;
        uint256 timestamp;
    }

    struct HeirInfo {
        address[] heirs;
        uint256 lastPing;
        uint256 timeoutPeriod;
        uint256 claimTimestamp; // 0 if no claim pending
        bool isDeceased;
    }

    mapping(string => Contribution[]) public userContributions;
    mapping(string => HeirInfo) public userHeirs;
    
    uint256 public constant TIMELOCK_DURATION = 3 days; // 3 day safety buffer

    event ContributionLogged(string indexed upid, string contributionHash, uint256 timestamp);
    event HeirSet(string indexed upid, address[] heirs, uint256 timeoutPeriod);
    event Pinged(string indexed upid, uint256 timestamp);
    event InheritanceClaimed(string indexed upid, uint256 unlockTime);
    event InheritanceCancelled(string indexed upid);
    event InheritanceExecuted(string indexed upid, address[] heirs, uint256 timestamp);

    function logContribution(string memory _upid, string memory _contributionHash) public {
        Contribution memory newContribution = Contribution({
            upid: _upid,
            contributionHash: _contributionHash,
            timestamp: block.timestamp
        });
        
        userContributions[_upid].push(newContribution);
        emit ContributionLogged(_upid, _contributionHash, block.timestamp);
    }

    function getContributions(string memory _upid) public view returns (Contribution[] memory) {
        return userContributions[_upid];
    }

    function setHeir(string memory _upid, address[] memory _heirs, uint256 _timeoutPeriod) public {
        HeirInfo storage info = userHeirs[_upid];
        info.heirs = _heirs;
        info.timeoutPeriod = _timeoutPeriod;
        info.lastPing = block.timestamp;
        info.claimTimestamp = 0;
        info.isDeceased = false;
        
        emit HeirSet(_upid, _heirs, _timeoutPeriod);
    }

    function pingProtocol(string memory _upid) public {
        HeirInfo storage info = userHeirs[_upid];
        require(info.heirs.length > 0, "Heirs not set");
        require(!info.isDeceased, "Account marked as deceased");
        
        info.lastPing = block.timestamp;
        if (info.claimTimestamp > 0) {
            info.claimTimestamp = 0; // Automatically cancel any pending claim on activity
            emit InheritanceCancelled(_upid);
        }
        emit Pinged(_upid, block.timestamp);
    }

    function claimInheritance(string memory _upid) public {
        HeirInfo storage info = userHeirs[_upid];
        require(info.heirs.length > 0, "Heirs not set");
        require(!info.isDeceased, "Already executed");
        require(block.timestamp > info.lastPing + info.timeoutPeriod, "Timeout period not reached");
        require(info.claimTimestamp == 0, "Claim already pending");

        info.claimTimestamp = block.timestamp;
        emit InheritanceClaimed(_upid, block.timestamp + TIMELOCK_DURATION);
    }

    function executeInheritance(string memory _upid) public {
        HeirInfo storage info = userHeirs[_upid];
        require(info.claimTimestamp > 0, "No claim pending");
        require(block.timestamp > info.claimTimestamp + TIMELOCK_DURATION, "Timelock not expired");
        require(!info.isDeceased, "Already executed");

        info.isDeceased = true;
        emit InheritanceExecuted(_upid, info.heirs, block.timestamp);
    }

    function getHeirInfo(string memory _upid) public view returns (address[] memory, uint256, uint256, uint256, bool) {
        HeirInfo memory info = userHeirs[_upid];
        return (info.heirs, info.lastPing, info.timeoutPeriod, info.claimTimestamp, info.isDeceased);
    }
}

