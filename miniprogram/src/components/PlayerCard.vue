<template>
  <view class="player-card" :class="{ settling: isSettling }">
    <view class="player-head">
      <view class="avatar">
        <text class="avatar-text">{{ player.name.charAt(0).toUpperCase() }}</text>
      </view>
      <text class="pname">{{ player.name }}</text>
      <text v-if="player.pnl != null" class="pnl" :class="pnlClass">
        {{ player.pnl > 0 ? '+' : '' }}{{ player.pnl }}
      </text>
      <button v-if="!settled" class="btn-primary btn-sm" @tap="showBuyIn = !showBuyIn">追加</button>
      <button class="btn-light btn-sm" @tap="$emit('remove', player.id)">移除</button>
    </view>
    <view class="pstats">
      <text>买入：<text class="b">{{ player.totalBuyIn }}</text></text>
      <text>共 <text class="b">{{ player.buyHands }}</text> 手</text>
      <text>次数：<text class="b">{{ player.buyCount }}</text></text>
      <text v-if="player.remaining != null">剩余：<text class="b">{{ player.remaining }}</text></text>
    </view>

    <!-- 追加买入展开区 -->
    <view class="buyin-panel" v-if="showBuyIn && !settled">
      <view class="stepper-row">
        <text class="stepper-label">追加手数</text>
        <view class="stepper">
          <view class="stepper-btn" :class="{ disabled: buyHands <= 1 }" @tap="decBuy">
            <text class="stepper-btn-text">−</text>
          </view>
          <text class="stepper-val">{{ buyHands }}</text>
          <view class="stepper-btn" @tap="incBuy">
            <text class="stepper-btn-text">+</text>
          </view>
        </view>
        <text class="preview-tag">= {{ buyHands * chipsPerHand }}</text>
      </view>
      <view class="buyin-actions">
        <button class="btn-gold flex1" @tap="onBuyIn">确认追加</button>
        <button class="btn-outline-sm" @tap="showBuyIn = false">取消</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  player: { type: Object, required: true },
  isSettling: { type: Boolean, default: false },
  settled: { type: Boolean, default: false },
  chipsPerHand: { type: Number, default: 10000 },
});
const emit = defineEmits(['remove', 'buyIn']);

const showBuyIn = ref(false);
const buyHands = ref(1);

const pnlClass = computed(() => {
  if (props.player.pnl > 0) return 'pos';
  if (props.player.pnl < 0) return 'neg';
  return 'zero';
});

function incBuy() { buyHands.value++; }
function decBuy() { if (buyHands.value > 1) buyHands.value--; }

function onBuyIn() {
  props.player.buyInputHands = buyHands.value;
  emit('buyIn', props.player);
  buyHands.value = 1;
  showBuyIn.value = false;
}
</script>

<style lang="scss" scoped>
.player-card {
  background: $card2;
  border: 1px solid $border;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.player-card.settling { border-color: $gold; }
.player-head { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: $green; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.avatar-text { font-size: 14px; font-weight: 700; color: $gold; }
.pname { flex: 1; font-size: 15px; font-weight: 600; color: $text; }
.pnl {
  font-size: 14px; font-weight: 700; padding: 2px 6px; border-radius: 6px;
}
.pnl.pos { color: #4caf50; background: rgba(76,175,80,.12); }
.pnl.neg { color: #ef5350; background: rgba(239,83,80,.12); }
.pnl.zero { color: $muted; background: rgba(255,255,255,.06); }
.pstats {
  display: flex; gap: 10px; font-size: 11px; color: $muted;
  flex-wrap: wrap;
}
.b { color: $text; font-weight: 700; }
.btn-sm { padding: 5px 10px; font-size: 12px; font-weight: 600; border-radius: 6px; border: none; flex-shrink: 0; }
.btn-primary { background: $green-light; color: #fff; }
.btn-light { background: transparent; border: 1px solid $border; color: $muted; }

/* 追加买入面板 */
.buyin-panel {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid $border;
}
.stepper-row {
  display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
}
.stepper-label { font-size: 12px; color: $muted; flex-shrink: 0; }
.stepper {
  display: flex; align-items: center; gap: 0;
  border: 1px solid $border; border-radius: 8px; overflow: hidden;
}
.stepper-btn {
  width: 34px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: $card;
}
.stepper-btn.disabled { opacity: 0.3; }
.stepper-btn-text { font-size: 18px; color: $text; font-weight: 600; }
.stepper-val {
  width: 40px; height: 30px; text-align: center; line-height: 30px;
  font-size: 14px; font-weight: 700; color: $gold; background: $card2;
}
.preview-tag {
  font-size: 12px; color: $gold; flex: 1; text-align: right;
}
.buyin-actions { display: flex; gap: 8px; }
.btn-gold {
  background: $gold; color: $card;
  border: none; border-radius: 8px;
  font-size: 12px; font-weight: 600; padding: 7px 14px;
}
.btn-outline-sm {
  background: transparent; border: 1px solid $border; color: $muted;
  border-radius: 8px; font-size: 12px; font-weight: 600; padding: 7px 14px;
}
.flex1 { flex: 1; }
</style>
