<template>
  <div>
    <nav class="bg-amber-100 p-4 lg:px-20">
      <div class="flex justify-between text-cyan-950 font-semibold space-x-4">
        <div class="flex gap-x-4">
          <router-link
            to="/orders/create"
            class="font-semibold hover:text-black"
            >Create Order</router-link
          >
          <router-link
            to="/orders/list"
            class="font-semibold hover:text-black"
            >Orders list</router-link
          >
        </div>
        <div>
          <button @click="logout" class="font-semibold hover:text-black">
            Log Out
          </button>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast(); // Initialize toast
const router = useRouter();

function logout() {
  localStorage.removeItem("jwt_token");
  router.push("/");
  toast.success("Log out successful!");
}
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
