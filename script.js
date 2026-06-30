// =====================
// A SQUARE PREMIUM BILL SYSTEM (UPGRADED)
// =====================

// PRODUCTS DATABASE
let products = {
"Classic Peanut Butter": {
100: { price: 70, stock: 100 },
250: { price: 160, stock: 100 },
500: { price: 300, stock: 100 },
1000: { price: 450, stock: 100 }
},
"Classic Crunchy Peanut Butter": {
100: { price: 75, stock: 100 },
250: { price: 170, stock: 100 },
500: { price: 310, stock: 100 },
1000: { price: 450, stock: 100 }
},
"Chocolate Peanut Butter": {
100: { price: 85, stock: 100 },
250: { price: 200, stock: 100 },
500: { price: 370, stock: 100 },
1000: { price: 500, stock: 100 }
},
"Crunchy Chocolate Peanut Butter": {
100: { price: 90, stock: 100 },
250: { price: 210, stock: 100 },
500: { price: 380, stock: 100 },
1000: { price: 550, stock: 100 }
},
"High Protein Cookie": {
"unit": { price: 40, stock: 200 }
}
};

// ADMIN PASSWORD
const ADMIN_PASS = "Avrtheking";
let adminUnlocked = false;

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
attachRowEvents();
calculateAll();
});

// =====================
// ATTACH EVENTS TO ROWS
// =====================
function attachRowEvents() {
document.querySelectorAll(".billRow").forEach(row => {

let product = row.querySelector(".product");
let variant = row.querySelector(".variant");
let qty = row.querySelector(".qty");
let price = row.querySelector(".price");
let total = row.querySelector(".total");

function updateRow() {
let p = product.value;
let v = variant.value;
let q = Number(qty.value || 1);

// COOKIE FIX (no variant system)
if (p === "High Protein Cookie") {
price.value = products[p].unit.price;
total.value = q * price.value;
calculateAll();
return;
}

// NORMAL PRODUCTS
if (products[p] && products[p][v]) {
price.value = products[p][v].price;
total.value = q * price.value;
}

calculateAll();
}

product.onchange = updateRow;
variant.onchange = updateRow;
qty.oninput = updateRow;
});
}

// =====================
// ADD ROW
// =====================
document.getElementById("addItem").addEventListener("click", () => {
let row = document.querySelector(".billRow").cloneNode(true);
row.querySelectorAll("input").forEach(i => i.value = "");
document.getElementById("billItems").appendChild(row);
attachRowEvents();
});

// =====================
// CALCULATE EVERYTHING
// =====================
function calculateAll() {

let subtotal = 0;

document.querySelectorAll(".billRow").forEach(row => {
let t = Number(row.querySelector(".total").value || 0);
subtotal += t;
});

document.getElementById("subtotal").value = subtotal;

// discount
let discountInput = document.getElementById("discount").value;
let delivery = Number(document.getElementById("delivery").value || 0);

let final = subtotal;

if (discountInput.includes("%")) {
let p = parseFloat(discountInput) || 0;
final -= (subtotal * p / 100);
} else {
final -= Number(discountInput || 0);
}

final += delivery;

document.getElementById("grandTotal").value = final.toFixed(2);
}

// =====================
// SAVE BILL + STOCK
// =====================
document.getElementById("saveBill").onclick = () => {

document.querySelectorAll(".billRow").forEach(row => {

let p = row.querySelector(".product").value;
let v = row.querySelector(".variant").value;
let q = Number(row.querySelector(".qty").value || 0);

// COOKIE FIX
if (p === "High Protein Cookie") {
products[p].unit.stock -= q;
return;
}

if (products[p] && products[p][v]) {
products[p][v].stock -= q;
}

});

alert("Bill Saved & Stock Updated ✔");
};

// =====================
// ADMIN PANEL
// =====================
document.getElementById("adminBtn").onclick = () => {
document.getElementById("adminModal").style.display = "flex";
};

document.getElementById("loginAdmin").onclick = () => {
let pass = document.getElementById("adminPass").value;

if (pass === ADMIN_PASS) {
adminUnlocked = true;
alert("Admin Unlocked ✔");
document.getElementById("adminModal").style.display = "none";
} else {
document.getElementById("errorMsg").innerText = "Wrong Password!";
}
};

// =====================
// BEAUTIFUL COLORFUL PDF
// =====================
document.getElementById("generateBill").onclick = () => {

const { jsPDF } = window.jspdf;
let doc = new jsPDF();

// HEADER
doc.setFillColor(212, 175, 55);
doc.rect(0, 0, 220, 20, "F");

doc.setFontSize(18);
doc.setTextColor(0, 0, 0);
doc.text("A SQUARE INVOICE", 60, 13);

// CUSTOMER INFO
let name = document.getElementById("customerName").value;
let phone = document.getElementById("customerPhone").value;
let email = document.getElementById("customerEmail").value;

doc.setFontSize(11);
doc.setTextColor(50, 50, 50);
doc.text(`Name: ${name}`, 10, 30);
doc.text(`Phone: ${phone}`, 10, 37);
doc.text(`Email: ${email}`, 10, 44);

// ITEMS
let y = 55;

document.querySelectorAll(".billRow").forEach(row => {

let p = row.querySelector(".product").value;
let v = row.querySelector(".variant").value;
let q = row.querySelector(".qty").value;
let t = row.querySelector(".total").value;

doc.setTextColor(0, 0, 0);
doc.text(`${p} ${v ? "(" + v + ")" : ""} x${q} = ₹${t}`, 10, y);

y += 8;
});

// TOTAL BOX
doc.setFillColor(0, 0, 0);
doc.rect(10, y + 5, 180, 15, "F");

doc.setTextColor(255, 215, 0);
doc.text(`GRAND TOTAL: ₹${document.getElementById("grandTotal").value}`, 15, y + 15);

// FOOTER
doc.setFontSize(10);
doc.setTextColor(100, 100, 100);
doc.text("Thank you for choosing A Square ❤️", 40, y + 35);

doc.save("A-Square-Premium-Invoice.pdf");
};

// =====================
// PRINT
// =====================
document.getElementById("printBill").onclick = () => {
window.print();
};

// =====================
// INITIAL CALC
// =====================
setInterval(calculateAll, 500);
