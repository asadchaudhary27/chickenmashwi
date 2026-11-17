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

// --- Add-to-Cart Flying Parabolic Animation ---
function flyToCartAnimation(startElement) {
    const cartTarget = document.querySelector('.floating-cart-btn') || document.getElementById('cart-btn');
    if (!startElement || !cartTarget) return;

    const startRect = startElement.getBoundingClientRect();
    const targetRect = cartTarget.getBoundingClientRect();

    const clone = document.createElement('div');
    clone.className = 'fly-item-clone';
    clone.innerHTML = '<i class="ri-shopping-bag-3-fill"></i>';
    clone.style.left = `${startRect.left + (startRect.width / 2) - 24}px`;
    clone.style.top = `${startRect.top + (startRect.height / 2) - 24}px`;
    document.body.appendChild(clone);

    // Force DOM layout
    clone.getBoundingClientRect();

    const deltaX = (targetRect.left + (targetRect.width / 2)) - (startRect.left + (startRect.width / 2));
    const deltaY = (targetRect.top + (targetRect.height / 2)) - (startRect.top + (startRect.height / 2));

    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.35)`;
    clone.style.opacity = '0.3';

    // Mobile haptic vibration if supported
    if (navigator.vibrate) {
        try { navigator.vibrate(40); } catch(e) {}
    }

    setTimeout(() => {
        clone.remove();

        // Bounce cart button
        cartTarget.classList.remove('cart-bump');
        void cartTarget.offsetWidth;
        cartTarget.classList.add('cart-bump');

        // Pop cart badge
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.classList.remove('badge-pop');
            void badge.offsetWidth;
            badge.classList.add('badge-pop');
        }

        setTimeout(() => {
            cartTarget.classList.remove('cart-bump');
            if (badge) badge.classList.remove('badge-pop');
        }, 500);
    }, 650);
}

// --- Cart Toast Notification ---
let toastTimeout;
function showCartToast(title, desc) {
    const toast = document.getElementById('cart-toast');
    if (!toast) return;

    const titleEl = document.getElementById('toast-title');
    const descEl = document.getElementById('toast-desc');
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
    }, 3200);
}

const toastViewCartBtn = document.getElementById('toast-view-cart-btn');
if (toastViewCartBtn) {
    toastViewCartBtn.addEventListener('click', () => {
        const toast = document.getElementById('cart-toast');
        if (toast) toast.classList.remove('active');
        openCart();
    });
}

// --- Available Arabian Add-ons & Extras ---
const AVAILABLE_ADDONS = [
    { id: 'garlic-toum', name: 'Extra Garlic Toum Sauce', price: 50 },
    { id: 'fresh-pita', name: 'Fresh Arabian Pita (Khubz)', price: 50 },
    { id: 'mandi-rice-portion', name: 'Extra Spiced Mandi Rice', price: 150 },
    { id: 'batata-harra-extra', name: 'Batata Harra (Arabic Potatoes)', price: 100 },
    { id: 'arabian-pickles', name: 'Arabian Torshi Pickled Turnips', price: 50 },
    { id: 'green-chutney-extra', name: 'Spicy Arabian Green Chutney', price: 30 },
    { id: 'cheese-layer', name: 'Melted Cheese Topping', price: 100 },
    { id: 'drink-can-extra', name: 'Chilled Cola / Sprite (350ml)', price: 100 }
];

let currentModalItem = null;
let currentModalQty = 1;
let selectedModalAddons = [];

function openAddonModal(name, basePrice, img, desc) {
    currentModalItem = { name, basePrice: parseFloat(basePrice), img, desc };
    currentModalQty = 1;
    selectedModalAddons = [];

    const modal = document.getElementById('addon-modal');
    const titleEl = document.getElementById('addon-modal-title');
    const descEl = document.getElementById('addon-modal-desc');
    const basePriceEl = document.getElementById('addon-modal-base-price');
    const imgEl = document.getElementById('addon-modal-img');
    const noteEl = document.getElementById('addon-custom-note');
    const qtyValEl = document.getElementById('addon-qty-val');
    const addonsListEl = document.getElementById('addons-list');

    if (titleEl) titleEl.textContent = name;
    if (descEl) descEl.textContent = desc || 'Authentic slow flame Arabian specialty.';
    if (basePriceEl) basePriceEl.textContent = `Rs. ${currentModalItem.basePrice.toLocaleString()}`;
    if (imgEl && img) imgEl.src = img;
    if (noteEl) noteEl.value = '';
    if (qtyValEl) qtyValEl.textContent = currentModalQty;

    // Render selectable add-on rows
    if (addonsListEl) {
        addonsListEl.innerHTML = AVAILABLE_ADDONS.map(addon => `
            <label class="addon-row" data-id="${addon.id}">
                <div class="addon-row-left">
                    <input type="checkbox" class="addon-checkbox" value="${addon.id}" data-name="${addon.name}" data-price="${addon.price}">
                    <span class="addon-row-name">${addon.name}</span>
                </div>
                <span class="addon-price-badge">+Rs. ${addon.price}</span>
            </label>
        `).join('');

        addonsListEl.querySelectorAll('.addon-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const row = cb.closest('.addon-row');
                if (cb.checked) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                }
                updateModalTotal();
            });
        });
    }

    updateModalTotal();
    if (modal) modal.classList.add('active');
}

function updateModalTotal() {
    if (!currentModalItem) return;
    const checkboxes = document.querySelectorAll('#addons-list .addon-checkbox:checked');
    let addonsTotal = 0;
    selectedModalAddons = [];
    checkboxes.forEach(cb => {
        const p = parseFloat(cb.dataset.price);
        addonsTotal += p;
        selectedModalAddons.push({ name: cb.dataset.name, price: p });
    });

    const unitPrice = currentModalItem.basePrice + addonsTotal;
    const grandTotal = unitPrice * currentModalQty;

    const totalEl = document.getElementById('addon-modal-total-price');
    if (totalEl) totalEl.textContent = `Rs. ${grandTotal.toLocaleString()}`;
}

// Modal Quantity Buttons
const addonQtyMinus = document.getElementById('addon-qty-minus');
const addonQtyPlus = document.getElementById('addon-qty-plus');
const addonQtyVal = document.getElementById('addon-qty-val');

if (addonQtyMinus) {
    addonQtyMinus.addEventListener('click', () => {
        if (currentModalQty > 1) {
            currentModalQty--;
            if (addonQtyVal) addonQtyVal.textContent = currentModalQty;
            updateModalTotal();
        }
    });
}

if (addonQtyPlus) {
    addonQtyPlus.addEventListener('click', () => {
        currentModalQty++;
        if (addonQtyVal) addonQtyVal.textContent = currentModalQty;
        updateModalTotal();
    });
}

// Close Addon Modal
const closeAddonModalBtn = document.getElementById('close-addon-modal');
const addonModalOverlay = document.getElementById('addon-modal');
function closeAddonModal() {
    if (addonModalOverlay) addonModalOverlay.classList.remove('active');
}
if (closeAddonModalBtn) closeAddonModalBtn.addEventListener('click', closeAddonModal);
if (addonModalOverlay) {
    addonModalOverlay.addEventListener('click', (e) => {
        if (e.target === addonModalOverlay) closeAddonModal();
    });
}

// Confirm Add Customized Item to Cart
const addonConfirmBtn = document.getElementById('addon-confirm-btn');
if (addonConfirmBtn) {
    addonConfirmBtn.addEventListener('click', () => {
        if (!currentModalItem) return;

        const noteInput = document.getElementById('addon-custom-note');
        const instructions = noteInput ? noteInput.value.trim() : '';

        let addonsPrice = 0;
        selectedModalAddons.forEach(a => addonsPrice += a.price);
        const unitPrice = currentModalItem.basePrice + addonsPrice;

        const addonKey = selectedModalAddons.map(a => a.name).sort().join('|');
        const itemKey = `${currentModalItem.name}__${addonKey}__${instructions}`;

        const existing = cart.find(item => item.id === itemKey);
        if (existing) {
            existing.quantity += currentModalQty;
        } else {
            cart.push({
                id: itemKey,
                name: currentModalItem.name,
                basePrice: currentModalItem.basePrice,
                price: unitPrice,
                addons: [...selectedModalAddons],
                instructions: instructions,
                quantity: currentModalQty
            });
        }

        updateCartUI();
        flyToCartAnimation(addonConfirmBtn);
        showCartToast(currentModalItem.name, `${currentModalQty}x with extras added to cart!`);
        closeAddonModal();
    });
}

// Event Delegation for Customize Buttons
document.addEventListener('click', (e) => {
    const custBtn = e.target.closest('.customize-btn');
    if (!custBtn) return;

    const name = custBtn.dataset.name;
    const price = custBtn.dataset.price;
    const img = custBtn.dataset.img;
    const desc = custBtn.dataset.desc;

    if (name && price) {
        openAddonModal(name, price, img, desc);
    }
});

// Event Delegation for Quick Add-on Pills in Cart Drawer
document.addEventListener('click', (e) => {
    const pill = e.target.closest('.quick-addon-pill');
    if (!pill) return;

    const name = pill.dataset.name;
    const price = parseFloat(pill.dataset.price);
    if (!name || isNaN(price)) return;

    const itemKey = `addon_${name}`;
    const existing = cart.find(item => item.id === itemKey);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: itemKey,
            name: name,
            basePrice: price,
            price: price,
            addons: [],
            instructions: '',
            quantity: 1
        });
    }

    updateCartUI();
    flyToCartAnimation(pill);
    showCartToast(name, `Added side to order (+Rs. ${price})`);
});

// Standard Add to Cart with Event Delegation & Flying Animation
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    
    if (btn.classList.contains('adding')) return;
    
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    if (!name || isNaN(price)) return;
    
    // Check if plain item exists
    const itemKey = `standard_${name}`;
    const existingItem = cart.find(item => item.id === itemKey || (item.name === name && (!item.addons || item.addons.length === 0) && !item.instructions));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemKey,
            name: name,
            basePrice: price,
            price: price,
            addons: [],
            instructions: '',
            quantity: 1
        });
    }
    
    updateCartUI();
    flyToCartAnimation(btn);
    showCartToast(name, `Added to cart (Rs. ${price.toLocaleString()})`);
    
    // Feedback animation on button
    btn.classList.add('adding');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="ri-check-line"></i> Added!';
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
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
        
        // Addons mini tags
        let addonsHtml = '';
        if (item.addons && item.addons.length > 0) {
            addonsHtml = `<div class="item-addons-tags">${item.addons.map(a => `<span class="addon-tag">+ ${a.name} (+Rs. ${a.price})</span>`).join('')}</div>`;
        }

        // Special instruction note
        let noteHtml = '';
        if (item.instructions) {
            noteHtml = `<div class="item-instruction-tag"><i class="ri-information-line"></i> Note: "${item.instructions}"</div>`;
        }

        itemEl.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                ${addonsHtml}
                ${noteHtml}
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
            if (item.addons && item.addons.length > 0) {
                const addonsStr = item.addons.map(a => `${a.name} (+Rs. ${a.price})`).join(', ');
                message += `   └ Extras: ${addonsStr}\n`;
            }
            if (item.instructions) {
                message += `   └ Kitchen Note: "${item.instructions}"\n`;
            }
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
