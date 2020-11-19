'use strict';

class Modal {
  constructor() {
    this.modals;
    this.modalsCloseButton;
    this.pendingAnimation = false;
  }

  init() {
    this.modals = [...document.querySelectorAll('.modal')];
    this.modalsCloseButton = [...document.querySelectorAll('.js-close')];

    this.listeners();
  }

  open(modal) {
    modal.classList.add('is-visible');
  }

  close(modal) {
    const modalVideo = document.querySelector('.modal__video');

    modal.classList.remove('is-visible');

    modalVideo.pause();
  }

  listeners() {
    document.querySelectorAll('.js-modal').forEach(item => {
      item.addEventListener('click', e => {
        let modal = document.querySelector(item.getAttribute('data-modal'));
        this.open(modal);
      });
    });


    document.querySelectorAll('.js-close').forEach(item => {
      const that = this;
      item.addEventListener('click', e => {
        // on ie11 closest there are not shareable. This Fix ie11
        let modal = e.target.parentElement.parentElement;
        that.close(modal);
        if (
          e.target.parentElement.parentElement.classList.contains(
            'modal--subscribe'
          )
        )
          resetForm('#mc-embedded-subscribe-form');
      });
    });
  }
}
