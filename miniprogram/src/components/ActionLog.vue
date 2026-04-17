<template>
  <view v-if="reversedLogs.length === 0" class="empty">
    <text>暂无操作记录</text>
  </view>
  <view v-for="(log, i) in reversedLogs" :key="i" class="log-item">
    <text class="log-time">{{ formatTime(log.time) }}</text>
    <text class="log-text">{{ log.text }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { formatTime } from '@/utils/helpers';

const props = defineProps({
  logs: { type: Array, default: () => [] },
});

const reversedLogs = computed(() => [...props.logs].reverse());
</script>

<style lang="scss" scoped>
.empty { text-align: center; color: $muted; padding: 30px 0; font-size: 13px; }
.log-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid $border;
}
.log-item:last-child { border-bottom: none; }
.log-time {
  font-size: 12px;
  color: $muted;
  flex-shrink: 0;
  font-family: monospace;
}
.log-text {
  font-size: 13px;
  color: $text;
  flex: 1;
}
</style>
