<style src="./SettingsMisc.css" scoped/>


<template>
  <GHeading>
    <GLocText code="#MiscTitle" :table="ST_MENU">
      Miscellaneous
    </GLocText>
  </GHeading>
  <div class="misc-settings-container">
    <div class="settings-main">
      <GDivider>
        <GLocText code="#MiscTitle" :table="ST_MENU">
          Miscellaneous
        </GLocText>
      </GDivider>

      <div class="misc-grid">
        <GSlider v-model="uiScale" :min="0.1" :step="0.1" :max="5" editable>
          <template #label>
            <GLocText code="#UiScale" :table="ST_MENU">
              UI Scale
            </GLocText>
          </template>
        </GSlider>

        <div>
          <GLabel>
            <GLocText code="#Language" :table="ST_MENU">
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
          <GLocText code="#Cancel" :table="ST_MENU">
            Cancel
          </GLocText>
        </GButton>
        <GButton variant="primary">
          <GLocText code="#Apply" :table="ST_MENU">
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
import {ST_MENU} from "@/assets/js/localizationConstants.js";
import {useLocalizationStore} from "@/stores/localizationStore.js";


const placeholder = ref('Select');
const searchPlaceHolder = ref('Search');
const emptyText = ref('Not found');
const language = ref('en');
const languages = ref();

const uiScale = ref(1.0);

const locStore = useLocalizationStore();

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

onMounted(async () => {
  // Fetch all localizations and languages in parallel
  const [placeholderResult, emptyTextResult, searchPlaceHolderResult, languagesResult] = await Promise.all([
    locStore.getText('#ComboPlaceHolder', ST_MENU, 'Select'),
    locStore.getText('#ComboEmpty', ST_MENU, 'Not found'),
    locStore.getText('#ComboSearch', ST_MENU, 'Search...'),
    fetchLanguages()
  ]);

  // Assign results
  placeholder.value = placeholderResult;
  emptyText.value = emptyTextResult;
  searchPlaceHolder.value = searchPlaceHolderResult;
  languages.value = languagesResult;
});
</script>
