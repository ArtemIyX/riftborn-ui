<template>
  <GBox class="menu-buttons">
    <GStack>
      <GButton v-for="button in menuButtons" :key="button.key">
        <GLocText :table="locTable" :key="button.key">{{ button.label }}</GLocText>
      </GButton>
    </GStack>
  </GBox>

</template>

<script setup>

import {ref} from "vue";

const locTable = 'ST_Menu';
const menuButtons = ref([
  {
    key: '#Play',
    label: 'Play',
    onClick: () => console.log('Starting game...')
  },
  {
    key: '#FindServers',
    label: 'Find servers',
    onClick: () => console.log('Finding servers...')
  },
  {
    key: '#Settings',
    label: 'Settings',
    onClick: () => console.log('Opening settings...')
  },
  {
    key: '#Credits',
    label: 'Credits',
    onClick: () => console.log('Showing credits...')
  },
  {
    key: '#Social',
    label: 'Social',
    onClick: () => console.log('Opening social...')
  },
  {
    key: '#Quit',
    label: 'Quit',
    onClick: () => console.log('Quitting game...')
  }
]);

const handleButtonClick = (button) => {
  if (button.onClick && typeof button.onClick === 'function') {
    button.onClick();
  }
};



</script>


<style scoped>
.menu-buttons {
  /* Container sizing */
  width: clamp(200px, 25vw, 400px);
  min-height: min-content;
  max-height: 80vh;

  /* Spacing */
  padding: clamp(1rem, 2vw, 2rem);
}
</style>
