<template>
  <view class="settle-input-row">
    <text class="label">{{ player.name }} <text class="small">(买入 {{ player.totalBuyIn }})</text></text>
    <input
      class="input"
      :value="player.settleInput"
      @input="onInput"
      type="number"
      placeholder="剩余筹码"
    />
  </view>
</template>

<script setup>
const props = defineProps({
  player: { type: Object, required: true },
});

function onInput(e) {
  props.player.settleInput = Number(e.detail.value) || null;
}
</script>

<style lang="scss" scoped>
.settle-input-row {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
}
.label { flex: 1; font-size: 13px; color: $text; }
.small { color: $muted; font-size: 11px; }
.input {
  width: 90px; flex-shrink: 0;
  background: $card2; border: 1px solid $border; border-radius: 8px;
  color: $text; padding: 8px 10px; font-size: 14px;
}
</style>
