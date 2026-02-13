document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     BURGER MENU
  ========================== */
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".nav-menu");

  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  }

  /* =========================
     DROPDOWN (Mobile Support)
  ========================== */
  document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", e => {

      // Desktop biarkan hover bekerja
      if (window.innerWidth > 768) return;

      e.preventDefault();
      link.parentElement.classList.toggle("open");
    });
  });

  /* =========================
     AUTO ACTIVE LINK
  ========================== */
  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-menu a").forEach(link => {
    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    const cleanHref = href.split("/").pop();

    if (cleanHref === currentPage) {
      link.classList.add("active");
    }
  });

  /* =========================
     DARK MODE INIT
  ========================== */
  const toggle = document.getElementById("darkToggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function enableDark() {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  }

  function disableDark() {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }

  // Load saved preference
  const savedTheme = localStorage.getItem("darkMode");

  if (savedTheme === "true") {
    enableDark();
  } else if (savedTheme === "false") {
    disableDark();
  } else {
    // First visit → follow system
    if (prefersDark.matches) enableDark();
  }

  /* =========================
     DARK TOGGLE CLICK
  ========================== */
  toggle?.addEventListener("click", () => {
    document.body.classList.contains("dark")
      ? disableDark()
      : enableDark();
  });

  /* =========================
     LISTEN SYSTEM CHANGE
  ========================== */
  prefersDark.addEventListener("change", e => {
    if (!localStorage.getItem("darkMode")) {
      e.matches ? enableDark() : disableDark();
    }
  });

});

/* =========================
   HIDE / SHOW ON SCROLL
========================== */
const nav = document.querySelector(".mui-nav");

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {

  const currentScroll = window.scrollY;

  if (currentScroll > lastScrollY && currentScroll > 80) {
    // Scroll ke bawah → sembunyikan
    nav.classList.add("hide");
  } else {
    // Scroll ke atas → tampilkan
    nav.classList.remove("hide");
  }

  lastScrollY = currentScroll;
});
