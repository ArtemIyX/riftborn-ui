<style src="./SettingsAudio.css" scoped/>


<template>
  <GHeading>
    <GLocText key="#Audio" table="ST_Menu">
      Audio
    </GLocText>
  </GHeading>

  <div class="audio-settings-container">
    <div class="settings-main">

      <GDivider>
        <GLocText key="#AudioDevices" table="ST_Menu">
          Devices
        </GLocText>
      </GDivider>

      <div class="audio-grid">
        <div>
          <GLabel>
            <GLocText key="#Mic" table="ST_Menu">
              Mic
            </GLocText>
          </GLabel>
          <GCombobox v-model="mic" :placeholder="placeholder" :options="micOptions"
                     emptyText="invalid"/>

        </div>
        <div>
          <GLabel>
            <GLocText key="#Speaker" table="ST_Menu">
              Speaker
            </GLocText>
          </GLabel>
          <GCombobox v-model="speaker" :placeholder="placeholder" :options="speakerOptions"
                     emptyText="invalid"/>

        </div>

        <div>
          <GLabel>
            <GLocText key="#MicInputVolume" table="ST_Menu">
              Mic Volume
            </GLocText>
          </GLabel>
          <GProgress variant="primary" animated value=25></GProgress>
        </div>
      </div>


      <GDivider>
        <GLocText key="#VolumeControls" table="ST_Menu">
          Volume Controls
        </GLocText>
      </GDivider>

      <GSlider variant="success" v-model="master" editable>
        <template #label>
          <GLocText key="#MasterVolume" table="ST_Menu">
            Master Volume
          </GLocText>
        </template>
      </GSlider>

      <GDivider/>

      <div class="audio-grid">
        <GSlider v-model="music" editable>
          <template #label>
            <GLocText key="#MusicVolume" table="ST_Menu">
              Music Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="sound" editable>
          <template #label>
            <GLocText key="#SoundVolume" table="ST_Menu">
              Sound Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="ui" editable>
          <template #label>
            <GLocText key="#UIVolume" table="ST_Menu">
              UI Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="ambient" editable>
          <template #label>
            <GLocText key="AmbientVolume" table="ST_Menu">
              Ambient Volume
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="voiceIn" editable>
          <template #label>
            <GLocText key="#VoiceInputVolume" table="ST_Menu">
              Voice Volume (Input)
            </GLocText>
          </template>
        </GSlider>

        <GSlider v-model="voiceOut" editable>
          <template #label>
            <GLocText key="#VoiceOutputVolume" table="ST_Menu">
              Voice Volume (Output)
            </GLocText>
          </template>
        </GSlider>
      </div>


    </div>
    <div class="settings-footer">
      <div class="audio-grid">
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

onMounted(() => {
  getLocText("#AudioDevicePlaceHoder", "ST_Menu", "Select device").then((res) => {
    placeholder.value = res;
  })
  fetchSpeaker().then(res => {
    speakerOptions.value = res;
  })

  fetchMic().then(res => {
    micOptions.value = res;
  })
});

</script>
