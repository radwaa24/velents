<template>
  <div
    v-if="loading"
    class="flex items-center justify-center bg-cyan-950 h-[675px]"
  >
    <div
      class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-200"
    ></div>
  </div>
  <div
    v-else
    class="p-6 lg:px-20 bg-gradient-to-b bg-cyan-950 min-h-[675px] text-black"
  >
    <h2 class="text-amber-200 md:text-3xl text-lg font-bold mb-4">
      Order Details
    </h2>
    <div v-if="order">
      <div
        v-if="isEditing"
        class="bg-white shadow rounded-lg p-6 border border-gray-300"
      >
        <h3 class="font-semibold text-lg text-cyan-900 mb-2">Edit Order</h3>
        <Form @submit="updateOrder" v-slot="{ errors }">
          <div class="mb-4">
            <label class="block text-gray-700">Product Name:</label>
            <Field
              name="productName"
              as="input"
              class="mt-1 w-full p-2 border rounded-md"
              rules="required"
              v-model="order.productName"
            />
            <ErrorMessage name="productName" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Quantity:</label>
            <Field
              name="quantity"
              as="input"
              type="number"
              class="mt-1 w-full p-2 border rounded-md"
              rules="required|integer|min:1"
              v-model.number="order.quantity"
            />
            <ErrorMessage name="quantity" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Price:</label>
            <Field
              name="price"
              as="input"
              type="number"
              step="0.01"
              class="mt-1 w-full p-2 border rounded-md"
              rules="required|numeric|min:0"
              v-model.number="order.price"
            />
            <ErrorMessage name="price" class="text-red-500" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Status:</label>
            <Field
              name="status"
              v-model="order.status"
              as="select"
              class="mt-1 w-full p-2 border rounded-md"
              rules="required"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </Field>
            <ErrorMessage name="status" class="text-red-500" />
          </div>
          <div
            class="flex justify-center flex-col items-center md:justify-start md:flex-row gap-4 text-white"
          >
            <button
              type="submit"
              class="bg-cyan-900 hover:bg-cyan-950 px-4 py-2 rounded"
            >
              Update Order
            </button>
            <button
              @click="
                isEditing = false;
                modalOpen = false;
              "
              type="button"
              class="bg-gray-500 hover:bg-gray-600 px-4 py-2 w-[122px] rounded"
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>

      <div v-else class="bg-white shadow rounded-lg p-6 border border-gray-300">
        <div class="flex justify-between items-center">
          <router-link
            class="font-semibold text-lg text-cyan-900 hover:text-cyan-950"
            :to="{ path: `/orders/${order.id}` }"
          >
            Order ID: #{{ order.id }}
          </router-link>
          <div></div>
          <div
            class="px-2 p-0.5 rounded-md"
            :class="{
              '!bg-yellow-500 !text-white': order.status == 'pending',
              '!bg-green-800 !text-white': order.status == 'paid',
            }"
          >
            {{ order.status == "paid" ? "Paid" : "Pending" }}
          </div>
        </div>
        <p class="text-gray-800">Product Name: {{ order.productName }}</p>
        <p class="text-gray-800">Quantity: {{ order.quantity }}</p>
        <p class="text-gray-800">Price: ${{ formatPrice(order.price) }}</p>
        <p class="text-gray-800">
          Created At: {{ formatDate(order.created_at) }}
        </p>
        <div class="flex justify-end gap-x-4">
          <button
            @click="isEditing = true"
            class="mt-4 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded self-end"
          >
            Edit this order
          </button>
          <button
            v-if="order.status == 'pending'"
            @click="modalOpen = true"
            class="mt-4 bg-cyan-950 hover:bg-cyan-900 text-white px-4 py-2 rounded self-end"
          >
            Pay for this order
          </button>
        </div>
      </div>
    </div>
    <!-- Payment Modal -->
    <PaymentModal
      v-if="modalOpen"
      :isOpen="modalOpen"
      :order="order"
      :updateOrder="updateOrderStatus"
      @close="modalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { Form, Field, ErrorMessage, defineRule } from "vee-validate";
import { required, min, numeric, integer } from "@vee-validate/rules";
import PaymentModal from "./PaymentModal.vue";

defineRule("required", required);
defineRule("min", min);
defineRule("numeric", numeric);
defineRule("integer", integer);

const toast = useToast();
const route = useRoute();
const orderId = route.params.id;
const order = ref({});
const loading = ref(false);
const modalOpen = ref(false);
const isEditing = ref(false);

onMounted(async () => {
  loading.value = true;
  await fetch(
    `https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/orders/${orderId}`
  )
    .then((response) => response.json())
    .then((data) => {
      order.value = data;
      loading.value = false;
    })
    .catch(() => {
      toast.error("Failed to load order details.");
      loading.value = false;
    });
});

async function updateOrder() {
  const response = await fetch(
    `https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/orders/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order.value),
    }
  );

  if (response.ok) {
    const updatedOrder = await response.json();
    order.value = updatedOrder;
    toast.success("Order updated successfully!");
  } else {
    toast.error("Failed to update order. Please try again.");
  }
}

async function updateOrderStatus() {
  const updatedOrder = { ...order.value, status: "paid" };
  const response = await fetch(
    `https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/orders/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrder),
    }
  );

  if (response.ok) {
    const result = await response.json();
    order.value = result;
    toast.success("Order status updated to 'paid' successfully!");
  } else {
    toast.error("Failed to update order status. Please try again.");
  }
}

function formatPrice(price) {
  return typeof price === "number" ? price.toFixed(2) : "0.00";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}
</script>
