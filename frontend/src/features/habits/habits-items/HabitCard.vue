<script setup>
import { useHabitsFilter } from "../../../shared/composables/filter/HabitsFilter.js";

import HabitMenu from "./HabitMenu.vue";
import HabitStatus from "./HabitStatus.vue";

const { isHabitLocked } = useHabitsFilter();

const props = defineProps({
  habit: {
    type: Object,
  }
})
</script>

<template>
  <li class="relative flex flex-col bg-white w-[340px] h-fit rounded-2xl p-4 shadow-md">
      <div class="flex flex-col">
        <div class="flex justify-between items-center text-sm">
        <span class="text-gray-700">
          {{ habit?.dateCreatedHabit }},
          {{ habit?.timeCreatedHabit }}
        </span>
          <HabitMenu :id="habit?.id" :status="habit?.status"/>
        </div>
        <div class="flex flex-col py-2">
          <h1 class="text-xl">
            {{ habit?.category }}
          </h1>
          <h2 class="text-lg w-60 px-5 break-all mt-2">
            {{ habit?.habit }}
          </h2>
          <span class="px-2 text-gray-500 mt-2">
          {{ habit?.frequency }} — {{ habit?.time }}
        </span>
        </div>
      </div>
      <div class="flex justify-between mt-2">
        <div class="flex gap-4">
          <div class="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">
            <span class="text-sm">🔥</span>
            <span class="font-semibold">
            {{ habit?.currentSeries }}
          </span>
          </div>
          <HabitStatus :status="habit?.status" />
        </div>
      </div>
    <div v-if="isHabitLocked(habit)" class="absolute inset-0 bg-black/45 backdrop-blur flex flex-col gap-5
           items-center justify-center rounded-2xl">
      <div class="bg-white/90 px-5 py-3 rounded-xl
             shadow-lg flex items-center gap-2">
        <span class="text-xl">🔒</span>
        <span class="font-medium text-gray-800">
          Привычка заблокирована
        </span>
      </div>
      <span class="font-medium text-white/70 text-center w-47 break-all">
        Что бы разблокировать выполните {{ habit?.linkedHabit }}
      </span>
    </div>
  </li>
</template>

<style scoped>

</style>