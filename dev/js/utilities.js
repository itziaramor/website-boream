'use strict';

// ----------------------------------------------------
//  Utilities
// ----------------------------------------------------

class Utils {
  static checkIfIE11() {
    BOREAM.isIE11 = !window.ActiveXObject && 'ActiveXObject' in window;

    if (BOREAM.isIE11) {
      BOREAM.E.classList.add('ie11');
    }

  }

  static getHeightest(selector) {
    // Gets all the values and returns the higher
    function getMaxValue(arr) {
      const values = arr.map(i => {
        return i.getBoundingClientRect().height;
      });

      return Math.max(...values);
    }

    let postTitles = document.querySelectorAll(selector);
    let postTitlesArr = Array.from(postTitles);

    const maxHeight = getMaxValue(postTitlesArr);

    document.documentElement.style.setProperty('--height', `${maxHeight}px`);
  }
}
