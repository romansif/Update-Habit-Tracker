<script setup lang="ts">
import { ref, watch } from "vue";

import { useUser } from "./composables/useUser";
import { useForms } from "../../shared/composables/forms/useForms";
import { useClearForms } from "../../shared/composables/forms/clearForms";
// @ts-ignore
import opened from '../../app/assets/icons/opened.png'
// @ts-ignore
import closed from '../../app/assets/icons/closed.png'
import BaseButton from "../../shared/ui/button/BaseButton.vue";

const { registerUser } = useUser();
const { clearRegisterForm } = useClearForms();
const { registerForm, userErrors } = useForms();

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
}

const toLower = () => {
  registerForm.value.name = registerForm.value.name.toLowerCase()
};

watch(() => [registerForm.value.name, registerForm.value.email, registerForm.value.password],([name, email, password]) => {
      if(name){
        userErrors.value.nameError = false
      }
      if(email) {
        userErrors.value.emailError = false
      }
      if(password){
        userErrors.value.passwordError = false
      }
    }
)
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="flex flex-col gap-8">
      <h1 class="text-3xl">Регистрация</h1>
      <form action="" @keydown.prevent.enter="registerUser" class="flex flex-col gap-6 w-[600px]">
        <div class="flex flex-col gap-3">
          <input v-model="registerForm.name" type="text" @input="toLower" placeholder="Имя" class="bg-gray-300
                 outline-none rounded-[4px] p-4">
          <span v-if="userErrors.nameError" class="text-sm text-red-500">{{ userErrors.nameMessage }}</span>
        </div>
        <div class="flex flex-col gap-3">
          <input v-model="registerForm.email" type="text" placeholder="E-mail" class="bg-gray-300 outline-none
                 rounded-[4px] p-4">
          <span v-if="userErrors.emailError" class="text-sm text-red-500">{{ userErrors.emailMessage }}</span>
        </div>
        <div class="flex flex-col gap-3">
          <div class="relative">
            <input placeholder="Пароль" v-model="registerForm.password" :type="showPassword ? 'text' : 'password'"
                   class="bg-gray-300 outline-none rounded-[4px] p-4 w-full">
            <img @click="togglePassword" :src="showPassword ? opened : closed" alt=""
                  class="w-[30px] h-[30px] absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer">
          </div>
          <span v-if="userErrors.passwordError" class="text-sm text-red-500">{{ userErrors.passwordMessage }}</span>
        </div>
      </form>
      <div class="flex flex-col gap-5">
        <div class="flex justify-center">
          <BaseButton button-type="Зарегистрироваться" variant="register" @click=registerUser />
        </div>
        <div class="flex justify-center gap-3">
          <span>Уже есть аккаунт</span>
          <router-link :to="{ name: 'login' }" @click="clearRegisterForm " class="text-violet-600 hover:text-violet-700 focus:outline-none">
            "Войти"
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>