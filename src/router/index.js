import {createRouter, createWebHashHistory} from 'vue-router'
import MainMenu from "@/views/menu/main-menu/MainMenu.vue";
import MenuPlayView from "@/views/menu/menu-play/MenuPlayView.vue";
import MenuSettingsView from "@/views/menu/menu-settings/MenuSettingsView.vue";

import SettingsGraphicsView from "@/views/menu/settings/settings-graphics/SettingsGraphicsView.vue";
import SettingsAudioView from "@/views/menu/settings/settings-audio/SettingsAudioView.vue";
import SettingsInputView from "@/views/menu/settings/settings-input/SettingsInputView.vue";
import SettingsMiscView from "@/views/menu/settings/settings-misc/SettingsMiscView.vue";
import SettingsModsView from "@/views/menu/settings/settings-mods/SettingsModsView.vue";
import PauseMenuView from "@/views/pause/pause-menu/PauseMenuView.vue";
import GameHUD from "@/views/game/game-hud/GameHUD.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
/*    {
      path: '/',
      redirect: '/menu'
    },*/
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
      path: '/pause',
      name: 'pause',
      component: PauseMenuView,
      children: [
        {
          path: 'settings',
          name: 'pause-settings',
          component: MenuSettingsView,
          children: [
            {
              path: 'graphics',
              name: 'pause-graphics',
              component: SettingsGraphicsView
            },
            {
              path: 'audio',
              name: 'pause-audio',
              component: SettingsAudioView
            },
            {
              path: 'input',
              name: 'pause-input',
              component: SettingsInputView
            },
            {
              path: 'misc',
              name: 'pause-misc',
              component: SettingsMiscView
            },
            {
              path: 'mods',
              name: 'pause-mods',
              component: SettingsModsView
            }
          ]
        },
      ]
    },
    {
      path: '/game',
      name: 'game',
      component: GameHUD,
    }
    /* {
       path: '/:pathMatch(.*)*',
       name: 'notFound',
       redirect: '/menu'
     }*/
  ],
})

export default router
