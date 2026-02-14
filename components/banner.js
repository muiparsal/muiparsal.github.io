function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(err => console.error("Gagal load:", file));
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("banner-top", "/components/banner-top.html");
  loadComponent("banner-bottom", "/components/banner-bottom.html");
});
