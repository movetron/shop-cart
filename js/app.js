(() => {
    "use strict";
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const counterContainer = document.querySelector(".counter");
    const cart = document.querySelector(".cart__container");
    const inCart = document.querySelectorAll(".inCart");
    const checkButton = document.getElementById("button");
    const templateShelf = document.getElementById("template-shelf").content;
    const templateProduct = document.getElementById("template-product").content;
    const products = [ {
        id: 1,
        title: "wine",
        image: "img/1.png"
    }, {
        id: 2,
        title: "milk",
        image: "../img/2.png"
    }, {
        id: 3,
        title: "jam",
        image: "../img/3.png"
    }, {
        id: 4,
        title: "cheese",
        image: "../img/4.png"
    }, {
        id: 5,
        title: "meat",
        image: "../img/5.png"
    }, {
        id: 6,
        title: "thigh",
        image: "../img/6.png"
    }, {
        id: 7,
        title: "chips",
        image: "../img/7.png"
    }, {
        id: 8,
        title: "pineapple",
        image: "../img/8.png"
    }, {
        id: 9,
        title: "banana",
        image: "../img/9.png"
    }, {
        id: 10,
        title: "apple",
        image: "../img/10.png"
    }, {
        id: 11,
        title: "salad",
        image: "../img/11.png"
    } ];
    let dragItem = null;
    let getX = 0;
    let getY = 0;
    function startDrag(event) {
        dragItem = event.target;
        event.dataTransfer.effectAllowed = "move";
        dragItem.classList.add("dragging");
    }
    function onDrop(event) {
        event.preventDefault();
        if (dragItem) {
            dragItem.classList.remove("dragging");
            if (event.target === cart || inCart) {
                cart.appendChild(dragItem);
                dragItem.classList.add("inCart");
                toggleCheckButton();
            }
        }
    }
    function endDrag(event) {
        event.preventDefault();
        if (dragItem) {
            dragItem.classList.remove("dragging");
            dragItem = null;
        }
    }
    function startTouch(event) {
        event.preventDefault();
        const touch = event.touches[0];
        getX = touch.clientX;
        getY = touch.clientY;
        dragItem = event.target;
        dragItem.classList.add("dragging_anim");
    }
    function moveTouch(event) {
        event.preventDefault();
        if (!dragItem) return;
        const touch = event.touches[0];
        const deltaX = touch.clientX - getX;
        const deltaY = touch.clientY - getY;
        dragItem.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
    function endTouch(event) {
        event.preventDefault();
        if (dragItem) {
            dragItem.classList.remove("dragging_anim");
            dragItem.style.transform = "";
            if (overCart(event.changedTouches[0])) {
                cart.appendChild(dragItem);
                dragItem.classList.add("inCart");
                toggleCheckButton();
            }
            dragItem = null;
        }
    }
    function overCart(touch) {
        const cartRect = cart.getBoundingClientRect();
        return touch.clientX > cartRect.left && touch.clientX < cartRect.right && touch.clientY > cartRect.top && touch.clientY < cartRect.bottom;
    }
    const MAX_IN_CART = 3;
    function toggleCheckButton() {
        const itemsInCart = cart.querySelectorAll(".item__image").length;
        if (itemsInCart === MAX_IN_CART) {
            checkButton.classList.remove("hidden");
            toggleItemDraggable(false);
        }
    }
    function toggleItemDraggable(enable) {
        document.querySelectorAll(".item").forEach((item => {
            item.draggable = enable;
            if (enable) {
                item.addEventListener("dragstart", startDrag);
                item.addEventListener("dragend", endDrag);
                item.addEventListener("touchstart", startTouch);
                item.addEventListener("touchmove", moveTouch);
                item.addEventListener("touchend", endTouch);
            } else {
                item.removeEventListener("dragstart", startDrag);
                item.removeEventListener("dragend", endDrag);
                item.removeEventListener("touchstart", startTouch);
                item.removeEventListener("touchmove", moveTouch);
                item.removeEventListener("touchend", endTouch);
            }
        }));
    }
    function createProducts() {
        const shelvesData = [ products.slice(0, 4), products.slice(4, 7), products.slice(7, 11) ];
        shelvesData.forEach((items => {
            const shelf = templateShelf.cloneNode(true).querySelector(".shelf");
            shelf.append(...createProductItmes(items));
            counterContainer.appendChild(shelf);
            toggleItemDraggable(true);
        }));
    }
    function createProductItmes(items) {
        return items.map((item => {
            const productElement = templateProduct.cloneNode(true).querySelector(".item");
            productElement.querySelector("img").src = item.image;
            productElement.classList.add(item.title);
            return productElement;
        }));
    }
    cart.addEventListener("dragover", (event => event.preventDefault()));
    cart.addEventListener("drop", onDrop);
    cart.addEventListener("touchend", endDrag);
    createProducts();
    window["FLS"] = true;
})();
