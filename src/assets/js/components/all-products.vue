<template>
    <div id="all-products">
        <h1>All Products</h1>

        <p><router-link :to="{ name: 'create_product' }" class="btn btn-primary">Create Product</router-link></p>

        <div class="form-group">
            <input type="text" name="search" v-model="productSearch" placeholder="Search products" class="form-control" v-on:keyup="searchProducts">
        </div>

        <div>
            <button @click="ordenarCrypto">{{ sortDirection }}</button>
        </div>

        <!--<h1>holaaa</h1>-->

        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>
                        <img :src="`/src/assets/img/${product.description}.png`" style="width: 30px; weight: 30px">
                        {{ product.name }}
                    </td>   
                    <td>{{ product.description }}</td>
                    <td>{{ product.price }}</td>
                    <td>
                        <router-link :to="{name: 'edit_product', params: { id: product.id }}" class="btn btn-primary">Edit</router-link>
                        <router-link :to="{name: 'delete_product', params: { id: product.id }}" class="btn btn-danger">Delete</router-link>
                    </td>
                </tr>
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
                sortDirection: 'Asc'
            }
        },

        created: function()
        {
            this.fetchProductData();
        },

        methods: {
            ordenarCrypto: function()
            {
                if (this.sortDirection === 'Asc') {
                    this.products.sort((a, b) => (a.price > b.price) ? 1 : -1)
                    this.sortDirection = 'Desc'
                }else {
                    this.products.sort((a, b) => (a.price < b.price) ? 1 : -1)
                    this.sortDirection = 'Asc'
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
