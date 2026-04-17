<template>
  <view class="restore-bar">
    <view class="ri">
      <text>🔄 检测到上次游戏记录</text>
      <text class="ri-small">{{ restoreInfo }}</text>
    </view>
    <button class="btn-gold btn-sm" @tap="$emit('restore')">恢复</button>
    <button class="btn-outline btn-sm" @tap="$emit('discard')">丢弃</button>
  </view>
</template>

<script setup>
defineProps({
  restoreInfo: { type: String, default: '' },
});
defineEmits(['restore', 'discard']);
</script>

<style lang="scss" scoped>
.restore-bar {
  background: #1a3d28;
  border: 1px solid $gold;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.ri { flex: 1; font-size: 12px; }
.ri-small { color: $muted; display: block; font-size: 11px; }
.btn-gold {
  background: $gold; color: $card;
  border: none; border-radius: 8px;
  font-size: 12px; font-weight: 600;
  padding: 6px 10px;
}
.btn-outline {
  background: transparent;
  border: 1px solid $border;
  color: $muted;
  border-radius: 8px;
  font-size: 12px; font-weight: 600;
  padding: 6px 10px;
}
</style>
