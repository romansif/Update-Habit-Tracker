<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const route = useRoute()

const isProfilePage = computed(() => route.name !== 'profile')
const isAllHabitsPage = computed(() => route.name !== 'habits')
const isDayCompletedHabitsPage = computed(() => route.name !== 'day-completed-habits')
const isAllCompletedHabitsPage = computed(() => route.name !== 'all-completed-habits')
const isInProgressHabitsPage = computed(() => route.name !== 'in-progress-habits')
const isIncompletedHabitsPage = computed(() => route.name !== 'incompleted-habits')
const isCalendarPage = computed(() => route.name !== 'calendar')
</script>

<template>
  <Menu as="div" class="relative inline-block p-6">
    <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white rounded-lg
                                bg-gradient-to-b from-indigo-400 to-indigo-600 shadow-xl
                                shadow-indigo-500/40 active:scale-95 transition py-4 px-6 text-sm font-semibold
                                text-white inset-ring-1 inset-ring-white/5 hover:bg-gray-500">
      Вкладки
      <ChevronDownIcon class="-mr-1 size-5 text-white" aria-hidden="true" />
    </MenuButton>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute z-10 mt-2 w-51 origin-top-right divide-y divide-white/40 rounded-md bg-indigo-400 outline-1 -outline-offset-1 outline-white/10">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <router-link :to="{ name: 'profile' }">
                <span v-if="isProfilePage" :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Профиль
                </span>
            </router-link>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <router-link :to="{ name: 'calendar' }">
                <span v-if="isCalendarPage" :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Календарь
                </span>
            </router-link>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <router-link :to="{ name: 'habits' }">
                <span v-if="isAllHabitsPage" :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Все привычки
                </span>
            </router-link>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <router-link :to="{ name: 'all-completed-habits' }">
                <span v-if="isAllCompletedHabitsPage" :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Выполненые за все время
                </span>
            </router-link>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <router-link :to="{ name: 'day-completed-habits' }">
                <span v-if="isDayCompletedHabitsPage" :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Выполненые за сегодня
                </span>
            </router-link>
          </MenuItem>
        </div>
          <MenuItem v-slot="{ active }">
            <router-link :to="{ name: 'in-progress-habits' }">
                <span v-if="isInProgressHabitsPage" :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    В процессе
                </span>
            </router-link>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <router-link :to="{ name: 'incompleted-habits' }">
                <span v-if="isIncompletedHabitsPage" :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Не выполненые
                </span>
            </router-link>
          </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>