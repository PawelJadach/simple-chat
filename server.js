const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

const messages = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).json({message: 'Not found'});
})

app.listen(port, () => console.log(`Server start on port ${port}`));