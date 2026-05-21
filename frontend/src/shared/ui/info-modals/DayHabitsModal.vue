<script setup>
import { useModals } from "../../composables/modal/useModals.js";
import { useRecordsStore } from "../../composables/store/recordsStore.js";

import BaseButton from '../button/BaseButton.vue';
import DayHabits from "../../../features/calendar/calendar-items/DayHabits.vue";
import options from '../../../app/assets/icons/options.svg'
import close from "../../../app/assets/icons/close.png";

const { dayHabitsRecords, resetDate } = useRecordsStore();
const { closeHabitsRecordsModal, openResetRecordsModal } = useModals();
</script>
<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
    <div class="bg-white rounded-lg p-3 w-[600px]">
      <div class="flex justify-end gap-2">
        <button @click="openResetRecordsModal
                            (
                            'DAY','историю выполнения привычек за день?','DAY'
                            )">
          <img :src="options" alt="" class="w-[18px] h-[20px]">
        </button>
        <img :src="close" alt="" class="w-[25px] h-[25px]" @click=closeHabitsRecordsModal />
      </div>
      <div class="px-3 py-4">
          <div class="mb-4">
            <h3 class="text-xl italic mt-1">Прогресс привычек за {{ resetDate }}</h3>
          </div>
          <transition-group name="list" tag="ul" class="flex flex-col max-h-[505px] overflow-y-auto no-scrollbar">
            <ul v-if="dayHabitsRecords?.length > 0" >
              <DayHabits />
            </ul>
            <span v-else class="italic text-gray-500 px-2">Пустой день</span>
          </transition-group>
        </div>
      </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.5s ease;
}
</style>