import { computed } from 'vue';
import { calcTransfers } from '../utils/helpers';

export function useSettlement(players, totalChips) {
  const filledTotal = computed(() => {
    return players.value.reduce((s, p) => {
      const v = Number(p.settleInput);
      return s + (isNaN(v) || v < 0 ? 0 : v);
    }, 0);
  });

  const chipDiff = computed(() => filledTotal.value - totalChips.value);

  const progPct = computed(() => {
    const t = totalChips.value;
    return t > 0 ? Math.min(filledTotal.value / t * 100, 120) : 0;
  });

  const progClass = computed(() => {
    if (chipDiff.value === 0 && filledTotal.value > 0) return 'exact';
    if (chipDiff.value > 0) return 'over';
    return '';
  });

  const checkerState = computed(() => {
    if (filledTotal.value === 0) return 'warn';
    return chipDiff.value === 0 ? 'ok' : 'err';
  });

  const checkerMsg = computed(() => {
    if (filledTotal.value === 0) return '请填写各玩家剩余筹码';
    if (chipDiff.value === 0) return '✅ 筹码总数匹配，可以结算';
    if (chipDiff.value > 0) return `⚠️ 多出 ${chipDiff.value} 筹码，请检查`;
    return `⚠️ 还差 ${-chipDiff.value} 筹码未分配`;
  });

  const sortedPlayers = computed(() =>
    [...players.value].sort((a, b) => (b.pnl ?? -Infinity) - (a.pnl ?? -Infinity))
  );

  const transfers = computed(() => calcTransfers(sortedPlayers.value));

  return {
    filledTotal, chipDiff, progPct, progClass,
    checkerState, checkerMsg, sortedPlayers, transfers,
  };
}
