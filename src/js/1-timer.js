import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const invalidDateMessage = 'Please choose a date in the future';
const defaultTimerData = { days: 0, hours: 0, minutes: 0, seconds: 0 };
const datetimePickerInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerElements = document.querySelectorAll('.timer .field .value');
let timer = null;
let selectedDate = null;

const FLATPICKR_PICKER_OPTIONS = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];
    console.log(date);
    const isValid = validateDate(date);

    if (isValid) {
      switchDisable(startButton, false);
      selectedDate = date;
    } else {
      switchDisable(startButton, true);
      iziToast.error({
        message: invalidDateMessage,
        position: 'topRight',
        iconColor: '#FFF',
        titleColor: '#FFF',
        messageColor: '#FFF',
        backgroundColor: '#EF4040',
        progressBarColor: '#B51B1B',
      });
    }
  },
};

function convertMsToTimerData(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function switchDisable(element, disabled) {
  if (disabled) {
    element.setAttribute('disabled', null);
  } else {
    element.removeAttribute('disabled');
  }
}

function validateDate(date) {
  if (!date) {
    console.error('[validateDate] date is empty');
    return false;
  }

  if (new Date().valueOf() >= date.valueOf()) {
    console.error('[validateDate] date in the past');
    return false;
  }

  return true;
}

function startTimer() {
  if (timer || !selectedDate) {
    return;
  }

  switchDisable(startButton, true);
  switchDisable(datetimePickerInput, true);

  updateTimer();

  timer = setInterval(() => {
    updateTimer();
  }, 1000);
}

function updateTimer() {
  const ms = selectedDate.valueOf() - new Date().valueOf();

  if (ms <= 0) {
    clearInterval(timer);
    timer = null;
    selectedDate = null;
    switchDisable(datetimePickerInput, false);
    updateTimerElements(defaultTimerData);
    return;
  }

  updateTimerElements(convertMsToTimerData(ms));
}

function updateTimerElements(timerData) {
  timerElements.forEach(timerElement => {
    const dataAttr = Array.from(timerElement.attributes).find(attr =>
      attr.name.startsWith('data-')
    );

    const dataItemName = dataAttr.name.replace('data-', '');

    if (dataItemName in timerData) {
      const newValue = formatTimerNumber(timerData[dataItemName]);

      if (newValue !== timerElement.innerHTML) {
        timerElement.innerHTML = newValue;
      }
    }
  });
}

function formatTimerNumber(timerNumber) {
  const timerNumberStr = `${timerNumber}`;
  return timerNumberStr.length < 2 ? `0${timerNumberStr}` : timerNumberStr;
}

function initForm() {
  flatpickr(datetimePickerInput, FLATPICKR_PICKER_OPTIONS);
  startButton.addEventListener('click', () => startTimer());
  switchDisable(startButton, true);
  updateTimerElements(defaultTimerData);
}

initForm();
