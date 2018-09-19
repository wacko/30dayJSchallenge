const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rgb = document.querySelector('.rgb');

const effects = document.querySelectorAll('.filtros [name=effect]');
const noEffect = (x => x)
let currentEffect = noEffect

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream)
      video.src = window.URL.createObjectURL(localMediaStream)
      video.play()
    })
    .catch(err => {
      console.error('oh no!', err)
    })
}

function paintToCanvas() {
  const width = video.videoWidth
  const height = video.videoHeight
  canvas.width = width
  canvas.height = height
  console.log(width, height)

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    let pixels = ctx.getImageData(0, 0, width, height)
    pixels = currentEffect(pixels)
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

function redEffect(pixels) {
  for (var i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = (pixels.data[i] + 255) / 2 // R
    // pixels.data[i + 1] = // R
    // pixels.data[i + 2] = // R
  }
  return pixels
}

function rgbSplit(pixels) {
  for (var i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 100] = pixels.data[i + 0]
    pixels.data[i + 100] = pixels.data[i + 1]
    pixels.data[i - 200] = pixels.data[i + 2]
  }
  return pixels
}

function greenScreen(pixels) {
  const levels = {}

  document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value
    })

  for (var i = 0; i < pixels.data.length; i+=4) {
    red = pixels.data[i+0]
    green = pixels.data[i+1]
    blue = pixels.data[i+2]
    alpha = pixels.data[i+3]

    if (red >= levels.rmin
        && red <= levels.rmax
        && green >= levels.gmin
        && green <= levels.gmax
        && blue >= levels.bmin
        && blue <= levels.bmax) {
      pixels.data[i+3] = 0
    // } else {
    //   pixels.data[i+3] = 1
    }
  }
  return pixels
}

function takePhoto() {
  snap.currentTime = 0
  snap.play()

  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.setAttribute('download', 'photo')
  link.href = data
  link.innerHTML = `<img src=${data} alt="Photo" />`
  strip.insertBefore(link, strip.firstChild)


}

function setCurrentEffect() {
  // console.log(this.value)
  rgb.hidden = true  
  switch (this.value) {
    case 'none':
      currentEffect = noEffect
      break
    case 'redEffect':
      currentEffect = redEffect
      break
    case 'greenScreen':
      currentEffect = greenScreen
      rgb.hidden = false  
      break
    case 'rgbSplit':
      currentEffect = rgbSplit
      break
  }

}


video.addEventListener('canplay', paintToCanvas)
effects.forEach(x => x.addEventListener('click', setCurrentEffect))
rgb.hidden = true
getVideo()
