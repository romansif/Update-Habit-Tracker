<script setup>
import { watch } from "vue";

import { useQuery } from "@tanstack/vue-query";
import { useUser } from "../auth/composables/useUser.js";
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
const { getUser, updateUser } = useUser();
const { userErrors, updateForm } = useForms();
const { logoutUserVisible, deleteUserVisible, createHabitVisible } = useModalsStore();

const { isPending, isError, error } = useQuery({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await getUser()
    return res
  }
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
  <div v-if="isPending" class="flex justify-center items-center h-[600px]">
    <img src="../../app/assets/icons/loading.svg" alt="" class="w-[120px] h-[120px]">
  </div>
  <div v-else-if="isError" class="flex justify-center items-center h-[600px]">
    <span class="text-2xl text-gray-100 italic">Error {{ error.message }}</span>
  </div>
    <div v-else class="flex justify-center py-13">
      <div class="w-[850px]">
          <ProfileCards />
        <div class="flex flex-col gap-3 justify-center items-center mt-30">
          <div>
            <h1 class="text-xl">Текущее имя пользователя: {{ user?.name }}</h1>
            <input type="text" v-model="updateForm.name" @input="toLower" placeholder="Имя пользователя"
                   class="bg-white shadow-xl w-[600px] placeholder:text-sm outline-none rounded-[4px] p-5 mt-6">
          </div>
          <div>
            <span v-if="userErrors.newNameError" class="text-sm text-red-500 mt-3">{{ userErrors?.newNameMessage }}</span>
          </div>
        </div>
        <div class="flex justify-center mt-3">
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