const express = require('express');

const app = express();
const port = 80;

app.get('/', (req, res) => res.send('Schematical Games!'));
app.get('/heartbeat', (req, res) => res.send('I am alive!!!'));``
app.listen(port, () => console.log(`Example app listening on port ${port}!`));