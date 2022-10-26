const express = require('express');

const app = express();
const PORT = 80;

app.use(express.static('./'))

app.listen(PORT, () => {
    console.log("Listening on port %s", PORT)
})