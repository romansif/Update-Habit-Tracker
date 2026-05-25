<script setup>
import { useUserModals } from "../../composables/modal/useModals.js";
import { useUserStore } from "../../composables/store/userStore.js";
import { useUser } from "../../../features/auth/composables/useUser.js";

import BaseButton from '../button/BaseButton.vue';

const { deleteUser } = useUser()
const { deleteUserMessage } = useUserStore();
const { closeDeleteUser } = useUserModals();
</script>

<template>
  <section class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]
                                flex items-center justify-center">
    <div class="bg-white rounded-2xl w-[400px] h-[200px] shadow-xl">
      <div class="flex flex-col justify-center items-center py-8 px-2 gap-6">
        <h2 class="text-2xl text-center">{{ deleteUserMessage }}</h2>
        <div class="flex justify-center gap-6">
          <BaseButton button-type="Нет" variant="cancel" @click=closeDeleteUser />
          <BaseButton button-type="Да" variant="confirm" @click=deleteUser />
        </div>
      </div>
    </div>
  </section>
</template>