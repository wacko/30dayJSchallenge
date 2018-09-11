// Elements

const player = document.querySelector('.player')
const video = document.querySelector('.viewer')
const progress = document.querySelector('.progress')
const progressBar = document.querySelector('.progress__filled')

const toggle = document.querySelector('.toggle')
const skipButtons = document.querySelectorAll('[data-skip]')
const ranges = document.querySelectorAll('.player__slider')


// Functions

function togglePlay() {
  if (video.paused) {
    video.play()
  } else {
    video.pause()
  }
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚'
  toggle.textContent = icon
}

function skip() {
  const amount = this.dataset.skip
  video.currentTime += parseFloat(amount)
}

function handleRangeUpdate() {
  video[this.name] = this.value
}

function handleProgressBar() {
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  video.currentTime = scrubTime
}


// Hook up the event listeners

video.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)
video.addEventListener('timeupdate', handleProgressBar)

toggle.addEventListener('click', togglePlay)

skipButtons.forEach(b => {b.addEventListener('click', skip)})

ranges.forEach(b => {b.addEventListener('change', handleRangeUpdate)})

let mousemove = false
progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', () => {
  if (mousemove) { scrub }
})
progress.addEventListener('mousedown', () => mousemove)
progress.addEventListener('mouseup', scrub)

progressBar.style.flexBasis = 0