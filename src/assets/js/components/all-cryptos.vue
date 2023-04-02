<template>
    <div id="all-cryptos">
        <h1>All Cryptos</h1>
        
        <!-- TODO: Posar la barra de búsqueda a la capçalera perquè sigui sempre visible -->
        <div class="form-group">
            <input type="text" name="search" v-model="cryptoSearch" placeholder="Search cryptos" class="form-control" v-on:keyup="searchCryptos">
        </div>

        <div>
            <button class ="btn btn-info" @click="ordenarCrypto">{{ sortDirection }}</button>
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

        <!-- Cart -->
        <div class="cart-container">
            
        </div>

    </div>
</template>

<script>

    export default{
        data(){
            return{
                cryptos: [],
                originalCryptos: [],
                cryptoSearch: '',
                sortDirection: 'Asc 🡡',
                rows: 3,
                columns: 3
            }
        },

        created: function()
        {
            this.fetchCryptoData();
        },

        methods: {
            ordenarCrypto: function()
            {
                if (this.sortDirection === 'Asc 🡡') {
                    this.cryptos.sort((a, b) => (a.price > b.price) ? 1 : -1)
                    this.sortDirection = 'Desc 🡣'
                }else {
                    this.cryptos.sort((a, b) => (a.price < b.price) ? 1 : -1)
                    this.sortDirection = 'Asc 🡡'
                }
            },

            addToCart: function(crypto)
            {

            },

            fetchCryptoData: function()
            {
                this.$http.get('http://localhost:3000/api/products').then((response) => {
                    this.cryptos = response.body;
                    this.originalCryptos = this.cryptos;
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
