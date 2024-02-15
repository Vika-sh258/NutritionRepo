const express = require('express');
const { default: fetch } = require('node-fetch');

const app = express();

app.get('/excel', async (req, res) => {
  try {
    const response = await fetch('https://1drv.ms/x/s!Aluuzf5hUwJUpiRa007pt7LCSY_r?e=WsfHec');
    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
