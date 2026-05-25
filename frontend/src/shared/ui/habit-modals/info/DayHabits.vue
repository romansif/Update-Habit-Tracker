<script setup>
import { useRecordsModals } from "../../../composables/modal/useModals.js";
import { useRecordsStore } from "../../../composables/store/recordsStore.js";

import DayHabits from "../../../../features/calendar/calendar-items/DayHabits.vue";
import options from '../../../../app/assets/icons/options.svg'
import close from "../../../../app/assets/icons/close.png";

const { dayHabitsRecords, resetDate } = useRecordsStore();
const { closeHabitsRecords, openResetRecords } = useRecordsModals();
</script>
<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-[600px]">
      <div class="flex flex-col">
        <div class="flex gap-4 items-center mb-4">
          <img :src="options" alt="" class="w-[18px]"
               @click="openResetRecords('DAY','историю выполнения привычек за день?','DAY')" />
          <h3 class="text-xl italic">Прогресс привычек за {{ resetDate }}</h3>
          <img :src="close" alt="" class="w-[25px] h-[25px] ml-auto" @click=closeHabitsRecords />
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