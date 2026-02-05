import {createRouter, createWebHashHistory} from 'vue-router'
import MainMenu from "@/views/menu/main-menu/MainMenu.vue";
import MenuPlayView from "@/views/menu/menu-play/MenuPlayView.vue";
import MenuSettingsView from "@/views/menu/menu-settings/MenuSettingsView.vue";

import SettingsGraphicsView from "@/views/menu/settings/settings-graphics/SettingsGraphicsView.vue";
import SettingsAudioView from "@/views/menu/settings/settings-audio/SettingsAudioView.vue";
import SettingsInputView from "@/views/menu/settings/settings-input/SettingsInputView.vue";
import SettingsMiscView from "@/views/menu/settings/settings-misc/SettingsMiscView.vue";
import SettingsModsView from "@/views/menu/settings/settings-mods/SettingsModsView.vue";

const router = createRouter({
  history: createWebHashHistory(),
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
            },
            {
              path: 'audio',
              name: 'settings-audio',
              component: SettingsAudioView
            },
            {
              path: 'input',
              name: 'settings-input',
              component: SettingsInputView
            },
            {
              path: 'misc',
              name: 'settings-misc',
              component: SettingsMiscView
            },
            {
              path: 'mods',
              name: 'settings-mods',
              component: SettingsModsView
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
