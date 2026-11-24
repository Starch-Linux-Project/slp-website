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
  window.matchMedia('(min-width: 701px)').addEventListener?.('change', closeMenu);
}

document.querySelectorAll('[data-copy-checksum]').forEach((button) => {
  const checksum = document.getElementById(button.dataset.copyChecksum);
  const feedback = button.parentElement.querySelector('.checksum-feedback');
  if (!checksum || !feedback) return;

  const hash = checksum.textContent.trim();
  if (!/^[a-f0-9]{64}$/i.test(hash)) return;

  button.disabled = false;
  button.addEventListener('click', async () => {
    feedback.textContent = '';
    try {
      await navigator.clipboard.writeText(hash);
      feedback.textContent = 'SHA256 copied.';
      return;
    } catch {
      // The Clipboard API can be unavailable or blocked in previews.
    }

    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(checksum);
      selection.removeAllRanges();
      selection.addRange(range);

      try {
        if (document.execCommand('copy')) {
          selection.removeAllRanges();
          feedback.textContent = 'SHA256 copied.';
          return;
        }
      } catch {
        // Leave the checksum selected so it can be copied manually.
      }
    }

    feedback.textContent = 'Could not copy automatically. Copy the checksum above manually.';
  });
});
