import { ref } from 'vue'

const registerForm = ref({
    name: '',
    email: '',
    password: '',
})

const loginForm = ref({
    email: '',
    password: '',
})

const userErrors = ref({
    nameError: false,
    emailError: false,
    passwordError: false,
    newNameError: false,

    nameMessage: '',
    emailMessage: '',
    passwordMessage: '',
    newNameMessage: '',
})

export const useForms = () => {
    return{
        registerForm,
        loginForm,
        userErrors
    }
}