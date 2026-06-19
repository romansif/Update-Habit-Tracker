<script setup lang="ts">
const props = defineProps({
  status: {
    type: String,
  }
})
</script>

<template>
  <p class="italic text-sm px-2 py-1.5 rounded"
     :class="
     {
       'bg-green-500 text-white': status === 'Выполнено',
       'bg-purple-500 text-white': status === 'В процессе',
       'bg-rose-500 text-white': status === 'Не выполнено'
     }">
    {{ status }}
  </p>
</template>

<style scoped>

</style>