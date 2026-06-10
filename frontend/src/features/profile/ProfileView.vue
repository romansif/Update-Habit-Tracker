<script setup>
import { onMounted, watch } from "vue";

import { useUser } from "../auth/composables/useUser.js";
import { useGetUsers } from "../auth/composables/getUsers.js";
import { useForms } from "../../shared/composables/forms/useForms.js";
import { useUserStore } from "../../shared/composables/store/userStore.js";
import { useModalsStore } from "../../shared/composables/store/modalsStore.js";

import ProfileMenu from "./profile-items/ProfileMenu.vue";
import BaseButton from "../../shared/ui/button/BaseButton.vue";
import LogoutUser from "../../shared/ui/user-modals/LogoutUser.vue";
import DeleteUser from "../../shared/ui/user-modals/DeleteUser.vue";
import ProfileCards from "./profile-items/ProfileCards.vue";
import CreateHabit from "../../shared/ui/habit-modals/CreateHabit.vue";

const { user } = useUserStore()
const { updateUser } = useUser();
const { getUser } = useGetUsers();
const { userErrors, updateForm } = useForms();
const { logoutUserVisible, deleteUserVisible, createHabitVisible } = useModalsStore();

onMounted(async () => {
  await getUser();
})
const toLower = () => {
  updateForm.value.name = updateForm.value.name.toLowerCase()
}

watch(() => updateForm.value.name, (newValue) => {
  if(newValue) {
    userErrors.value.newNameError = false
  }
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center gap-4">
      <router-link :to="{ name: 'current-habits' }" class="px-8 py-5 text-white rounded-lg bg-gradient-to-b
                            from-indigo-400 to-indigo-600 shadow-xl shadow-indigo-500/40
                            active:scale-95 transition mx-5">
        Вернуться
      </router-link>
      <ProfileMenu />
    </div>
    <div class="flex justify-center py-13">
      <div class="w-[850px]">
          <ProfileCards />
        <div class="flex flex-col gap-3 items-center mt-30">
          <div class="flex">
            <h1 class="text-xl">Текущее имя пользователя: {{ user?.name }}</h1>
          </div>
          <div class="flex flex-col gap-3">
            <input type="text" v-model="updateForm.name" @input="toLower" placeholder="Имя пользователя"
                   class="bg-white shadow-xl w-[850px] placeholder:text-sm outline-none rounded-[4px] p-5 mt-6">
            <span v-if="userErrors.newNameError" class="text-sm text-red-500">{{ userErrors?.newNameMessage }}</span>
          </div>
        </div>
        <div class="flex justify-end mt-6">
            <BaseButton button-type="Применить" variant="confirmEditUser" @click="updateUser" />
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
    </div>
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