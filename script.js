'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab'); // used for buttons
const tabsContainer = document.querySelector('.operations__tab-container'); // parent class of all buttons
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
});

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // MAtching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // GUARD CLAUSE
  if (!clicked) return;

  // REMOVE ACTIVE CLASSES
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // This will keep buttons in the same level, so in the next line of code only the buttons will be made active
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // ACTIVE TAB
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // the 'this' keyword is now the opacity
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5)); // used bind() method to pass an argument into a handler function

nav.addEventListener('mouseout', handleHover.bind(1));

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // Used array destructuring

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

/////////////////////////////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden'); // Using CSS
});

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src; // 'dataset' where the special data properties are stored

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // root set to the entire viewport
  threshold: 0, // can be ajusted as we go
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    /**
     * In HTML file, each dot is going to be one element with the class of 'dots__dot' & then it will have a data attribute of slide (data-slide) with the number of the slide that clicking the button will go to. Again the (data-) attrribute here holds some data that we need in order to make the functionality work.
     */
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active')); // this is the first step of removing all the active classes, after this we will only add only on the one that we're interested in.

    /**
     * How to select the dots that we actually want? We want to select based on the 'data-slide' attribute, for that we can create a selector.
     * Previously we used '[]' to select for the images with certain attribute, here we can do as well and we can even check if they have a certain value. '[data-slide="${slide}"]' means 'data-slide' should exactly have the value of 'slide'.
     * And then, to the selected class we can add a class, which is the 'active' class.
     */
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    // slide: no. of slide where we want to go to
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  // Going to the next slide mean simply changing the value in the 'transform' property
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      // -1, because length is not 0 based but the index is 0 based, that's why subtracted
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    goToSlide(0); // once our app starts it immediately goes to slide 0

    createDots();

    // In the beginning, like on page reload, we want the dot function to be already activated with slide on 0.
    activateDots(0); // by default the slide is on 0 on page load/reload.
  };
  init();

  // Event handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // We actually handle the keyboard events right at the document
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide); // passed slide that we read above in dataset
      activateDots(slide);
    }
  });
};
slider();

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!\n', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded!\n', e);
});

