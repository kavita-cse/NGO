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
});
