const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const cart = require('./cart');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const cartHandler = (req, res, action, cartFile) => {

    readFile(cartFile, 'utf-8')
        .then(currentCartString => {
            if (action === 'read') {
                res.setHeader('Content-type', 'application/json');
                res.send(JSON.stringify(JSON.parse(currentCartString)));
            }
            if (action === 'change') {
                cart.change(JSON.parse(currentCartString), req.body)
                    .then(newCart => {
                        writeFile(cartFile, JSON.stringify(newCart, null , 4), 'utf-8')
                            .catch((err) => {
                                res.send({"result": 0, "error": err})
                            });
                        res.send({"result": 1});
                    })
                    .catch((err) => {
                        res.send({"result": 0, "error": err})
                    })
            }
        })
        .catch(err => {

            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        });
}

module.exports = cartHandler;
