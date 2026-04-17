/**
 * 格式化时间戳为"x分钟前"等相对时间
 */
export function formatAgo(ts) {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60) return '刚刚';
  if (d < 3600) return Math.floor(d / 60) + ' 分钟前';
  if (d < 86400) return Math.floor(d / 3600) + ' 小时前';
  return Math.floor(d / 86400) + ' 天前';
}

/**
 * 格式化时间戳为 HH:mm:ss
 */
export function formatTime(ts) {
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

/**
 * 贪心双指针算法：计算最优转账方案（最少笔数还清所有账）
 * @param {Array} sortedPlayers - 按 pnl 降序排列的玩家数组
 * @returns {Array} 转账列表 [{ from, to, amount }]
 */
export function calcTransfers(sortedPlayers) {
  const winners = sortedPlayers.filter(p => p.pnl > 0).map(p => ({ name: p.name, amount: p.pnl }));
  const losers = sortedPlayers.filter(p => p.pnl < 0).map(p => ({ name: p.name, amount: -p.pnl }));
  const result = [];
  let wi = 0, li = 0;
  while (wi < winners.length && li < losers.length) {
    const pay = Math.min(winners[wi].amount, losers[li].amount);
    result.push({ from: losers[li].name, to: winners[wi].name, amount: pay });
    winners[wi].amount -= pay;
    losers[li].amount -= pay;
    if (winners[wi].amount === 0) wi++;
    if (losers[li].amount === 0) li++;
  }
  return result;
}
