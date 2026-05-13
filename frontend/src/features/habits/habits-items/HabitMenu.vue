<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHabits } from "../composables/useHabits.js";

const { openInfoModal, openDeleteHabitModal, updateStatus } = useHabits()

const route = useRoute()

const props = defineProps({
  status: {
    type: String,
  },
  id: {
    type: String,
  }
})

const isCompletedHabitsPage = computed(() => route.name !== 'completed-habits')
const isinProgressHabitsPage = computed(() => route.name !== 'in-progress-habits')

const canAddInCompletedHabits = computed(() => props.status !== 'Выполнено')
const canAddInProgressHabits = computed(() => props.status !== 'В процессе' && props.status !== 'Выполнено')
</script>

<template>
  <Menu as="div" class="relative inline-block">
    <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white rounded-lg
                                bg-gradient-to-b from-indigo-400 to-indigo-600 shadow-lg
                                shadow-indigo-500/40 active:scale-95 transition p-2 text-sm font-semibold
                                text-white inset-ring-1 inset-ring-white/5 hover:bg-gray-500">
      Добавить
      <ChevronDownIcon class="-mr-1 size-5 text-white" aria-hidden="true" />
    </MenuButton>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute right-0 z-10 mt-2 w-38 origin-top-right divide-y divide-white/40 rounded-md bg-indigo-400 outline-1 -outline-offset-1 outline-white/10">
        <div>
          <MenuItem v-slot="{ active }">
            <button @click="openInfoModal(id, 'Выполнено')" class="w-full text-start">
              <span :class="[
                      active ? `bg-white/25 text-white outline-hidden` :
                      'text-white', 'block px-4 py-2 text-sm'
                  ]">
                  Детали
              </span>
            </button>
          </MenuItem>
        </div>
        <div v-if="isCompletedHabitsPage">
          <MenuItem v-if="canAddInCompletedHabits" v-slot="{ active }">
            <button @click="updateStatus(id, 'Выполнено')" class="w-full text-start">
              <span :class="[
                      active ? `bg-white/25 text-white outline-hidden` :
                      'text-white', 'block px-4 py-2 text-sm'
                  ]">
                  В Выполненные
              </span>
            </button>
          </MenuItem>
        </div>
        <div v-if="isinProgressHabitsPage">
          <MenuItem v-if="canAddInProgressHabits" v-slot="{ active }">
            <button @click="updateStatus(id, 'В процессе')" class="w-full text-start">
                <span :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    В процессе
                </span>
            </button>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button @click="openDeleteHabitModal(id, 'Удалить привычку?')" class="w-full text-start">
                <span :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Удалить
                </span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>