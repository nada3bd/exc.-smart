/* FILENAME: scripts/router.js */

export function initRouter(startCanvasCallback, stopCanvasCallback) {
  const container = document.getElementById("app-container");

  window.router.navigate = async (pageId) => {
    // Fade out
    container.style.opacity = "0";

    setTimeout(async () => {
      try {
        // CRITICAL: Requires Local Server (e.g. Live Server)
        const response = await fetch(`pages/${pageId}.html`);
        if (!response.ok) throw new Error("Page not found");
        const html = await response.text();

        // Inject
        container.innerHTML = html;

        // Handle Canvas Logic
        if (pageId === "home") {
          startCanvasCallback();
        } else {
          stopCanvasCallback();
        }

        // Fade in
        setTimeout(() => {
          container.style.opacity = "1";
          window.scrollTo(0, 0);
        }, 50);
      } catch (err) {
        console.error("Error loading page:", err);
        container.innerHTML = `<div class="p-10 text-center text-red-500">Error loading ${pageId}.html.<br><br><small>Are you running this on a local server? (e.g. VS Code Live Server)</small></div>`;
        container.style.opacity = "1";
      }
    }, 300);
  };

  // Load home page by default
  window.router.navigate("home");
}
