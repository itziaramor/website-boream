// Initialize scripts
// ********************

// Initialize IE11 class
Utils.checkIfIE11();
// Redirect to page
// Redirect to page
if (BOREAM.isIE11) {
  // var url = "https://boream.com/hemos-detectado-que-utilizas-internet-explorer";
  // if (window.location != url) {
  //   window.location = url;
  // }
  // missing forEach on NodeList for IE11
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  imageToBg();
}


// svg icons ie11
svg4everybody({
	nosvg: true, // shiv <svg> and <use> elements and use image fallbacks
	polyfill: true // polyfill <use> elements for External Content
});

cssVars({
  processShadowDOM: true  // default: false
});

// Initialize Navigation
if (document.querySelector('.nav') !== null) {
  let navigation = new Navigation('.nav');
  navigation.init();
}

// Initialize Clients slider
if (document.querySelector('.clients') !== null) {
  let clients = new Clients('.clients');
  clients.init();
}

// Initialize Employees slider
if (document.querySelector('.employees') !== null) {
  let employees = new Employees('.employees');
  employees.init();
}

// Initialize Modals
if (document.querySelector('.modal') !== null) {
  new Modal().init();
}

// Validate Subscription to insights
function resetForm(formId) {
  let form = document.querySelector(formId);
  let inputs = form.querySelectorAll('input');

  inputs.forEach(function(input) {
    if (input.getAttribute('type') === 'checkbox') {
      input.checked = false;
    } else {
      input.value = '';
    }
  });

  let mcStatusKO = document.querySelector('#mce-error-response');
  let mcStatusOK = document.querySelector('#mce-success-response');

 // mcStatusOK.innerHTML = 'Gracias por inscribirte a Insights!';
}

var serialize = function(form) {
  // Setup our serialized data
  var serialized = '';

  // Loop through each field in the form
  for (i = 0; i < form.elements.length; i++) {
    var field = form.elements[i];

    // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
    if (
      !field.name ||
      field.disabled ||
      field.type === 'file' ||
      field.type === 'reset' ||
      field.type === 'submit' ||
      field.type === 'button'
    )
      continue;

    // Convert field data to a query string
    if (
      (field.type !== 'checkbox' && field.type !== 'radio') ||
      field.checked
    ) {
      serialized +=
        '&' +
        encodeURIComponent(field.name) +
        '=' +
        encodeURIComponent(field.value);
    }
  }

  return serialized;
};

var displayMailChimpStatus = function(data) {
  var mcContentForm = document.querySelector('.modal__content-form');
  var mcContentMessage = document.querySelector('.modal__content-message');
  var mcForm = document.querySelector('#mc-embedded-subscribe-form');
  var mcStatusKO = document.querySelector('#mce-error-response');
  var mcStatusOK = document.querySelector('#mce-success-response');

  mcStatusKO.innerHTML = '';
  mcStatusOK.innerHTML = '';

  if (data.result === 'error') {
    // Añadir clase ERROR para que se vea bien el menasaje
    // Mostrar el mensaje
    mcForm.classList.add('is-error');
    mcStatusKO.innerHTML = "La dirección de email introducida ya se encuentra suscrita.";

  } else {
    // Si había clase ERROR quitarla
    // Mostrar el mensaje de gracias y ocultar el contenedor del formulario
    // Limpiar el formulario
    if (mcForm.classList.contains('is-error'))
      mcForm.classList.remove('is-error');
    //mcForm.classList.add('is-success');
    mcContentForm.classList.remove('active');
    mcContentMessage.classList.add('active');
    mcStatusOK.innerHTML = data.msg;
    resetForm('#mc-embedded-subscribe-form');
  }
};

// Submit the form
var submitMailChimpForm = function(form) {
  var url = form.getAttribute('action');
  url = url.replace('/post?u=', '/post-json?u=');
  url += serialize(form) + '&c=displayMailChimpStatus';

  // Create script with url and callback (if specified)
  var script = window.document.createElement('script');
  script.src = url;

  // Insert script tag into the DOM (append to <head>)
  var ref = window.document.getElementsByTagName('script')[0];
  ref.parentNode.insertBefore(script, ref);

  // After the script is loaded (and executed), remove it
  script.onload = function() {
    this.remove();
  };
};

// Check all fields on submit
document.addEventListener(
  'submit',
  function(event) {
    // Only run on forms flagged for validation
    if (!event.target.classList.contains('validate')) return;

    // Prevent form from submitting
    event.preventDefault();

    // Otherwise, let the form submit normally
    // You could also bolt in an Ajax form submit process here
    submitMailChimpForm(event.target);
  },
  false
);

window.onload = function() {
  // Initialize scroll behaviour
  let pageScroll = new Scroll();
  pageScroll.init();

  // Initialize scroll to top arrow
  let scrollTop = new ScrollTop('.js-totop');
  scrollTop.init();

  // Initialize scroll down project nav
  let scrollProjectNav = new ScrollProjectNav('.project__nav');
  scrollProjectNav.init();

    if (typeof active_tags === "function")
    {
        active_tags();
    }
};


function imageToBg() {
  var container = document.getElementsByClassName('project__figure');
  var image = document.getElementsByClassName('project__image');
  //var container = document.getElementsByClassName('image-bg');
  //var image = document.querySelector('.image-bg').getElementsByTagName('img');
  // Loop through HTMLCollection
  for(var i = 0; i < container.length; i++) {
    // Asign image source to variable
    var imageSource = container[i].querySelector('img').src;
    // Hide image
    container[i].querySelector('img').style.display = 'none';
    // Add background-size: cover
    container[i].style.backgroundSize = 'cover';
    // Add background-image: and put image source here
    container[i].style.backgroundImage = 'url(' + imageSource + ')';
    // Add background-position: center center
    container[i].style.backgroundPosition = 'center center';

    image[i].style.display = 'none';
  }
}
