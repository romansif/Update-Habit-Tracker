<script setup>
import { watch } from "vue";
import { useSearchingHabits } from "./composables/searchHabits.js";
import { useGetHabits } from "../habits/composables/getHabits.js";

import NavMenu from "./NavMenu.vue";
import NavSort from "./NavSort.vue";

import reset from '../../app/assets/icons/reset-search.png'

const { getHabits } = useGetHabits();
const { searchForm, debouncedSearch, resetSearchForm } = useSearchingHabits();

watch(() => searchForm.value.search, async (newValue) => {
  if(newValue) {
    await debouncedSearch();
  }else(
      await getHabits()
  )
})
</script>

<template>
  <nav class="bg-white flex items-center">
    <NavMenu />
    <div class="flex-1 flex justify-center">
      <div class="relative">
        <input v-model="searchForm.search" type="text" placeholder="Поиск" class="bg-gradient-to-b from-indigo-400 to-indigo-600
               w-[500px] placeholder:text-sm placeholder:text-white outline-none rounded-[4px] p-4 text-white shadow-xl">
        <img @click="resetSearchForm" v-if="searchForm.search" :src="reset" alt="search" class="w-[15px] h-[15px] absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer" />
      </div>
    </div>
    <NavSort />
  </nav>
</template>

<style scoped>

</style>