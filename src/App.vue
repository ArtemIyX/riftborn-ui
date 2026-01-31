<template>

  <g-button variant="primary" text="Hello world" @click="hello"/>
  <g-button-adv variant="success" text="Hello world" @click="hello"/>
  <g-button-common variant="danger" text="Hello world" @click="hello"/>

  <g-divider/>

  <g-combobox
    v-model="selectedSystem"
    :options="systems"
    placeholder="Select system..."
    searchable
  />

  <g-combobox
    v-model="selectedSystem"
    :options="systems"
    variant="primary"
    placeholder="OVERRIDE TARGET"
  />

  <g-divider/>

  <g-input
    variant="default"
    v-model="shipName"
    label="Vessel Designation"
    placeholder="Enter name..."
    clearable
    required
  />

  <g-input
    v-model="frequency"
    variant="primary"
    label="Frequency"
    suffix="MHz"
    type="number"
  />

  <g-input
    v-model="coordinates"
    variant="ghost"
    placeholder="Search coordinates..."
    error="Invalid format"
  />

  <g-divider/>

  <g-textarea
    v-model="logEntry"
    label="Captain's Log"
    placeholder="Enter log entry..."
    :rows="6"
    show-count
    :maxlength="500"
  />

  <g-divider/>

  <g-textarea
    v-model="distressSignal"
    variant="primary"
    label="Distress Message"
    hint="Broadcast on all frequencies"
    required
  />

  <g-textarea
    v-model="notes"
    variant="ghost"
    placeholder="Quick notes..."
    resize
  />

  <g-divider/>

  <!-- Single -->
  <g-checkbox v-model="autoSave" label="Auto-save enabled" />

  <!-- Variants -->
  <g-checkbox v-model="confirmed" variant="success" label="Systems nominal" />
  <g-checkbox v-model="override" variant="danger" label="Override safety" />

  <g-divider/>

  <g-toggle :model-value="isActive('autopilot')" @change="toggle('autopilot')" label="Autopilot" />
  <g-toggle :model-value="isActive('shields')" @change="toggle('shields')" label="Shields" />
  <g-toggle :model-value="isActive('selfDestruct')" @change="toggle('selfDestruct')" label="Self Destruct" />

  <g-divider/>
  <!-- Radio group - all share same v-model -->
  <g-radio v-model="selectedSystem_radio" value="navigation" label="Navigation" />
  <g-radio v-model="selectedSystem_radio" value="weapons" label="Weapons" />
  <g-radio v-model="selectedSystem_radio" value="shields" label="Shields" />
  <g-radio v-model="selectedSystem_radio" value="engines" label="Engines" />

  <!-- With variants -->
  <g-radio v-model="priority" value="low" variant="success" label="Low" />
  <g-radio v-model="priority" value="medium" variant="primary" label="Medium" />
  <g-radio v-model="priority" value="critical" variant="danger" label="Critical" />

  <g-divider/>

  <g-slider v-model="power" label="Reactor Power" suffix="%" />

  <g-slider
    v-model="throttle"
    label="Throttle"
    :min="0"
    :max="100"
    :step="5"
    show-ticks
    variant="primary"
  />

  <g-slider
    v-model="temperature"
    label="Core Temp"
    suffix="°C"
    :min="0"
    :max="1000"
    variant="danger"
    show-min-max
  />

  <g-slider
    v-model="oxygen"
    label="O₂ Level"
    suffix="%"
    variant="success"
    size="large"
  />

  <g-divider/>

  <g-progress :value="75" label="Hull Integrity" />

  <!-- With threshold warning -->
  <g-progress
    :value="23"
    label="Oxygen"
    variant="danger"
    :threshold="20"
    status="CRITICAL"
  />

  <!-- Loading state -->
  <g-progress
    indeterminate
    label="Scanning..."
    variant="info"
  />

  <!-- Segmented (like power cells) -->
  <g-progress
    :value="60"
    label="Power Cells"
    :segments="10"
    variant="success"
  />

  <!-- Animated striped -->
  <g-progress
    :value="45"
    label="Download"
    striped
    animated
    suffix=" MB"
    :max="200"
  />

  <g-divider/>

  <!-- Simple text tooltip -->
  <g-tooltip text="Emergency systems activated">
    <g-button>Status</g-button>
  </g-tooltip>

  <!-- With title and hotkey -->
  <g-tooltip
    title="Fire Torpedoes"
    text="Launch forward torpedo array"
    hotkey="Ctrl + F"
    variant="danger"
  >
    <g-button>🚀</g-button>
  </g-tooltip>

  <!-- With icon -->
  <g-tooltip
    icon="warning"
    text="Hull integrity critical"
    variant="warning"
    placement="right"
  >
    <span>⚠️</span>
  </g-tooltip>

  <g-tooltip title="Reactor Status" text="Core temperature nominal">
    <g-button>⚛️ Reactor</g-button>

    <template #widget>
      <GProgress
        :value="78"
        label="Power Output"
        variant="success"
        size="small"
      />
    </template>
  </g-tooltip>


  <GButton
    text="OPEN MODAL"
    variant="primary"
    @click="showModal = true"
  />

  <GModal
    v-model="showModal"
    title="SYSTEM STATUS"
    variant="danger"
    size="medium"
    persistent
  >
    <p>All systems operational. Hull integrity at 98%. Oxygen levels nominal.</p>
    <p>No immediate threats detected in sector 7-G.</p>

    <template #actions>
      <GButtonCommon
        text="CANCEL"
        variant="danger"
        @click="showModal = false"
      />
      <GButton
        text="CONFIRM"
        variant="danger"
        size="small"
        @click="showModal = false"
      />
    </template>
  </GModal>

  <div class="card-grid">
    <!-- Basic Card -->
    <g-card
      title="Hull Integrity"
      subtitle="Sector 7-G"
      variant="success"
      :show-status="true"
    >
      <p>All compartments sealed. No breaches detected.</p>
      <p>Last inspection: 2 hours ago</p>
    </g-card>

    <!-- Danger Card with Footer -->
    <g-card
      title="Oxygen Levels"
      subtitle="Critical System"
      variant="danger"
      :show-status="true"
    >
      <p>Warning: Oxygen reserves at 23%. Immediate resupply required.</p>

      <template #footer>
        <GButtonCommon text="DETAILS" variant="ghost" size="small" />
        <GButton text="RESUPPLY" variant="danger" size="small" />
      </template>
    </g-card>

    <!-- Collapsible Card -->
    <g-card
      title="Navigation Log"
      subtitle="Last 24 hours"
      variant="primary"
      :collapsible="true"
      :collapsed="isNavCollapsed"
      @update:collapsed="isNavCollapsed = $event"
    >
      <p>• 06:00 - Course correction alpha-7</p>
      <p>• 12:30 - Entered asteroid field</p>
      <p>• 18:45 - Exited asteroid field</p>
      <p>• 22:00 - Autopilot engaged</p>
    </g-card>

    <!-- Warning Card -->
    <g-card
      title="Power Grid"
      variant="warning"
      :show-status="true"
      :hoverable="true"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </template>

      <p>Reactor output fluctuating. Non-critical systems on standby.</p>
    </g-card>

    <!-- Creep/Anomaly Card -->
    <g-card
      title="Unknown Signal"
      subtitle="Origin: Unidentified"
      variant="creep"
      :show-status="true"
      :active="true"
    >
      <p>Biological signature detected in cargo bay 3. Pattern does not match any known species in database.</p>

      <template #footer>
        <GButton text="INVESTIGATE" variant="warning" size="small" />
      </template>
    </g-card>

    <!-- Loading Card -->
    <g-card
      title="Scanning..."
      variant="primary"
      :loading="isLoading"
      loading-text="ANALYZING DATA..."
    >
      <p>Scan results will appear here.</p>

      <template #footer>
        <GButtonCommon
          :text="isLoading ? 'SCANNING...' : 'START SCAN'"
          variant="primary"
          size="small"
          :disabled="isLoading"
          @click="startScan"
        />
      </template>
    </g-card>

    <!-- Ghost Card -->
    <g-card
      title="System Notes"
      variant="ghost"
      size="compact"
    >
      <p>Minimal styling for secondary information panels.</p>
    </g-card>

    <!-- Card with Header Actions -->
    <g-card
      title="Crew Status"
      subtitle="5 Active Members"
      variant="default"
    >
      <template #header-actions>
        <GButtonCommon text="+" variant="ghost" size="small" />
      </template>

      <p>All crew members accounted for. Morale: Stable.</p>
    </g-card>
  </div>

