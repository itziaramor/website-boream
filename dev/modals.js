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
    var modalContentForm = document.querySelector('.modal__content-form');
    var modalContentMessage = document.querySelector('.modal__content-message');

    modal.classList.remove('is-visible');

    if( modalContentMessage.classList.contains('active') ) {
      modalContentMessage.classList.remove('active');
      modalContentForm.classList.add('active');
    }
  }

  listeners() {
    document.querySelectorAll('.js-modal').forEach(item => {
      item.addEventListener('click', e => {
        let modal = document.querySelector(item.getAttribute('data-modal'));
        this.open(modal);
      });
    });

    document.querySelectorAll('.js-close').forEach(item => {
      item.addEventListener('click', e => {
        let modal = item.closest('.modal');
        this.close(modal);
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
