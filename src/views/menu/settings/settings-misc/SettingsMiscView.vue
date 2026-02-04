<style src="./SettingsMisc.css" scoped/>


<template>
  <GHeading>
    <GLocText key="#MiscTitle" table="ST_Menu">
      Miscellaneous
    </GLocText>
  </GHeading>
  <div class="misc-settings-container">
    <div class="settings-main">
      <GDivider>
        <GLocText key="#MiscTitle" table="ST_Menu">
          Miscellaneous
        </GLocText>
      </GDivider>

      <div class="misc-grid">
        <GSlider v-model="uiScale" :min="0.1" :step="0.1" :max="5" editable>
          <template #label>
            <GLocText key="#UiScale" table="ST_Menu">
              UI Scale
            </GLocText>
          </template>
        </GSlider>

        <div>
          <GLabel>
            <GLocText key="#Language" table="ST_Menu">
              Language
            </GLocText>
          </GLabel>
          <GCombobox searchable v-model="language" :placeholder="placeholder" :options="languages"
                     :search-placeholder="searchPlaceHolder"
                     :emptyText="emptyText"/>

        </div>

      </div>

    </div>
    <div class="settings-footer">
      <div class="misc-grid">
        <GButton variant="secondary">
          <GLocText key="#Cancel" table="ST_Menu">
            Cancel
          </GLocText>
        </GButton>
        <GButton variant="primary">
          <GLocText key="#Apply" table="ST_Menu">
            Apply
          </GLocText>
        </GButton>
      </div>
    </div>
  </div>

</template>

<script setup>

import {onMounted, ref} from "vue";
import {getLocText} from "@/assets/js/localization.js";

const placeholder = ref('Select');
const searchPlaceHolder = ref('Search');
const emptyText = ref('Not found');
const language = ref('en');
const languages = ref();

const uiScale = ref(1.0);

const fetchLanguages = async () => {
  return new Promise(resolve => {
    const debugLanguages = [
      {
        value: 'en',
        label: 'English',
      },
      {
        value: 'ua',
        label: 'Ukrainian',
      },
      {
        value: 'es',
        label: 'Spanish',
      }
    ];
    resolve(debugLanguages);
  })
}

onMounted(() => {
  getLocText('#ComboPlaceHolder', 'ST_Menu', 'Select').then((result) => {
    placeholder.value = result;
  });

  getLocText('#ComboEmpty', 'ST_Menu', 'Not found').then((result) => {
    emptyText.value = result;
  });

  getLocText('#ComboSearch', 'ST_Menu', 'Search...').then((result) => {
    searchPlaceHolder.value = result;
  });

  fetchLanguages().then((result) => {
    languages.value = result;
  })
});
</script>
