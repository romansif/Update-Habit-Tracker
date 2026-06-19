<script setup lang="ts">
import { useRoute } from "vue-router";
import { watchEffect } from "vue";
import { useQuery } from "@tanstack/vue-query";

import { useGetHabits } from "./composables/getHabits";
import { useHabitModals } from "../../shared/composables/modal/habitModals";
import { useHabitsStore } from "../../shared/composables/store/habitsStore";

import HabitCard from "./habits-items/HabitCard.vue";

const modal = useHabitModals()
const route = useRoute();

const { getFilteredHabits } = useGetHabits()
const { habits, totalPages } = useHabitsStore()

const { data: serverResponse, isPending, isError, error } = useQuery({
  queryKey: [String(route.name ?? '')],

  queryFn: async () => {
    const routeName = route.name ? String(route.name) : ''
    const res = await getFilteredHabits(routeName);
    if (res?.rollBack?.length > 0) {
      Array.isArray(res.rollBack) &&
          res.rollBack.forEach(habitName => {
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
    <span class="text-2xl text-gray-200 italic">Error {{ error.value?.message }}</span>
  </div>
  <div v-else-if="habits && habits.length === 0" class="flex justify-center items-center">
      <span class="text-2xl text-gray-200 italic pt-15">Нет привычек для отображения</span>
  </div>
  <div v-else class="flex justify-center pt-20">
    <transition-group name="list" tag="ul" class="grid grid-cols-4 gap-9">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
    </transition-group>
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