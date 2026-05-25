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

const habitForm = ref({
    habit: '',
    time: '',
    category: '',
    status: 'Не выполнено',
    frequency: '',
    term: '',
    linkedHabit: '',
});

const updateForm = ref({
    name: ''
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

const habitErrors = ref({
    habitError: false,
    timeError: false,
    categoryError: false,
    frequencyError: false,
    termError: false,

    habitMessage: '',
    timeMessage: '',
    categoryMessage: '',
    frequencyMessage: '',
    termMessage: '',
})


export const useForms = () => {
    return{
        registerForm,
        loginForm,
        habitForm,
        updateForm,

        userErrors,
        habitErrors,
    }
}