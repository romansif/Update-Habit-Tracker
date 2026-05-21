<script setup>
import { useModals } from "../../composables/modal/useModals.js";
import { useRecordsStore } from "../../composables/store/recordsStore.js";

import DayHabit from "../../../features/habits/habit-calendar/DayHabit.vue";
import close from "../../../app/assets/icons/close.png";

const { closeHabitRecordsModal } = useModals();
const { dayHabitRecords, resetDate } = useRecordsStore();
</script>
<template>
  <div class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                      flex items-center justify-center">
    <div class="bg-white rounded-lg p-3 w-[600px]">
      <div class="flex">
        <img :src="close" alt="" class="w-[25px] h-[25px] ml-auto" @click=closeHabitRecordsModal />
      </div>
      <div class="px-3">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl italic mt-1">Прогресс привычек за {{ resetDate }}</h3>
        </div>
        <span v-if="dayHabitRecords && dayHabitRecords.length < 0" class="italic text-gray-500">Пустой день</span>
        <transition-group name="list" tag="ul">
          <DayHabit :dayHabitRecords="dayHabitRecords"/>
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