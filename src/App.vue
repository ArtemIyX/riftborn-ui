

<template>
  <div class="panel">
    <h2 class="panel-title">Systems Status</h2>
    <p class="panel-text">Hull integrity: <span class="status-ok">98%</span></p>
    <p class="panel-text">Oxygen: <span class="status-warning">34%</span></p>
    <button class="btn-primary">Repair</button>
  </div>
</template>

<script setup>
</script>

<style scoped>
.panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  padding: 16px;
}

.panel-title {
  color: var(--primary);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.panel-text {
  color: var(--text-secondary);
}

.status-ok {
  color: var(--success);
}

.status-warning {
  color: var(--warning);
}

.btn-primary {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-glow);
  box-shadow: 0 0 12px var(--primary-glow);
}
</style>
