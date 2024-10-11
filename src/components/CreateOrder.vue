<template>
  <div class="px-5 flex items-center justify-center min-h-[675px] bg-cyan-950">
    <div class="bg-amber-100 p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h2 class="text-cyan-900 text-3xl font-bold text-center mb-6">
        Create Order
      </h2>
      <Form
        @submit="onSubmit"
        v-slot="{ errors, isSubmitting }"
        class="flex flex-col md:grid gap-4"
      >
        <div>
          <label
            for="productName"
            class="block text-sm font-medium text-cyan-900"
            >Product Name</label
          >
          <Field
            name="productName"
            type="text"
            v-model="productName"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-black"
            placeholder="Enter product name"
            rules="required"
            ref="productNameRef"
          />
          <ErrorMessage name="productName" class="text-red-600 text-sm mt-1" />
        </div>
        <div>
          <label for="quantity" class="block text-sm font-medium text-cyan-900"
            >Quantity</label
          >
          <Field
            name="quantity"
            type="number"
            v-model="quantity"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-black"
            placeholder="Enter quantity"
            rules="required|numeric|min:1"
            ref="quantityRef"
          />
          <ErrorMessage name="quantity" class="text-red-600 text-sm mt-1" />
        </div>
        <div>
          <label for="price" class="block text-sm font-medium text-cyan-900"
            >Price</label
          >
          <Field
            name="price"
            type="number"
            v-model="price"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-black"
            placeholder="Enter price"
            rules="required|numeric|min:0.01"
            ref="priceRef"
          />
          <ErrorMessage name="price" class="text-red-600 text-sm mt-1" />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-cyan-900"
            >Order Status</label
          >
          <Field
            as="select"
            name="status"
            v-model="status"
            rules="required"
            class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm text-black"
          >
            <option value="" disabled>Select status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </Field>
          <ErrorMessage name="status" class="text-red-600 text-sm mt-1" />
        </div>
        <div class="col-span-2">
          <button
            :disabled="
              isSubmitting || !productName || !quantity || !price || !status
            "
            type="submit"
            class="w-full py-3 px-4 bg-cyan-800 text-white rounded-md hover:bg-cyan-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create Order
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
const router = useRouter();

const productName = ref("");
const quantity = ref("");
const price = ref("");
const status = ref("");
const error = ref(null);
const message = ref(null);
const toast = useToast();

async function onSubmit(values, { resetForm }) {
  const token = localStorage.getItem("token");
  await fetch("https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productName: values.productName,
      quantity: values.quantity,
      price: values.price,
      status: values.status,
    }),
  })
    .then(() => {
      toast.success("Order created successfully");
      resetForm();
      message.value = "Order created successfully";
      error.value = null;
      router.push("/orders/list");
    })
    .catch(() => {
      error.value = "Failed to create order";
      toast.error("Failed to create order");
      message.value = null;
    });
}
</script>

<style scoped></style>
