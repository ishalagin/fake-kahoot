/**
 * @module
 */
/**
 * @const
 * @type {number}
 * @summary Set Final Value for Countdown Timer
 */
let countDownTo = 0

/**
 * @const
 * @type {number}
 * @summary Get Starting Value of Countdown Timer
 */
let startCountDownAt = 9

/**
 * @function countDown
 * @summary Display the value of startCountDownAt in the element with
 * id="clockDisplay" if startCountDownAt is equal to countDownTo reset timer
 * and get next questionFinally decrements startCountDownAt by 1
 */
let countDown = () => {
  document.getElementById('clockDisplay').innerHTML = startCountDownAt

  if (startCountDownAt === countDownTo) {
    startCountDownAt = 9
    clearInterval(timer)
    getNextQuestion()
    displayNotification('timeup')
  }
  startCountDownAt -= 1
}

/**
 * @summary initializing interval timer method
 */
let timer

/**
 * @function countDownTimer
 * @summary initially sets startCountDownAt to 9 and resets timer function
 * sets timer to a interval method with countDown as its function to execute
 * every second
 */
let countDownTimer = () => {
  startCountDownAt = 9
  clearInterval(timer)
  timer = setInterval(countDown, 1000)
}

/**
 * @summary initializing progressBar interval method
 */
let id

/**
 * @function moveBar
 * @summary initializes width of progress bar to 0%
 * resets progressBar interval method
 * sets id to interval method with frame as its function to execute every 50 ms
 * if progressBar width is less than 100% complete then it will add another
 * .5%; otherwise clear progressBar interval method
 * @function frame
 */
function moveBar () {
  let elem = document.getElementById('progressBar')
  let width = 0
  clearInterval(id)
  id = setInterval(frame, 50)
  function frame () {
    if (width >= 100) {
      clearInterval(id)
    } else {
      width += 0.5
      elem.style.width = width + '%'
    }
  }
}
