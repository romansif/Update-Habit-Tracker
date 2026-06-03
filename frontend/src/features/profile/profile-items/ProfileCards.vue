<script setup xmlns="http://www.w3.org/1999/html">
import { onMounted } from "vue";
import { useGetRecords } from "../../calendar/composables/getRecords.js";
import { useHabitsStore } from "../../../shared/composables/store/habitsStore.js";

const { habitsCount } = useHabitsStore();
const { getRecordsCurrent } = useGetRecords();

onMounted(async() => {
  await getRecordsCurrent();
})
</script>

<template>
  <div class="flex justify-between">
    <div class="flex flex-col gap-4 py-8 px-11.5 bg-white rounded-[10px] text-center shadow-xl">
        <span>Всего привычек</span>
        <span>{{ habitsCount?.allHabits }}</span>
    </div>
    <div class="flex flex-col gap-4 py-8 px-8.5 bg-white rounded-[10px] text-center shadow-xl">
        <span>Выполнено за день</span>
        <span>{{ habitsCount?.dayCompletedHabits }}</span>
    </div>
    <div class="flex flex-col gap-4 py-8 px-9 bg-white rounded-[10px] text-center shadow-xl">
        <span>Всего выполненно</span>
        <span>{{ habitsCount?.allCompletedHabits }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>