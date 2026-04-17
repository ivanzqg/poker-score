<template>
  <view class="header" :style="{ paddingTop: navBarInfo.top + 'px' }">
    <!-- 第一行：App 名称居中 -->
    <view class="title-row" :style="{ height: navBarInfo.height + 'px' }">
      <text class="title">🃏 扑克筹码记分</text>
    </view>

    <!-- 第二行：状态信息 -->
    <view class="status-row">
      <view class="stat">
        <text class="stat-v">{{ playerCount }}</text>
        <text class="stat-l">玩家</text>
      </view>
      <view class="stat">
        <text class="stat-v">{{ totalChips }}</text>
        <text class="stat-l">总筹码</text>
      </view>
      <view class="badge" :class="{ gold: settled }">
        <text class="badge-text" :class="{ 'badge-text-gold': settled }">{{ phaseLabel }}</text>
      </view>
    </view>

    <!-- 第三行：操作按钮 -->
    <view class="action-row">
      <view class="action-btn" :class="{ active: tab === 'game' }" @tap="$emit('changeTab', 'game')">
        <text class="action-text">{{ tab === 'game' ? '➕ 添加' : '🎮 玩家' }}</text>
      </view>
      <view
        class="action-btn"
        :class="{ active: tab === 'settle', disabled: disableSettle }"
        @tap="!disableSettle && $emit('changeTab', 'settle')"
      >
        <text class="action-text">🏆 结算</text>
      </view>
      <view class="action-btn" :class="{ active: tab === 'log' }" @tap="$emit('changeTab', 'log')">
        <text class="action-text">📋 记录</text>
      </view>
      <view class="action-btn" :class="{ active: tab === 'config' }" @tap="$emit('changeTab', 'config')">
        <text class="action-text">⚙️ 设置</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  playerCount: { type: Number, default: 0 },
  totalChips: { type: Number, default: 0 },
  phaseLabel: { type: String, default: '' },
  settled: { type: Boolean, default: false },
  tab: { type: String, default: 'game' },
  disableSettle: { type: Boolean, default: false },
  navBarInfo: { type: Object, default: () => ({ top: 0, height: 0 }) },
});
defineEmits(['changeTab']);
</script>

<style lang="scss" scoped>
.header {
  flex-shrink: 0;
  background: $card;
  border-bottom: 1px solid $border;
}

/* 标题行 */
.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 17px;
  color: $gold;
  font-weight: 700;
  letter-spacing: 1px;
}

/* 状态行 */
.status-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 6px 14px;
}
.stat {
  display: flex;
  align-items: baseline;
  gap: 3px;
}
.stat-v { font-size: 14px; font-weight: 700; color: $gold; }
.stat-l { font-size: 10px; color: $muted; }
.badge {
  padding: 2px 8px;
  border-radius: 10px;
  background: $green;
}
.badge.gold { background: $gold; }
.badge-text { font-size: 11px; font-weight: 600; color: #fff; }
.badge-text-gold { color: $card; }

/* 按钮行 */
.action-row {
  display: flex;
  gap: 8px;
  padding: 0 14px 10px;
}
.action-btn {
  flex: 1;
  text-align: center;
  padding: 7px 0;
  border-radius: 8px;
  background: $card2;
  border: 1px solid $border;
}
.action-btn.active {
  background: $green;
  border-color: $green-light;
}
.action-btn.disabled {
  opacity: 0.4;
}
.action-text {
  font-size: 12px;
  font-weight: 600;
  color: $text;
}
</style>
