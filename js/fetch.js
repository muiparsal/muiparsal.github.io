function loadComponent(id, file, callback = null) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
    })
    .catch(err => console.error("Gagal load:", file, err));
}

document.addEventListener("DOMContentLoaded", function () {

  // Load Nav + Jalankan initNav setelah selesai
  loadComponent("nav-container", "/nav.html", function () {

    // Load nav.js setelah nav.html masuk
    const script = document.createElement("script");
    script.src = "/js/nav.js";
    script.onload = function () {
      if (typeof initNav === "function") {
        initNav();
      }
    };
    document.body.appendChild(script);

  });

  // Load banner
  loadComponent("banner-top", "/components/banner-top.html");
  loadComponent("banner-bottom", "/components/banner-bottom.html");

});