// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://root:dwQ616TcXVisIGnc@cluster0.jq30c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
 .then(() => console.log('Connected to MongoDB'))
 .catch(error => console.error('Error connecting to MongoDB:', error.message));

// Define a simple Survey model
const SurveySchema = new mongoose.Schema({
  questions: Array,
  responses: Array, // To store responses from React Native app
});

const Survey = mongoose.model('Survey', SurveySchema);

// API route to create a survey
app.post('/api/surveys', async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API route to get all surveys
app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API route for React Native app to sync data
app.post('/api/surveys/:id/responses', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    survey.responses.push(req.body);
    await survey.save();
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
