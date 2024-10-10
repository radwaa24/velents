<template>
    <div>
      <nav class="bg-cyan-800 p-4">
        <div class="flex justify-between">
          <div>
            <router-link to="/orders/create" class="text-white px-4">Create Order</router-link>
            <router-link to="/orders/list" class="text-white px-4">Order List</router-link>
            <router-link to="/orders/history" class="text-white px-4">Order History</router-link>
          </div>
          <button @click="logout" class="text-white px-4">Logout</button>
        </div>
      </nav>
  
      <router-view />
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  function logout() {
    // Clear token or any authentication logic here
    localStorage.removeItem('token');
    router.push('/'); // Navigate to home page
  }
  </script>
  
  <style scoped>
  /* Additional styling can go here */
  </style>
  