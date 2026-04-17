<template>
  <view class="tabs">
    <view class="tab" :class="{ active: tab === 'game' }" @tap="$emit('change', 'game')">
      <text class="tab-icon">🎮</text>
      <text class="tab-label">游戏</text>
    </view>
    <view
      class="tab"
      :class="{ active: tab === 'settle', disabled: disableSettle }"
      @tap="!disableSettle && $emit('change', 'settle')"
    >
      <text class="tab-icon">🏆</text>
      <text class="tab-label">结算</text>
    </view>
    <view class="tab" :class="{ active: tab === 'config' }" @tap="$emit('change', 'config')">
      <text class="tab-icon">⚙️</text>
      <text class="tab-label">设置</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  tab: { type: String, default: 'game' },
  disableSettle: { type: Boolean, default: false },
});
defineEmits(['change']);
</script>

<style lang="scss" scoped>
.tabs {
  flex-shrink: 0;
  display: flex;
  background: $card;
  border-bottom: 1px solid $border;
}
.tab {
  flex: 1;
  padding: 9px 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab.disabled { opacity: 0.4; }
.tab-icon { font-size: 16px; margin-bottom: 1px; }
.tab-label { font-size: 12px; font-weight: 600; color: $muted; }
.tab.active .tab-label { color: $gold; }
.tab.active {
  border-bottom: 2px solid $gold;
}
</style>
