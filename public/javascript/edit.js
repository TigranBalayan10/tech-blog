let currentUserId;
async function currentUserData () {
    const response = await fetch('/api/users/loggedin', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    });
    const userData = await response.json()
    const userId = await userData.id;
    currentUserId= await userId;
};
currentUserData();

// Edit expenses
async function editProduct(event) {
  event.preventDefault();
  const product_name = document.querySelector("#edit-product").value.trim();
  const priceWithDollarSign = document.querySelector("#edit-price").value.trim();
  const price = priceWithDollarSign.replace('$', '');
  const tag_id = document.querySelector("#drop-down-tag").value;
  const product = document.querySelector("#edit-product");
  const productId = product.getAttribute("data-set-product-id");

  const response = await fetch(`/api/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify({
      product_name,
      price,
      tag_id,
      user_id
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    updateUserIncome();
    location.reload('/')
  }
}
async function updateUserIncome () {
  // Empty array for all the products in same month
  let monthlyProducts = [];
  // Empty number where prices will be added to
  let monthlyTotal = 0;
  // Get all expenses prices of the current month. 
  const response = await fetch(`/api/products/monthly/${currentUserId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
  });
  const allProducts = await response.json();
  allProducts.forEach( product => {
      const date = new Date(product.createdAt);
      const createdMonth = date.getMonth() + 1;
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      if (createdMonth === currentMonth) {
          monthlyProducts.push(product);
      }
  });
  monthlyProducts.forEach(product => {
      const price = parseInt(product.price)
      monthlyTotal += price;
  });
  // This is where we get the total Expenses
  document.querySelector('#total_expenses').innerHTML = monthlyTotal;
  const response2 = await fetch(`/api/users/${currentUserId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'}
  });
  userData = await response2.json();
  const monthlyIncome = await userData.monthly_income - monthlyTotal;
  document.querySelector('#remaining_income').innerHTML = monthlyIncome
  reloadPage();
}

let deleteProductId;
function editStartClick (event){
  // Get the data from the list item
  const btn = event.target;
  const productPrice = btn.previousElementSibling.childNodes[1].innerHTML;
  const productName = btn.previousElementSibling.previousElementSibling.children[0].innerHTML;
  const date = btn.previousElementSibling.previousElementSibling.previousElementSibling
      .innerHTML;

  const product = btn.previousElementSibling.previousElementSibling.previousElementSibling
  const productId = product.getAttribute("data-set-product-id");
  // set productID
  deleteProductId = productId;
  // Set the data in the form
  document.querySelector("#edit-product").value = productName;
  document.querySelector("#edit-price").value = productPrice;
  document.querySelector("#edit-product").setAttribute('data-set-product-id', productId);
}

// Add click event listeners to all buttons
const buttons = document.getElementsByClassName("product-edit-btn");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", editStartClick);
}

// Delete product
async function deleteProduct(event) {
  // Get the prodcut ID
  const product = document.getElementById('edit-product');
  const productId = product.getAttribute('data-set-product-id');
  const response = await fetch(`/api/products/${deleteProductId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  const deletedData = await response.json();
  if(response.ok){
    updateExpenses();
    window.location.replace('/');
  }
}

// Add click event to edit and delete button
document
  .querySelector("#delete-product")
  .addEventListener("click", deleteProduct);


document.querySelector("#edit-expense").addEventListener("click", editProduct);
