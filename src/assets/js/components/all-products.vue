<template>
    <div id="all-products">
        <h1>All Products</h1>

        <p><router-link :to="{ name: 'create_product' }" class="btn btn-primary">Create Product</router-link></p>

        <div class="form-group">
            <input type="text" name="search" v-model="productSearch" placeholder="Search products" class="form-control" v-on:keyup="searchProducts">
        </div>

        <div>
            <button class ="btn btn-info" @click="ordenarCrypto">{{ sortDirection }}</button>
        </div>

        <table class="table table-hover">
            <!--<thead>
                <tr>
                    <th>Name</th>
                    <th>Abbreviation</th>
                    <th>Description</th>   
                    <th>Price</th>
                </tr>
            </thead>-->

            <tbody>
                <tr v-for="(product, products) in products" :key="products">
                    <td v-for="(column, columnindex) in 3" :key="columnindex">
                        <div class="product">
                            <img :src="`/src/assets/img/${product.abbreviation}.png`" style="width: 30px; weight: 30px"/>
                            <span>{{ product.name }}</span>
                        </div>
                    </td>
                </tr>
                
                
                <!--<tr v-for="product in products" :key="product.id">
                    <td>
                        <img :src="`/src/assets/img/${product.abbreviation}.png`" style="width: 30px; weight: 30px">
                        {{ product.name }}
                    </td>   
                    <td>{{ product.abbreviation }}</td>
                    <td>{{ product.description }}</td>
                    <td>{{ product.price }}</td>
                </tr>-->
            </tbody>
        </table>
    </div>
</template>

<script>

    export default{
        data(){
            return{
                products: [],
                originalProducts: [],
                productSearch: '',
                sortDirection: 'Asc 🡡',
                rows: 3,
                columns: 3
            }
        },

        created: function()
        {
            this.fetchProductData();
        },

        methods: {
            ordenarCrypto: function()
            {
                if (this.sortDirection === 'Asc 🡡') {
                    this.products.sort((a, b) => (a.price > b.price) ? 1 : -1)
                    this.sortDirection = 'Desc 🡣'
                }else {
                    this.products.sort((a, b) => (a.price < b.price) ? 1 : -1)
                    this.sortDirection = 'Asc 🡡'
                }
            },

            fetchProductData: function()
            {
                this.$http.get('http://localhost:3000/api/products').then((response) => {
                    this.products = response.body;
                    this.originalProducts = this.products;
                }, (response) => {

                });
            },

            searchProducts: function()
            {
                if(this.productSearch == '')
                {
                    this.products = this.originalProducts;
                    return;
                }

                var searchedProducts = [];
                for(var i = 0; i < this.originalProducts.length; i++)
                {
                    var productName = this.originalProducts[i]['name'].toLowerCase();
                    if(productName.indexOf(this.productSearch.toLowerCase()) >= 0)
                    {
                        searchedProducts.push(this.originalProducts[i]);
                    }
                }

                this.products = searchedProducts;
            }
        }
    }
</script>
