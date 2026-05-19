<script setup>
import HabitMenu from "./HabitMenu.vue";
import HabitStatus from "./HabitStatus.vue";

const props = defineProps({
  habit: {
    type: Object,
  }
})

console.log(props.habit)
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
      <div class="flex flex-col py-2">
        <h1 class="text-xl">{{ habit?.category }}</h1>
        <h2 class="text-lg w-60 px-5 break-all mt-2">{{ habit?.habit }}</h2>
        <span class="px-2 text-gray-500 mt-2">{{ habit?.frequency }} — {{ habit?.time }}</span>
        <span class="px-2 text-gray-500"></span>
      </div>
    </div>
    <div class="flex justify-between mt-2">
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