<style src="./SettingsGraphics.css" scoped/>

<template>
  <GHeading>
    <GLocText key="#Graphics" table="ST_Menu">
      Graphics
    </GLocText>
  </GHeading>

  <div class="graphics-settings-container">
    <div class="settings-main">

      <GDivider>
        <GLocText key="#Display" table="ST_Menu">
          Display
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GLabel>
            <GLocText key="#Resolution" table="ST_Menu">
              Resolution
            </GLocText>
          </GLabel>
          <GCombobox :disabled="displayMode === '#Display_Borderless'" v-model="resolution"
                     :placeholder="placeHolder" :options="resolutionOptions"
                     emptyText="invalid"/>

        </div>

        <div>
          <GLabel>
            <GLocText key="#DisplayMode" table="ST_Menu">
              Display Mode
            </GLocText>
          </GLabel>
          <GCombobox v-model="displayMode" :placeholder="placeHolder" :options="displayOptions"
                     emptyText="invalid"/>

        </div>
      </div>

      <div class="graphics-grid" style="padding-top: 1rem">
        <GCheckbox v-model="motionBlur">
          <GLocText key="#MotionBlur" table="ST_Menu">
            Motion blur
          </GLocText>
        </GCheckbox>

        <GCheckbox v-model="vsync">
          <GLocText key="#VSync" table="ST_Menu">
            VSync
          </GLocText>
        </GCheckbox>

      </div>


      <GDivider>
        <GLocText key="#AntiAliasing" table="ST_Menu">
          Anti-Aliasing
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GLabel>
            <GLocText key="#AntiAliasingQuality" table="ST_Menu">
              Anti-Aliasing quality
            </GLocText>
          </GLabel>
          <GCombobox v-model="aaQual" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>

        </div>

        <div>
          <GLabel>
            <GLocText key="#AntiAliasingType" table="ST_Menu">
              Anti-Aliasing
            </GLocText>
          </GLabel>
          <GCombobox v-model="aaType" :placeholder="placeHolder" :options="aaOptions"
                     emptyText="invalid"/>

        </div>

      </div>

      <GDivider>
        <GLocText key="#PostProcess" table="ST_Menu">
          Post-Processing
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GLabel>
            <GLocText key="#PostProcessQual" table="ST_Menu">
              Post-Process
            </GLocText>
          </GLabel>
          <GCombobox v-model="postProcess" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText key="#ViewDistanceQual" table="ST_Menu">
              View Distance
            </GLocText>
          </GLabel>
          <GCombobox v-model="viewDistance" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText key="#ShadowsQual" table="ST_Menu">
              Shadows
            </GLocText>
          </GLabel>
          <GCombobox v-model="shadows" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText key="#GlobalIlluminationQual" table="ST_Menu">
              Global Illumination
            </GLocText>
          </GLabel>
          <GCombobox v-model="globalIllumination" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText key="#ReflectionsQual" table="ST_Menu">
              Reflections
            </GLocText>
          </GLabel>
          <GCombobox v-model="reflections" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText key="#TexturesQual" table="ST_Menu">
              Textures
            </GLocText>
          </GLabel>
          <GCombobox v-model="textures" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText key="#EffectsQual" table="ST_Menu">
              Effects
            </GLocText>
          </GLabel>
          <GCombobox v-model="effects" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText key="#FoliageQual" table="ST_Menu">
              Foliage
            </GLocText>
          </GLabel>
          <GCombobox v-model="foliage" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText key="#ShadingQual" table="ST_Menu">
              Foliage
            </GLocText>
          </GLabel>
          <GCombobox v-model="shading" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

      </div>

      <GDivider>
        <GLocText key="#FPS" table="ST_Menu">
          Frame Rate
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GCheckbox v-model="limitFpsCheck">
            <GLocText key="#LimitFpsCheck" table="ST_Menu">
              Limit FPS
            </GLocText>
          </GCheckbox>
          <GSlider :disabled="!limitFpsCheck" editable min="0" step="1" max="480"
                   v-model="fpsLimit">
            <template #label>
              <GLocText key="#FpsLimit" table="ST_Menu">
                Max. FPS
              </GLocText>
            </template>
          </GSlider>
        </div>
        <div>
          <GCheckbox v-model="renderScaleCheck">
            <GLocText key="#RenderScaleTitle" table="ST_Menu">
              Custom Render Scale
            </GLocText>
          </GCheckbox>
          <GSlider :disabled="!renderScaleCheck" editable v-model="renderScale">
            <template #label>
              <GLocText key="#RenderScale" table="ST_Menu">
                Render Scale
              </GLocText>
            </template>
          </GSlider>
        </div>
      </div>


    </div>
    <div class="settings-footer">
      <div class="graphics-grid">
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
import {fetchLocalization, getLocText, getLocTextArray} from "@/assets/js/localization.js";

