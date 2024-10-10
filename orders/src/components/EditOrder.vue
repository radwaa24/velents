<template>
    <div class="edit-order-form" v-if="order">
      <form @submit.prevent="updateOrder">
        <input v-model="order.productName" type="text" placeholder="Product Name" />
        <input v-model="order.quantity" type="number" placeholder="Quantity" />
        <input v-model="order.price" type="number" placeholder="Price" />
        <select v-model="order.status">
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Canceled">Canceled</option>
        </select>
        <button type="submit">Update Order</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const order = ref(null)
  const route = useRoute()
  
  onMounted(() => {
    const token = localStorage.getItem('token')
    axios.get(`https://mockapi.io/orders/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      order.value = res.data
    })
  })
  
  function updateOrder() {
    const token = localStorage.getItem('token')
    axios.put(`https://mockapi.io/orders/${route.params.id}`, order.value, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      alert('Order updated successfully')
    })
  }
  </script>
  
  <style>
  /* Styles for editing an order */
  </style>
  