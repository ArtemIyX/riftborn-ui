import {createRouter, createWebHistory} from 'vue-router'
import MainMenu from "@/views/menu/main-menu/MainMenu.vue";
import MenuPlayView from "@/views/menu/menu-play/MenuPlayView.vue";
import MenuSettingsView from "@/views/menu/menu-settings/MenuSettingsView.vue";

import SettingsGraphicsView from "@/views/menu/settings/settings-graphics/SettingsGraphicsView.vue";

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
      component: MainMenu,
      children: [
        {
          path: 'play',
          name: 'menu-play',
          component: MenuPlayView
        },
        {
          path: 'settings',
          name: 'menu-settings',
          component: MenuSettingsView,
          children: [
            {
              path: 'graphics',
              name: 'settings-graphics',
              component: SettingsGraphicsView
            }
          ]
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      redirect: '/menu'
    }
  ],
})

export default router
