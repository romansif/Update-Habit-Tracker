<script setup>
import { onMounted } from 'vue';
import { useRecords } from "../../../features/calendar/composables/useRecords.js";

const { resetHabitsCurrentCount } = useRecords();

onMounted(async () => {
  await resetHabitsCurrentCount();
})
</script>

<template>
<router-view />
</template>

<style scoped>

</style>