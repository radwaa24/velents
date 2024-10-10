<template>
    <div class="p-6 bg-gradient-to-b bg-cyan-950 min-h-screen text-black">
      <h2 class="text-white text-3xl font-bold mb-4">Order Details</h2>
      <div v-if="order">
        <div class="bg-white shadow rounded-lg p-6 border border-gray-300">
          <h3 class="font-semibold text-lg text-cyan-900 mb-2">
            Order ID: {{ order.id }}
          </h3>
          <p class="text-gray-600">Product Name: {{ order.productName }}</p>
          <p class="text-gray-600">Quantity: {{ order.quantity }}</p>
          <p class="text-gray-600">Price: ${{ formatPrice(order.price) }}</p>
          <p class="text-gray-600">Status: {{ order.status }}</p>
          <p class="text-gray-600">Payment Information: {{ order.paymentInfo }}</p>
          <p class="text-gray-600">
            Created At: {{ formatDate(order.created_at) }}
          </p>
        </div>
      </div>
      <div v-else>
        <p class="text-white">Loading order details...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router"; // Import useRoute for accessing route parameters
  
  const route = useRoute(); // Get the current route object
  const orderId = route.params.id; // Get the order ID from the route parameters
  const order = ref(null); // Ref to store the order data
  
  onMounted(async () => {
    const response = await fetch(`https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/orders/${orderId}`);
    order.value = await response.json();
  });
  
  // Format price to two decimal places
  function formatPrice(price) {
    return typeof price === "number" ? price.toFixed(2) : "0.00";
  }
  
  // Format the created_at date to MM-DD-YYYY
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options).replace(/\//g, "-"); // Replace slashes with dashes
  }
  </script>
  
  <style scoped>
  /* Additional styles can be added here if needed */
  </style>
  