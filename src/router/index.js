import { createRouter, createWebHistory } from 'vue-router';
import Orders from '@/views/Orders.vue';
import CreateOrder from '@/components/CreateOrder.vue';
import OrderList from '@/components/OrderList.vue';
import OrderDetails from '@/components/OrderDetails.vue';
import SignIn from '@/views/SignIn.vue'; // Make sure you have a SignIn component

const routes = [
  { path: '/', component: SignIn },
  {
    path: '/orders',
    component: Orders,
    children: [
      { path: 'create', component: CreateOrder },
      { path: 'list', component: OrderList },
      { path: ':id', component: OrderDetails },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
