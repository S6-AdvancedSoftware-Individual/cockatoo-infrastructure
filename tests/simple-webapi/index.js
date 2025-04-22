//1. Open directory in Terminal.
//2. Run npm install.
//3. Run node index.js.
//4. http://localhost:9999/hello is available.

const express = require('express');
const app = express();
const PORT = 9999;
let index = 1;

// Define a single endpoint
app.get('/hello', (req, res) => {
    console.log(`Received request for /hello - #${index++}`);
    res.send({ message: 'Hello, World!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
