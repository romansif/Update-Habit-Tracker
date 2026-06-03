import { useForms } from "./useForms.js";
import { useClearForms } from "./clearForms.js"
import { useUserStore } from "../store/userStore.js";
import { useGetUsers } from "../../../features/auth/composables/getUsers.js";

const { users } = useUserStore();
const { getUsers } = useGetUsers();
const { userErrors, registerForm, loginForm, updateForm, habitErrors, habitForm } = useForms();
const { clearRegisterValidation, clearLoginValidation, clearHabitValidation } = useClearForms();

export const useValidation = () => {
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isUsedEmail = async (email) => {
        await getUsers()
        const userEmail = users.value?.find((e) => e.email === email)

        return userEmail?.email
    }

    const validateRegisterForm = async () => {
        clearRegisterValidation()

        userErrors.value.nameError = !registerForm.value.name
        userErrors.value.emailError = !registerForm.value.email || !isValidEmail(registerForm.value.email) || isUsedEmail(registerForm.value.email)
        userErrors.value.passwordError = !registerForm.value.password || !registerForm.value.password.length < 8

        const emailTaken = await isUsedEmail(registerForm.value.email)

        userErrors.value.nameMessage = userErrors.value.nameError ? 'Поле имени пользователя обязательно должно быть заполнено' : ''
        if(!registerForm.value.email){
            userErrors.value.emailMessage = 'Поле почты обязательно должно быть заполнено'
        }else if(!isValidEmail(registerForm.value.email)){
            userErrors.value.emailMessage = 'Введённая почта не существует или введена неверно'
        }else if(emailTaken){
            userErrors.value.emailMessage = 'Данная почта уже зарегестрирована'
        }

        if(!registerForm.value.password){
            userErrors.value.passwordMessage = 'Поле пароля обязательно должно быть заполнено'
        }else if(registerForm.value.password.length < 8){
            userErrors.value.passwordMessage = 'Пароль должен состоять из 8 или более символов'
        }
        return !(!registerForm.value.name || !registerForm.value.email || !registerForm.value.password ||
            !isValidEmail(registerForm.value.email) || await isUsedEmail(registerForm.value.email) || registerForm.value.password.length < 8
        )
    }

    const validateLoginForm = () => {
        clearLoginValidation()

        userErrors.value.emailError = !loginForm.value.email || !isValidEmail(loginForm.value.email)
        userErrors.value.passwordError = !loginForm.value.password || !loginForm.value.password.length < 8

        if(!loginForm.value.email){
            userErrors.value.emailMessage = 'Поле почты обязательно должно быть заполнено'
        }else if(!isValidEmail(loginForm.value.email)){
            userErrors.value.emailMessage = 'Введённая почта не существует или введена неверно'
        }

        if(!loginForm.value.password){
            userErrors.value.passwordMessage = 'Поле пароля обязательно должно быть заполнено'
        }else if(!loginForm.value.password.length < 8){
            userErrors.value.passwordMessage = 'Пароль должен состоять из 8 или более символов'
        }
        return !(!loginForm.value.email || !loginForm.value.password ||
            !isValidEmail(loginForm.value.email) || loginForm.value.password.length < 8
        )
    }

    const validateHabitForm = () => {
        clearHabitValidation()

        habitErrors.value.habitError = !habitForm.value.habit
        habitErrors.value.timeError = !habitForm.value.time
        habitErrors.value.categoryError = !habitForm.value.category
        habitErrors.value.frequencyError = !habitForm.value.frequency
        habitErrors.value.termError = !habitForm.value.term
        habitErrors.value.linkedHabitError = !habitForm.value.linkedHabit

        habitErrors.value.habitMessage = habitErrors.value.habitError ? 'Поле привычки должно быть заполненно' : ''
        habitErrors.value.timeMessage = habitErrors.value.timeError ? 'Поле времени на выполнение должно быть заполненно' : ''
        habitErrors.value.categoryMessage = habitErrors.value.categoryError ? 'Поле категории должно быть заполненно' : ''
        habitErrors.value.frequencyMessage = habitErrors.value.frequencyError ? 'Поле частоты выполнения должно быть заполненно' : ''
        habitErrors.value.termMessage = habitErrors.value.termError ? 'Поле срока выполения должно быть заполненно' : ''

        return !(!habitForm.value.habit || !habitForm.value.time || !habitForm.value.category ||
            !habitForm.value.frequency || !habitForm.value.term )
    }

    const validateUpdateForm = () => {
        userErrors.value.newNameError = !updateForm.value.name || !updateForm.value.name.length < 5

        if(!updateForm.value.name){
            userErrors.value.newNameMessage = 'Поле нового имени пользователя обязательно должно быть заполненно'
        }else if(!updateForm.value.name.length < 5){
            userErrors.value.newNameMessage = 'Поле нового имени пользователя должно состоять из 5 или более символов'
        }

        return !(!updateForm.value.name || updateForm.value.name.length < 5)

    }

    return{
        validateRegisterForm,
        validateLoginForm,
        validateHabitForm,
        validateUpdateForm
    }
}