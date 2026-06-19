<script setup lang="ts">
import { onMounted } from 'vue';
import { useRecords } from "../../../features/calendar/composables/useRecords";

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