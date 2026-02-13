document.addEventListener("DOMContentLoaded", () => {

  const nav = document.querySelector(".mui-nav");
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".nav-menu");
  const toggle = document.getElementById("darkToggle");
  const overlay = document.querySelector(".nav-overlay");

  /* =========================
     FUNCTION CLOSE MENU
  ========================== */
  function closeMenu() {
    if (menu) menu.classList.remove("open");
    if (burger) burger.classList.remove("active");
    if (overlay) overlay.classList.remove("show");
    document.body.classList.remove("nav-open");
  }

  /* =========================
     BURGER
  ========================== */
  if (burger && menu) {

    burger.addEventListener("click", () => {

      menu.classList.toggle("open");
      burger.classList.toggle("active");

      if (overlay) {
        overlay.classList.toggle("show");
      }

      document.body.classList.toggle("nav-open");
    });

    /* Close when click link (mobile) */
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) closeMenu();
      });
    });
  }

  /* =========================
     OVERLAY CLICK
  ========================== */
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  /* =========================
     DROPDOWN MOBILE
  ========================== */
  document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", e => {
      if (window.innerWidth > 768) return;
      e.preventDefault();
      link.parentElement.classList.toggle("open");
    });
  });

  /* =========================
     ACTIVE LINK
  ========================== */
  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-menu a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    if (href.split("/").pop() === currentPage) {
      link.classList.add("active");
    }
  });

  /* =========================
     DARK MODE
  ========================== */
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function enableDark() {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  }

  function disableDark() {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }

  const savedTheme = localStorage.getItem("darkMode");

  if (savedTheme === "true") enableDark();
  else if (savedTheme === "false") disableDark();
  else if (prefersDark.matches) enableDark();

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.contains("dark")
        ? disableDark()
        : enableDark();
    });
  }

  prefersDark.addEventListener("change", e => {
    if (!localStorage.getItem("darkMode")) {
      e.matches ? enableDark() : disableDark();
    }
  });

  /* =========================
     HIDE / SHOW ON SCROLL
  ========================== */
  if (nav) {
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY && currentScroll > 80) {
        nav.classList.add("hide");
      } else {
        nav.classList.remove("hide");
      }

      lastScrollY = currentScroll;
    });
  }

});
