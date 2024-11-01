const express = require('express');
const multer = require('multer');
const Arweave = require('arweave');
const fs = require('fs');
const cors = require('cors'); // Import CORS

// Initialize Express app
const app = express();
const port = process.env.PORT || 10000;

// Enable CORS for all routes
app.use(cors());

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Arweave
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
});

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the Arweave File Upload API!');
});



// POST route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const key = JSON.parse(fs.readFileSync('arweave-keyfile.json')); // Adjust path as necessary
        const fileData = req.file.buffer; // Get file data from multer

        const transaction = await arweave.createTransaction({ data: fileData }, key);
        transaction.addTag('Content-Type', req.file.mimetype); // Set content type based on uploaded file

        await arweave.transactions.sign(transaction, key);
        const response = await arweave.transactions.post(transaction);

        // Respond with the transaction ID and link to the uploaded file
        res.json({ link: `https://arweave.net/${transaction.id}` });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ error: 'File upload failed.' });
    }
});

app.use(cors({
    origin: 'https://arweave-qiryasrhg-paavs-projects.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

});
