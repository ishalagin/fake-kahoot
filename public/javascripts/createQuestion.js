let createQuestionWrap = document.getElementById('createQuestionWrap')
let createQuestionOverlay = document.getElementById('createQuestionOverlay')
let questionInput = document.getElementById('questionInput')
let correctAnswerInput = document.getElementById('correctAnswerInput')
let wrongAnswerInput1 = document.getElementById('wrongAnswerInput1')
let wrongAnswerInput2 = document.getElementById('wrongAnswerInput2')
let wrongAnswerInput3 = document.getElementById('wrongAnswerInput3')
/**
 * @module
 */

/**
 * @summary Displays the question User interface
 * @function
 * @public
 */
createQuestionOverlay.addEventListener('click', () => {
  createQuestionOverlay.style.backgroundColor = 'rgba(236, 239, 241, 0)'
  createQuestionWrap.style.top = '-100vh'
  setTimeout(() => {
    createQuestionOverlay.style.display = 'none'
  }, 300)
})

/**
 * @summary Fancy function that allows a user to close a window by clicking
 * outside of it
 * @function
 * @public
 */
createQuestionWrap.addEventListener('click', (event) => {
  event.stopPropagation()
})

/**
 * @summary Displays the question windows
 * @function
 * @public
 */
let showCreateQuestionWindow = () => {
  createQuestionOverlay.style.display = 'block'
  setTimeout(() => {
    createQuestionOverlay.style.backgroundColor = 'rgba(236, 239, 241, 0.5)'
    createQuestionWrap.style.top = '15vh'
  }, 10)
}
/**
 * @summary HTTP request to insert question data to database
 * @function
 * @public
 */
let createQuestion = () => {
  serverRequest(
    'POST',
    '/createQuestion',
    `questionContent=${questionInput.value}&` +
    `rightAnswer=${correctAnswerInput.value}&` +
    `wrongAnswer1=${wrongAnswerInput1.value}&` +
    `wrongAnswer2=${wrongAnswerInput2.value}&` +
    `wrongAnswer3=${wrongAnswerInput3.value}`,
    (xmlhttp) => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        swal({
          title: 'Success',
          text: 'Question created!',
          type: 'success'
        }).then((value) => {
          window.location.reload()
        })
      } else {
        swal({
          title: 'Failed',
          text: 'Failed to create question!',
          type: 'error'
        })
      }
    })
}
