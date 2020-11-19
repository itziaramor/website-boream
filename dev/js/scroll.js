'use strict';

// ----------------------------------------------------
//  SCROLL
// ----------------------------------------------------

class Scroll {
  constructor() {
    this.isScrolling = false;
    this.scrollPosition = 0;
    this.oldOffset = 0;
    this.currentOffset = 0;
    this.delta = 5;
    this.header = document.querySelector('.site-header');
    this.headerHeight = this.header.offsetHeight;
    this.body = '';
  }

  init() {
    this.listeners();
  }

  watchScrollPosition() {
    if (this.scrollPosition > 0) {
      this.getScrollDirection();
      this.isScrolling = false;
    } else {
      this.header.classList.remove('is-visible');
    }
  }

  getScrollDirection() {
    this.currentOffset = this.scrollPosition;

    if (Math.abs(this.oldOffset - this.currentOffset) <= this.delta) {
      return;
    }

    if (this.currentOffset > this.oldOffset) {
      this.header.classList.remove('is-visible');
      this.header.classList.add('is-hidden');
    } else {
      this.header.classList.add('is-visible');
      this.header.classList.remove('is-hidden');
    }

    if (this.currentOffset > 0) {
      this.header.classList.add('is-visible');
      //this.header.classList.remove('is-hidden');
    }

    this.oldOffset = this.currentOffset;
  }

  listeners() {
    window.addEventListener('scroll', event => {
      this.isScrolling = true;
      this.scrollPosition = document.body.scrollTop || window.pageYOffset;
      this.watchScrollPosition();
    });
  }
}
