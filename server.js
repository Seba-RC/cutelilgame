const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve your assets and js files
app.use(express.static(path.join(__dirname, '/')));

// Send index.html when someone visits the site
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0',() => {
  console.log(`Goober is live on port ${port}`);
});