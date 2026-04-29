<script setup>
import { onMounted } from "vue";
import { useRecords } from "../../../shared/composables/user-composables/recordsComposable.js";

const { getRecordsCurrent, userRecordsCurrent } = useRecords();


onMounted(async() => {
  await getRecordsCurrent();
})
</script>

<template>
  <section class="flex justify-center gap-32 py-18">
    <div class="flex flex-col gap-4 py-8 px-10 bg-white rounded-[10px] text-center shadow-xl">
      <span>Всего привычек</span>
      <span>{{ userRecordsCurrent?.allHabitsCounter }}</span>
    </div>
    <div class="flex flex-col gap-4 py-8 px-7 bg-white rounded-[10px] text-center shadow-xl">
      <span>Текущее в процессе</span>
      <span>{{ userRecordsCurrent?.inProgressHabitsCounter }}</span>
    </div>
    <div class="flex flex-col gap-4 py-8 px-8 bg-white rounded-[10px] text-center shadow-xl">
      <span>Всего выполненно</span>
      <span>{{ userRecordsCurrent?.completedHabitsCounter }}</span>
    </div>
  </section>
</template>

<style scoped>

</style>