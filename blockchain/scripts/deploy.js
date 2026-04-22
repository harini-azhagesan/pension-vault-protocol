import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

    const artifactPath = path.join(__dirname, "../artifacts/contracts/PensionLedger.sol/PensionLedger.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log("PensionLedger deployed to:", address);

    const contractInfo = {
        address: address,
        abi: artifact.abi
    };

    const outputDir = path.join(__dirname, "../../server/utils");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(outputDir, "contract.json"),
        JSON.stringify(contractInfo, null, 2)
    );
    
    console.log("Contract info exported to server/utils/contract.json");
}

main().catch(console.error);
