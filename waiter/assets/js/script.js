let burgerMenuBg = document.querySelector(".burger-menu-bg");
let burgerMenu = document.querySelector(".burger-menu");
let burgerMenuButton = document.querySelector(".burger-menu-button");

burgerMenuButton.addEventListener("click", function () {
    burgerMenu.classList.add("active");
    burgerMenuBg.classList.add("active");
});

burgerMenuBg.addEventListener("click", function () {
    burgerMenu.classList.remove("active");
    burgerMenuBg.classList.remove("active");
})

let newOrderButton = document.querySelector(".new-order-button");

newOrderButton.addEventListener("click", () => {
    window.location.href = "select-table.html"
})