let scoreHistory = document.getElementById('scoreHistoryWrap')
let createdQuestionsWrap = document.getElementById('createdQuestionsWrap')

let displayPlayHistory = () => {
  serverRequest('POST', '/playerhistory', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      scoreHistory.innerHTML = '<h1>Score History</h1>\n' +
            xmlhttp.responseText + '\n</div>'
    }
  })
}

let displayCreatedQuestions = () => {
  serverRequest('POST', '/createdquestions', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      createdQuestionsWrap.innerHTML = '<h1>Created Questions</h1>\n' +
        xmlhttp.responseText + '\n</div>'
    }
  })
}

displayPlayHistory()
displayCreatedQuestions()
