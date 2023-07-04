/* ********** JS CODE *************** */

const cartBtn       = document.querySelector('.cart-btn');
const cartItems     = document.querySelector('.cart-items');
const cartOverlay   = document.querySelector('.cart-overlay');
const cartDOM       = document.querySelector('.cart');
const closeCartBtn  = document.querySelector('.close-cart');
const cartContent   = document.querySelector('.cart-content');
const clearCartBtn  = document.querySelector('.clear-cart');
const cartTotal     = document.querySelector('.cart-total');
const productsDOM   = document.querySelector('.products-center');

let cart = [];

// getting the products
class Products {
    async getProducts(){
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            //console.log(products);
            products = products.map( (item) => {

                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;

                return {title, price, id, image}
                
            });
            return products;
            
        } catch (error) {
            console.log(error);
        }
        
    } // end async
}

// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach( product => {
           result += `        
                <article class="product">
                    <div class="img-container">
                        <img src=${product.image} class="product-img" alt="${product.title}">
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart"></i>
                            add to cart
                        </button>
                    </div><!-- end img-container -->
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </article><!-- end article product --> `;
        });
        //console.log(products)
        productsDOM.innerHTML = result;
    } // end displayProducts()

    getBagButtons(){
        const btns = document.querySelectorAll(".bag-btn");
        console.log(btns);
    }
}

// local storage

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
        }).then( () => {
               ui.getBagButtons(); 
           });
});



