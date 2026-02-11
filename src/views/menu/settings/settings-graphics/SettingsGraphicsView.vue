<style src="./SettingsGraphics.css" scoped/>

<template>
  <GHeading>
    <GLocText code="#Graphics" :table="ST_MENU">
      Graphics
    </GLocText>
  </GHeading>

  <div class="graphics-settings-container">
    <div class="settings-main">

      <GDivider>
        <GLocText code="#Display" :table="ST_MENU">
          Display
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GLabel>
            <GLocText code="#Resolution" :table="ST_MENU">
              Resolution
            </GLocText>
          </GLabel>
          <GCombobox :disabled="displayMode === '#Display_Borderless'" v-model="resolution"
                     :placeholder="placeHolder" :options="resolutionOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText code="#DisplayMode" :table="ST_MENU">
              Display Mode
            </GLocText>
          </GLabel>
          <GCombobox v-model="displayMode" :placeholder="placeHolder" :options="displayOptions"
                     emptyText="invalid"/>

        </div>
      </div>

      <div class="graphics-grid" style="padding-top: 1rem">
        <GCheckbox v-model="motionBlur">
          <GLocText code="#MotionBlur" :table="ST_MENU">
            Motion blur
          </GLocText>
        </GCheckbox>

        <GCheckbox v-model="vsync">
          <GLocText code="#VSync" :table="ST_MENU">
            VSync
          </GLocText>
        </GCheckbox>
      </div>


      <GDivider>
        <GLocText code="#AntiAliasing" :table="ST_MENU">
          Anti-Aliasing
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GLabel>
            <GLocText code="#AntiAliasingQuality" :table="ST_MENU">
              Anti-Aliasing quality
            </GLocText>
          </GLabel>
          <GCombobox v-model="aaQual" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText code="#AntiAliasingType" :table="ST_MENU">
              Anti-Aliasing
            </GLocText>
          </GLabel>
          <GCombobox v-model="aaType" :placeholder="placeHolder" :options="aaOptions"
                     emptyText="invalid"/>
        </div>

      </div>

      <GDivider>
        <GLocText code="#PostProcess" :table="ST_MENU">
          Post-Processing
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GLabel>
            <GLocText code="#PostProcessQual" :table="ST_MENU">
              Post-Process
            </GLocText>
          </GLabel>
          <GCombobox v-model="postProcess" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText code="#ViewDistanceQual" :table="ST_MENU">
              View Distance
            </GLocText>
          </GLabel>
          <GCombobox v-model="viewDistance" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText code="#ShadowsQual" :table="ST_MENU">
              Shadows
            </GLocText>
          </GLabel>
          <GCombobox v-model="shadows" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText code="#GlobalIlluminationQual" :table="ST_MENU">
              Global Illumination
            </GLocText>
          </GLabel>
          <GCombobox v-model="globalIllumination" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText code="#ReflectionsQual" :table="ST_MENU">
              Reflections
            </GLocText>
          </GLabel>
          <GCombobox v-model="reflections" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

        <div>
          <GLabel>
            <GLocText code="#TexturesQual" :table="ST_MENU">
              Textures
            </GLocText>
          </GLabel>
          <GCombobox v-model="textures" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText code="#EffectsQual" :table="ST_MENU">
              Effects
            </GLocText>
          </GLabel>
          <GCombobox v-model="effects" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText code="#FoliageQual" :table="ST_MENU">
              Foliage
            </GLocText>
          </GLabel>
          <GCombobox v-model="foliage" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>
        <div>
          <GLabel>
            <GLocText code="#ShadingQual" :table="ST_MENU">
              Foliage
            </GLocText>
          </GLabel>
          <GCombobox v-model="shading" :placeholder="placeHolder" :options="qualOptions"
                     emptyText="invalid"/>
        </div>

      </div>

      <GDivider>
        <GLocText code="#FPS" :table="ST_MENU">
          Frame Rate
        </GLocText>
      </GDivider>

      <div class="graphics-grid">
        <div>
          <GCheckbox v-model="limitFpsCheck">
            <GLocText code="#LimitFpsCheck" :table="ST_MENU">
              Limit FPS
            </GLocText>
          </GCheckbox>
          <GSlider :disabled="!limitFpsCheck" editable :min="1" :step="1" :max="480"
                   v-model="fpsLimit">
            <template #label>
              <GLocText code="#FpsLimit" :table="ST_MENU">
                Max. FPS
              </GLocText>
            </template>
          </GSlider>
        </div>
        <div>
          <GCheckbox v-model="renderScaleCheck">
            <GLocText code="#RenderScaleTitle" :table="ST_MENU">
              Custom Render Scale
            </GLocText>
          </GCheckbox>
          <GSlider :disabled="!renderScaleCheck" :min="1" :max="300" editable v-model="renderScale">
            <template #label>
              <GLocText code="#RenderScale" :table="ST_MENU">
                Render Scale
              </GLocText>
            </template>
          </GSlider>
        </div>
      </div>

      <GDivider/>

      <div class="graphics-grid">
        <GSlider editable :min="75" :max="145"
                 v-model="fov">
          <template #label>
            <GLocText code="#FOV" :table="ST_MENU">
              FOV
            </GLocText>
          </template>
        </GSlider>
      </div>

    </div>
    <div class="settings-footer">
      <div class="graphics-grid">
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

import {ST_MENU} from "@/assets/js/localizationConstants.js";
import {useLocalizationStore} from "@/stores/localizationStore.js";

const locStore = useLocalizationStore();

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
const fov = ref(90.0);


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

onMounted(async () => {
  // Fetch all localizations in parallel
  const [placeHolderResult, qualResult, aaResult, displayResult] = await Promise.all([
    locStore.getText('#ComboPlaceHolder', ST_MENU, 'Select'),
    locStore.getTextArray([
      {
        key: '#Low',
        table: ST_MENU,
        defaultValue: 'Low'
      },
      {
        key: '#Medium',
        table: ST_MENU,
        defaultValue: 'Medium'
      },
      {
        key: '#High',
        table: ST_MENU,
        defaultValue: 'High'
      },
      {
        key: '#Epic',
        table: ST_MENU,
        defaultValue: 'Epic'
      },
      {
        key: '#Cinematic',
        table: ST_MENU,
        defaultValue: 'Cinematic'
      }
    ]),
    locStore.getTextArray([
      {
        key: '#AA_None',
        table: ST_MENU,
        defaultValue: 'None'
      },
      {
        key: '#AA_FXAA',
        table: ST_MENU,
        defaultValue: 'FXAA'
      },
      {
        key: '#AA_TSR',
        table: ST_MENU,
        defaultValue: 'TSR'
      },
      {
        key: '#AA_TAA',
        table: ST_MENU,
        defaultValue: 'TAA'
      }
    ]),
    locStore.getTextArray([
      {
        key: '#Display_Fullscreen',
        table: ST_MENU,
        defaultValue: 'Fullscreen'
      },
      {
        key: '#Display_Windowed',
        table: ST_MENU,
        defaultValue: 'Windowed'
      },
      {
        key: '#Display_Borderless',
        table: ST_MENU,
        defaultValue: 'Borderless'
      }
    ])
  ]);

  // Assign results
  placeHolder.value = placeHolderResult;

  console.log("qual result is " + JSON.stringify(qualResult));
  qualOptions.value = qualResult.map(item => ({
    value: item.key,
    label: item.result
  }));

  aaOptions.value = aaResult.map(item => ({
    value: item.key,
    label: item.result
  }));

  displayOptions.value = displayResult.map(item => ({
    value: item.key,
    label: item.result
  }));

  await fetchResolutionOptions();
});
</script>
