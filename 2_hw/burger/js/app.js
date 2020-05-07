'use strict';
const burgers = [
    {
        name: 'big',
        price: 100,
        calories: 40
    },
    {
        name: 'small',
        price: 50,
        calories: 20
    }
];
const stuffings = [
    {
        name: 'cheese',
        price: 10,
        calories: 20
    }, {
        name: 'salad',
        price: 20,
        calories: 5
    }, {
        stuffing: 'potato',
        price: 15,
        calories: 10
    }
];
const toppings = [
    {
        name: 'flavoring',
        price: 15,
        calories: 0
    }, {
        name: 'maionese',
        price: 20,
        calories: 5
    }
];


class Burger {
    constructor() {
        this.size = this._getSize();
        this.stuffing = this._getStuffing();
        this.toppings = this._getToppings();
    }


    _getElByName(objMas, name){
        return objMas.find(el => el.name === name);
    }
    _getPrice(objMas, name) {
        let el = this._getElByName(objMas, name);
        if (el === undefined) return 0;
        return el.price;
    }
    _getCalories(objMas, name) {
        let el = this._getElByName(objMas, name);
        if (el === undefined) return 0;
        return el.calories;
    }

    _getSize() {
        return document.querySelector('input[name="size"]:checked').getAttribute('value');
    }

    _getStuffing() {
        return document.querySelector('input[name="filling"]:checked').getAttribute('value');
    }
    _getToppings() {
        return [...document.querySelectorAll('input[type="checkbox"]:checked')].map( el => el.name );
    }

    calculatePrice() {
        let totalPrice = this._getPrice(burgers, this.size);
        totalPrice += this._getPrice(stuffings, this.stuffing);
        if (this.toppings.length == 0) {
            return totalPrice;
        }

        totalPrice += this.toppings
            .map( el => this._getPrice(toppings, el))
            .reduce( (acc , cur) => acc + cur);
        return totalPrice;

    }

    calculateCalories() {
        let totalCal = this._getCalories(burgers, this.size);
        totalCal += this._getCalories(stuffings, this.stuffing);
        if (this.toppings.length == 0) {
            return totalCal;
        }
        totalCal += this.toppings
            .map( el => this._getCalories(toppings, el))
            .reduce( (acc , cur) => acc + cur);
        return totalCal;
    }

}

let burger = null;
window.addEventListener('load', () => {
    document.querySelector('.btn-create').addEventListener('click', event => {
        burger = new Burger();
        document.querySelector('.status').textContent = `Стоимость бургера ${burger.calculatePrice()}, Калорий: ${burger.calculateCalories()}`;
    })
})