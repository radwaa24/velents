<!-- src/App.vue -->
<template>
  <div>
    <router-view />
    <!-- <Navbar v-if="isAuthenticated" /> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Nav.vue';

const isAuthenticated = ref(!!localStorage.getItem('token')); // Check for token

// You can add a watcher to update this based on login/logout events
</script>

<style scoped>
/* Add any custom styling here */
</style>
