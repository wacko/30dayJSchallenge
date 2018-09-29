let countdown
const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')
const buttons = document.querySelectorAll('[data-time]')

function timer(seconds) {
  const now = Date.now()
  const then = now + seconds * 1000
  displayTimeLeft(seconds)
  displayEndTime(then)
  clearInterval(countdown)
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000)

    if (secondsLeft < 0) {
      clearInterval(countdown)
      return
    }
    displayTimeLeft(secondsLeft)
  }, 1000)
}

function displayTimeLeft(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  display = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  document.title = display
  timerDisplay.textContent = display
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp)
  const hour = end.getHours()
  const adjustedHour = hour > 12 ? hour-12 : hour
  const minutes = end.getMinutes()
  endTime.textContent = `Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`
}

function setTimer(elem) {
  timer(this.dataset.time)
}

buttons.forEach(button => {button.addEventListener('click', setTimer)})
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault()
  const minutes = parseInt(this.minutes.value)
  timer(minutes * 60)
  this.reset()
})
