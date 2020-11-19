'use strict';

// ----------------------------------------------------
//  SCROLL TO TOP
// ----------------------------------------------------

class ScrollTop {
  constructor(elem) {
    this.elem = document.querySelector(elem);
    this.siteContainer = document.querySelector('.site-container');
    this.viewportHeight = window.innerHeight;
    this.scrollPosition = window.pageYOffset;
    this.footerHeight;
    this.pageHeight;
    this.limit;
  }

  init() {
    if (this.elem && this.siteContainer) {
      this.pageHeight = window.document.body.clientHeight;
      this.footerHeight = document.querySelector('.site-footer').offsetHeight;
      this.limit = this.pageHeight - (this.footerHeight + this.viewportHeight);
      this.scrollCalcs();
    }
  }

  scrollCalcs() {
    // if (!callback || typeof callback !== 'function') return;
    var scrollUpHeader = document.querySelector('.site-header');

    this.elem.addEventListener(
      'click',
      event => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });

        scrollUpHeader.classList.remove('is-hidden');
      },
      false
    );

    window.addEventListener(
      'resize',
      event => {
        this.viewportHeight = window.innerHeight;
        this.pageHeight = window.document.body.clientHeight;
        this.footerHeight = document.querySelector('.site-footer').offsetHeight;
        this.limit =
          this.pageHeight - (this.footerHeight + this.viewportHeight);
        this.scrollBehaviour();
      },
      false
    );

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
      this.scrollPosition >= this.pageHeight / 3 &&
      this.scrollPosition < this.limit
    ) {
      this.siteContainer.classList.remove('relative');
      this.elem.classList.remove('is-absolute');
      this.elem.classList.add('is-visible');
    } else if (this.scrollPosition >= this.limit) {
      this.siteContainer.classList.add('relative');
      this.elem.classList.add('is-absolute');
    } else {
      this.elem.classList.remove('is-visible');
      this.siteContainer.classList.remove('relative');
      this.elem.classList.remove('is-absolute');
    }
  }
}
