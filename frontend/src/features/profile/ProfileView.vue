<script setup lang="ts">
import { onMounted, watch } from "vue";

import { useUser } from "../auth/composables/useUser";
import { useGetUsers } from "../auth/composables/getUsers";
import { useForms } from "../../shared/composables/forms/useForms";
import { useUserStore } from "../../shared/composables/store/userStore";

import ProfileMenu from "./profile-items/ProfileMenu.vue";
import BaseButton from "../../shared/ui/button/BaseButton.vue";
import ProfileCards from "./profile-items/ProfileCards.vue";
import NavMenu from "../navigation/NavMenu.vue";

const { user } = useUserStore()
const { updateUser } = useUser();
const { getUser } = useGetUsers();
const { userErrors, updateForm } = useForms();

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
      <NavMenu />
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
    </div>
  </div>
</template>

<style scoped>

</style>