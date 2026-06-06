document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav link
  const currentLocation = location.pathname;
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    if (
      link.getAttribute("href") === currentLocation ||
      (currentLocation === "/" && link.getAttribute("href") === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // ── Hamburger Menu ────────────────────────────────────────────────────────
  const hamburger = document.querySelector(".hamburger");
  const navLinksContainer = document.querySelector(".nav-links");

  if (hamburger && navLinksContainer) {
    // Toggle menu on hamburger click
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinksContainer.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking a nav link
    navLinksContainer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking anywhere outside the nav
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
        navLinksContainer.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navLinksContainer.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }
});

