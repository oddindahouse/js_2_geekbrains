const util = require('util');
const fs = require('fs');
const logger = require('./logger');
const path = require('path');

const readFile = util.promisify(fs.readFile);


const getProductById = (catalog, id) => {
    return catalog.find(product => product.id_product === id);
}
const refreshCart = (cart) => {
    cart.amount = cart.contents.reduce((acc , el) => acc + el.quantity * el.price, 0);
    cart.countGoods = cart.contents.reduce((acc, el) => acc + el.quantity, 0);
}

exports.change = (currentCart, reqBody) => {
    return new Promise((resolve, reject) => {
        readFile(path.resolve(__dirname,'./db/catalogData.json'), 'utf-8')
            .then(catalogString => {
                const catalog = JSON.parse(catalogString);
                const foundCatalogProduct = getProductById(catalog, reqBody.id);
                const foundCartProduct = getProductById(currentCart.contents, reqBody.id);
                //console.log(foundCartProduct, foundCatalogProduct);
                if (foundCatalogProduct) { //запрашиваемый товар существует в каталоге

                    if (foundCartProduct) { //товар есть в корзине
                        if (foundCartProduct.quantity + reqBody.quantity <= 0) { //тогда удаляем элемент
                            currentCart.contents.splice(currentCart.contents.findIndex(el => el === foundCartProduct), 1);
                            //console.log(currentCart);
                            logger.logAction(`DELETE ${foundCatalogProduct.product_name}`);
                        } else { //иначе меняем количество товаров
                            if (reqBody.quantity < 0) {
                                logger.logAction(`DELETE ${foundCatalogProduct.product_name}`);
                            } else
                            {
                                logger.logAction(`ADD ${foundCatalogProduct.product_name}`);
                            }
                            foundCartProduct.quantity += reqBody.quantity;
                           // console.log(currentCart);
                        }

                    } else { //товара нет в корзине
                        logger.logAction(`ADD ${foundCatalogProduct.product_name}`);
                        let newCartItem = Object.assign({}, foundCatalogProduct, {quantity: 1});
                        currentCart.contents.push(newCartItem); //добавляем товар
                    }
                }
                refreshCart(currentCart);//обновляем данные корзины
                resolve(currentCart);
            })
            .catch(err => {
                reject(err);
            })

    })

}
