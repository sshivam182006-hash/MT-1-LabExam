import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory array to store vehicle records
let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Honda City",
        vehicleNumber: "DL3CAX5678",
        type: "Sedan",
        price: 1200000
    }
];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Route 1: GET / -> Welcome page in HTML format
    if (method === 'GET' && url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to the Vehicle Management Web Application</h1><p>Use /vehicles, /about, or /info</p>');
    }
    // Route 2: GET /about -> Application information
    else if (method === 'GET' && url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h2>About Application</h2><p>This server demonstrates Node.js built-in HTTP and FS modules for managing vehicle records.</p>');
    }
    // Route 3: GET /info -> Serve static file public/info.html using FS module
    else if (method === 'GET' && url === '/info') {
        const filePath = path.join(__dirname, 'public', 'info.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error: Could not read info.html' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Route 4: GET /vehicles -> List all vehicle records in JSON format
    else if (method === 'GET' && url === '/vehicles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicles));
    }
    // Route 5: POST /add-vehicle -> Add a new vehicle record
    else if (method === 'POST' && url === '/add-vehicle') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newVehicle = JSON.parse(body);
                const { id, vehicleName, vehicleNumber, type, price } = newVehicle;

                // Validate required fields
                if (!id || !vehicleName || !vehicleNumber || !type || price === undefined) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Bad Request: All fields (id, vehicleName, vehicleNumber, type, price) are required.' }));
                    return;
                }

                vehicles.push({ id, vehicleName, vehicleNumber, type, price });

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Vehicle added successfully',
                    vehicle: { id, vehicleName, vehicleNumber, type, price }
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad Request: Invalid JSON format.' }));
            }
        });
    }
    // Error Handling: 404 for invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '404 Not Found: Route does not exist.' }));
    }
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
