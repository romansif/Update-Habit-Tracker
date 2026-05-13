import { useForms } from "./useForms.js";

const { userErrors, registerForm, loginForm, updateForm, habitErrors, habitForm } = useForms()

export const useValidation = () => {
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validateRegisterForm = () => {
        userErrors.value.nameError = !registerForm.value.name

        userErrors.value.emailError = !registerForm.value.email || !isValidEmail(registerForm.value.email)

        userErrors.value.passwordError = !registerForm.value.password || !registerForm.value.password.length < 8

        userErrors.value.nameMessage = userErrors.value.nameError ? 'Поле имени пользователя обязательно должно быть заполнено' : ''

        if(!registerForm.value.email){
            userErrors.value.emailMessage = 'Поле почты обязательно должно быть заполнено'
        }else if(!isValidEmail(registerForm.value.email)){
            userErrors.value.emailMessage = 'Введённая почта не существует или введена неверно'
        }

        if(!registerForm.value.password){
            userErrors.value.passwordMessage = 'Поле пароля обязательно должно быть заполнено'
        }else if(registerForm.value.password.length < 8){
            userErrors.value.passwordMessage = 'Пароль должен состоять из 8 или более символов'
        }

        return !(!registerForm.value.name || !registerForm.value.email || !registerForm.value.password ||
            !isValidEmail(registerForm.value.email) || registerForm.value.password.length < 8
        )
    }

    const validateLoginForm = () => {
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
        habitErrors.value.habitError = !habitForm.value.habit
        habitErrors.value.timeError = !habitForm.value.time
        habitErrors.value.categoryError = !habitForm.value.category
        habitErrors.value.frequencyError = !habitForm.value.frequency
        habitErrors.value.termError = !habitForm.value.term

        habitErrors.value.habitMessage = habitErrors.value.habitError ? 'Поле привычки должно быть заполненно' : ''
        habitErrors.value.timeMessage = habitErrors.value.timeError ? 'Поле времени на привычку должно быть заполненно' : ''
        habitErrors.value.categoryMessage = habitErrors.value.categoryError ? 'Поле категории привычки должно быть заполненно' : ''
        habitErrors.value.frequencyMessage = habitErrors.value.frequencyError ? 'Поле частоты выполнения привычки должно быть заполненно' : ''
        habitErrors.value.termMessage = habitErrors.value.termError ? 'Поле срока выполения привычки должно быть заполненно' : ''

        return !(!habitForm.value.habit || !habitForm.value.time || !habitForm.value.category ||
            !habitForm.value.frequency || !habitForm.value.term)
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