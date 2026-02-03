<style src="./SettingsGraphics.css" scoped/>

<template>
  <GHeading>
    <GLocText key="#Graphics" table="ST_Menu">
      Graphics
    </GLocText>
  </GHeading>

  <GDivider>
    <GLocText key="#AntiAliasing" table="ST_Menu">
      Anti-Aliasing
    </GLocText>
  </GDivider>

  <GStack direction="row">
    <GLabel>
      <GLocText key="#AntiAliasingQuality" table="ST_Menu">
        Anti-Aliasing quality
      </GLocText>
    </GLabel>
    <GCombobox v-model="aaQual" :placeholder="placeHolder" :options="qualOptions" emptyText="invalid" ref="combo_aa_quality">

    </GCombobox>
  </GStack>

</template>


<script setup>

import {onMounted, ref} from "vue";
import {fetchLocalization, getLocText, getLocTextArray} from "@/assets/js/localization.js";

const placeHolder = ref('Select');

const aaQual = ref('Low');

const qualOptions = ref();

onMounted(() => {
  getLocText('#ComboPlaceHolder', 'ST_Menu', 'Select').then((result) => {
    placeHolder.value = result;
  });

  getLocTextArray([
    {
      key: '#Low',
      table: '#ST_Menu',
      defaultValue: 'Low'
    },
    {
      key: '#Medium',
      table: '#ST_Menu',
      defaultValue: 'Medium'
    },
    {
      key: '#High',
      table: '#ST_Menu',
      defaultValue: 'High'
    },
    {
      key: '#Epic',
      table: '#ST_Menu',
      defaultValue: 'Epic'
    },
    {
      key: '#Cinematic',
      table: '#ST_Menu',
      defaultValue: 'Cinematic'
    }
  ]).then((result) => {
    qualOptions.value = result.map(item => ({
      value: item.result,
      label: item.result
    }));
  });

});
</script>
