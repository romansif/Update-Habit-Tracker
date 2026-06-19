<script setup lang="ts">
import { watch } from 'vue'
import { usePagination } from "./composable/pagination";
import { useGetHabits } from "../habits/composables/getHabits";
import { useHabitsStore } from "../../shared/composables/store/habitsStore";

import BaseButton from "../../shared/ui/button/BaseButton.vue";

const { prevPage, nextPage } = usePagination();
const { getFilteredHabits } = useGetHabits()
const { currentPage, totalPages } = useHabitsStore();

watch(currentPage, async () => {
  await getFilteredHabits()
})
</script>

<template>
    <div class="flex justify-center">
      <div class="fixed bottom-6">
        <div class="flex gap-26 items-center">
          <BaseButton v-if="totalPages > 1" @click="prevPage" button-type="Назад" variant="prevPage"/>
          <span class="text-lg text-gray-100 mt-5">Страница {{ currentPage }} из {{ totalPages }}</span>
          <BaseButton v-if="totalPages > 1" @click="nextPage" button-type="Вперед" variant="nextPage"/>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>