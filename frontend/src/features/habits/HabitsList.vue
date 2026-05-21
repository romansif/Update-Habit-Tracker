<script setup>
import { useQuery } from "@tanstack/vue-query";

import { useGetHabits } from "./composables/getHabits.js";
import { usePagination } from "../footer/composable/usePagination.js"
import { useModalsStore } from "../../shared/composables/store/modalsStore.js";
import { useHabitsStore } from "../../shared/composables/store/habitsStore.js";

import Pagination from "../footer/Pagination.vue";
import HabitCard from "./habits-items/HabitCard.vue";
import HabitCalendar from "./habit-calendar/HabitCalendar.vue";
import HabitInfo from "../../shared/ui/info-modals/HabitInfo.vue";
import DeleteHabit from "../../shared/ui/delete-modals/DeleteHabit.vue";
import DayHabitModal from "../../shared/ui/info-modals/DayHabitModal.vue";

const { habits } = useHabitsStore()
const { getHabits } = useGetHabits()
const { paginatedItems } = usePagination()
const { habitInfoModalVisible, deleteHabitModalVisible, calendarModalVisible, habitRecordsModalVisible } = useModalsStore()

const { isPending, isError, error } = useQuery({
  queryKey: ['habits'],
  queryFn: getHabits
})
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
  <div v-else class="flex justify-center pt-10">
    <transition-group name="list" tag="ul" class="grid grid-cols-4 gap-9">
        <HabitCard v-for="habit in paginatedItems" :key="habit.id" :habit="habit" />
    </transition-group>
  </div>
  <Pagination v-if="habits && habits.length > 0"/>
  <transition name="modal" >
    <HabitInfo v-show="habitInfoModalVisible" />
  </transition>
  <transition name="modal">
    <HabitCalendar v-show="calendarModalVisible"/>
  </transition>
  <transition name="modal">
    <DayHabitModal v-show="habitRecordsModalVisible" />
  </transition>
  <transition name="modal">
    <DeleteHabit v-show="deleteHabitModalVisible" />
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