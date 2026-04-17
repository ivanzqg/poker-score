<template>
  <view class="modal-mask" @tap="$emit('close')">
    <view class="modal-box" @tap.stop>
      <text class="modal-title">🏆 结算结果</text>

      <!-- 结果表头 -->
      <view class="result-header">
        <text class="th" style="flex:2">玩家</text>
        <text class="th" style="flex:1">买入</text>
        <text class="th" style="flex:1">剩余</text>
        <text class="th" style="flex:1">盈亏</text>
      </view>
      <!-- 结果行 -->
      <view class="result-row" v-for="(p, i) in sortedPlayers" :key="p.id">
        <text class="td" style="flex:2">{{ i===0?'🥇 ':i===1?'🥈 ':i===2?'🥉 ':'' }}{{ p.name }}</text>
        <text class="td muted" style="flex:1">{{ p.totalBuyIn }}</text>
        <text class="td" style="flex:1">{{ p.remaining }}</text>
        <view style="flex:1">
          <text class="pnl" :class="p.pnl > 0 ? 'pos' : p.pnl < 0 ? 'neg' : 'zero'">
            {{ p.pnl > 0 ? '+' : '' }}{{ p.pnl }}
          </text>
        </view>
      </view>

      <view class="divider"></view>

      <text class="section-label">💸 建议转账</text>

      <view v-if="transfers.length === 0" class="empty-text">
        <text>无需转账</text>
      </view>
      <view v-for="t in transfers" :key="t.from+t.to" class="transfer-row">
        <text class="t-from">{{ t.from }}</text>
        <text class="t-arrow">→</text>
        <text class="t-to">{{ t.to }}</text>
        <text class="t-amt">{{ t.amount }}</text>
      </view>

      <button class="btn-primary full" @tap="$emit('close')">关闭</button>
      <button class="btn-outline full mt8" @tap="$emit('newGame')">开始新局</button>
    </view>
  </view>
</template>

<script setup>
defineProps({
  sortedPlayers: { type: Array, default: () => [] },
  transfers: { type: Array, default: () => [] },
});
defineEmits(['close', 'newGame']);
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.75);
  display: flex;
  align-items: flex-end;
  z-index: 200;
}
.modal-box {
  background: $card;
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 32px;
  padding-bottom: calc(32px + env(safe-area-inset-bottom));
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
}
.modal-title {
  color: $gold; text-align: center; display: block;
  margin-bottom: 14px; font-size: 18px; font-weight: 700;
}
.result-header {
  display: flex; padding: 4px 6px;
  border-bottom: 1px solid $border;
  margin-bottom: 4px;
}
.th { color: $muted; font-weight: 500; font-size: 13px; }
.result-row {
  display: flex; align-items: center;
  padding: 7px 6px;
  border-bottom: 1px solid #1e3d2a;
}
.td { font-size: 13px; color: $text; }
.td.muted { color: $muted; }
.pnl {
  font-size: 13px; font-weight: 700;
  padding: 2px 6px; border-radius: 6px;
  display: inline-block;
}
.pnl.pos { color: #4caf50; background: rgba(76,175,80,.12); }
.pnl.neg { color: #ef5350; background: rgba(239,83,80,.12); }
.pnl.zero { color: $muted; background: rgba(255,255,255,.06); }
.divider { border-top: 1px solid $border; margin: 10px 0; }
.section-label { font-size: 12px; color: $muted; margin-bottom: 8px; display: block; }
.empty-text { color: $muted; font-size: 13px; text-align: center; }
.transfer-row {
  display: flex; align-items: center; padding: 7px 0;
  border-bottom: 1px solid $border;
}
.transfer-row:last-of-type { border-bottom: none; }
.t-from { color: #ef5350; flex: 1; font-size: 13px; }
.t-arrow { color: $muted; margin: 0 6px; font-size: 13px; }
.t-to { color: #4caf50; flex: 1; font-size: 13px; }
.t-amt { color: $gold; font-weight: 700; font-size: 13px; }
.btn-primary {
  background: $green-light; color: #fff;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600; padding: 10px 14px;
  margin-top: 16px;
}
.btn-outline {
  background: transparent; border: 1px solid $border; color: $muted;
  border-radius: 8px; font-size: 13px; font-weight: 600; padding: 10px 14px;
}
.full { width: 100%; }
.mt8 { margin-top: 8px; }
</style>
