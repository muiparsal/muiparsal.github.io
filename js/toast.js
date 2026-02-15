function showToast(msg){
  let toast = document.getElementById("toast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";

    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(()=>{
    toast.classList.remove("show");
  },3000);
}
window.addEventListener("offline", ()=>{
  showToast("Anda sedang offline");
});
window.addEventListener("online", ()=>{
  showToast("Koneksi kembali online");
});