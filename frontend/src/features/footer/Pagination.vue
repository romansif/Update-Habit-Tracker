<script setup>
import { usePagination } from "./composable/usePagination.js";

import BaseButton from "../../shared/ui/button/BaseButton.vue";

const { currentPage, totalPages, nextPage, prevPage } = usePagination();
</script>

<template>
    <div class="flex justify-center">
      <div class="fixed bottom-6">
        <div class="flex gap-26 items-center">
          <BaseButton @click="prevPage" button-type="Назад" variant="prevPage"/>
          <span class="text-lg text-gray-100 mt-5">Страница {{ currentPage }} из {{ totalPages }}</span>
          <BaseButton @click="nextPage" button-type="Вперед" variant="nextPage"/>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>