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
  <li class="h-[165px] w-[320px] bg-white p-4 rounded-xl shadow-xl flex flex-col">
    <div class="flex justify-between items-center text-lg mb-2  ">
      <h1 class="italic">{{ habit?.habit }}</h1>
      <p class="text-gray-500">
        {{ habit?.dateCreatedHabit }}, {{ habit?.timeCreatedHabit }}
      </p>
    </div>
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <p class="text-gray-500 text-md px-2">
          {{ habit?.frequency }}
        </p>
        <p class="text-gray-500 text-md px-2">{{ habit?.time }}</p>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <HabitStatus :status="habit?.status" />
      <HabitMenu :id="habit?.id" :status="habit?.status"/>
    </div>
  </li>
</template>

<style scoped>

</style>