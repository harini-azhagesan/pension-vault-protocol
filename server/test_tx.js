// using native fetch

async function run() {
    try {
        const body = JSON.stringify({
            upid: 'UPL-2026-3685', // Alice's UPID
            employerId: '65f1a2b3c4d5e6f7a8b9c0d1', // mock employer id
            amount: 50000,
            month: '2026-04',
            year: 2026
        });

        const res = await fetch('http://localhost:5000/api/contributions/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });
        
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch(err) {
        console.error("Error:", err);
    }
}

run();
