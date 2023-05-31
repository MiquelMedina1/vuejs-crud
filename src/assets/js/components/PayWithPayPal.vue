<template>
  <div>
    <button class="btn btn-primary" @click="payWithPayPal">Pay with PayPal</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    payWithPayPal() {
      axios
        .post('http://localhost:3000/api/create-order', {})
        .then((response) => {
          const { orderId, redirectUrl } = response.data;
          window.location.href = redirectUrl;
        })
        .catch((error) => {
          console.error('Error creating PayPal order:', error);
        });
    },
  },
};
</script>
