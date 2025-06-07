<template>
  <div
    class="cat"
    :class="catState"
    @click="handleClick"
    :style="catStyle"
  >
    <svg v-if="catState !== 'vomit'" viewBox="0 0 120 120" class="cat-svg">
      <!-- Bunte Body-Farbe -->
      <ellipse cx="60" cy="85" rx="32" ry="28" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <!-- Bunter Head -->
      <ellipse cx="60" cy="50" rx="26" ry="24" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <!-- Left Ear -->
      <polygon points="34,38 44,8 54,38" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <polygon points="40,28 44,14 48,28" fill="#f9c5d1"/>
      <!-- Right Ear -->
      <polygon points="66,38 76,8 86,38" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <polygon points="72,28 76,14 80,28" fill="#f9c5d1"/>
      <!-- Eyes -->
      <ellipse cx="50" cy="54" rx="7" ry="11" fill="#fff"/>
      <ellipse cx="70" cy="54" rx="7" ry="11" fill="#fff"/>
      <ellipse cx="50" cy="58" rx="2.2" ry="3.5" fill="#222"/>
      <ellipse cx="70" cy="58" rx="2.2" ry="3.5" fill="#222"/>
      <!-- Nose -->
      <ellipse cx="60" cy="68" rx="1.7" ry="1.2" fill="#e07a5f"/>
      <!-- Mouth -->
      <path d="M59 71 Q60 73 61 71" stroke="#e07a5f" stroke-width="1.2" fill="none"/>
    </svg>
    <svg v-else viewBox="0 0 120 120" class="cat-svg">
      <!-- Bunte Body-Farbe -->
      <ellipse cx="60" cy="85" rx="32" ry="28" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <!-- Bunter Head -->
      <ellipse cx="60" cy="50" rx="26" ry="24" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <!-- Left Ear -->
      <polygon points="34,38 44,8 54,38" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <polygon points="40,28 44,14 48,28" fill="#f9c5d1"/>
      <!-- Right Ear -->
      <polygon points="66,38 76,8 86,38" :fill="pickColor(props.id)" stroke="#111" stroke-width="2.5"/>
      <polygon points="72,28 76,14 80,28" fill="#f9c5d1"/>
      <!-- Eyes (schwindelig) -->
      <ellipse cx="50" cy="54" rx="7" ry="11" fill="#fff"/>
      <ellipse cx="70" cy="54" rx="7" ry="11" fill="#fff"/>
      <path d="M47 54 Q50 60 53 54 Q50 48 47 54" stroke="#222" stroke-width="1.5" fill="none"/>
      <path d="M67 54 Q70 60 73 54 Q70 48 67 54" stroke="#222" stroke-width="1.5" fill="none"/>
      <!-- Nase -->
      <ellipse cx="60" cy="68" rx="1.7" ry="1.2" fill="#e07a5f"/>
      <!-- Mund (offen, schlecht) -->
      <ellipse cx="60" cy="73" rx="5.5" ry="3.2" fill="#7ed957"/>
      <!-- GROSSE Kotze, lustig -->
      <path d="M60 76 Q80 100 60 115 Q40 100 60 76" fill="#7ed957" stroke="#5fae3e" stroke-width="2.5"/>
      <ellipse cx="60" cy="115" rx="15" ry="4.5" fill="#b6e388"/>
      <!-- Spritzer -->
      <ellipse cx="50" cy="110" rx="2.5" ry="1.2" fill="#7ed957"/>
      <ellipse cx="70" cy="110" rx="2.5" ry="1.2" fill="#7ed957"/>
      <ellipse cx="55" cy="118" rx="1.2" ry="0.6" fill="#b6e388"/>
      <ellipse cx="65" cy="118" rx="1.2" ry="0.6" fill="#b6e388"/>
    </svg>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  id: Number,
  onVomit: Function,
  resetSignal: Number,
  level: { type: Number, default: 1 },
  left: { type: Number, default: 0 },
  top: { type: Number, default: 0 },
});

const catState = ref('normal'); // normal, sick, vomit
const tapCount = ref(0);
const sickThreshold = 5;
const recoverTimeout = 2000;
let recoverTimer = null;

// Position wird jetzt von außen gesteuert
const catStyle = computed(() => ({
  left: `${props.left}px`,
  top: `${props.top}px`,
  position: 'absolute',
  transition: 'none',
}));

function handleClick() {
  if (catState.value === 'vomit') return;
  tapCount.value++;
  if (tapCount.value >= sickThreshold) {
    catState.value = 'vomit';
    props.onVomit(props.id);
  } else if (tapCount.value >= sickThreshold - 2) {
    catState.value = 'sick';
  }
  resetRecoverTimer();
}

function resetRecoverTimer() {
  if (recoverTimer) clearTimeout(recoverTimer);
  if (catState.value !== 'vomit') {
    recoverTimer = setTimeout(() => {
      tapCount.value = 0;
      catState.value = 'normal';
    }, recoverTimeout);
  }
}

watch(() => props.resetSignal, () => {
  tapCount.value = 0;
  catState.value = 'normal';
});

onUnmounted(() => {
  if (recoverTimer) clearTimeout(recoverTimer);
});

const catColors = [
  '#222', // Schwarz (Jiji)
  '#3b2c1a', // Braun
  '#6d4c41', // Hellbraun
  '#bdbdbd', // Grau
  '#f5e6c8', // Creme
  '#e57373', // Rot
  '#fbc02d', // Gelb
  '#1976d2', // Blau
  '#7e57c2', // Lila
];

function pickColor(id) {
  // Zufällig, aber pro id immer gleich (damit beim Rendern stabil)
  const seed = (id * 9301 + 49297) % 233280;
  return catColors[seed % catColors.length];
}
</script>

<style scoped>
.cat {
  width: 120px;
  height: 120px;
  display: inline-block;
  margin: 20px;
  cursor: pointer;
  transition: transform 0.1s;
  position: relative;
  z-index: 2;
}
.cat-svg {
  width: 120px;
  height: 120px;
  display: block;
  margin: 0 auto;
}
.cat.sick .cat-svg {
  filter: hue-rotate(90deg) brightness(1.1) saturate(1.2);
}
.cat.vomit .cat-svg {
  opacity: 0.5;
}
</style>
