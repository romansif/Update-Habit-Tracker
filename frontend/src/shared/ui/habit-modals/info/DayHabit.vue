<script setup>
import { useRecordsModals } from "../../../composables/modal/useModals.js";
import { useRecordsStore } from "../../../composables/store/recordsStore.js";


import close from "../../../../app/assets/icons/close.png";
import DayHabit from "../../../../features/habits/habit-calendar/DayHabit.vue";

const { closeHabitRecords } = useRecordsModals();
const { dayHabitRecords, resetDate } = useRecordsStore();
</script>
<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-[600px]">
      <div class="flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl italic mt-1">Прогресс привычек за {{ resetDate }}</h3>
          <img :src="close" alt="" class="w-[25px] h-[25px]" @click=closeHabitRecords />
        </div>
        <transition-group name="list" tag="ul" class="flex flex-col max-h-[505px] overflow-y-auto no-scrollbar">
          <ul v-if="dayHabitRecords?.length > 0" >
            <DayHabit />
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