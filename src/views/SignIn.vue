<template>
  <div
    class="flex items-center justify-center min-h-screen bg-center"
    style="
      background-image: url('https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    "
  >
    <div
      class="bg-amber-50 mx-10 md:mx-0 bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-lg"
    >
      <h2 class="text-green-900 text-2xl font-bold text-center mb-6">Sign In</h2>
      <Form
        @submit="handleLogin"
        v-slot="{ errors }"
        class="space-y-4"
      >
        <div>
          <label for="email" class="block text-sm font-medium text-green-950">Email</label>
          <Field
            name="email"
            type="email"
            v-model="userEmail"
            class="mt-1 block w-full p-2 border rounded-md shadow-sm text-black"
            placeholder="Enter your email"
            rules="required|email"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-green-950">Password</label>
          <Field
            name="password"
            type="password"
            v-model="password"
            class="mt-1 block w-full p-2 border rounded-md shadow-sm text-black"
            placeholder="Enter your password"
            rules="required|min:6"
          />
          <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
        </div>
        <button
          :disabled="!userEmail || !password || errors.length"
          type="submit"
          class="w-full py-2 px-4 bg-green-900 text-white rounded-md hover:bg-green-950 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign In
        </button>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { required, email, min } from "@vee-validate/rules";
import { useToast } from "vue-toastification";

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);

const router = useRouter();
const toast = useToast();
const userEmail = ref("");
const password = ref("");

async function handleLogin() {
  try {
    const response = await fetch('https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail.value, password: password.value }),
    });

    if (!response.ok) {
      throw new Error('Login failed: ' + response.statusText);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('jwt_token', data.token);
      toast.success('Login successful!');
      router.push('/orders/list');
    } else {
      toast.error('Login failed: No token received');
    }
  } catch (error) {
    toast.error(error.message);
  }
}
</script>
