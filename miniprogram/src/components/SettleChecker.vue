<template>
  <view class="checker" :class="checkerState">
    <view class="checker-row">
      <text class="cl">桌面总买入</text>
      <text class="cv">{{ totalChips }}</text>
    </view>
    <view class="checker-row">
      <text class="cl">已填剩余合计</text>
      <text class="cv">{{ filledTotal }}</text>
    </view>
    <view class="checker-row">
      <text class="cl">差值</text>
      <text class="cv diff" :class="chipDiff === 0 ? 'ok' : 'err'">
        {{ chipDiff === 0 ? '0 ✓' : (chipDiff > 0 ? '+' : '') + chipDiff }}
      </text>
    </view>
    <view class="prog-bar">
      <view class="prog-fill" :class="progClass" :style="{ width: progPct + '%' }"></view>
    </view>
    <text class="checker-status" :class="checkerState">{{ checkerMsg }}</text>
  </view>
</template>

<script setup>
defineProps({
  totalChips: { type: Number, default: 0 },
  filledTotal: { type: Number, default: 0 },
  chipDiff: { type: Number, default: 0 },
  progPct: { type: Number, default: 0 },
  progClass: { type: String, default: '' },
  checkerState: { type: String, default: 'warn' },
  checkerMsg: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
.checker {
  background: $card2;
  border: 1px solid $border;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
}
.checker.ok { border-color: #4caf50; }
.checker.err { border-color: $red; }
.checker-row {
  display: flex; justify-content: space-between;
  font-size: 12px; margin-bottom: 4px;
}
.checker-row:last-of-type { margin-bottom: 0; }
.cl { color: $muted; }
.cv { font-weight: 700; color: $text; }
.diff.ok { color: #4caf50; }
.diff.err { color: $red; }
.prog-bar {
  height: 5px; background: $border; border-radius: 3px;
  margin: 6px 0; overflow: hidden;
}
.prog-fill {
  height: 100%; border-radius: 3px;
  background: $green-light;
  transition: width 0.2s, background 0.2s;
}
.prog-fill.exact { background: #4caf50; }
.prog-fill.over { background: $red; }
.checker-status { font-size: 11px; font-weight: 600; }
.checker-status.ok { color: #4caf50; }
.checker-status.err { color: $red; }
.checker-status.warn { color: $muted; }
</style>
