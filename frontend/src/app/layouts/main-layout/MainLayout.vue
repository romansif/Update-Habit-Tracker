<script setup>
import { onMounted } from 'vue';
import { useRecords } from "../../../features/calendar/composables/useRecords.js";

const { resetHabitsCurrent } = useRecords();

onMounted(async () => {
  await resetHabitsCurrent();
})
</script>

<template>
<router-view />
</template>

<style scoped>

</style>