<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-cyan-950 bg-opacity-70"
    @click.self="closeModal"
  >
    <div class="bg-white p-6 rounded-lg w-full lg:max-w-2xl mx-10 shadow-lg relative">
      <h3 class="text-cyan-950 text-xl font-semibold mb-4">Pay for Order: #{{ order.id }}</h3>

      <!-- VeeValidate Form for Payment -->
      <Form @submit="handlePayment" v-slot="{ errors }">
        <!-- Card Information (using Stripe Elements) -->
        <div class="mb-4">
          <label for="card-element" class="block text-sm font-medium text-cyan-950">Card Information</label>
          <div id="card-element" class="mt-2 p-2 border border-gray-300 rounded"></div>
          <span v-if="errors.cardElement" class="text-red-500 text-sm">{{ errors.cardElement }}</span>
        </div>

        <!-- Email Validation -->
        <div class="mb-4">
          <Field
            name="email"
            rules="required|email"
            v-slot="{ field, errors }"
          >
            <label for="email" class="block text-sm font-medium text-cyan-950">Email</label>
            <input
              type="email"
              v-bind="field"
              id="email"
              class="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter your email"
            />
            <span class="text-red-500 text-sm">{{ errors[0] }}</span>
          </Field>
        </div>

        <button type="submit" class="mt-4 bg-cyan-900 hover:bg-cyan-950 text-white p-2 w-full rounded">
          Submit Payment
        </button>
      </Form>

      <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-cyan-950">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Form, Field, defineRule, configure } from 'vee-validate';
import { required, email } from '@vee-validate/rules';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from 'vue-toastification';

// Stripe setup
const stripePromise = loadStripe('pk_test_51Q8RgS2Kh2qpE6NatZ00YDbxegTNGfoKPGmJ1twYLEXtQxuEMYgkTCwp1ECTqOKBsRZWeEMpYFw2Q9eU9AaT6jpe00infconrk');
let cardElement = null;
let stripe = null;

// Props
const props = defineProps({
  isOpen: Boolean,
  order: Object,
  updateOrder: Function, // Add the updateOrder prop
});

// Emit event for closing the modal
const emit = defineEmits(['close']);

// Toast setup
const toast = useToast();

// Modal State
const paymentStatus = ref('');
const paymentMessage = ref('');

// Vee Validate Rules
defineRule('required', required);
defineRule('email', email);

// Configure Vee Validate to show validation messages on blur
configure({
  validateOnInput: false,
  validateOnBlur: true,
});

// Close modal and reset states
const closeModal = () => {
  emit('close');
  paymentStatus.value = '';
  paymentMessage.value = '';
  if (cardElement) {
    cardElement.clear();
  }
};

// Initialize Stripe elements on mount
onMounted(async () => {
  stripe = await stripePromise;
  const elements = stripe.elements();
  cardElement = elements.create('card');
  cardElement.mount('#card-element');
});

// Handle Payment
const handlePayment = async (values) => {
  if (!stripe || !cardElement) {
    return;
  }

  try {
    // Check if the client_secret is valid
    if (props.order.client_secret) {
      // Attempt to call Stripe's confirmCardPayment
      const { error, paymentIntent } = await stripe.confirmCardPayment(props.order.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: values.email,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Call the updateOrder function with the order ID and new status
        props.updateOrder(props.order.id, 'paid'); // Call updateOrder here

        paymentStatus.value = 'success';
        paymentMessage.value = 'Payment successful!';
        toast.success('Payment completed successfully.');
        closeModal(); // Close the modal on success
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } else {
      // If there's no client_secret, simulate success
      props.updateOrder(props.order.id, 'paid'); // Call updateOrder here
      paymentStatus.value = 'success';
      paymentMessage.value = 'Payment successful! (simulated)';
      toast.success('Payment completed successfully (simulated).');
      closeModal(); // Close the modal on success
    }
  } catch (error) {
    paymentStatus.value = 'error';
    paymentMessage.value = 'Payment failed. Please try again.';
    toast.error(`Error: ${error.message}`);
  }
};
</script>

<style scoped>
/* Add styles for the modal */
</style>