const placeHolder = ref('Select');
const qualOptions = ref([]);
const aaOptions = ref([]);

const aaQual = ref('#Low');
const aaType = ref('#AA_None');

const shadows = ref('#Low');
const viewDistance = ref('#Low');
const globalIllumination = ref('#Low');
const reflections = ref('#Low');
const postProcess = ref('#Low');
const textures = ref('#Low');
const effects = ref('#Low');
const foliage = ref('#Low');
const shading = ref('#Low');

const motionBlur = ref(false);
const vsync = ref(false);
const limitFpsCheck = ref(false);
const renderScaleCheck = ref(false);

const fpsLimit = ref(0.0);
const renderScale = ref(100.0);


const resolution = ref('1920x1080');
const displayMode = ref('#Display_Fullscreen');

const resolutionOptions = ref([
  {value: '1920x1080', label: 'Full HD (1920x1080)'},
  {value: '1280x720', label: 'HD (1280x720)'},
  {value: '854x480', label: 'SD (854x480)'}
]);

const displayOptions = ref([]);


const fetchResolutionOptions = async () => {
  try {
    // Simulate server call with a promise
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        // Simulate server response - change to false to test fallback
        const serverSuccess = false;

        if (serverSuccess) {
          resolve({
            success: true,
            data: [
              {value: '3840x2160', label: '4K (3840x2160)'},
              {value: '2560x1440', label: '2K (2560x1440)'},
              {value: '1920x1080', label: 'Full HD (1920x1080)'},
              {value: '1280x720', label: 'HD (1280x720)'}
            ]
          });
        } else {
          resolve({success: false});
        }
      }, 500); // Simulate network delay
    });

    if (response.success) {
      resolutionOptions.value = response.data;
    } else {

    }
  } catch (error) {
    console.error('Failed to fetch resolution options:', error);

  }
};

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
      value: item.key,
      label: item.result
    }));
  });

  getLocTextArray([
    {
      key: '#AA_None',
      table: '#ST_Menu',
      defaultValue: 'None'
    },
    {
      key: '#AA_FXAA',
      table: '#ST_Menu',
      defaultValue: 'FXAA'
    },
    {
      key: '#AA_TSR',
      table: '#ST_Menu',
      defaultValue: 'TSR'
    },
    {
      key: '#AA_TAA',
      table: '#ST_Menu',
      defaultValue: 'TAA'
    },
  ]).then((result) => {
    aaOptions.value = result.map(item => ({
      value: item.key,
      label: item.result
    }));
  });

  getLocTextArray([
    {
      key: '#Display_Fullscreen',
      table: '#ST_Menu',
      defaultValue: 'Fullscreen'
    },
    {
      key: '#Display_Windowed',
      table: '#ST_Menu',
      defaultValue: 'Windowed'
    },
    {
      key: '#Display_Borderless',
      table: '#ST_Menu',
      defaultValue: 'Borderless'
    },
  ]).then((result) => {
    displayOptions.value = result.map(item => ({
      value: item.key,
      label: item.result
    }));
  });

  fetchResolutionOptions();


});
</script>
