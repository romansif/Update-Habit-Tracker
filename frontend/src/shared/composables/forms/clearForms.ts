import { useForms } from "./useForms";

const { registerForm, loginForm, userErrors, habitForm, habitErrors } = useForms();

export const useClearForms = () => {
    const clearRegisterForm = () => {
        registerForm.value.name = '';
        registerForm.value.email = '';
        registerForm.value.password = '';

        userErrors.value.nameError = false;
        userErrors.value.emailError = false;
        userErrors.value.passwordError = false;

        clearRegisterValidation()
    };

    const clearLoginForm = () => {
        loginForm.value.email = '';
        loginForm.value.password = '';

        userErrors.value.emailError = false;
        userErrors.value.passwordError = false;

        clearLoginValidation()
    };

    const clearHabitForm = () => {
        habitForm.value.habit = '';
        habitForm.value.time = ''
        habitForm.value.category = '';
        habitForm.value.status = '';
        habitForm.value.frequency = '';
        habitForm.value.term = '';
        habitForm.value.linkedHabit = '';

        habitErrors.value.habitError = false;
        habitErrors.value.timeError = false;
        habitErrors.value.categoryError = false;
        habitErrors.value.frequencyError = false;
        habitErrors.value.termError = false;

        clearHabitValidation()
    };

    const clearRegisterValidation = () => {
        userErrors.value.nameMessage = '';
        userErrors.value.emailMessage = '';
        userErrors.value.passwordMessage = '';
    }

    const clearLoginValidation = () => {
        userErrors.value.nameMessage = '';
        userErrors.value.emailMessage = '';
        userErrors.value.passwordMessage = '';
    }

    const clearHabitValidation = () => {
        habitErrors.value.habitMessage = '';
        habitErrors.value.timeMessage = '';
        habitErrors.value.categoryMessage = '';
        habitErrors.value.frequencyMessage = '';
        habitErrors.value.termMessage = '';
    }

    return{
        clearRegisterForm,
        clearLoginForm,
        clearHabitForm,

        clearRegisterValidation,
        clearLoginValidation,
        clearHabitValidation
    }
}