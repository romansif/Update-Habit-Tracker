<script setup>
import { useUserModals } from "../../composables/modal/useModals.js";
import { useUserStore } from "../../composables/store/userStore.js";
import { useUser } from '../../../features/auth/composables/useUser.js'

import BaseButton from '../button/BaseButton.vue';

const { logoutUser } = useUser()
const { logoutUserMessage } = useUserStore();
const { closeLogoutUser } = useUserModals();
</script>

<template>
  <section class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                                flex items-center justify-center">
    <div class="bg-white rounded-2xl w-[400px] h-[200px] shadow-xl">
      <div class="flex flex-col justify-center items-center py-8 px-2 gap-6">
        <h2 class="text-2xl text-center">{{ logoutUserMessage }}</h2>
        <div class="flex justify-center gap-6">
          <BaseButton button-type="Нет" variant="cancel" @click="closeLogoutUser" />
          <BaseButton button-type="Да" variant="confirm" @click="logoutUser" />
        </div>
      </div>
    </div>
  </section>
</template>