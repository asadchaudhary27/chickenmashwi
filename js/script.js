// --- Mobile Navbar Toggle with Outside Click & Overlay ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.getElementById('nav-overlay');

function openNav() {
    if (!navLinks) return;
    navLinks.classList.add('nav-active');
    if (navOverlay) navOverlay.classList.add('active');
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'true');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('ri-menu-line');
            icon.classList.add('ri-close-line');
        }
    }
}

function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove('nav-active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-line');
        }
    }
}

if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinks.classList.contains('nav-active')) {
            closeNav();
        } else {
            openNav();
        }
    });

    if (navOverlay) {
        navOverlay.addEventListener('click', closeNav);
    }

    // Close nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close when clicking outside navbar
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('nav-active')) {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                closeNav();
            }
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('nav-active')) {
            closeNav();
        }
    });
}

// --- Cart Logic ---
let cart = [];

const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartBadge = document.getElementById('cart-count');

// Toggle Cart
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Add to Cart with Event Delegation
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    if (!name || isNaN(price)) return;
    
    // Check if item exists
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartUI();
    
    // Feedback animation
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="ri-check-line"></i> Added';
    btn.style.background = 'var(--primary-color)';
    btn.style.color = '#ffffff';
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.style.color = '';
    }, 1200);
});

// Category Tab Filtering
const menuTabs = document.querySelectorAll('.menu-tab-btn');
const categorySections = document.querySelectorAll('.menu-category-section');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const targetCategory = tab.dataset.category;
        
        categorySections.forEach(sec => {
            if (targetCategory === 'all' || sec.dataset.category === targetCategory) {
                sec.style.display = 'block';
                // Trigger scroll-reveal check
                sec.classList.add('active');
            } else {
                sec.style.display = 'none';
            }
        });
    });
});

// Remove from Cart
window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// Update Cart UI
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty! Go add some boldness.</div>';
        cartTotalElement.innerText = 'Rs. 0.00';
        cartBadge.innerText = '0';
        return;
    }
    
    let total = 0;
    let totalItems = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-price">Rs. ${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeItem(${index})"><i class="ri-delete-bin-line"></i></button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
    
    cartTotalElement.innerText = 'Rs. ' + total.toFixed(2);
    cartBadge.innerText = totalItems;
}

// --- High-Performance Butter-Smooth Scroll & Section Revealer ---
const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.scroll-reveal, .content-section');
    
    // Always activate hero immediately
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('active');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target); // Stop tracking once visible -> 0 CPU overhead!
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.05
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers: show everything immediately
        revealElements.forEach(el => el.classList.add('active'));
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
    initScrollReveal();
}

// --- WhatsApp Checkout Logic ---
const checkoutBtn = document.querySelector('.checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal');
const checkoutForm = document.getElementById('checkout-form');

// Open Modal
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty! Add some delicious Mashwi first.");
            return;
        }
        if (checkoutModal) checkoutModal.classList.add('active');
    });
}

// Close Modal
const closeCheckoutModal = () => {
    if (checkoutModal) checkoutModal.classList.remove('active');
};
if (closeModalBtn) closeModalBtn.addEventListener('click', closeCheckoutModal);
if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });
}

// Handle Form Submit
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    const notes = document.getElementById('order-notes').value;
    
    let total = 0;
    
    // Build Message
    let message = `*🍗 New Order - Chicken Mashwi*\n\n`;
    message += `*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n`;
    message += `*Order Details:*\n`;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${item.quantity}x ${item.name} - Rs. ${itemTotal.toFixed(2)}\n`;
    });
    
    message += `\n*Total:* Rs. ${total.toFixed(2)}\n`;
    
    if (notes) {
        message += `\n*Notes:* ${notes}\n`;
    }
    
    // Replace with actual Chicken Mashwi number
    const phoneNumber = "923399978999"; 
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Optional: Clear Cart after sending
    cart = [];
    updateCartUI();
    closeCheckoutModal();
    closeCart();
    checkoutForm.reset();
});

// --- Menu Card Popup Modal Logic ---
const menuCardModal = document.getElementById('menu-card-modal');
const closeMenuCardModalBtn = document.getElementById('close-menu-card-modal');
const openMenuCardBtns = document.querySelectorAll('.open-menu-card-btn');

const openMenuModal = (e) => {
    if (e) e.preventDefault();
    if (menuCardModal) {
        menuCardModal.classList.add('active');
        menuCardModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
};

const closeMenuModal = () => {
    if (menuCardModal) {
        menuCardModal.classList.remove('active');
        menuCardModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
};

openMenuCardBtns.forEach(btn => {
    btn.addEventListener('click', openMenuModal);
});

if (closeMenuCardModalBtn) {
    closeMenuCardModalBtn.addEventListener('click', closeMenuModal);
}

if (menuCardModal) {
    menuCardModal.addEventListener('click', (e) => {
        if (e.target === menuCardModal) {
            closeMenuModal();
        }
    });
}

// Global Escape Key Listener for Modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (menuCardModal && menuCardModal.classList.contains('active')) {
            closeMenuModal();
        }
        if (checkoutModal && checkoutModal.classList.contains('active')) {
            closeCheckoutModal();
        }
    }
});
