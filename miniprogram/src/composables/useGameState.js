import { ref, computed, onMounted } from 'vue';
import { saveToStorage, loadFromStorage, clearStorage } from './useStorage';
import { formatAgo } from '../utils/helpers';

export function useGameState() {
  const tab = ref('game');
  const players = ref([]);
  const settled = ref(false);
  const idCounter = ref(0);
  const chipsPerHand = ref(10000);
  const newName = ref('');
  const newHands = ref(1);
  const showAddPanel = ref(false);
  const showResult = ref(false);
  const showRestore = ref(false);
  const restoreInfo = ref('');
  const actionLogs = ref([]);

  const totalChips = computed(() => players.value.reduce((s, p) => s + p.totalBuyIn, 0));
  const phaseLabel = computed(() => settled.value ? '已结算' : '游戏中');
  const isSettling = computed(() => tab.value === 'settle' && !settled.value);

  function addLog(text) {
    actionLogs.value.push({ time: Date.now(), text });
  }

  function persistState(silent) {
    const state = {
      players: players.value,
      settled: settled.value,
      idCounter: idCounter.value,
      chipsPerHand: chipsPerHand.value,
      actionLogs: actionLogs.value,
      savedAt: Date.now(),
    };
    saveToStorage(state);
    if (!silent) {
      uni.showToast({ title: '已自动保存', icon: 'none', duration: 1500 });
    }
  }

  function restoreGame() {
    const s = loadFromStorage();
    if (!s) return;
    players.value = s.players || [];
    settled.value = s.settled || false;
    idCounter.value = s.idCounter || 0;
    chipsPerHand.value = s.chipsPerHand || 10000;
    actionLogs.value = s.actionLogs || [];
    showRestore.value = false;
    addLog('恢复上次游戏');
    persistState();
  }

  function discardRestore() {
    clearStorage();
    showRestore.value = false;
  }

  function addPlayer() {
    const name = newName.value.trim();
    const hands = newHands.value;
    if (!name) {
      uni.showToast({ title: '请输入玩家名称', icon: 'none' });
      return;
    }
    if (!hands || hands <= 0) {
      uni.showToast({ title: '请输入有效手数', icon: 'none' });
      return;
    }
    if (players.value.find(p => p.name === name)) {
      uni.showToast({ title: '玩家名称重复', icon: 'none' });
      return;
    }
    const chips = hands * chipsPerHand.value;
    players.value.push({
      id: ++idCounter.value,
      name,
      totalBuyIn: chips,
      buyCount: 1,
      buyHands: hands,
      buyInputHands: null,
      remaining: null,
      pnl: null,
      settleInput: null,
    });
    addLog(`添加玩家 ${name}，买入 ${chips}（${hands}手）`);
    newName.value = '';
    newHands.value = 1;
    showAddPanel.value = false;
    persistState();
  }

  async function removePlayer(id) {
    const player = players.value.find(p => p.id === id);
    uni.hideToast();
    const res = await new Promise(resolve => {
      uni.showModal({ content: '确认移除该玩家？', success: resolve, fail: () => resolve({ confirm: false }) });
    });
    if (!res.confirm) return;
    const name = player ? player.name : '未知';
    players.value = players.value.filter(p => p.id !== id);
    addLog(`移除玩家 ${name}`);
    persistState();
  }

  function buyIn(p) {
    const hands = Number(p.buyInputHands);
    if (!hands || hands <= 0) {
      uni.showToast({ title: '请输入有效手数', icon: 'none' });
      return;
    }
    const chips = hands * chipsPerHand.value;
    p.totalBuyIn += chips;
    p.buyCount++;
    p.buyHands += hands;
    p.buyInputHands = null;
    addLog(`${p.name} 追加买入 ${chips}（${hands}手）`);
    persistState();
  }

  function calcSettle() {
    players.value.forEach(p => {
      p.remaining = Number(p.settleInput);
      p.pnl = p.remaining - p.totalBuyIn;
    });
    settled.value = true;
    addLog('完成结算');
    persistState();
    showResult.value = true;
    tab.value = 'game';
  }

  async function resetGame() {
    if (players.value.length > 0) {
      uni.hideToast();
      const res = await new Promise(resolve => {
        uni.showModal({ content: '确认重置？所有记录将清空。', success: resolve, fail: () => resolve({ confirm: false }) });
      });
      if (!res.confirm) return;
    }
    doReset();
  }

  function doReset() {
    addLog('重置游戏');
    players.value = [];
    settled.value = false;
    idCounter.value = 0;
    showResult.value = false;
    showAddPanel.value = false;
    actionLogs.value = [];
    clearStorage();
    tab.value = 'game';
  }

  function newGame() {
    showResult.value = false;
    doReset();
  }

  onMounted(() => {
    const s = loadFromStorage();
    if (s && s.players && s.players.length > 0) {
      restoreInfo.value = `${s.players.length} 位玩家 · 保存于 ${formatAgo(s.savedAt)}`;
      showRestore.value = true;
    }
  });

  return {
    tab, players, settled, chipsPerHand, newName, newHands,
    showAddPanel, showResult, showRestore, restoreInfo, actionLogs,
    totalChips, phaseLabel, isSettling,
    persistState, restoreGame, discardRestore,
    addPlayer, removePlayer, buyIn, calcSettle, resetGame, newGame,
  };
}
