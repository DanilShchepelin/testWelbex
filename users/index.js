const express = require('express');
const api = require('./routers');
const port = 3001;

const app = express();

app.use(express.json());
app.use('/api', api);

app.listen(port, () => {
    console.log(`Server has stared on http://localhost:${port}`);
})