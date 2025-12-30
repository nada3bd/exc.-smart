/* FILENAME: scripts/main.js */

import { initRouter } from "./router.js";
import { initUI, startCanvas, stopCanvas } from "./ui.js";

// Global namespace
window.router = {};
window.ui = {};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize UI (Loader, Mobile Menu, Navbar, Theme)
  initUI();

  // 2. Initialize Router (Fetches pages) - Must happen after UI setup
  // Pass canvas callbacks so router can start/stop animations
  initRouter(startCanvas, stopCanvas);
});
