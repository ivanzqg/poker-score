<template>
  <view class="container">
    <TopBar
      :playerCount="players.length"
      :totalChips="totalChips"
      :phaseLabel="phaseLabel"
      :settled="settled"
      :tab="tab"
      :disableSettle="players.length < 2"
      :navBarInfo="navBarInfo"
      @changeTab="onChangeTab"
    />

    <!-- 游戏 Tab -->
    <scroll-view v-if="tab === 'game'" scroll-y class="page">
      <RestoreBar
        v-if="showRestore"
        :restoreInfo="restoreInfo"
        @restore="restoreGame"
        @discard="discardRestore"
      />

      <AddPlayerPanel
        v-if="showAddPanel"
        :chipsPerHand="chipsPerHand"
        @add="onAddPlayer"
        @cancel="showAddPanel = false"
      />

      <view v-if="players.length === 0 && !showAddPanel" class="empty">
        <text>还没有玩家，点击上方「添加玩家」开始</text>
      </view>

      <PlayerCard
        v-for="p in players"
        :key="p.id"
        :player="p"
        :isSettling="isSettling"
        :settled="settled"
        :chipsPerHand="chipsPerHand"
        @remove="removePlayer"
        @buyIn="buyIn"
      />

      <view class="row mt4" v-if="settled">
        <button class="btn-gold flex1" @tap="showResult = true">查看结果</button>
        <button class="btn-outline" @tap="newGame">新局</button>
      </view>
    </scroll-view>

    <!-- 结算 Tab -->
    <scroll-view v-if="tab === 'settle'" scroll-y class="page">
      <view class="card">
        <SettleChecker
          :totalChips="totalChips"
          :filledTotal="filledTotal"
          :chipDiff="chipDiff"
          :progPct="progPct"
          :progClass="progClass"
          :checkerState="checkerState"
          :checkerMsg="checkerMsg"
        />

        <SettleInputRow
          v-for="p in players"
          :key="p.id"
          :player="p"
        />

        <view class="row mt10">
          <button class="btn-gold flex1" :disabled="chipDiff !== 0 || filledTotal === 0" @tap="calcSettle">计算结果</button>
          <button class="btn-outline" @tap="tab = 'game'">返回</button>
        </view>
      </view>
    </scroll-view>

    <!-- 记录 Tab -->
    <scroll-view v-if="tab === 'log'" scroll-y class="page">
      <view class="card">
        <ActionLog :logs="actionLogs" />
      </view>
    </scroll-view>

    <!-- 设置 Tab -->
    <scroll-view v-if="tab === 'config'" scroll-y class="page">
      <view class="card">
        <text class="section-hint">设置每手筹码数，买入和追加时输入手数自动换算</text>
        <view class="row">
          <text class="config-label">每手筹码数</text>
          <input
            class="input w80"
            :value="chipsPerHand"
            @input="onChipsPerHandChange"
            type="number"
          />
        </view>
        <text class="config-info">当前：1手 = <text style="color: #f5c518; font-weight: 700;">{{ chipsPerHand }}</text> 筹码</text>
      </view>
      <view class="card">
        <button class="btn-danger full" @tap="resetGame">重置当前游戏</button>
      </view>
    </scroll-view>

    <!-- 结果弹窗 -->
    <ResultModal
      v-if="showResult"
      :sortedPlayers="sortedPlayers"
      :transfers="transfers"
      @close="showResult = false"
      @newGame="newGame"
    />
  </view>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue';
import ActionLog from '@/components/ActionLog.vue';
import RestoreBar from '@/components/RestoreBar.vue';
import AddPlayerPanel from '@/components/AddPlayerPanel.vue';
import PlayerCard from '@/components/PlayerCard.vue';
import SettleChecker from '@/components/SettleChecker.vue';
import SettleInputRow from '@/components/SettleInputRow.vue';
import ResultModal from '@/components/ResultModal.vue';
import { useGameState } from '@/composables/useGameState';
import { useSettlement } from '@/composables/useSettlement';
import { getNavBarInfo } from '@/utils/navbar';

const navBarInfo = getNavBarInfo();

const {
  tab, players, settled, chipsPerHand, newName, newHands,
  showAddPanel, showResult, showRestore, restoreInfo, actionLogs,
  totalChips, phaseLabel, isSettling,
  persistState, restoreGame, discardRestore,
  addPlayer, removePlayer, buyIn, calcSettle, resetGame, newGame,
} = useGameState();

const {
  filledTotal, chipDiff, progPct, progClass,
  checkerState, checkerMsg, sortedPlayers, transfers,
} = useSettlement(players, totalChips);

function onChangeTab(t) {
  if (t === 'game') {
    if (tab.value === 'game') {
      // 已在玩家页，点击按钮切换添加面板
      showAddPanel.value = !showAddPanel.value;
    }
    // 从其他 tab 切回时不打开面板
  } else {
    showAddPanel.value = false;
  }
  tab.value = t;
}

function onAddPlayer({ name, hands }) {
  newName.value = name;
  newHands.value = hands;
  addPlayer();
}

function onChipsPerHandChange(e) {
  chipsPerHand.value = Number(e.detail.value) || 10000;
  persistState();
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: $bg;
}
.page {
  flex: 1;
  padding: 12px;
  padding-bottom: 24px;
}
.card {
  background: $card;
  border: 1px solid $border;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.section-hint { font-size: 11px; color: $muted; margin-bottom: 8px; display: block; }
.empty { text-align: center; color: $muted; padding: 30px 0; font-size: 13px; }
.row { display: flex; gap: 8px; align-items: center; }
.mt4 { margin-top: 4px; }
.mt10 { margin-top: 10px; }
.flex1 { flex: 1; }
.full { width: 100%; }

.input {
  background: $card2; border: 1px solid $border; border-radius: 8px;
  color: $text; padding: 8px 10px; font-size: 14px;
}
.w80 { width: 80px; flex-shrink: 0; }
.config-label { font-size: 13px; color: $muted; white-space: nowrap; }
.config-info { margin-top: 8px; font-size: 12px; color: $muted; display: block; }

.btn-gold {
  background: $gold; color: $card;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600; padding: 8px 14px;
}
.btn-danger {
  background: $red; color: #fff;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600; padding: 8px 14px;
}
.btn-outline {
  background: transparent; border: 1px solid $border; color: $muted;
  border-radius: 8px; font-size: 13px; font-weight: 600; padding: 8px 14px;
}
button:disabled { opacity: 0.35; }
</style>
