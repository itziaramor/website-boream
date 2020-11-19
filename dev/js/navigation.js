'use strict';

// ----------------------------------------------------
//  NAVIGATION
// ----------------------------------------------------


class Navigation {
  constructor(elem) {
    this.elem = document.querySelector(elem);
    this.links = this.elem.querySelectorAll('.nav__link');
    this.linkHome = this.elem.querySelector('.nav__link[href="/"]');
    this.header = document.querySelector('.site-header');
    this.menuButton = document.querySelector('.js-toggle-menu');
    this.menuList = document.querySelector('.nav__list');
    this.windowWidth;
    this.limit = 1024;
    this.currentPath = document.location.pathname;
    this.currentPage;
  }

  init() {
    this.windowWidth = window.innerWidth;
    this.resetMenuClasses();
    this.listeners();
  }

  listeners() {
    this.currentPage = this.getPage();
    this.links.forEach(link => {
      if (this.currentPage === '') {
        this.linkHome.classList.add('is-active');
      } else if (link.getAttribute('href') === this.currentPage) {
        link.classList.add('is-active');
      }
    });

    this.menuButton.addEventListener('click', () => {
      this.menuButton.classList.toggle('is-active');
      this.menuList.classList.toggle('is-open');
      this.header.classList.toggle('menu-is-open');
      document.body.classList.toggle('overflow-hidden');
    });

    window.addEventListener('resize', e => {
      this.resetMenuClasses();
    });
  }

  getPage() {
    if (this.currentPath.lastIndexOf('/') === 0) {
      return this.currentPath;
    } else {
      return this.currentPath.substr(0, this.currentPath.lastIndexOf('/'));
    }
  }

  resetMenuClasses() {
    this.windowWidth = window.innerWidth;

    if (
      this.windowWidth > this.limit &&
      this.header.classList.contains('menu-is-open')
    ) {
      this.header.classList.remove('menu-is-open');
      this.menuList.classList.remove('is-open');
      this.menuButton.classList.remove('is-active');
    }
  }
}
