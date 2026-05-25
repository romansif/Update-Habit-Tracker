<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

import { useUserModals, useHabitModals } from '../../../shared/composables/modal/useModals.js'

const { openCreateHabit } = useHabitModals()
const { openLogoutUser, openDeleteUser } = useUserModals()
</script>

<template>
  <Menu as="div" class="relative inline-block p-6">
    <MenuButton class="inline-flex w-full justify-center gap-x-1.5 text-white rounded-lg
                                bg-gradient-to-b from-indigo-400 to-indigo-600 shadow-xl
                                shadow-indigo-500/40 active:scale-95 transition p-5 text-sm font-semibold
                                text-white inset-ring-1 inset-ring-white/5 hover:bg-gray-500">
      Пользователь
      <ChevronDownIcon class="-mr-1 size-5 text-white" aria-hidden="true" />
    </MenuButton>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute right-6 z-10 mt-2 w-46 origin-top-right divide-y divide-white/40 rounded-md bg-indigo-400 outline-1 -outline-offset-1 outline-white/10">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button @click=openCreateHabit class="w-full text-start">
                <span :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Создать привычку
                </span>
            </button>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button @click="openLogoutUser('Вы точно хотите выйти из этого аккаунта?')" class="w-full text-start">
                  <span :class="[
                          active ? 'bg-white/25 text-white outline-hidden' :
                          'text-white', 'block px-4 py-2 text-sm'
                      ]">
                     Выйти из аккаунта
                  </span>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }" class="w-full text-start">
            <button @click="openDeleteUser('Вы хотите удалить этот аккаунт навсегда?')">
                <span :class="[
                        active ? 'bg-white/25 text-white outline-hidden' :
                        'text-white', 'block px-4 py-2 text-sm'
                    ]">
                    Удалить аккаунт
                </span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>