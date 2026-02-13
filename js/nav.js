document.addEventListener("DOMContentLoaded", function(){

  const burger = document.getElementById("burger");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("navOverlay");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownParent = document.querySelector(".has-dropdown");
  const darkToggle = document.getElementById("darkToggle");

  // Burger
  burger?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay?.addEventListener("click", () => {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Dropdown
  dropdownToggle?.addEventListener("click", () => {
    dropdownParent.classList.toggle("active");
  });

  // Dark Mode
  darkToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  // Load saved theme
  if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
  }

});
