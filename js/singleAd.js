'use strict';

//const item = document.location.href = '../html/main.html';


let getItem = localStorage.getItem('item');

console.log(getItem);

let single_item = document.getElementById('singleItem');
let single_item_slot = document.createElement('div');
single_item.appendChild(single_item_slot);

single_item_slot.innerHTML = getItem;