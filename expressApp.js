import express from 'express';

const app = express();
const PORT = 4000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Initialize array with at least three sample vehicle records
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
    },
    {
        id: 3,
        vehicleName: "Tata Nexon",
        vehicleNumber: "MH12DE9012",
        type: "Compact SUV",
        price: 1100000
    }
];

// 1. GET /vehicles -> Retrieve all vehicles
app.get('/vehicles', (req, res) => {
    res.status(200).json(vehicles);
});

// 2. GET /vehicles/:id -> Retrieve vehicle by ID
app.get('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    if (!vehicle) {
        return res.status(404).json({ error: `Vehicle with ID ${vehicleId} not found.` });
    }

    res.status(200).json(vehicle);
});

// 3. POST /vehicles -> Add a new vehicle
app.post('/vehicles', (req, res) => {
    const { id, vehicleName, vehicleNumber, type, price } = req.body;

    // Validate required fields and positive price
    if (!id || !vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({
            error: 'Invalid request. All fields (id, vehicleName, vehicleNumber, type, price) are required and price must be a positive number.'
        });
    }

    // Check for duplicate ID
    if (vehicles.some(v => v.id === id)) {
        return res.status(400).json({ error: `Vehicle with ID ${id} already exists.` });
    }

    const newVehicle = { id, vehicleName, vehicleNumber, type, price };
    vehicles.push(newVehicle);

    res.status(201).json({
        message: 'Vehicle added successfully',
        vehicle: newVehicle
    });
});

// 4. PUT /vehicles/:id -> Update vehicle details
app.put('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);

    if (vehicleIndex === -1) {
        return res.status(404).json({ error: `Vehicle with ID ${vehicleId} not found.` });
    }

    const { vehicleName, vehicleNumber, type, price } = req.body;

    // Validate required fields and positive price
    if (!vehicleName || !vehicleNumber || !type || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({
            error: 'Invalid request. Fields (vehicleName, vehicleNumber, type, price) are required and price must be a positive number.'
        });
    }

    vehicles[vehicleIndex] = {
        id: vehicleId,
        vehicleName,
        vehicleNumber,
        type,
        price
    };

    res.status(200).json({
        message: 'Vehicle updated successfully',
        vehicle: vehicles[vehicleIndex]
    });
});

// 5. DELETE /vehicles/:id -> Delete a vehicle
app.delete('/vehicles/:id', (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);

    if (vehicleIndex === -1) {
        return res.status(404).json({ error: `Vehicle with ID ${vehicleId} not found.` });
    }

    const deletedVehicle = vehicles.splice(vehicleIndex, 1)[0];

    res.status(200).json({
        message: 'Vehicle deleted successfully',
        vehicle: deletedVehicle
    });
});

// Handle invalid routes (404)
app.use((req, res) => {
    res.status(404).json({ error: '404 Not Found: Endpoint does not exist.' });
});

// Handle malformed JSON errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Bad Request: Malformed JSON payload.' });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
