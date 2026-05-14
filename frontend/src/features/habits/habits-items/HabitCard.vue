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
    <div class="flex justify-between">
      <h1 class="text-xl w-36 break-all">{{ habit?.habit }}</h1>
      <p class="text-lg text-gray-700">
        {{ habit?.dateCreatedHabit }}, {{ habit?.timeCreatedHabit }}
      </p>
    </div>
    <div class="flex flex-col mt-4 text-gray-500 px-2">
      <p>
          {{ habit?.frequency }}
      </p>
      <p>{{ habit?.time }}</p>
    </div>
    <div class="flex justify-between mt-4">
      <HabitStatus :status="habit?.status" />
      <HabitMenu :id="habit?.id" :status="habit?.status"/>
    </div>
  </li>
</template>

<style scoped>

</style>