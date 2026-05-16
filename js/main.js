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

  // --- Post Grid Filtering ---
  const filterPills = document.querySelectorAll(".filter-pill");
  const postCards = document.querySelectorAll(".post-card");

  if (filterPills.length > 0 && postCards.length > 0) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        // Remove active class from all pills
        filterPills.forEach((p) => p.classList.remove("active"));
        // Add active class to clicked pill
        pill.classList.add("active");

        const filterValue = pill.getAttribute("data-filter");

        postCards.forEach((card) => {
          if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
            card.style.display = "flex";
            // Add a small animation effect when showing
            card.style.opacity = "0";
            setTimeout(() => { card.style.opacity = "1"; }, 50);
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // --- Highlights Modal Logic ---
  const highlightItems = document.querySelectorAll(".highlight-item");
  const modalOverlay = document.getElementById("impact-modal");
  
  if (highlightItems.length > 0 && modalOverlay) {
    const closeModalBtn = document.getElementById("close-modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalDate = document.getElementById("modal-date");
    const modalLocation = document.getElementById("modal-location");
    const modalDesc = document.getElementById("modal-desc");
    const modalImpact = document.getElementById("modal-impact");

    // Dummy data for highlights
    const highlightsData = {
      "1": {
        title: "Cleanliness Drive",
        date: "14 May 2026",
        location: "City Central Park",
        img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
        desc: "Over 50 volunteers gathered early morning to clean up the central park, collecting over 200 bags of waste and promoting proper disposal methods among morning walkers.",
        impact: "200+ Bags of Waste Removed"
      },
      "2": {
        title: "Tree Plantation",
        date: "05 May 2026",
        location: "Greenbelt Area",
        img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
        desc: "As part of our green initiative, students and local residents came together to plant native saplings to restore the local ecosystem and improve air quality.",
        impact: "500+ Saplings Planted"
      },
      "3": {
        title: "Food Distribution",
        date: "28 Apr 2026",
        location: "Community Shelter",
        img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
        desc: "Our weekly food drive successfully provided nutritious meals to families in need. A big thank you to our local restaurant partners for their generous contributions.",
        impact: "300+ Meals Served"
      },
      "4": {
        title: "Education Support",
        date: "15 Apr 2026",
        location: "Rural Public School",
        img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
        desc: "We distributed school supplies, textbooks, and bags to underprivileged children, ensuring they have the necessary tools to continue their education without barriers.",
        impact: "150+ Students Equipped"
      },
      "5": {
        title: "Health Camp",
        date: "10 Apr 2026",
        location: "Village Center",
        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        desc: "A free medical checkup camp was organized featuring general physicians, eye specialists, and pediatricians to provide accessible healthcare diagnostics to the rural community.",
        impact: "450+ Patients Checked"
      },
      "6": {
        title: "Women Empowerment",
        date: "02 Mar 2026",
        location: "Vocational Center",
        img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
        desc: "Launched a new skill development workshop focusing on digital literacy and tailoring, helping women achieve financial independence and entrepreneurial skills.",
        impact: "60+ Women Certified"
      },
      "7": {
        title: "Volunteer Work",
        date: "Ongoing",
        location: "Multiple Locations",
        img: "https://images.unsplash.com/photo-1559027615-cd4628ce02df?auto=format&fit=crop&w=800&q=80",
        desc: "Our dedicated network of volunteers continues to be the backbone of our organization, actively participating in diverse community building activities every weekend.",
        impact: "1000+ Volunteer Hours"
      }
    };

    // Open Modal
    highlightItems.forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        const data = highlightsData[id];
        if (data) {
          modalImg.src = data.img;
          modalTitle.textContent = data.title;
          modalDate.textContent = data.date;
          modalLocation.textContent = data.location;
          modalDesc.textContent = data.desc;
          modalImpact.textContent = data.impact;
          
          modalOverlay.classList.add("active");
          document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
        }
      });
    });

    // Close Modal Logic
    const closeModal = () => {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    };

    closeModalBtn.addEventListener("click", closeModal);

    // Close on clicking outside content
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
