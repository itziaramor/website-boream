'use strict';

// ----------------------------------------------------
//  Clients slider
// ----------------------------------------------------

class Clients {
  constructor(elem) {
    this.elem = document.querySelector(elem);
    this.wrapper = document.querySelector('.clients__info');
    this.list = this.elem.querySelectorAll('li');
    this.images = this.elem.querySelectorAll('.clients__image');
    this.logos = this.elem.querySelectorAll('.clients__logo');
    this.buttons = this.elem.querySelectorAll('button');
    this.imagePath = null;
    this.clientsLength = this.list.length - 1;
    this.counter = 0;
    this.interval = null;
    this.delay = 6000;
  }

  init() {
    this.interval = setInterval(() => {
      this.clientsInterval();
    }, this.delay);
    this.listeners();
  }

  listeners() {
    this.buttons.forEach(button => {
      button.addEventListener('click', e => {
        this.stopClientsInterval();
        this.counter = e.target.parentNode.getAttribute('data-idx');
        this.updateCurrentClient(this.counter);
      });
    });
  }

  // Helper fn
  // @param {Array} Collection to iterate
  // @param {Number} Index that points to the element on the array
  updateCollection(array, idx) {
    let typeArray = Array.from(array);
    let currentActive = typeArray.findIndex(item => {
      return item.classList.contains('is-active');
    });

    idx = parseInt(idx);

    array.forEach(item => {
      item.classList.remove('is-active');
      item.classList.remove('is-inactive');
    });

    array[currentActive].classList.add('is-inactive');
    array[idx].classList.add('is-active');
  }

  // Changes the classes 'is-active' and 'is-inactive'
  changeCurrentClient(counter) {
    this.updateCollection(this.list, counter);
    this.updateCollection(this.images, counter);
    this.updateCollection(this.logos, counter);
  }

  clientsInterval() {
    this.counter >= this.clientsLength ? (this.counter = 0) : this.counter++;
    this.changeCurrentClient(this.counter);
  }

  updateCurrentClient(n) {
    this.changeCurrentClient(n);
    this.startClientsInterval();
  }

  startClientsInterval() {
    this.interval = setInterval(() => {
      this.clientsInterval();
    }, this.delay);
  }

  stopClientsInterval() {
    this.interval = clearInterval(this.interval);
  }
}


