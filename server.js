const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve employees.json
app.get('/employees', (req, res) => {
  res.sendFile(path.join(__dirname, 'employees.json'));
});

// POST method to insert an employee document into the file
app.post('/employees', (req, res) => {
  const newEmployee = req.body;
  console.log(newEmployee);

  // Read existing employees data from the file
  fs.readFile(path.join(__dirname, 'employees.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    const employees = JSON.parse(data);

    // Add new employee from the request body
    employees.push(newEmployee);

    // Write updated employees data back to the file
    fs.writeFile(path.join(__dirname, 'employees.json'), JSON.stringify(employees, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(201).send('Employee added successfully');
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
