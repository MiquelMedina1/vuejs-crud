<template>
  <div id="all-cryptos">
    <div class="header-container">
      <div class="header">
        <h1>CryptoStore</h1>
        <div class="search-container">
            <input
            type="text"
            name="search"
            v-model="cryptoSearch"
            placeholder="Search cryptos"
            class="form-control"
            v-on:keyup="searchCryptos"
            >
        </div>
        <div class="actions-container">
           <button class="btn btn-info" @click="ordenarCrypto">{{ sortDirection }}</button>
            <button class="btn btn-success" @click="showCart">🛒 ({{ cart.length }})</button>
        </div>
      </div>
    </div>

    <!-- Crypto info -->
    <div class="crypto-grid">
        <div v-for="crypto in cryptos" :key="crypto.id" class="crypto">
            <div>
                <img :src="`/src/assets/img/${crypto.abbreviation}.png`" class="crypto-image" alt="Crypto Image" >
                <span class="crypto-name">{{ crypto.name }}</span>
                <span class="crypto-abbreviation">{{ crypto.abbreviation }}</span>
            </div>      
            <p class="crypto-description">{{ crypto.description }}</p>
            <div class="row">
                <div class="col-sm-7">
                    <h2 class="crypto-price">Price History</h2>
                    <span class="crypto-lastQuote">€{{ crypto.lastQuote }}</span>
                    <span class="crypto-timeLastQuote"> ● {{ crypto.timeLastQuote }}</span>
                </div>
                <div class="col-sm-5" style="padding: 10%;">
                    <button @click="addToCart(crypto)" class="btn btn-success">Add to Cart</button>
                </div>

            </div>
        </div>
    </div>

<!-- CartModal -->
<div v-if="cartVisible" class="cart-modal">
  <div class="cart-content">
    <h2>Your Cart</h2>
    <div v-if="cart.length === 0">
      <p>Your cart is empty.</p>
    </div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id" class="cart-item">
            <td><img :src="`/src/assets/img/${item.crypto.abbreviation}.png`" class="cart-item-image" alt="Crypto Image"></td>
            <td>{{ item.crypto.name }}</td>
            <td>€{{ item.crypto.lastQuote }}</td>
            <td>
              <input type="number" v-model="item.quantity" class="cart-item-quantity" min="1">
            </td>
            <td>
              <button @click="removeFromCart(item)" class="btn btn-sm btn-warning">Remove 🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="cart-total">
        <span class="cart-total-label">Total:</span>
        <span class="cart-total-price">€{{ calculateTotalPrice }}</span>
      </div>
    </div>
    <button class="btn btn-primary" @click="closeCart">Close</button>
    <button v-if="cart.length > 0" class="btn btn-primary" @click="payWithPayPal">Pay</button>
  </div>
</div>

  </div>
</template>

<script>
    import axios from 'axios';

    export default{
        data(){
            return{
                cryptos: [],
                originalCryptos: [],
                cryptoSearch: '',
                suggestion: [],
                sortDirection: 'Asc 🡡',
                rows: 3,
                columns: 3,
                cart: [],
                cartVisible: false,
                total: 20,      
            }
        },


        created: function()
        {
            this.fetchCryptoData();
        },

        computed: {
            calculateTotalPrice() {
            var totalPrice = 0;
            for (const item of this.cart) {
                const price = parseFloat(item.crypto.lastQuote);
                const quantity = item.quantity;
                totalPrice += price * quantity;
        }
        return totalPrice.toFixed(2);
            },
        },

        methods: {
            addToCart: function(crypto) {
                const existingItem = this.cart.find(item => item.crypto.abbreviation === crypto.abbreviation);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    this.cart.push({ crypto, quantity: 1 });
                }
            },

            closeCart: function() {
                this.cartVisible = false;
            },

            ordenarCrypto: function() {
                if (this.sortDirection === 'Asc 🡡') {
                    this.cryptos.sort((a, b) => parseFloat(b.lastQuote) - parseFloat(a.lastQuote));
                    this.sortDirection = 'Desc 🡣';
                } else {
                    this.cryptos.sort((a, b) => parseFloat(a.lastQuote) - parseFloat(b.lastQuote));
                    this.sortDirection = 'Asc 🡡';
                }
            },

            showCart() {
                this.cartVisible = true;
            },

            incrementQuantity: function(item) {
                item.quantity++;
            },
            
            decrementQuantity: function(item) {
                if (item.quantity > 1) {
                    item.quantity--;
                }
            },

            removeFromCart: function(item) {
                const index = this.cart.indexOf(item);
                if (index > -1) {
                    this.cart.splice(index, 1);
                }
            },
            
            payWithPayPal() {
                this.$http.get(`http://localhost:3000/api/createOrder?total=${this.calculateTotalPrice}`)
                .then((response) => {
                    window.location.href = response.data.redirectUrl;
                })
                .catch((error) => {
                console.log(error);
                });
            },

            recommend: function() {
                if (this.suggestion === "") {
                    // Si no se ha ingresado ninguna sugerencia, mostrar todos los elementos
                    this.cryptos = this.originalCryptos;
                } else {
                    this.$http.get(`http://localhost:3000/api/search?suggestion=${this.suggestion}`)
                    .then((response) => {
                        this.suggestions = response.body;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
            },



            fetchCryptoData: function() {
            this.$http.get('http://localhost:3000/api/products').then((response) => {
                this.cryptos = response.body;
                this.originalCryptos = this.cryptos;

                this.cryptos.sort((a, b) => parseFloat(a.lastQuote) - parseFloat(b.lastQuote));
            }, (response) => {

            });
            },


            searchCryptos: function()
            {
                if(this.cryptoSearch == '')
                {
                    this.cryptos = this.originalCryptos;
                    return;
                }

                var searchedCryptos = [];
                for(var i = 0; i < this.originalCryptos.length; i++)
                {
                    var cryptoName = this.originalCryptos[i]['name'].toLowerCase();
                    if(cryptoName.indexOf(this.cryptoSearch.toLowerCase()) >= 0)
                    {
                        searchedCryptos.push(this.originalCryptos[i]);
                    }
                }

                this.cryptos = searchedCryptos;
            }

            
        }
    }
</script>
