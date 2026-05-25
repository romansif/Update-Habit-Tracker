<script setup>
import { onMounted, watch } from "vue";

import { useUser } from "../auth/composables/useUser.js";
import { useForms } from "../../shared/composables/forms/useForms.js";
import { useUserStore } from "../../shared/composables/store/userStore.js";
import { useModalsStore } from "../../shared/composables/store/modalsStore.js";

import ProfileMenu from "./profile-items/ProfileMenu.vue";
import ProfileCountsCard from "./profile-items/ProfileCountsCard.vue";
import BaseButton from "../../shared/ui/button/BaseButton.vue";
import LogoutUser from "../../shared/ui/user-modals/LogoutUser.vue";
import CreateHabit from "../../shared/ui/habit-modals/CreateHabit.vue";
import DeleteUser from "../../shared/ui/user-modals/DeleteUser.vue";

const { user } = useUserStore()
const { getUser, updateUser } = useUser();
const { userErrors, updateForm } = useForms();
const { logoutUserVisible, deleteUserVisible, createHabitVisible } = useModalsStore();

const toLower = () => {
  updateForm.value.name = updateForm.value.name.toLowerCase()
}

watch(() => updateForm.value.name, (newValue) => {
  if(newValue) {
    userErrors.value.newNameError = false
  }
})

onMounted(async () => {
  await getUser();
})
</script>

<template>
  <div class="bg-indigo-200 min-h-screen">
    <div class="flex justify-between items-center gap-4">
      <router-link :to="{ name: 'current-habits' }" class="px-8 py-5 text-white rounded-lg bg-gradient-to-b
                            from-indigo-400 to-indigo-600 shadow-xl shadow-indigo-500/40
                            active:scale-95 transition mx-5">
        Вернуться
      </router-link>
      <ProfileMenu />
    </div>
    <section class="flex justify-center py-13">
      <div class="w-[850px]">
          <ProfileCountsCard />
        <div class="flex flex-col justify-center items-center mt-30">
          <div>
            <h1 class="text-xl">Текущее имя пользователя: {{ user?.name }}</h1>
            <input type="text" v-model="updateForm.name" @input="toLower" placeholder="Имя пользователя"
                   class="bg-white shadow-xl w-[600px] placeholder:text-sm outline-none rounded-[4px] p-5 mt-6">
          </div>
          <span v-if="userErrors.newNameError" class="text-sm text-red-500 mt-3">{{ userErrors?.newNameMessage }}</span>
        </div>
        <div class="flex justify-center mt-5">
            <BaseButton button-type="Применить" variant="confirm" @click="updateUser" />
        </div>
      </div>
      <transition name="modal" >
        <CreateHabit v-show="createHabitVisible" />
      </transition>
      <transition name="modal" >
        <DeleteUser v-show="deleteUserVisible" />
      </transition>
      <transition name="modal" >
        <LogoutUser v-show="logoutUserVisible" />
      </transition>
    </section>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>