<template>
  <GToastContainer/>



  <GButton variant="primary" text="Hello world" @click="hello"/>
  <GButtonAdv variant="success" text="Hello world" @click="hello"/>
  <GButtonCommon variant="danger" text="Hello world" @click="hello"/>

  <GDivider text="Combo boxes"/>

  <GCombobox
    v-model="selectedSystem"
    :options="systems"
    placeholder="Select system..."
    searchable
  />

  <GCombobox
    v-model="selectedSystem"
    :options="systems"
    variant="primary"
    placeholder="OVERRIDE TARGET"
  />

  <GDivider text="Inputs"/>

  <GInputNumber
    v-model="power2"
    :min="0"
    :max="100"
    unit="%"
    label="POWER ALLOCATION"
    size="small"
  />

  <GInput
    variant="default"
    v-model="shipName"
    label="Vessel Designation"
    placeholder="Enter name..."
    clearable
    required
  />

  <GInput
    v-model="frequency"
    variant="primary"
    label="Frequency"
    suffix="MHz"
    type="number"
  />

  <GInput
    v-model="coordinates"
    variant="ghost"
    placeholder="Search coordinates..."
    error="Invalid format"
  />

  <GDivider text="Text area"/>

  <GTextarea
    v-model="logEntry"
    label="Captain's Log"
    placeholder="Enter log entry..."
    :rows="6"
    show-count
    :maxlength="500"
  />

  <GDivider/>

  <GTextarea
    v-model="distressSignal"
    variant="primary"
    label="Distress Message"
    hint="Broadcast on all frequencies"
    required
  />

  <GTextarea
    v-model="notes"
    variant="ghost"
    placeholder="Quick notes..."
    resize
  />

  <GDivider text="Checkboxes"/>

  <!-- Single -->
  <GCheckbox v-model="autoSave" label="Auto-save enabled"/>

  <!-- Variants -->
  <GCheckbox v-model="confirmed" variant="success" label="Systems nominal"/>
  <GCheckbox v-model="override" variant="danger" label="Override safety"/>

  <GDivider text="Toggles"/>

  <GToggle :model-value="isActive('autopilot')" @change="toggle('autopilot')" label="Autopilot"/>
  <GToggle :model-value="isActive('shields')" @change="toggle('shields')" label="Shields"/>
  <GToggle :model-value="isActive('selfDestruct')" @change="toggle('selfDestruct')"
            label="Self Destruct"/>

  <GDivider text="Radio"/>
  <!-- Radio group - all share same v-model -->
  <GRadio v-model="selectedSystem_radio" value="navigation" label="Navigation"/>
  <GRadio v-model="selectedSystem_radio" value="weapons" label="Weapons"/>
  <GRadio v-model="selectedSystem_radio" value="shields" label="Shields"/>
  <GRadio v-model="selectedSystem_radio" value="engines" label="Engines"/>

  <!-- With variants -->
  <GRadio v-model="priority" value="low" variant="success" label="Low"/>
  <GRadio v-model="priority" value="medium" variant="primary" label="Medium"/>
  <GRadio v-model="priority" value="critical" variant="danger" label="Critical"/>

  <GDivider text="Slider"/>

  <GSlider v-model="power" label="Reactor Power" suffix="%"/>

  <GSlider
    v-model="throttle"
    label="Throttle"
    :min="0"
    :max="100"
    :step="5"
    show-ticks
    variant="primary"
  />

  <GSlider
    v-model="temperature"
    label="Core Temp"
    suffix="°C"
    :min="0"
    :max="1000"
    variant="danger"
    show-min-max
  />

  <GSlider
    v-model="oxygen"
    label="O₂ Level"
    suffix="%"
    variant="success"
    size="large"
  />

  <GDivider text="Progress"/>

  <GProgress :value="75" label="Hull Integrity"/>

  <!-- With threshold warning -->
  <GProgress
    :value="23"
    label="Oxygen"
    variant="danger"
    :threshold="20"
    status="CRITICAL"
  />

  <!-- Loading state -->
  <GProgress
    indeterminate
    label="Scanning..."
    variant="info"
  />

  <!-- Segmented (like power cells) -->
  <GProgress
    :value="60"
    label="Power Cells"
    :segments="10"
    variant="success"
  />

  <!-- Animated striped -->
  <GProgress
    :value="45"
    label="Download"
    striped
    animated
    suffix=" MB"
    :max="200"
  />

  <GDivider text="Tooltips"/>

  <!-- Simple text tooltip -->
  <GTooltip text="Emergency systems activated">
    <GButton>Status</GButton>
  </GTooltip>

  <!-- With title and hotkey -->
  <GTooltip
    title="Fire Torpedoes"
    text="Launch forward torpedo array"
    hotkey="Ctrl + F"
    variant="danger"
  >
    <GButton>🚀</GButton>
  </GTooltip>

  <!-- With icon -->
  <GTooltip
    icon="warning"
    text="Hull integrity critical"
    variant="warning"
    placement="right"
  >
    <span>⚠️</span>
  </GTooltip>

  <GTooltip title="Reactor Status" text="Core temperature nominal">
    <GButton>⚛️ Reactor</GButton>

    <template #widget>
      <GProgress
        :value="78"
        label="Power Output"
        variant="success"
        size="small"
      />
    </template>
  </GTooltip>

  <GDivider text="Modal"/>

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

  <GDivider text="Cards"/>
  <div class="card-grid">
    <!-- Basic Card -->
    <GCard
      title="Hull Integrity"
      subtitle="Sector 7-G"
      variant="success"
      :show-status="true"
    >
      <p>All compartments sealed. No breaches detected.</p>
      <p>Last inspection: 2 hours ago</p>
    </GCard>

    <!-- Danger Card with Footer -->
    <GCard
      title="Oxygen Levels"
      subtitle="Critical System"
      variant="danger"
      :show-status="true"
    >
      <p>Warning: Oxygen reserves at 23%. Immediate resupply required.</p>

      <template #footer>
        <GButtonCommon text="DETAILS" variant="ghost" size="small"/>
        <GButton text="RESUPPLY" variant="danger" size="small"/>
      </template>
    </GCard>

    <!-- Collapsible Card -->
    <GCard
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
    </GCard>

    <!-- Warning Card -->
    <GCard
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
    </GCard>

    <!-- Creep/Anomaly Card -->
    <GCard
      title="Unknown Signal"
      subtitle="Origin: Unidentified"
      variant="creep"
      :show-status="true"
      :active="true"
    >
      <p>Biological signature detected in cargo bay 3. Pattern does not match any known species in
        database.</p>

      <template #footer>
        <GButton text="INVESTIGATE" variant="warning" size="small"/>
      </template>
    </GCard>

    <!-- Loading Card -->
    <GCard
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
    </GCard>

    <!-- Ghost Card -->
    <GCard
      title="System Notes"
      variant="ghost"
      size="compact"
    >
      <p>Minimal styling for secondary information panels.</p>
    </GCard>

    <!-- Card with Header Actions -->
    <GCard
      title="Crew Status"
      subtitle="5 Active Members"
      variant="default"
    >
      <template #header-actions>
        <GButtonCommon text="+" variant="ghost" size="small"/>
      </template>

      <p>All crew members accounted for. Morale: Stable.</p>
    </GCard>
  </div>

  <GDivider text="Toast"/>

  <GButtonCommon @click="pushToast">
    Push toast
  </GButtonCommon>
  <GDivider/>

  <GDivider text="Heading"/>
  <!-- Simple -->
  <GHeading level="h1">SYSTEM STATUS</GHeading>

  <!-- Critical alert -->
  <GHeading level="h2" variant="danger" show-status glow scanline>
    HULL BREACH DETECTED
  </GHeading>

  <!-- Section header with line -->
  <GHeading level="h3" variant="primary" decorative-line="right">
    CREW ROSTER
  </GHeading>

  <!-- Horror element -->
  <GHeading level="h2" variant="creep" glow scanline brackets>
    UNKNOWN SIGNAL
  </GHeading>

  <!-- With badge -->
  <GHeading level="h4" variant="warning" badge="3">
    PENDING REPAIRS
  </GHeading>

  <GDivider/>

  <GDivider text="Text"/>
  <!-- Standard body text -->
  <GText>System status nominal</GText>

  <!-- Technical monospace -->
  <GText family="mono" variant="success">
    [OK] All systems operational
  </GText>

  <!-- Critical alert -->
  <GText variant="danger" size="large" glow flicker>

    HULL BREACH DETECTED
  </GText>

  <!-- Horror element -->
  <GText variant="creep" glitch scanline>
    Unknown signal detected...
  </GText>

  <!-- Status with badge -->
  <GText variant="warning" badge="3">
    Pending repairs
  </GText>

  <!-- Truncated long text -->
  <GText truncate style="max-width: 200px">
    This very long text will be truncated...
  </GText>

  <!-- Gradient title -->
  <GText
    size="xl"
    weight="bold"
    gradient="primary"
    family="title"
    interactive
    @click="console.log('gradient clicked')"
  >
    USS NAUTILUS
  </GText>

  <GDivider text="Labels"/>

  <!-- Simple required field -->
  <GLabel for="password" required>Password</GLabel>
  <br/>
  <!-- With hint -->
  <GLabel for="depth" hint="Enter depth in meters" hint-icon required>
    Target Depth
  </GLabel>
  <br/>
  <!-- Critical field -->
  <GLabel
    variant="danger"
    show-status
    required
    required-pulse
    flicker
  >
    Hull Integrity
  </GLabel>
  <br/>
  <!-- With tooltip -->
  <GLabel tooltip="This field is required for navigation">
    Target Location
  </GLabel>
  <br/>
  <!-- With badge -->
  <GLabel badge="NEW" variant="primary">
    Advanced Sonar
  </GLabel>
  <br/>
  <!-- Status label -->
  <GLabel variant="success" show-status badge="OK">
    Life Support System
  </GLabel>
  <br/>
  <GDivider text="Links"/>
  <!-- Simple link -->
  <GLink href="/missions">View Missions</GLink>
  <br/>
  <!-- External with auto icon -->
  <GLink href="https://example.com" external>
    External Docs
  </GLink>
  <br/>
  <!-- Technical mono link -->
  <GLink family="mono" variant="info" href="/logs">
    system.logs.access
  </GLink>
  <br/>
  <!-- Critical alert -->
  <GLink variant="danger" glow flicker href="/alert">
    <template #icon-left>
      <GLabel variant="danger">!!</GLabel>
    </template>
    Hull Breach Detected
  </GLink>

  <br/>
  <!-- With badge -->
  <GLink badge="NEW" variant="primary" href="/features">
    New Features
  </GLink>

  <br/>
  <!-- Animated underline -->
  <GLink underline-animated href="/details">
    View Details →
  </GLink>

  <GDivider text="Skeleton"/>

  <div v-if="true" class="mission-briefing-loading">
    <!-- Header -->
    <div class="header-skeleton">
      <GSkeleton variant="text" width="300px" height="32px" animation="scan" />
      <GSkeleton variant="text" width="200px" animation="scan" />
    </div>

    <!-- Main card -->
    <GSkeleton
      variant="card"
      :show-corners="true"
      animation="pulse"
      height="400px"
    />

    <!-- Action buttons -->
    <div class="actions-skeleton">
      <GSkeleton variant="button" animation="wave" />
      <GSkeleton variant="button" animation="wave" />
    </div>
  </div>

  <div v-else class="mission-briefing">
    <!-- Actual content here -->
  </div>

  <GDivider text="Spinners"/>
  <section class="demo-section">
    <h2>Spinner Variants</h2>
    <div class="spinner-grid">
      <div class="spinner-item">
        <GSpinner variant="ring" label="Ring" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="sonar" label="Sonar" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="orbital" label="Orbital" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="dots" label="Dots" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="pulse" label="Pulse" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="bars" label="Bars" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="scan" label="Scan" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="helix" label="Helix" />
      </div>
      <div class="spinner-item">
        <GSpinner variant="glitch" label="Glitch" />
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2>Sizes</h2>
    <div class="size-demo">
      <div class="size-item">
        <span>Tiny</span>
        <GSpinner variant="sonar" size="tiny" />
      </div>
      <div class="size-item">
        <span>Small</span>
        <GSpinner variant="sonar" size="small" />
      </div>
      <div class="size-item">
        <span>Medium</span>
        <GSpinner variant="sonar" size="medium" />
      </div>
      <div class="size-item">
        <span>Large</span>
        <GSpinner variant="sonar" size="large" />
      </div>
      <div class="size-item">
        <span>Huge</span>
        <GSpinner variant="sonar" size="huge" />
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2>Inline Spinners</h2>
    <div class="inline-examples">
      <p>
        <GSpinner variant="dots" size="tiny" inline /> Loading data...
      </p>
      <p>
        <GSpinner variant="ring" size="small" inline /> Processing mission briefing...
      </p>
      <p>
        <GSpinner variant="bars" size="small" inline /> Analyzing sonar readings...
      </p>
    </div>
  </section>

  

</template>

<script setup>


import {ref} from 'vue'
import {useToast} from "@/components/shared/useToast.js";

const toast = useToast()
const showModal = ref(false)
const power2 = ref(50.0)

const pushToast = () => {
  toast.show({
    title: 'ALERT',
    message: 'Details here',
    variant: 'danger',
    duration: 5000,      // 0 = persistent
    closable: true,
    showProgress: true,
    action: {
      label: 'BUTTON', onClick: () => {
      }
    }
  })
}

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
