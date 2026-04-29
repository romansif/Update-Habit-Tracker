<script setup>
import { onMounted } from "vue";

import { useHabits } from '../../shared/composables/user-composables/habitsComposable.js'
import { useGetHabits } from "../../shared/composables/user-composables/habitsComposable.js";


import HabitCard from "./habit-items/HabitCard.vue";
import DeleteHabitModal from "../../shared/ui/delete-modals/DeleteHabitModal.vue";

const { habits, deleteHabitModalVisible } = useHabits()
const { getHabits } = useGetHabits()

onMounted(async () => {
  await getHabits();
})

</script>

<template>
  <div class="pt-15">
    <div class="flex justify-center items-center">
      <span v-if="habits && habits.length === 0" class="text-2xl text-gray-200 italic">Нет привычек для отображения</span>
    </div>
    <div class="flex justify-center">
      <ul class="grid grid-cols-4 gap-15 overflow-y-auto h-[580px] no-scrollbar pt-15">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      </ul>
      <DeleteHabitModal v-show="deleteHabitModalVisible" />
    </div>
  </div>
</template>

<style scoped>

</style>