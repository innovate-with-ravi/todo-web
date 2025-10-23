function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

// click on menu button
let menuOpen = true;
let menuBtn = document.getElementById("menu-btn")
menuBtn.addEventListener("click", async () => {
    let details = document.querySelector(".details")

    if (menuOpen) {
        details.style.animation = "closeX 0.2s linear 0s 1";

        // collapse at the time when animation ends
        details.addEventListener("animationend", () => { details.classList.add("collapse") }, { once: true })
    } else {
        details.classList.remove("collapse");
        details.style.animation = "openX 0.2s linear 0s 1";
    }
    menuOpen = !menuOpen;
})

// click on tasks
let allTasks = document.getElementById("all-tasks")
let starred = document.getElementById("starred")
allTasks.addEventListener("click", () => {
    allTasks.style.backgroundColor = "#004a77"
    starred.style.backgroundColor = "transparent"
})

// click on starred
starred.addEventListener("click", () => {
    starred.style.backgroundColor = "#004a77"
    allTasks.style.backgroundColor = "transparent"
})

// click on lists
let listsOpen = true;
let listsHead = document.getElementById("listsCont").children[0];
listsHead.addEventListener('click', () => {
    let lists = document.getElementById("lists")
    let arrowSymbol = document.getElementById("lists-btn").querySelector(".symbol")
    if (!listsOpen) {
        lists.classList.remove("collapse")
        lists.style.animation = "openY 0.2s linear 0s 1";
        arrowSymbol.innerHTML = "keyboard_arrow_up";
    } else {
        lists.style.animation = "closeY 0.2s linear 0s 1";
        lists.addEventListener("animationend", () => lists.classList.add("collapse"), { once: true });
        arrowSymbol.innerHTML = "keyboard_arrow_down";
    }

    listsOpen = !listsOpen;
});