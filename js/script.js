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
    if (cartSidebar) cartSidebar.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
}

function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Add to Cart with Event Delegation & Double-Click Debounce
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    
    if (btn.classList.contains('adding')) return;
    
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
    btn.classList.add('adding');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="ri-check-line"></i> Added';
    btn.style.background = 'var(--primary-color)';
    btn.style.color = '#ffffff';
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = '';
        btn.style.color = '';
        btn.classList.remove('adding');
    }, 900);
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

// Change Quantity (+ / -)
window.changeQuantity = function(index, delta) {
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
};

// Update Cart UI
function updateCartUI() {
    if (!cartItemsContainer || !cartTotalElement || !cartBadge) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty! Go add some boldness.</div>';
        cartTotalElement.innerText = 'Rs. 0';
        cartBadge.innerText = '0';
        return;
    }
    
    let total = 0;
    let totalItems = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-price">Rs. ${item.price.toLocaleString()} x ${item.quantity} = <strong>Rs. ${itemTotal.toLocaleString()}</strong></div>
            </div>
            <div class="cart-qty-controls">
                <button type="button" class="qty-btn" onclick="changeQuantity(${index}, -1)" title="Decrease quantity">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="changeQuantity(${index}, 1)" title="Increase quantity">+</button>
            </div>
            <button type="button" class="remove-item" onclick="removeItem(${index})" title="Remove item"><i class="ri-delete-bin-line"></i></button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
    
    cartTotalElement.innerText = 'Rs. ' + total.toLocaleString();
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
                    obs.unobserve(entry.target);
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
        message += `*Customer Details:*\n• Name: ${name}\n• Phone: ${phone}\n• Address / Table: ${address}\n\n`;
        message += `*Order Items:*\n`;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `• ${item.quantity}x ${item.name} - Rs. ${itemTotal.toLocaleString()}\n`;
        });
        
        message += `\n*Total Amount:* Rs. ${total.toLocaleString()}\n`;
        
        if (notes) {
            message += `*Notes:* ${notes}\n`;
        }
        
        message += `\n_Order placed via Chicken Mashwi Digital Web Menu_`;
        
        // Chicken Mashwi WhatsApp Contact
        const phoneNumber = "923399978999"; 
        
        // Encode for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Clear Cart after sending
        cart = [];
        updateCartUI();
        closeCheckoutModal();
        closeCart();
        checkoutForm.reset();
    });
}

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

// --- Digital Table QR Code Modal & Multi-QR Switcher ---
const qrModal = document.getElementById('qr-modal');
const closeQrModalBtn = document.getElementById('close-qr-modal');
const openQrModalBtns = document.querySelectorAll('.open-qr-modal-btn');
const qrTabBtns = document.querySelectorAll('.qr-tab-btn');
const qrDisplayImg = document.getElementById('qr-display-img');
const qrDisplayTitle = document.getElementById('qr-display-title');
const qrDisplayDesc = document.getElementById('qr-display-desc');
const qrDirectLink = document.getElementById('qr-direct-link');
const downloadQrBtn = document.getElementById('download-qr-btn');
const printQrBtn = document.getElementById('print-qr-btn');

// QR Code Data Configurations
const qrConfigs = {
    menu: {
        img: 'assets/images/qr-menu.png',
        title: 'Scan for Digital Menu & Order',
        desc: 'Scan with your mobile camera to open our live digital menu, pick your favorite dishes, and order directly on WhatsApp.',
        link: 'https://asadchaudhary27.github.io/chickenmashwi/#menu',
        linkText: 'Open Digital Menu (1-Click)',
        downloadName: 'Chicken-Mashwi-Menu-QR.png'
    },
    review: {
        img: 'assets/images/qr-google-review.png',
        title: 'Scan to Rate Us on Google (5★)',
        desc: 'Loved our authentic slow flame taste? Scan to open our Google Reviews page and share your 5-star experience!',
        link: 'https://maps.google.com/?cid=7872371147936234528',
        linkText: 'Leave Google Review in 1-Click',
        downloadName: 'Chicken-Mashwi-Google-Review-QR.png'
    },
    location: {
        img: 'assets/images/qr-google-maps.png',
        title: 'Scan for Google Maps Directions',
        desc: 'Scan to navigate directly to Chicken Mashwi in Barkat Market, Garden Town, Lahore.',
        link: 'https://maps.google.com/?cid=7872371147936234528',
        linkText: 'Open Directions in Google Maps',
        downloadName: 'Chicken-Mashwi-Location-QR.png'
    },
    whatsapp: {
        img: 'assets/images/qr-whatsapp.png',
        title: 'Scan to Chat on WhatsApp',
        desc: 'Scan to chat directly with our team at 033-999-78-999 for inquiries, party orders, or catering.',
        link: 'https://wa.me/923399978999',
        linkText: 'Chat on WhatsApp in 1-Click',
        downloadName: 'Chicken-Mashwi-WhatsApp-QR.png'
    }
};

function switchQR(type) {
    const config = qrConfigs[type] || qrConfigs.menu;
    
    // Update active tab button
    qrTabBtns.forEach(btn => {
        if (btn.dataset.qr === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update image and text
    if (qrDisplayImg) {
        qrDisplayImg.src = config.img;
        qrDisplayImg.alt = config.title;
    }
    if (qrDisplayTitle) qrDisplayTitle.textContent = config.title;
    if (qrDisplayDesc) qrDisplayDesc.textContent = config.desc;
    if (qrDirectLink) {
        qrDirectLink.href = config.link;
        qrDirectLink.innerHTML = `<i class="ri-external-link-line"></i> ${config.linkText}`;
    }
    if (downloadQrBtn) {
        downloadQrBtn.href = config.img;
        downloadQrBtn.download = config.downloadName;
    }
}

const openQrModal = (e) => {
    if (e) e.preventDefault();
    if (qrModal) {
        qrModal.classList.add('active');
        qrModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // If button specifies a target QR (e.g. review or location)
        const targetType = e.currentTarget && e.currentTarget.dataset.qrTarget ? e.currentTarget.dataset.qrTarget : 'menu';
        switchQR(targetType);
    }
};

const closeQrModal = () => {
    if (qrModal) {
        qrModal.classList.remove('active');
        qrModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
};

openQrModalBtns.forEach(btn => {
    btn.addEventListener('click', openQrModal);
});

if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener('click', closeQrModal);
}

if (qrModal) {
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            closeQrModal();
        }
    });
}

// QR Tabs Click
qrTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchQR(btn.dataset.qr);
    });
});

// Print QR Table Card
if (printQrBtn) {
    printQrBtn.addEventListener('click', () => {
        window.print();
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
        if (qrModal && qrModal.classList.contains('active')) {
            closeQrModal();
        }
    }
});
