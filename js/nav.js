function initNav() {

  const nav = document.querySelector(".mui-nav");
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".nav-menu");
  const toggle = document.getElementById("darkToggle");
  const overlay = document.querySelector(".nav-overlay");

  function closeMenu() {
    if (menu) menu.classList.remove("open");
    if (burger) burger.classList.remove("active");
    if (overlay) overlay.classList.remove("show");
    document.body.classList.remove("nav-open");
  }

  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.toggle("open");
      burger.classList.toggle("active");
      if (overlay) overlay.classList.toggle("show");
      document.body.classList.toggle("nav-open");
    });

   menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", (e) => {

    // Kalau ini tombol dropdown (parent)
    if (link.classList.contains("dropdown-toggle")) {
      return; // jangan close menu utama
    }

    if (window.innerWidth <= 768) {
      closeMenu();
    }

  });
});



  if (overlay) overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".dropdown > a").forEach(link => {
    link.addEventListener("click", e => {
      if (window.innerWidth > 768) return;
      e.preventDefault();
      link.parentElement.classList.toggle("open");
    });
  });

  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-menu a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    if (href.split("/").pop() === currentPage) {
      link.classList.add("active");
    }
  });

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function enableDark() {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  }

  function disableDark() {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
  }

  const saved = localStorage.getItem("darkMode");

  if (saved === "true") enableDark();
  else if (saved === "false") disableDark();
  else if (prefersDark.matches) enableDark();

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.contains("dark")
        ? disableDark()
        : enableDark();
    });
  }

  if (nav) {
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
      const current = window.scrollY;
      if (current > lastScrollY && current > 80) nav.classList.add("hide");
      else nav.classList.remove("hide");
      lastScrollY = current;
    });
  }

}


