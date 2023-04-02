import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueResource from 'vue-resource';
Vue.use(VueResource);

import App from './App.vue'

const AllCryptos = require('./assets/js/components/all-cryptos.vue');

const routes = [
    {
        name: 'all_cryptos',
        path: '/',
        component: AllCryptos
    }
];
var router = new VueRouter({ routes: routes, mode: 'history' });
new Vue(Vue.util.extend({ router }, App)).$mount('#app');