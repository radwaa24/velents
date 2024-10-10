<template>
  <div class="p-6 lg:px-20 bg-cyan-950 min-h-screen text-black">
    <div class="flex justify-between items-center">
      <h2 class="text-amber-200 text-3xl font-bold mb-4">Order List</h2>
      <div class="flex mb-4 space-x-4">
        <div>
          <select
            v-model="selectedStatus"
            id="status"
            class="mt-1 w-full p-2.5 border rounded-md bg-amber-200"
          >
            <option value="">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            v-model="selectedDate"
            placeholder="Filter by date"
            id="date"
            class="mt-1 w-full p-2 border rounded-md bg-amber-200"
          />
        </div>
      </div>
    </div>

    <!-- Order Cards -->
    <div v-if="loading" class="flex items-center justify-center h-screen">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-200"
      ></div>
    </div>
    <div v-else>
      <div
        v-if="filteredOrders.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-amber-50 bg-opacity-90 shadow rounded-lg p-4"
        >
          <div class="flex justify-between items-center">
            <router-link
              class="font-semibold text-lg text-cyan-900 hover:text-cyan-950"
              :to="{ path: `/orders/${order.id}` }"
              >Order ID: #{{ order.id }}</router-link
            >
            <div
              class="px-2 p-0.5 rounded-md"
              :class="{
                '!bg-yellow-500 !text-white ': !order.status, // Red for 'pending'
                '!bg-green-800 !text-white': order.status, // Green for 'paid'
              }"
            >
              {{ order.status ? "Paid" : "Pending" }}
            </div>
          </div>
          <p class="text-gray-600">Product: {{ order.productName }}</p>

          <p class="text-gray-600">Quantity: {{ order.quantity }}</p>
          <p class="text-gray-600">Price: ${{ formatPrice(order.price) }}</p>
          <p class="text-gray-600">
            Created at: {{ formatDate(order.created_at) }}
          </p>

          <div class="flex w-full justify-end">
            <button
              v-if="!order.status"
              @click="openPaymentModal(order)"
              class="mt-2 bg-cyan-900 text-white p-2 px-4 rounded"
            >
              Pay for this order
            </button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center h-[500px]">
        <img
          src="https://img.freepik.com/premium-vector/no-data-found-empty-file-folder-concept-design-vector-illustration_620585-1698.jpg"
          alt="No Data Found"
          class="mb-4 w-[200px] h-[200px] object-contain rounded-md"
        />
      </div>

      <!-- Pagination -->
      <div
        class="flex justify-between items-center mt-4"
        v-if="filteredOrders.length > 0"
      >
        <button
          :disabled="currentPage === 1"
          @click="prevPage"
          class="bg-amber-200 font-medium px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span class="text-amber-200 font-bold">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="nextPage"
          class="bg-amber-200 font-medium px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      v-if="modalOpen"
      :isOpen="modalOpen"
      :order="selectedOrder"
      @close="modalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import PaymentModal from "./PaymentModal.vue";

const orders = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;
const selectedStatus = ref("");
const selectedDate = ref("");
const selectedOrder = ref(null);
const modalOpen = ref(false);
const loading = ref(false);
// Fetch orders from API
onMounted(async () => {
  loading.value = true;
  try {
    const response = await fetch(
      "https://6707d2988e86a8d9e42d1397.mockapi.io/order/v1/orders"
    );
    const data = await response.json();
    orders.value = Array.isArray(data) ? data : [];
    loading.value = false;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    loading.value = false;
    orders.value = [];
  }
});

// Format price to two decimal places
function formatPrice(price) {
  return typeof price === "number" ? price.toFixed(2) : "0.00";
}

// Format the created_at date to MM-DD-YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("en-US", options).replace(/\//g, "-");
}

// Filter orders based on selected status and date
const filteredOrdersBeforePagination = computed(() => {
  let filtered = orders.value;

  if (selectedStatus.value) {
    filtered = filtered.filter((order) => {
      return selectedStatus.value === "Paid" ? order.status : !order.status;
    });
  }

  if (selectedDate.value) {
    const date = new Date(selectedDate.value);
    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === date.toDateString();
    });
  }

  return filtered;
});

// Paginate filtered orders
const filteredOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = currentPage.value * itemsPerPage;
  return filteredOrdersBeforePagination.value.slice(start, end);
});

// Total pages based on filtered orders before pagination
const totalPages = computed(() => {
  return Math.ceil(filteredOrdersBeforePagination.value.length / itemsPerPage);
});

// Pagination functions
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// Open payment modal
function openPaymentModal(order) {
  selectedOrder.value = order;
  modalOpen.value = true;
}
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>
