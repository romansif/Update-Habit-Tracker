<script setup>
import { useGetRecords } from "../../../features/calendar/composables/getRecords.js";
import { useRecords } from "../../../features/calendar/composables/useRecords.js";

import BaseButton from '../BaseButton.vue';
import DayRecords from "../../../features/calendar/calendar-items/DayRecords.vue";
import options from '../../../app/assets/icons/options.png'

const { resetDate, closeRecordsModal } = useGetRecords();
const { dayRecords, openResetRecordsModal } = useRecords();
</script>
<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-[600px]">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl italic mt-1">Прогресс привычек за {{ resetDate }}</h3>
        <button @click="openResetRecordsModal
                        (
                        'Day','историю выполнения привычек за день?','DAY'
                        )">
          <img :src="options" alt="" class="w-[30px] h-[30px]">
        </button>
      </div>
      <transition-group name="list" class="list">
        <ul v-if="dayRecords?.length > 0" class="flex flex-col max-h-[505px] overflow-y-auto no-scrollbar">
          <DayRecords />
        </ul>
        <span v-else class="italic text-gray-500">Пустой день</span>
      </transition-group>
      <div class="flex">
        <BaseButton button-type="Закрыть" variant="closeHabitsInDay" @click=closeRecordsModal />
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