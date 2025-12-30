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

  // Ensure modal setup can run on initial load and after router page injections
  async function setupLearnMoreModal() {
    try {
      // If modal already exists, skip re-insertion
      if (!document.getElementById('learn-more-modal')) {
        const res = await fetch('components/learn-more-modal.html');
        if (!res.ok) return;
        const html = await res.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper.firstElementChild);
      }

      const modal = document.getElementById('learn-more-modal');
      const modalTitle = document.getElementById('modal-title');
      const menu1 = document.getElementById('modal-menu-1-items');
      const menu2 = document.getElementById('modal-menu-2-items');
      const closeBtn = document.getElementById('modal-close');
      const closeBtn2 = document.getElementById('modal-close-2');

      const CONTENT = {
        workflow: {
          title: 'AI Workflow Automation Tools',
          menu1: ['Process mining', 'RPA orchestration', 'Task routing', 'Monitoring'],
          menu2: ['Integrations', 'Analytics dashboard', 'Security & audit']
        },
        enterprise: {
          title: 'Enterprise AI Platforms',
          menu1: ['Model management', 'Multi-tenant ops', 'Data pipelines'],
          menu2: ['SLA & Support', 'Scaling & orchestration', 'Compliance']
        },
        custom: {
          title: 'Custom AI & IT Solutions',
          menu1: ['Solution scoping', 'Custom integrations', 'Deployment options'],
          menu2: ['Training & handover', 'Maintenance', 'Consulting']
        }
      };

      function openModal(id) {
        const info = CONTENT[id] || CONTENT['custom'];
        if (modalTitle) modalTitle.textContent = info.title;
        if (menu1) menu1.innerHTML = info.menu1.map(i => `<li>${i}</li>`).join('');
        if (menu2) menu2.innerHTML = info.menu2.map(i => `<li>${i}</li>`).join('');
        if (modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeModal() {
        if (modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
          document.body.style.overflow = '';
        }
      }

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
      const overlay = document.querySelector('[data-modal-close]');
      if (overlay) overlay.addEventListener('click', closeModal);
      // Ensure single Escape listener
      if (!window._learnMoreEscapeAttached) {
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
        window._learnMoreEscapeAttached = true;
      }

      // Programmatically add Learn More buttons if not present in HTML
      const cardTitles = {
        'AI Workflow Automation Tools': 'workflow',
        'Enterprise AI Platforms': 'enterprise',
        'Custom AI & IT Solutions': 'custom'
      };

      document.querySelectorAll('.group').forEach(card => {
        const h = card.querySelector('h4');
        if (!h) return;
        const id = cardTitles[h.textContent.trim()];
        if (!id) return;
        if (!card.querySelector('.learn-more-btn')) {
          const b = document.createElement('button');
          b.className = 'learn-more-btn mt-4 inline-block bg-ai-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-ai-500 transition-colors';
          b.textContent = 'Learn More';
          b.dataset.modalId = id;
          const p = card.querySelector('p');
          if (p) p.insertAdjacentElement('afterend', b);
          else card.appendChild(b);
        }
      });

      // Attach click listeners (remove previous to avoid duplicates)
      document.querySelectorAll('.learn-more-btn').forEach(btn => {
        btn.removeEventListener('click', btn._learnMoreHandler);
        const handler = () => { const id = btn.dataset.modalId || 'custom'; openModal(id); };
        btn._learnMoreHandler = handler;
        btn.addEventListener('click', handler);
      });

    } catch (e) {
      console.warn('Learn More modal setup failed', e);
    }
  }

  // Run on initial load
  setupLearnMoreModal();

  // Re-run when router injects a new page
  document.addEventListener('page:loaded', () => {
    setupLearnMoreModal();
  });

  // Inject Learn More modal component (if present in components folder)
  (async function injectLearnMoreModal() {
    try {
      const res = await fetch('components/learn-more-modal.html');
      if (!res.ok) return;
      const html = await res.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper.firstElementChild);

      const modal = document.getElementById('learn-more-modal');
      const modalTitle = document.getElementById('modal-title');
      const menu1 = document.getElementById('modal-menu-1-items');
      const menu2 = document.getElementById('modal-menu-2-items');
      const closeBtn = document.getElementById('modal-close');
      const closeBtn2 = document.getElementById('modal-close-2');

      const CONTENT = {
        workflow: {
          title: 'AI Workflow Automation Tools',
          menu1: ['Process mining', 'RPA orchestration', 'Task routing', 'Monitoring'],
          menu2: ['Integrations', 'Analytics dashboard', 'Security & audit']
        },
        enterprise: {
          title: 'Enterprise AI Platforms',
          menu1: ['Model management', 'Multi-tenant ops', 'Data pipelines'],
          menu2: ['SLA & Support', 'Scaling & orchestration', 'Compliance']
        },
        custom: {
          title: 'Custom AI & IT Solutions',
          menu1: ['Solution scoping', 'Custom integrations', 'Deployment options'],
          menu2: ['Training & handover', 'Maintenance', 'Consulting']
        }
      };

      function openModal(id) {
        const info = CONTENT[id] || CONTENT['custom'];
        if (modalTitle) modalTitle.textContent = info.title;
        if (menu1) menu1.innerHTML = info.menu1.map(i => `<li>${i}</li>`).join('');
        if (menu2) menu2.innerHTML = info.menu2.map(i => `<li>${i}</li>`).join('');
        if (modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeModal() {
        if (modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
          document.body.style.overflow = '';
        }
      }

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
      const overlay = document.querySelector('[data-modal-close]');
      if (overlay) overlay.addEventListener('click', closeModal);
      window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

      // Programmatically add Learn More buttons if not present in HTML
      const cardTitles = {
        'AI Workflow Automation Tools': 'workflow',
        'Enterprise AI Platforms': 'enterprise',
        'Custom AI & IT Solutions': 'custom'
      };

      document.querySelectorAll('.group').forEach(card => {
        const h = card.querySelector('h4');
        if (!h) return;
        const id = cardTitles[h.textContent.trim()];
        if (!id) return;
        if (!card.querySelector('.learn-more-btn')) {
          const b = document.createElement('button');
          b.className = 'learn-more-btn mt-4 inline-block bg-ai-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-ai-500 transition-colors';
          b.textContent = 'Learn More';
          b.dataset.modalId = id;
          const p = card.querySelector('p');
          if (p) p.insertAdjacentElement('afterend', b);
          else card.appendChild(b);
        }
      });

      // Attach click listeners
      document.querySelectorAll('.learn-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = btn.dataset.modalId || 'custom';
          openModal(id);
        });
      });

    } catch (e) {
      // silently fail if modal component isn't available
      console.warn('Learn More modal injection failed', e);
    }
  })();
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
