'use strict';
const products = [
  {id: 1, title: 'Notebook', price: 20000},
  {id: 2, title: 'Mouse', price: 1500},
  {id: 3, title: 'Keyboard', price: 5000},
  {id: 4, title: 'Gamepad', price: 4500},
];

const renderProduct = (title, price, img = 'https://via.placeholder.com/200x150') => {
  return `<div class="product-item">
            <img src="${img}" alt="img">
            <h3>${title}</h3>
            <p>${price}</p>
            <button class="by-btn">Добавить в корзину</button>
          </div>`;
};

const renderProducts = list => {
  list.forEach( good => document.querySelector('.products')
      .insertAdjacentHTML('beforeend', renderProduct(good.title, good.price))
  );
};

renderProducts(products);
