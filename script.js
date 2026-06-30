// =====================
// A SQUARE BILL MAKER
// =====================

// PRODUCTS DATABASE (with stock system)
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
40: { price: 40, stock: 200 }
}
};

// =====================
// ADMIN PASSWORD
// =====================
const ADMIN_PASS = "Avrtheking";
let adminUnlocked = false;

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
setupFirstRow();
updateDashboard();
});

// =====================
// SET PRICE AUTOMATICALLY
// =====================
function setupFirstRow() {
document.querySelectorAll(".billRow").forEach(row => {

let product = row.querySelector(".product");
let variant = row.querySelector(".variant");
let qty = row.querySelector(".qty");
let price = row.querySelector(".price");
let total = row.querySelector(".total");

function calculate() {
let p = product.value;
let v = variant.value;

if(products[p] && products[p][v]){
price.value = products[p][v].price;
total.value = price.value * qty.value;
calculateGrandTotal();
}
}

product.onchange = calculate;
variant.onchange = calculate;
qty.oninput = calculate;
});
}

// =====================
// GRAND TOTAL CALCULATION
// =====================
function calculateGrandTotal(){

let subtotal = 0;

document.querySelectorAll(".billRow").forEach(row=>{
let total = row.querySelector(".total").value || 0;
subtotal += Number(total);
});

document.getElementById("subtotal").value = subtotal;

let discount = document.getElementById("discount").value;
let delivery = Number(document.getElementById("delivery").value || 0);

let final = subtotal;

// discount logic
if(discount.includes("%")){
let percent = parseFloat(discount);
final -= (subtotal * percent / 100);
}else if(discount){
final -= Number(discount);
}

final += delivery;

document.getElementById("grandTotal").value = final;

}

// =====================
// ADD NEW PRODUCT ROW
// =====================
document.getElementById("addItem").addEventListener("click", ()=>{

let newRow = document.querySelector(".billRow").cloneNode(true);
document.getElementById("billItems").appendChild(newRow);
setupFirstRow();
});

// =====================
// ADMIN LOGIN
// =====================
document.getElementById("adminBtn").onclick = ()=>{
document.getElementById("adminModal").style.display = "flex";
};

document.getElementById("loginAdmin").onclick = ()=>{
let pass = document.getElementById("adminPass").value;

if(pass === ADMIN_PASS){
adminUnlocked = true;
alert("Admin Unlocked");
document.getElementById("adminModal").style.display = "none";
}else{
document.getElementById("errorMsg").innerText = "Wrong Password!";
}
};

// =====================
// STOCK DEDUCTION (ON SAVE)
// =====================
document.getElementById("saveBill").onclick = ()=>{

document.querySelectorAll(".billRow").forEach(row=>{
let p = row.querySelector(".product").value;
let v = row.querySelector(".variant").value;
let q = Number(row.querySelector(".qty").value);

if(products[p] && products[p][v]){
products[p][v].stock -= q;
}
});

alert("Bill Saved & Stock Updated");
updateDashboard();
};

// =====================
// DASHBOARD UPDATE
// =====================
function updateDashboard(){

let totalProducts = Object.keys(products).length;
let lowStock = 0;

for(let p in products){
for(let v in products[p]){
if(products[p][v].stock < 20){
lowStock++;
}
}
}

document.getElementById("productCount").innerText = totalProducts;
document.getElementById("lowStock").innerText = lowStock;
document.getElementById("totalOrders").innerText =
Number(document.getElementById("totalOrders").innerText) + 1;
document.getElementById("todaySales").innerText =
"₹" + document.getElementById("grandTotal").value;
}

// =====================
// PDF GENERATION (SIMPLE)
// =====================
document.getElementById("generateBill").onclick = ()=>{

const { jsPDF } = window.jspdf;
let doc = new jsPDF();

doc.setFontSize(16);
doc.text("A Square Invoice", 10, 10);

let y = 20;

document.querySelectorAll(".billRow").forEach(row=>{
let p = row.querySelector(".product").value;
let v = row.querySelector(".variant").value;
let q = row.querySelector(".qty").value;
let t = row.querySelector(".total").value;

doc.text(`${p} (${v}) x${q} = ₹${t}`, 10, y);
y += 10;
});

doc.text("Grand Total: ₹" + document.getElementById("grandTotal").value, 10, y+10);

doc.save("A-Square-Invoice.pdf");
};

// =====================
// PRINT
// =====================
document.getElementById("printBill").onclick = ()=>{
window.print();
};
