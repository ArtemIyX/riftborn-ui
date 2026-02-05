<style src="./SettingsAudio.css" scoped/>


<template>
  <GHeading>
    <GLocText code="#Audio" :table="ST_MENU">
      Audio
    </GLocText>
  </GHeading>

  <div class="audio-settings-container">
    <div class="settings-main">

      <GDivider>
        <GLocText code="#AudioDevices" :table="ST_MENU">
          Devices
        </GLocText>
      </GDivider>

      <div class="audio-grid">
        <div>
          <GLabel>
            <GLocText code="#Mic" :table="ST_MENU">
              Mic
            </GLocText>
          </GLabel>
          <GCombobox v-model="mic" :placeholder="placeholder" :options="micOptions"
                     emptyText="invalid"/>

        </div>
        <div>
          <GLabel>
            <GLocText code="#Speaker" :table="ST_MENU">
              Speaker
            </GLocText>
          </GLabel>
          <GCombobox v-model="speaker" :placeholder="placeholder" :options="speakerOptions"
                     emptyText="invalid"/>

        </div>

        <div>
          <GLabel>
            <GLocText code="#MicInputVolume" :table="ST_MENU">
              Mic Volume
            </GLocText>
          </GLabel>
          <GProgress variant="primary" animated value=25></GProgress>
        </div>
      </div>


      <GDivider>
        <GLocText code="#VolumeControls" :table="ST_MENU">
          Volume Controls
        </GLocText>
      </GDivider>

      <GSlider variant="success" v-model="master" editable>
        <template #label>
          <GLocText code="#MasterVolume" :table="ST_MENU">
            Master Volume
          </GLocText>
        </template>
      </GSlider>

      <GDivider/>

      <div class="audio-grid">
        <GSlider v-model="music" editable>
          <template #label>
            <GLocText code="#MusicVolume" :table="ST_MENU">
              Music Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="sound" editable>
          <template #label>
            <GLocText code="#SoundVolume" :table="ST_MENU">
              Sound Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="ui" editable>
          <template #label>
            <GLocText code="#UIVolume" :table="ST_MENU">
              UI Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="ambient" editable>
          <template #label>
            <GLocText code="#AmbientVolume" :table="ST_MENU">
              Ambient Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="voiceIn" editable>
          <template #label>
            <GLocText code="#VoiceInputVolume" :table="ST_MENU">
              Voice Volume (Input)
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="voiceOut" editable>
          <template #label>
            <GLocText code="#VoiceOutputVolume" :table="ST_MENU">
              Voice Volume (Output)
            </GLocText>
          </template>
        </GSlider>
      </div>


    </div>
    <div class="settings-footer">
      <div class="audio-grid">
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
import {useLocalizationStore} from "@/stores/useLocalizationStore.js";


const master = ref(100.0);
const music = ref(100.0);
const sound = ref(100.0);
const ui = ref(100.0);
const ambient = ref(100.0);

const voiceIn = ref(100.0);
const voiceOut = ref(100.0);

const placeholder = ref("");

const mic = ref('0');
const speaker = ref('0');
const micOptions = ref([]);
const speakerOptions = ref([]);

const fetchMic = async () => {
  return new Promise((resolve, reject) => {
    const mics = [{
      value: '0',
      label: 'Mic - A',
    },
      {
        value: '1',
        label: 'Mic - B',
      },
      {
        value: '2',
        label: 'Mic - C',
      },
      {
        value: '3',
        label: 'Mic -D',
      }
    ];
    resolve(mics);
  })
};

const fetchSpeaker = async () => {
  return new Promise((resolve, reject) => {
    const speakers = [{
      value: '0',
      label: 'Speaker - A',
    }, {
      value: '1',
      label: 'Speaker - B',
    }, {
      value: '2',
      label: 'Speaker - C',
    }, {
      value: '3',
      label: 'Speaker -D',
    }
    ];
    resolve(speakers);
  })
};

const locStore = useLocalizationStore();

onMounted(async () => {
  // Fetch all data in parallel
  const [placeholderResult, speakerResult, micResult] = await Promise.all([
    locStore.getText("#AudioDevicePlaceHoder", ST_MENU, "Select device"),
    fetchSpeaker(),
    fetchMic()
  ]);

  // Assign results
  placeholder.value = placeholderResult.result;
  speakerOptions.value = speakerResult.result;
  micOptions.value = micResult;
});
</script>
