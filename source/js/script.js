const menu = document.querySelector('.nav');
const menuBtn = document.querySelector('.nav__toggle');

menuBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  menu.classList.toggle('nav--open');
});
