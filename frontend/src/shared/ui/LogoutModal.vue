<script setup>
import { useUser } from '../../features/auth/composables/userComposable.js'

import BaseButton from '../ui/BaseButton.vue';

const { logoutUserMessage, closeLogoutUserModal, logoutUser,  } = useUser()
</script>

<template>
  <section class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                                flex items-center justify-center">
    <div class="bg-white rounded-2xl w-[400px] h-[200px] shadow-xl">
      <div class="flex flex-col justify-center items-center py-8 px-2 gap-6">
        <h2 class="text-2xl text-center">{{ logoutUserMessage }}</h2>
        <div class="flex justify-center gap-6">
          <BaseButton button-type="Нет" variant="cancelExitModal" @click="closeLogoutUserModal" />
          <BaseButton button-type="Да" variant="confirmExitModal" @click="logoutUser" />
        </div>
      </div>
    </div>
  </section>
</template>