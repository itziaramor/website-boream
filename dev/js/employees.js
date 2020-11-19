// Employees
// --------------------

// Only for development purpouses
// const EMPLOYEES_INFO = [
//   {
//     name: 'Guillermo Alonso del Real',
//     role: 'User Experience',
//     text:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
//   },
//   {
//     name: 'Employee 2',
//     role: 'Frontend',
//     text: 'Lipsum sit dolor',
//   },
//   {
//     name: 'Employee 3',
//     role: 'Backend',
//     text: 'Si lorem no ipsum',
//   },
//   {
//     name: 'Employee 4',
//     role: 'Visual Designer',
//     text:
//       'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud',
//   },
// ];

class Employees {
  constructor(elem) {
    this.employee = document.querySelector(elem);
    this.wrapper = this.employee.querySelector('.employees__info__wrapper');
    this.name = this.employee.querySelector('.employees__info__name');
    this.role = this.employee.querySelector('.employees__info__role');
    this.text = this.employee.querySelector('.employees__info__text');
    this.slider;
  }

  init() {
    this.initializeSlider();
    this.listeners();
  }

  initializeSlider() {
    this.slider = tns({
      container: '.employees__pics',
      items: 1,
      autoplay: true,
      autoplayButton: false,
      controlsContainer: false,
      controlsText: ['', ''],
      speed: 1000,
      responsive: {
        1024: {
          items: 1,
        },
      },
      mouseDrag: true,
    });
  }

  listeners() {
    this.slider.events.on('indexChanged', event => {
      this.customizedFunction(event);
    });
  }

  customizedFunction(event) {
    event.displayIndex--;
    this.loadEmployeeData(EMPLOYEES_INFO[event.displayIndex]);
  }

  loadEmployeeData(obj) {
    let sliderItem = this.slider.getInfo().index;
    let sliderClone = this.slider.getInfo().cloneCount;

    if (sliderItem !== sliderClone) {
      this.wrapper.classList.remove('is-active');

      setTimeout(() => {
        this.name.innerHTML = obj.name;
        this.role.innerHTML = obj.role;
        this.text.innerHTML = obj.text;
        this.wrapper.classList.add('is-active');
      }, 700);
    }
  }
}
