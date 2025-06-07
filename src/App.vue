<template>
  <div class="game-container">
    <header>
      <h1 class="fun-title">
        <span class="cat-emoji">😺</span>
        <span class="title-text">Katzen Kotzen</span>
        <span class="cat-emoji">😹</span>
      </h1>
      <div class="scoreboard">
        <span>Level: {{ level }}</span>
        <span>Punkte: {{ score }}</span>
        <span>Highscore: {{ highscore }}</span>
        <button @click="resetGame">Neustart</button>
      </div>
    </header>
    <div class="cats-area" v-if="catStates.length === cats.length">
      <Cat
        v-for="(cat, idx) in cats"
        :key="cat.id"
        :id="cat.id"
        :onVomit="handleCatVomit"
        :resetSignal="resetSignal"
        :level="level"
        :left="catStates[idx].left"
        :top="catStates[idx].top"
      />
    </div>
    <div v-if="vomitedCats.length === cats.length" class="levelup">
      <h2>Nächstes Level!</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import Cat from './components/Cat.vue';
import game from './gameLogic.js';
const { level, score, highscore, cats, vomitedCats, resetSignal, handleCatVomit, resetGame } = game.setup();

const areaWidth = 600;
const areaHeight = 350;
const catSize = 120;

// Position und Geschwindigkeit für jede Katze
const catStates = reactive([]);
function initCatStates() {
  catStates.length = 0;
  for (let i = 0; i < cats.value.length; i++) {
    catStates.push({
      left: Math.random() * (areaWidth - catSize),
      top: Math.random() * (areaHeight - catSize),
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
    });
  }
}

// Initialisieren und bei Änderung von cats neu initialisieren
onMounted(initCatStates);
watch(cats, initCatStates);

function updatePositions() {
  for (let i = 0; i < catStates.length; i++) {
    let cat = catStates[i];
    cat.left += cat.vx;
    cat.top += cat.vy;
    if (cat.left < 0) { cat.left = 0; cat.vx *= -1; }
    if (cat.left > areaWidth - catSize) { cat.left = areaWidth - catSize; cat.vx *= -1; }
    if (cat.top < 0) { cat.top = 0; cat.vy *= -1; }
    if (cat.top > areaHeight - catSize) { cat.top = areaHeight - catSize; cat.vy *= -1; }
  }
  for (let i = 0; i < catStates.length; i++) {
    for (let j = i + 1; j < catStates.length; j++) {
      const a = catStates[i];
      const b = catStates[j];
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < catSize * 0.8) {
        [a.vx, b.vx] = [b.vx, a.vx];
        [a.vy, b.vy] = [b.vy, a.vy];
        const overlap = catSize * 0.8 - dist;
        const nx = dx / (dist || 1);
        const ny = dy / (dist || 1);
        a.left += nx * (overlap / 2);
        a.top += ny * (overlap / 2);
        b.left -= nx * (overlap / 2);
        b.top -= ny * (overlap / 2);
      }
    }
  }
}

let animationFrame;
function animate() {
  updatePositions();
  animationFrame = requestAnimationFrame(animate);
}
onMounted(() => {
  animate();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Comic+Neue:wght@700&display=swap');

.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9e7ff 0%, #e0f7fa 100%);
  text-align: center;
  font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
}
header {
  padding-top: 1rem;
  margin-bottom: 2rem;
}
.fun-title {
  font-family: 'Luckiest Guy', 'Comic Neue', cursive, sans-serif;
  font-size: 3.2rem;
  color: #8e24aa;
  letter-spacing: 2px;
  margin: 0.5em 0 0.2em 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  text-shadow: 2px 4px 0 #fffbe7, 0 2px 8px #0002;
  animation: wiggle 2.5s infinite;
}
.cat-emoji {
  font-size: 2.2rem;
  display: inline-block;
  animation: bounce 1.2s infinite alternate;
}
.cat-emoji:last-child {
  animation-delay: 0.6s;
}
.title-text {
  display: inline-block;
  animation: pop-title 1.2s;
}
@keyframes wiggle {
  0%, 100% { transform: rotate(-2deg); }
  10% { transform: rotate(2deg); }
  20% { transform: rotate(-2deg); }
  30% { transform: rotate(2deg); }
  40% { transform: rotate(-2deg); }
  50% { transform: rotate(0deg); }
}
@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-12px) scale(1.1); }
}
@keyframes pop-title {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.scoreboard {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1.2rem;
  margin-top: 1rem;
  color: #4a148c;
  font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  box-shadow: 0 2px 8px #0001;
  padding: 0.7em 2em;
  width: max-content;
  margin-left: auto;
  margin-right: auto;
}
.scoreboard span {
  font-weight: bold;
  text-shadow: 1px 1px 0 #fff, 0 1px 4px #b39ddb;
}
.cats-area {
  position: relative;
  width: 600px;
  height: 350px;
  margin: 2rem auto 0 auto;
  background-color: #b9e7a5;
  border-radius: 24px;
  box-shadow: 0 4px 24px #0001;
  overflow: hidden;
  /* Deutliches Gras-Muster mit Halmen und Tupfen, besser sichtbar */
  background-image: url('data:image/svg+xml;utf8,<svg width="120" height="60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" fill="%23b9e7a5"/><path d="M10 60 Q15 30 20 60" stroke="%238bc34a" stroke-width="5" fill="none"/><path d="M30 60 Q35 40 40 60" stroke="%234caf50" stroke-width="4" fill="none"/><path d="M50 60 Q55 35 60 60" stroke="%236fbf73" stroke-width="4" fill="none"/><path d="M70 60 Q75 38 80 60" stroke="%238bc34a" stroke-width="5" fill="none"/><path d="M90 60 Q95 32 100 60" stroke="%234caf50" stroke-width="4" fill="none"/><ellipse cx="25" cy="58" rx="5" ry="2" fill="%234caf50"/><ellipse cx="65" cy="59" rx="7" ry="2.5" fill="%238bc34a"/><ellipse cx="105" cy="58" rx="5" ry="2" fill="%236fbf73"/><circle cx="15" cy="55" r="2" fill="%234caf50"/><circle cx="45" cy="57" r="1.5" fill="%238bc34a"/><circle cx="85" cy="56" r="2" fill="%236fbf73"/></svg>');
  background-size: 120px 60px;
}
.levelup {
  margin-top: 2rem;
  font-size: 2rem;
  color: #8e24aa;
  animation: pop 0.7s;
}
@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
button {
  background: #ffb300;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #0001;
  transition: background 0.2s;
}
button:hover {
  background: #ffd54f;
}
</style>
