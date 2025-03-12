// Classe Product pour représenter un produit
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// Classe ShoppingCartItem pour représenter un élément du panier
class ShoppingCartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    // Méthode pour calculer le prix total de l'élément
    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

// Classe ShoppingCart pour représenter le panier d'achat
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // Méthode pour ajouter un élément au panier
    addItem(product, quantity) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new ShoppingCartItem(product, quantity));
        }
        this.updateCartDisplay();
    }

    // Méthode pour supprimer un élément du panier
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateCartDisplay();
    }

    // Méthode pour calculer le total du panier
    getTotal() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    // Méthode pour mettre à jour l'affichage du panier
    updateCartDisplay() {
        const cartElement = document.querySelector('.cart');
        cartElement.innerHTML = '';

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.setAttribute('data-id', item.product.id);

            itemElement.innerHTML = `
                <span class="name">${item.product.name}</span>
                <button class="like-btn">❤️</button>
                <button class="quantity-btn minus">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus">+</button>
                <button class="delete-btn">Supprimer</button>
                <span class="price">${item.getTotalPrice().toFixed(2)} €</span>
            `;

            cartElement.appendChild(itemElement);
        });

        const totalElement = document.createElement('div');
        totalElement.classList.add('total');
        totalElement.innerHTML = `
            <span>Total: </span>
            <span class="total-price">${this.getTotal().toFixed(2)} €</span>
        `;
        cartElement.appendChild(totalElement);

        this.addEventListeners();
    }

    // Méthode pour gérer les événements
    addEventListeners() {
        const cartElement = document.querySelector('.cart');

        cartElement.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.item');
            const productId = itemElement ? itemElement.getAttribute('data-id') : null;

            if (e.target.classList.contains('plus')) {
                const quantityElement = e.target.previousElementSibling;
                let quantity = parseInt(quantityElement.textContent);
                quantityElement.textContent = ++quantity;
                this.updateCartDisplay();
            } else if (e.target.classList.contains('minus')) {
                const quantityElement = e.target.nextElementSibling;
                let quantity = parseInt(quantityElement.textContent);
                if (quantity > 1) {
                    quantityElement.textContent = --quantity;
                    this.updateCartDisplay();
                }
            } else if (e.target.classList.contains('delete-btn')) {
                this.removeItem(productId);
            } else if (e.target.classList.contains('like-btn')) {
                e.target.classList.toggle('liked');
            }
        });
    }

    // Méthode pour récupérer la commande
    placeOrder() {
        const total = this.getTotal();
        if (total > 0) {
            alert(`Commande passée avec succès ! Montant total : ${total.toFixed(2)} €`);
            this.items = []; // Vider le panier après la commande
            this.updateCartDisplay();
        } else {
            alert("Votre panier est vide. Ajoutez des articles avant de commander.");
        }
    }
}

// Exemple d'utilisation
const product1 = new Product(1, 'Article 1', 50.00);
const product2 = new Product(2, 'Article 2', 20.00);

const cart = new ShoppingCart();
cart.addItem(product1, 1);
cart.addItem(product2, 1);

// Gestion du bouton "Commander"
document.getElementById('order-btn').addEventListener('click', () => {
    cart.placeOrder();
});