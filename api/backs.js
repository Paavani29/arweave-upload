const express = require('express');
const multer = require('multer');
const Arweave = require('arweave');
const cors = require('cors'); // Import CORS

const app = express();

// Enable CORS for all routes
app.use(cors());

// Initialize Arweave
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Decode the base64 Arweave key
const keyBase64 = process.env.ARWEAVE_KEYFILE_BASE64;
const key = JSON.parse(Buffer.from(keyBase64, 'base64').toString());

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const fileData = req.file.buffer;

        const transaction = await arweave.createTransaction({ data: fileData }, key);
        transaction.addTag('Content-Type', req.file.mimetype);
        await arweave.transactions.sign(transaction, key);
        const response = await arweave.transactions.post(transaction);

        res.json({ link: `https://arweave.net/${transaction.id}`, transactionId: transaction.id, status: response.status });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ error: "File upload failed." });
    }
});

module.exports = app;
