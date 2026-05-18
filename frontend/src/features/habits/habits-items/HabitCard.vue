<script setup>
import HabitMenu from "./HabitMenu.vue";
import HabitStatus from "./HabitStatus.vue";

const props = defineProps({
  habit: {
    type: Object,
  }
})
</script>

<template>
  <li class="flex flex-col bg-white w-[340px] h-fit rounded-lg p-4">
    <div class="flex flex-col">
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-700">
          {{ habit?.dateCreatedHabit }}, {{ habit?.timeCreatedHabit }}
        </span>
        <HabitMenu :id="habit?.id" :status="habit?.status"/>
      </div>
      <div class="flex flex-col mt-2">
        <h1 class="text-xl w-42 break-all">{{ habit?.habit }}</h1>
        <span class="px-2 text-gray-500 mt-2">{{ habit?.frequency }} — {{ habit?.time }}</span>
        <span class="px-2 text-gray-500"></span>
      </div>
    </div>
    <div class="flex justify-between mt-4">
      <div class="flex gap-4">
        <div class="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg">
          <span class="text-sm">🔥</span>
          <span class="font-semibold">{{ habit?.series }}</span>
        </div>
        <HabitStatus :status="habit?.status" />
      </div>
    </div>
  </li>
</template>

<style scoped>

</style>