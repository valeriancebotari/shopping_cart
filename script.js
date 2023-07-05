/* ********** JS CODE *************** */

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
let cart = [];

// products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      // let contentful = await client.getEntries({
      //   content_type: "comfyHouseProducts"
      // });
      // console.log(contentful.items);
      // console.log(data);

      let products = data.items;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// ui
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      result += `
   <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
        <!-- end of single product -->
   `;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach(button => {
      let id = button.dataset.id;

      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } else {
        button.addEventListener("click", event => {
          // disable button
          event.target.innerText = "In Bag";
          event.target.disabled = true;
          // add to cart
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          //cart = [...cart, cartItem];
          cart.push(cartItem);
          Storage.saveCart(cart);
          // add to DOM
          this.setCartValues(cart);
          this.addCartItem(cartItem);
          this.toggleShowCart();
        });
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = Number(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
        <img src=${item.image} alt="${item.title}">
            <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);
  }

  toggleShowCart(){
    if (cartOverlay.classList.contains('transparentBcg')){
          cartOverlay.classList.remove('transparentBcg');
    }
    else {
          cartOverlay.classList.add('transparentBcg')
    }

    if (cartDOM.classList.contains('showCart')){
          cartDOM.classList.remove('showCart');
    }
    else{
          cartDOM.classList.add('showCart');
    }    
  }

  //hideCart(){
  //  cartOverlay.classList.remove('transparentBcg'); 
   // cartDOM.classList.remove('showCart');
 // }

  setupAPP(){
    cart = Storage.getCart();
    console.log(cart);
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.toggleShowCart);
    //closeCartBtn.addEventListener('click', () => this.hideCart());
    closeCartBtn.addEventListener('click', this.toggleShowCart);
  }

  populateCart(cartArray){
    /* const cartList = cartArray.map( (item) => {
        return `
            <div class="cart-item">
                <img src=${item.image} alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <h5>$${item.price}</h5>
                    <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id=${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>
            </div>
        `;
    }).join(''); */
    
    cartArray.forEach( (item) => this.addCartItem(item));
    //cartContent.innerHTML = result;
  }

  cartLogic(){
      clearCartBtn.addEventListener('click', () =>{
          cart = [];  
          Storage.clearCart();

          const list = document.querySelectorAll('.cart-item');
          console.log(list);
          list.forEach( (item) => {
            item.remove();
          });
          
      });
  }

} // end class UI

// local storage

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find( (item) => item.id === id );        
    }

    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }

    static clearCart(){
        localStorage.removeItem('cart');
    }
   
} // end class Storage

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // setup app
    ui.setupAPP();

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
        }).then( () => {
               ui.getBagButtons(); 
               ui.cartLogic();
           });
});



