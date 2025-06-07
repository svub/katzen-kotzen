import { ref, reactive } from 'vue';
import Cat from './components/Cat.vue';

const level = ref(1);
const score = ref(0);
const highscore = ref(Number(localStorage.getItem('highscore') || 0));
const cats = ref([]);
const vomitedCats = ref([]);
const resetSignal = ref(0);
const levelStartTime = ref(Date.now());

function startLevel() {
  cats.value = Array.from({ length: level.value }, (_, i) => ({ id: i }));
  vomitedCats.value = [];
  resetSignal.value++;
  levelStartTime.value = Date.now();
}

function handleCatVomit(id) {
  if (!vomitedCats.value.includes(id)) vomitedCats.value.push(id);
  if (vomitedCats.value.length === cats.value.length) {
    const time = (Date.now() - levelStartTime.value) / 1000;
    const points = Math.max(1000 - Math.floor(time * 100), 100);
    score.value += points;
    if (score.value > highscore.value) {
      highscore.value = score.value;
      localStorage.setItem('highscore', highscore.value);
    }
    setTimeout(() => {
      level.value++;
      startLevel();
    }, 1200);
  }
}

function resetGame() {
  level.value = 1;
  score.value = 0;
  startLevel();
}

startLevel();

export default {
  components: { Cat },
  setup() {
    return {
      level,
      score,
      highscore,
      cats,
      vomitedCats,
      resetSignal,
      handleCatVomit,
      resetGame,
    };
  },
};
