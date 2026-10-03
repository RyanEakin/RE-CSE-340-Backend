const hamButton = document.querySelector(".toggles"); //this attaches to the button
const navigation = document.querySelector(".nav"); // this attaches to the navigation list of links

hamButton.addEventListener("click", () => { // adds an onclick event listener
    navigation.classList.toggle("open");// toggle class open being present on the nav-list
});