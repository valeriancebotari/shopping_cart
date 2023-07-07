/* ********** JS CODE *************** */
/*
  const client = contentful.createClient({
  space: "space ID",
  accessToken: "access token ID"
});
*/

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
let buttonsDOM = [];

// products
class Products {
  async getProducts() {
    try {

      /*
       let contentful = await client.getEntries({
        content_type: "comfyHouseProducts"
      });
      */

      /*
         console.log(contentful.items);
         .then((response) => console.log(response.items))
         .catch(console.error);
      */

         let result = await fetch("products.json");
         let data = await result.json();      
         let products = data.items;
      
      
      //let products = contentful.items;
      
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
              add to cart
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
    buttonsDOM = buttons;
    //console.log(buttonsDOM);
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
    //console.log(cart);
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
        this.clearCart();
      });
      // cart functionality
      cartContent.addEventListener('click', (e) => {
        //console.log(e.target);
        if (e.target.classList.contains('remove-item') ) {
          let removeItem = e.target;
          //console.log(removeItem);
          let id = removeItem.dataset.id;
          cartContent.removeChild(removeItem.parentElement.parentElement);
          this.removeItem(id);
        }
        else if (e.target.classList.contains('fa-chevron-up') ) {
        /* 
          let domElement = e.target.nextSibling.nextSibling;
          let chevron = domElement.textContent;
          chevron = Number(chevron);
          chevron += 1;
          domElement.textContent = chevron;

          let id = e.target.dataset.id;
          let cItem = cart.filter(item => item.id === id); // returns an array with 1 object
          cItem[0].amount++;
          this.setCartValues(cart);
          Storage.saveCart(cart);
        */ 

          let addAmount = e.target;
          let id = addAmount.dataset.id;
          let tempItem = cart.find( (item) => item.id === id); // returns 1 object, without array
          tempItem.amount++;
          this.setCartValues(cart);
          Storage.saveCart(cart);   
          
          addAmount.nextElementSibling.textContent = tempItem.amount;          
        }
        else if (e.target.classList.contains('fa-chevron-down') ) {
          let lowerAmount = e.target;
          let id = lowerAmount.dataset.id;
          let tempItem = cart.find( (item) => item.id === id); 
          tempItem.amount--;

              if(tempItem.amount === 0){
                  cartContent.removeChild(lowerAmount.parentElement.parentElement);
                  this.removeItem(id);    
              }
              else {                
                  this.setCartValues(cart);
                  Storage.saveCart(cart);   
                  lowerAmount.previousElementSibling.textContent = tempItem.amount;    
              }          
        }
      });
  }

  clearCart() {
    let cartItems = cart.map( (item) => item.id );
    cartItems.forEach( (id) => this.removeItem(id));  
    
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    } 
    this.toggleShowCart();
  }

  removeItem(id){
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i> add to cart`;
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
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



