import { useForms } from "./useForms.js";

const { userErrors, registerForm, loginForm } = useForms()

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
        }else{
            userErrors.value.emailMessage = ''
        }

        if(!registerForm.value.password){
            userErrors.value.passwordMessage = 'Поле пароля обязательно должно быть заполнено'
        }else if(registerForm.value.password.length <= 8){
            userErrors.value.passwordMessage = 'Пароль должен состоять из 8 или более символов'
        }else{
            userErrors.value.passwordMessage = ''
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
        }else{
            userErrors.value.emailMessage = ''
        }

        if(!loginForm.value.password){
            userErrors.value.passwordMessage = 'Поле пароля обязательно должно быть заполнено'
        }
        return !(!loginForm.value.email || !loginForm.value.password ||
            !isValidEmail(loginForm.value.email) || loginForm.value.password.length < 8
        )
    }

    return{
        validateRegisterForm,
        validateLoginForm
    }
}