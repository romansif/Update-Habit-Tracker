import { ref } from 'vue'

interface registerForm {
    name: string;
    email: string;
    password: string;
}
const registerForm = ref<registerForm>({
    name: '',
    email: '',
    password: '',
})

interface loginForm {
    email: string;
    password: string;
}
const loginForm = ref<loginForm>({
    email: '',
    password: '',
})

interface habitForm {
    habit: string,
    time: string,
    category: string,
    status: string,
    frequency: string,
    term: string,
    linkedHabit: string,
}
const habitForm = ref<habitForm>({
    habit: '',
    time: '',
    category: '',
    status: 'Не выполнено',
    frequency: '',
    term: '',
    linkedHabit: '',
});

interface updateForm {
    name: string;
}
const updateForm = ref<updateForm>({
    name: ''
})


interface userErrors {
    nameError: boolean,
    emailError: boolean,
    passwordError: boolean,
    newNameError: boolean,

    nameMessage: string,
    emailMessage: string,
    passwordMessage: string,
    newNameMessage: string,
}
const userErrors = ref<userErrors>({
    nameError: false,
    emailError: false,
    passwordError: false,
    newNameError: false,

    nameMessage: '',
    emailMessage: '',
    passwordMessage: '',
    newNameMessage: '',
})

interface habitErrors {
    habitError: boolean,
    timeError: boolean,
    categoryError: boolean,
    frequencyError: boolean,
    termError: boolean,

    habitMessage: string,
    timeMessage: string,
    categoryMessage: string,
    frequencyMessage: string,
    termMessage: string,
}
const habitErrors = ref<habitErrors>({
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