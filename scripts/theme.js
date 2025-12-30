/* FILENAME: scripts/theme.js */

export function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const html = document.documentElement;

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        updateIcon(true);
    } else {
        updateIcon(false);
    }

    toggleBtn.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
    });
}

function updateIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}