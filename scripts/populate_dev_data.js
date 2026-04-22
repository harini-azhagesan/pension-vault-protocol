const upids = ["UPL-2026-6812", "UPL-2026-9999"];
const employers = ["Google India", "Tata Consultancy Services", "Reliance Industries"];

async function populate() {
    for (const upid of upids) {
        for (let i = 0; i < 3; i++) {
            const employerId = employers[Math.floor(Math.random() * employers.length)];
            const amount = Math.floor(Math.random() * 50000) + 10000;
            const months = ["January", "February", "March", "April"];
            const month = months[i];
            
            try {
                const response = await fetch('http://localhost:5000/api/contributions/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        upid,
                        employerId,
                        amount,
                        month,
                        year: "2026"
                    })
                });
                const data = await response.json();
                console.log(`Added contribution for ${upid} via ${employerId}: ${data.blockchainHash}`);
            } catch (err) {
                console.error("Error adding contribution:", err.message);
            }
        }
    }
}

populate();
