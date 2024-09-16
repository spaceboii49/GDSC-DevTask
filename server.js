const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // Changed to a more typical port for Express

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/responses', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define Schema for responses
const responseSchema = new mongoose.Schema({
    name: String,
    text: String,
    date: { type: Date, default: Date.now }
});

const Response = mongoose.model('Response', responseSchema);

// POST route to submit form data
app.post('/submit-response', async (req, res) => {
    const { name, text } = req.body;

    if (!name || !text) {
        return res.status(400).json({ message: 'Name and text are required!' });
    }

    try {
        const newResponse = new Response({
            name,
            text
        });
        await newResponse.save();
        res.json({ message: 'Response submitted successfully!' });
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET route to retrieve form responses
app.get('/get-responses', async (req, res) => {
    try {
        const responses = await Response.find();
        res.json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/test', (req, res) => {
    console.log('Received request for /test');
    res.send('Test route is working!');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});