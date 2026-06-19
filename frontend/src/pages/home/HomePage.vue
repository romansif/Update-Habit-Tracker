<script setup lang="ts">

</script>

<template>
  <section class="bg-white min-h-screen flex flex-col justify-center items-center text-center px-4">
    <h1 class="text-4xl md:text-6xl font-bold">
      Контролируй привычки — управляй жизнью
    </h1>
    <p class="text-gray-500 max-w-xl mt-8">
      Создавай полезные привычки, отслеживай прогресс и становись лучше каждый день.
    </p>
    <div class="flex gap-6 mt-14">
      <router-link :to="{ name: 'login' }" class="px-20 py-6 text-white rounded-lg bg-gradient-to-b
                        from-indigo-400 to-indigo-600 shadow-xl shadow-indigo-500/40
                        active:scale-95 transition">
        Войти
      </router-link>
      <router-link :to="{ name: 'register' }" class="px-6 py-6 text-white rounded-lg bg-gradient-to-b
                        from-indigo-400 to-indigo-600 shadow-xl shadow-indigo-500/40
                        active:scale-95 transition">
        Зарегестрироваться
      </router-link>
    </div>
  </section>
  <section class="py-20 px-6 bg-gray-200 text-center">
    <h2 class="text-3xl font-bold mb-10">Что ты можешь делать</h2>
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div class="p-6 bg-white rounded-xl shadow">
        <h3 class="font-semibold text-lg mb-2">Создавай привычки</h3>
        <p class="text-gray-500">Добавляй цели и задачи на каждый день</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow">
        <h3 class="font-semibold text-lg mb-2">Отслеживай прогресс</h3>
        <p class="text-gray-500">Смотри свою статистику и рост</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow">
        <h3 class="font-semibold text-lg mb-2">Будь мотивирован</h3>
        <p class="text-gray-500">Не теряй фокус и иди к цели</p>
      </div>
    </div>
    <div class="mt-20">
      <p class="text-2xl italic text-gray-700 max-w-2xl mx-auto">
        Маленькие шаги каждый день приводят к большим результатам
      </p>
    </div>
  </section>
  <footer class="bg-gray-500 py-6 text-center text-gray-300 text-sm">
    © 2026 Habit Tracker. Все права защищены.
  </footer>
</template>

<style scoped>

</style>