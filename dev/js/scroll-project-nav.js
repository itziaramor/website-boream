'use strict';

// ----------------------------------------------------
//  SCROLL PROJECT NAV
// ----------------------------------------------------

class ScrollProjectNav {
  constructor(elem) {
    this.elem = document.querySelector(elem);
    this.siteContainer = document.querySelector('.site-container');
    this.viewportHeight = window.innerHeight;
    this.scrollPosition = window.pageYOffset;
    this.projectHeight;
    this.pageHeight;
    this.limit;
  }

  init() {
    if (this.elem && this.siteContainer) {
      this.pageHeight = window.document.body.clientHeight;
      this.projectHeight = document.querySelector('.project').offsetHeight;
      this.limit = this.pageHeight - (this.projectHeight + this.viewportHeight);
      this.scrollProjectNavCalcs();
    }
  }

  scrollProjectNavCalcs() {

    window.addEventListener(
      'scroll',
      event => {
        this.scrollPosition = window.pageYOffset;
        this.scrollBehaviour();
      },
      false
    );
  }

  scrollBehaviour() {
    if (
      this.scrollPosition >= (this.projectHeight/2)
    ) {
      this.elem.classList.add('is-invisible');
    } else {
      this.elem.classList.remove('is-invisible');
    }
  }
}
