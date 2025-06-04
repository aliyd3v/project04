
document.getElementById("pagePreloader").classList.add("active");

window.addEventListener("load", () => {
    document.getElementById("pagePreloader").classList.remove("active");
})