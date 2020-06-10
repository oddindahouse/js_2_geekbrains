const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const cartRouter = require('./cartRouter');

const app = express();

app.use(express.json());
app.use(
    express.static(
        path.resolve(__dirname,'../public')
    )
);

app.use('/api/cart', cartRouter);
app.get('/api/catalog', (req,res) => {
    const readFile = util.promisify(fs.readFile);
    readFile('./db/catalogData.json','utf-8')
        .then(result => {
            res.end(JSON.stringify(JSON.parse(result)));
        })
        .catch(err => {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        })
});

app.listen(3000, () => {
    console.log('Server running at port 3000');
});
