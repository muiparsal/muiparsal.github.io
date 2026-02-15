(function() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } 
  else if (!theme) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }
})();
