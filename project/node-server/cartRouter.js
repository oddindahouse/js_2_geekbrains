const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const cartHandler = require('./cartHandler');
const router = express.Router();

const cartFile = path.resolve(__dirname, './db/cart.json');

router.get('/', (req, res) => {
    cartHandler(req, res, 'read', cartFile);
});
router.post('/' , (req,res) => {
    cartHandler(req, res, 'change', cartFile);
   //console.log(req.body, req.quantity);
})
module.exports = router;