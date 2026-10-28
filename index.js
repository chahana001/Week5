const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import MongoDB functions
const {
    insertOne,
    findAll,
    countDocuments,
    findFemalesOver30,
    deleteManyPersons,
    updateManyPersons
} = require('./Week4lab');

// MongoDB connection
// Use this URI if MongoDB is installed and running locally.
const MONGO_URI = "mongodb+srv://Chahanauel:Chahanauel@employee.xphnuo1.mongodb.net/";

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err.message));


// Home route
app.get('/', (req, res) => {
    res.send('Hello! This is my first Express application.');
});


// About route
app.get('/about', (req, res) => {
    res.send('This is a basic Express application');
});


// Route parameters
app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(req.params);
});


// Get all students from Students.json
app.get('/GetStudents', (req, res) => {
    fs.readFile(__dirname + '/Students.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Error reading Students.json'
            });
        }

        try {
            res.status(200).json({
                status: true,
                statusCode: 200,
                requestedAt: new Date().toISOString(),
                requestUrl: req.originalUrl,
                requestMethod: req.method,
                studentData: JSON.parse(data)
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Invalid JSON in Students.json'
            });
        }
    });
});


// Get a student by ID
app.get('/GetStudent/:id', (req, res) => {
    console.log('GetStudent called');

    fs.readFile(__dirname + '/Students.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Error reading Students.json'
            });
        }

        try {
            const students = JSON.parse(data);
            const student = students['Student' + req.params.id];

            if (student) {
                return res.status(200).json(student);
            }

            return res.status(404).json({
                status: false,
                statusCode: 404,
                message: 'Student Not Found',
                requestedAt: new Date().toISOString(),
                requestUrl: req.originalUrl,
                requestMethod: req.method
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                statusCode: 500,
                message: 'Invalid JSON in Students.json'
            });
        }
    });
});


// Display student information form
app.get('/studentinfo', (req, res) => {
    res.sendFile('StudentInfo.html', { root: __dirname });
});


// Submit student information form
app.post('/submit-data', (req, res) => {
    const name = (req.body.firstName || '') + ' ' +
                 (req.body.lastName || '');

    const age = req.body.myAge;
    const gender = 'Gender: ' + (req.body.gender || '');
    const qualification = 'Qualification: ' + (req.body.Qual || '');

    console.log(req.body.Qual);

    res.status(200).json({
        status: true,
        message: 'Form Details',
        data: {
            name: name.trim(),
            age: age,
            gender: gender,
            qualification: qualification
        }
    });
});


// Display person form
app.get('/Showform', (req, res) => {
    res.sendFile('Personform.html', { root: __dirname });
});


// Insert a person into MongoDB
//<form action="/insertOne" method="POST"> 
app.post('/insertOne', async (req, res) => {
    try {
        const result = await insertOne(
            req.body.name,
            req.body.age,
            req.body.gender,
            req.body.salary
        );

        res.status(201).json({
            status: true,
            message: 'Person inserted successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});
app.get('/Showform', (req, res) => { 
 
    res.sendFile('Personform.html', { 
        root: __dirname 
    }); 
 
});

// Show all persons
app.get('/persons', async (req, res) => {
    try {
        const result = await findAll();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/persons', async (req, res) => { 
try { 
console.log("calling all find") 
const result = await findAll(); 
res.json(result); 
console.log("result") 
} catch (err) { 
res.status(500).json(err); 
} 
}); 
