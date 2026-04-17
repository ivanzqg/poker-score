<template>
  <view class="card">
    <input
      class="input"
      v-model="name"
      placeholder="玩家名称"
      maxlength="10"
      style="margin-bottom: 8px;"
    />
    <view class="stepper-row">
      <text class="stepper-label">买入手数</text>
      <view class="stepper">
        <view class="stepper-btn" :class="{ disabled: hands <= 1 }" @tap="dec">
          <text class="stepper-btn-text">−</text>
        </view>
        <text class="stepper-val">{{ hands }}</text>
        <view class="stepper-btn" @tap="inc">
          <text class="stepper-btn-text">+</text>
        </view>
      </view>
      <text class="preview-tag">= {{ hands * chipsPerHand }}</text>
    </view>
    <view class="row">
      <button class="btn-gold flex1" @tap="onAdd">确认加入</button>
      <button class="btn-outline" @tap="$emit('cancel')">取消</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  chipsPerHand: { type: Number, default: 10000 },
});
const emit = defineEmits(['add', 'cancel']);

const name = ref('');
const hands = ref(1);

function inc() { hands.value++; }
function dec() { if (hands.value > 1) hands.value--; }

function onAdd() {
  emit('add', { name: name.value, hands: Number(hands.value) });
  name.value = '';
  hands.value = 1;
}
</script>

<style lang="scss" scoped>
.card {
  background: $card;
  border: 1px solid $border;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.input {
  background: $card2;
  border: 1px solid $border;
  border-radius: 8px;
  color: $text;
  padding: 8px 10px;
  font-size: 14px;
  width: 100%;
}
.stepper-row {
  display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
}
.stepper-label { font-size: 13px; color: $muted; flex-shrink: 0; }
.stepper {
  display: flex; align-items: center;
  border: 1px solid $border; border-radius: 8px; overflow: hidden;
}
.stepper-btn {
  width: 36px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: $card2;
}
.stepper-btn.disabled { opacity: 0.3; }
.stepper-btn-text { font-size: 18px; color: $text; font-weight: 600; }
.stepper-val {
  width: 44px; height: 32px; text-align: center; line-height: 32px;
  font-size: 15px; font-weight: 700; color: $gold; background: $card;
}
.preview-tag {
  font-size: 12px; color: $gold; flex: 1; text-align: right;
}
.row { display: flex; gap: 8px; align-items: center; }
.flex1 { flex: 1; }
.btn-gold {
  background: $gold; color: $card;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600;
  padding: 8px 14px;
}
.btn-outline {
  background: transparent; border: 1px solid $border; color: $muted;
  border-radius: 8px; font-size: 13px; font-weight: 600;
  padding: 8px 14px;
}
</style>