</template>

<script setup>
import GButton from "@/components/shared/buttons/GButton.vue";
import GButtonAdv from "@/components/shared/buttons/GButtonAdv.vue";
import GButtonCommon from "@/components/shared/buttons/GButtonCommon.vue";
import GCombobox from "@/components/shared/GCombobox.vue";

import GInput from "@/components/shared/GInput.vue";

import {ref} from 'vue'
import GTextarea from "@/components/shared/GTextarea.vue";
import GCheckbox from "@/components/shared/GCheckbox.vue";
import GToggle from "@/components/shared/GToggle.vue";
import GDivider from "@/components/shared/GDivider.vue";
import GRadio from "@/components/shared/GRadio.vue";
import GSlider from "@/components/shared/GSlider.vue";
import GProgress from "@/components/shared/GProgress.vue";
import GTooltip from "@/components/shared/GTooltip.vue";
import GModal from "@/components/shared/GModal.vue";
import GCard from "@/components/shared/GCard.vue";

const showModal = ref(false)



const activeSystem = ref(null)

const selectedSystem_radio = ref(null)
const priority = ref(null)
const isActive = (key) => activeSystem.value === key
const toggle = (key) => {
  activeSystem.value = activeSystem.value === key ? null : key
}

const hello = () => {
  console.log("Hello world");
}


const shipName = ref(null)
const frequency = ref(null)
const coordinates = ref(null)
const logEntry = ref(null)
const distressSignal = ref(null)
const notes = ref(null)

const systems_check = ref([]);
const autoSave = ref(false);
const override = ref(false);
const confirmed = ref(false);
const someSelected = ref(false)

const power = ref(0.0)
const throttle = ref(0.0)
const oxygen = ref(0.0)
const temperature = ref(0.0)

const selectedSystem = ref(null)
const systems = [
  {value: 'life-support', label: 'Life Support'},
  {value: 'navigation', label: 'Navigation'},
  {value: 'weapons', label: 'Weapons Array'},
  {value: 'sonar', label: 'Sonar Systems'}
]

const changed = () => {

}

</script>

<style scoped>

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

</style>
