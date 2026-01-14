
function signup() {
    var suser = document.getElementById("suser");
    var spass = document.getElementById("spass");
    var spassc = document.getElementById("spassc")
    if (suser.value === "" || spass.value === ""||spassc==="") 
        {
        alert("Fill all the fields");
        return;
    }

    if (localStorage.getItem("user_" + suser.value)) {
        alert("User already exist!");
        return;
    }
    if (spass.value.length < 6) {
        alert("Password need to be 6 letters");
        return;
    }
    if(spass.value!=spassc.value)
    {
        alert("Passwords didn't match !");
        spassc.value="";
    }
    else{
    localStorage.setItem("user_" + suser.value, spass.value);
    window.location,href="index.html";
    }

}

function login() {
    var luser = document.getElementById("luser").value;
    var lpass = document.getElementById("lpass").value;

    if (luser === "" || lpass === "") {
        alert("Enter all the fields!");
    }
    else if (localStorage.getItem("user_" + luser) === null) {
        alert("User name not found");
    }
    else if (lpass === localStorage.getItem("user_" + luser)) {
        localStorage.setItem("Currentuser", luser);
        window.location.href = "homepage.html";
    }
    else {
        alert("Wrong password!");
    }
}

function logout() {
    localStorage.removeItem("Currentuser");
    window.location.href = "index.html";
}

function addcart(name, id, price, img) {
    var user = localStorage.getItem("Currentuser");
    if (!user) return;

    var cartkey = "cart_" + user;
    var cart = JSON.parse(localStorage.getItem(cartkey)) || {};

    if (cart[id]) {
        cart[id].qty += 1;
    } else {
        cart[id] = { id, name, price, img, qty: 1 };
    }

    localStorage.setItem(cartkey, JSON.stringify(cart));
}
loadcart();
function loadcart() {
    var user = localStorage.getItem("Currentuser");
    if (!user) return;

    var cartkey = "cart_" + user;
    var cart = JSON.parse(localStorage.getItem(cartkey)) || {};
    var cont = document.getElementById("cont");
    if (!cont) return;

    cont.innerHTML = "";

    for (var id in cart) {
        var item = cart[id];

        cont.innerHTML += `
        <div>
            <h1>${item.name}</h1>
            <h3>Qty: ${item.qty}</h3>
            <h3>Price: ${item.price * item.qty}</h3>
            <img src="${item.img}" width="100"><br>
            <button onclick="del(${item.id})">Remove</button>
            <button onclick="openBuyPopup(${item.id})" id="buy">Buy</button>
        </div>`;
    }
}

function del(id) {
    var user = localStorage.getItem("Currentuser");
    var cartkey = "cart_" + user;
    var cart = JSON.parse(localStorage.getItem(cartkey)) || {};

    delete cart[id];
    localStorage.setItem(cartkey, JSON.stringify(cart));
    loadcart();
}

function clr() {
    var user = localStorage.getItem("Currentuser");
    localStorage.removeItem("cart_" + user);
    loadcart();
}


function openBuyPopup(id = null) {
    currentBuyId = id;

    let user = localStorage.getItem("Currentuser");
    let cart = JSON.parse(localStorage.getItem("cart_" + user)) || {};

    let list = document.getElementById("buyList");
    let totalBox = document.getElementById("buyTotal");

    list.innerHTML = "";
    let total = 0;

    if (id !== null) {
        let item = cart[id];
        total = item.price * item.qty;
        list.innerHTML = `<p id="bi">${item.name} X ${item.qty}</p>`;
    } else {
        for (let key in cart) {
            let item = cart[key];
            total += item.price * item.qty;
            list.innerHTML += `<p id="bi">${item.name} : ${item.qty} X Rs.${item.price}</p>`;
        }
    }

    totalBox.innerText = "Total: " + total;
    document.getElementById("buyPopup").style.display = "flex";
}

document.getElementById("confirmBuy").onclick = function () {
    let user = localStorage.getItem("Currentuser");
    let cartKey = "cart_" + user;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || {};

    if (currentBuyId !== null) {
        delete cart[currentBuyId];
        localStorage.setItem(cartKey, JSON.stringify(cart));
    } else {
        localStorage.removeItem(cartKey);
    }

    closeBuy();
    loadcart();
};

function closeBuy() {
    document.getElementById("buyPopup").style.display = "none";
}
function searchProducts() {
    let img = document.getElementById("test");
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll("#products > div");

    if (input === "") {
        if (img) img.style.display = "block";
    } else {
        if (img) img.style.display = "none";
    }

    products.forEach(product => {
        let name = product.querySelector("h1").innerText.toLowerCase();
        if (name.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

window.onload = loadcart;
