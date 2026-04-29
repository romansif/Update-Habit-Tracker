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
  <li class="h-[210px] w-[300px] bg-white p-6 rounded-xl shadow-xl flex flex-col">
    <div class="flex justify-between">
      <h1 class="text-lg italic">{{ habit?.category }}</h1>
      <p class="text-gray-500">
        {{ new Date(habit?.dateCreatedHabit).toLocaleDateString
          ("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
          })
        }}
      </p>
    </div>
    <div class="flex justify-between items-center py-2">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg">{{ habit?.habit }}</h2>
        <p class="text-gray-500 text-md px-2">{{ habit?.frequency }}</p>
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