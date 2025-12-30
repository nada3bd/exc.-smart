/* FILENAME: scripts/ui.js */

let animId = null;

export function initUI() {
  // We make this async to wait for components to load
  loadComponents();
}

async function loadComponents() {
  // 1. Load Navbar
  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    try {
      const navbarRes = await fetch("components/navbar.html");
      const navbarHtml = await navbarRes.text();
      navbarContainer.innerHTML = navbarHtml;
    } catch (e) {
      console.error("Failed to load navbar", e);
    }
  }

  // 2. Load Footer
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    try {
      const footerRes = await fetch("components/footer.html");
      const footerHtml = await footerRes.text();
      footerContainer.innerHTML = footerHtml;
    } catch (e) {
      console.error("Failed to load footer", e);
    }
  }

  // 3. Now that HTML is injected, attach event listeners
  attachEventListeners();

  // 4. Initialize theme after navbar is loaded
  initThemeAfterLoad();

  // 5. Start Loader Animation removal
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 500);
    }, 1000);
  }
}

function attachEventListeners() {
  // Mobile Menu
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  window.ui.toggleMobileMenu = () => {
    menu.classList.toggle("hidden");
  };

  if (btn) {
    btn.addEventListener("click", window.ui.toggleMobileMenu);
  }
}

export function initThemeAfterLoad() {
  const toggleBtn = document.getElementById("theme-toggle");
  const html = document.documentElement;

  if (!toggleBtn) {
    console.warn("Theme toggle button not found");
    return;
  }

  // Set initial theme based on localStorage or system preference
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    html.classList.add("dark");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }

  toggleBtn.addEventListener("click", () => {
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  });
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.className = isDark ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }
}

export function startCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const html = document.documentElement;
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = html.classList.contains("dark")
        ? "rgba(255,255,255,0.5)"
        : "rgba(13, 148, 136, 0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(window.innerWidth / 10, 100);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          const isDark = html.classList.contains("dark");
          ctx.strokeStyle = isDark
            ? `rgba(255,255,255,${0.1 - dist / 1500})`
            : `rgba(13,148,136,${0.15 - dist / 1500})`;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

export function stopCanvas() {
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}
