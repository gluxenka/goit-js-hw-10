import 'izitoast/dist/css/iziToast.min.css';

import iziToast from 'izitoast';

const form = document.querySelector('.form');
const radioButtons = document.querySelectorAll('input[name="state"]');
const delayInput = document.querySelector('input[name="delay"]');

function showSuccessMessage(delay) {
  iziToast.success({
    message: `✅ Fulfilled promise in ${delay}ms`,
    position: 'topRight',
    iconColor: '#FFF',
    titleColor: '#FFF',
    messageColor: '#FFF',
    backgroundColor: '#59A10D',
    progressBarColor: '#326101',
  });
}

function showErrorMessage(delay) {
  iziToast.error({
    message: `❌ Rejected promise in ${delay}ms`,
    position: 'topRight',
    iconColor: '#FFF',
    titleColor: '#FFF',
    messageColor: '#FFF',
    backgroundColor: '#EF4040',
    progressBarColor: '#B51B1B',
  });
}

function handleNotification(promise) {
  promise.then(showSuccessMessage).catch(showErrorMessage);
}

function createNotification(state, delay) {
  if (
    !['fulfilled', 'rejected'].includes(state) ||
    typeof delay !== 'number' ||
    isNaN(delay)
  ) {
    return;
  }

  const delayedNotification = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'rejected') {
        reject(delay);
      }

      if (state === 'fulfilled') {
        resolve(delay);
      }
    }, delay);
  });

  handleNotification(delayedNotification);
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData);
  createNotification(formValues.state, Number(formValues.delay));
  resetForm();
}

function resetForm() {
  radioButtons.forEach(button => {
    button.checked = false;
  });

  delayInput.value = '';
}

function init() {
  form.addEventListener('submit', handleSubmit);
}

init();
