import { useForms } from "./useForms.js";

const { registerForm, loginForm, userErrors, habitForm, habitErrors } = useForms();

export const useClearForms = () => {
    const clearRegisterForm = () => {
        registerForm.value.name = '';
        registerForm.value.email = '';
        registerForm.value.password = '';

        userErrors.value.nameError = false;
        userErrors.value.emailError = false;
        userErrors.value.passwordError = false;
    }

    const clearLoginForm = () => {
        loginForm.value.email = '';
        loginForm.value.password = '';

        userErrors.value.emailError = false;
        userErrors.value.passwordError = false;
    }

    const clearHabitForm = () => {
        habitForm.value.habit = '';
        habitForm.value.time = ''
        habitForm.value.category = '';
        habitForm.value.status = '';
        habitForm.value.frequency = '';
        habitForm.value.term = '';

        habitErrors.value.habitError = false;
        habitErrors.value.timeError = false;
        habitErrors.value.categoryError = false;
        habitErrors.value.frequencyError = false;
        habitErrors.value.termError = false;
    }

    return{
        clearRegisterForm,
        clearLoginForm,
        clearHabitForm,
    }
}