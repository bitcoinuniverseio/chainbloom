document.documentElement.classList.add('js');

const themeButton = document.querySelector('#theme-toggle');
const themeLabel = themeButton?.querySelector('.theme-label');

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  if (!themeButton || !themeLabel) return;
  const isLight = theme === 'light';
  themeButton.setAttribute('aria-pressed', String(isLight));
  themeLabel.textContent = isLight ? 'Dark' : 'Light';
};

let storedTheme;
try {
  storedTheme = localStorage.getItem('chainbloom-theme');
} catch {
  storedTheme = null;
}

const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches
  ? 'light'
  : 'dark';
applyTheme(
  storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : preferredTheme,
);

themeButton?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try {
    localStorage.setItem('chainbloom-theme', next);
  } catch {
    // The selected theme still applies when storage is unavailable.
  }
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}
