<script setup>
import { useRoute } from "vue-router";
import { computed, watchEffect } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { useGetHabits } from "./composables/getHabits.js";
import { useHabitModals } from "../../shared/composables/modal/useModals.js";
import { useModalsStore } from "../../shared/composables/store/modalsStore.js";
import { useHabitsStore } from "../../shared/composables/store/habitsStore.js";

import Pagination from "../footer/Pagination.vue";
import HabitCard from "./habits-items/HabitCard.vue";
import HabitCalendar from "./habit-calendar/HabitCalendar.vue";
import HabitInfo from "../../shared/ui/habit-modals/info/HabitInfo.vue";
import DeleteHabit from "../../shared/ui/habit-modals/DeleteHabit.vue";
import DayHabit from "../../shared/ui/habit-modals/info/DayHabit.vue";
import DeleteRecords from "../../shared/ui/records-modals/DeleteRecords.vue";
import RollbackSeries from "../../shared/ui/habit-modals/restore/RollbackSeries.vue";
import RestoreSeries from "../../shared/ui/habit-modals/restore/RestoreSeries.vue";

const modal = useHabitModals()
const route = useRoute();

const { getFilteredHabits } = useGetHabits()
const { habits, totalPages } = useHabitsStore()
const { habitInfoVisible, deleteHabitVisible, calendarVisible, habitRecordsVisible,
  resetRecordsVisible, rollbackSeriesVisible, restoreSeriesVisible
} = useModalsStore()

const { data: serverResponse, isPending, isError, error } = useQuery({
  queryKey: computed(() => [
      route.name
  ]),

  queryFn: async () => {
    const res = await getFilteredHabits(route.name);
    if (res?.rolledBackHabits?.length > 0) {
          res.rolledBackHabits.forEach(habitName => {
          modal.openRollBackSeries(habitName);
      });
    }
    return res || { data: [], totalPages: 1 };
  }
});

watchEffect(() => {
  if (serverResponse.value) {
    habits.value = serverResponse.value.data || [];
    totalPages.value = serverResponse.value.totalPages || 1;
  }
});
</script>

<template>
  <div v-if="isPending" class="flex justify-center items-center h-[700px]">
    <img src="../../app/assets/icons/loading.svg" alt="" class="w-[120px] h-[120px]">
  </div>
  <div v-else-if="isError" class="flex justify-center items-center h-[700px]">
    <span class="text-2xl text-gray-200 italic">Error {{ error.message }}</span>
  </div>
  <div v-else-if="habits && habits.length === 0" class="flex justify-center items-center">
      <span class="text-2xl text-gray-200 italic pt-15">Нет привычек для отображения</span>
  </div>
  <div v-else class="flex justify-center pt-20">
    <transition-group name="list" tag="ul" class="grid grid-cols-4 gap-9">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
    </transition-group>
  </div>
  <Pagination v-if="habits && habits.length > 0"/>
  <transition name="modal" >
    <HabitInfo v-show="habitInfoVisible" />
  </transition>
  <transition name="modal">
    <HabitCalendar v-show="calendarVisible"/>
  </transition>
  <transition name="modal">
    <DayHabit v-show="habitRecordsVisible" />
  </transition>
  <transition name="modal">
    <DeleteRecords v-show="resetRecordsVisible"/>
  </transition>
  <transition name="modal">
    <DeleteHabit v-show="deleteHabitVisible" />
  </transition>
  <transition name="modal">
    <RollbackSeries v-show="rollbackSeriesVisible" />
  </transition>
  <transition name="modal">
    <RestoreSeries v-show="restoreSeriesVisible" />
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

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