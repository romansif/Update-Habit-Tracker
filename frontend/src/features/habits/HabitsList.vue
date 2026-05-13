<script setup>
import { onMounted } from "vue";

import { useHabits } from './composables/useHabits.js'
import { useGetHabits } from "./composables/getHabits.js";

import HabitCard from "./habits-items/HabitCard.vue";
import DeleteHabitModal from "../../shared/ui/delete-modals/DeleteHabitModal.vue";
import HabitInfoModal from "../../shared/ui/info-modals/HabitInfoModal.vue";

const { habits, habitInfoModalVisible, deleteHabitModalVisible } = useHabits()
const { getHabits } = useGetHabits()

onMounted(async () => {
  await getHabits();
})

</script>

<template>
    <div class="flex justify-center items-center">
      <span v-if="habits && habits.length === 0" class="text-2xl text-gray-200 italic pt-15">Нет привычек для отображения</span>
    </div>
    <div class="flex justify-center px-15">
      <ul class="grid grid-cols-4 gap-15 overflow-y-auto h-[580px] no-scrollbar pt-15">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      </ul>
      <HabitInfoModal v-show="habitInfoModalVisible" />
      <DeleteHabitModal v-show="deleteHabitModalVisible" />
    </div>
</template>

<style scoped>

</style>