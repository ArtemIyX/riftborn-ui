import {createRouter, createWebHistory} from 'vue-router'
import MainMenu from "@/views/MainMenu/MainMenu.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/menu'
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => MainMenu
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      redirect: '/menu'
    }
  ],
})

export default router
