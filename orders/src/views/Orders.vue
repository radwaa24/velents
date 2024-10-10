<template>
  <div>
    <nav class="bg-amber-100 p-4 lg:px-20">
      <div class="flex justify-between text-cyan-950 font-semibold space-x-4">
        <div class="flex gap-x-4">
          <router-link
            to="/orders/create"
            class="font-semibold hover:text-cyan-700 hover:underline"
            >Create Order</router-link
          >
          <router-link
            to="/orders/list"
            class="font-semibold hover:text-cyan-700 hover:underline"
            >List Orders</router-link
          >
        </div>
        <div>
          <button
            @click="logout"
            class="font-semibold hover:text-cyan-700 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function logout() {
  // Clear token and navigate to the sign-in page
  localStorage.removeItem("token");
  router.push("/");
}
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
