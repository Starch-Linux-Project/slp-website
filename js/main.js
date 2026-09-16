/* Navigation stays fully visible if JavaScript is unavailable. */
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');

if (menuButton && navigation) {
  document.documentElement.classList.add('js');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('is-open', !expanded);
  });
  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
}
