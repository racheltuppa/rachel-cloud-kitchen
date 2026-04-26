// Rachel's Menu Data
const menuItems = [
    { id: 1, name: "Spicy Basil Chicken", price: 14.99, img: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Truffle Mac & Cheese", price: 12.50, img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Vegan Buddha Bowl", price: 13.00, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80" }
];

let cart = [];

// Initialize Menu
function loadMenu() {
    const grid = document.getElementById('menu-grid');
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

// Cart Functions
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    cart.push(item);
    updateCartUI();
    alert(`${item.name} added to cart!`);
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)} <button onclick="removeFromCart(${index})" style="color:red; border:none; background:none; cursor:pointer;">X</button></span>
            </div>
        `;
    });
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('hidden');
}

// Checkout Function (Connects to backend)
async function checkout() {
    const nameInput = document.getElementById('customer-name').value;
    
    if (!nameInput) return alert('Please enter your name!');
    if (cart.length === 0) return alert('Your cart is empty!');

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const orderData = {
        customerName: nameInput,
        items: cart,
        total: total
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('🎉 Order placed successfully! Our chefs are on it.');
            cart = [];
            updateCartUI();
            toggleCart();
            document.getElementById('customer-name').value = '';
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error("Checkout Error:", error);
        alert('Server error. Ensure the backend is running.');
    }
}

// Run on load
window.onload = loadMenu;
