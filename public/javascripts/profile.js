let scoreHistory = document.getElementById('scoreHistoryWrap')

let displayPlayHistory = () => {
    serverRequest('POST', '/playerhistory', '', (xmlhttp) => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            scoreHistory.innerHTML = '<h1>Score History</h1>\n' +
            xmlhttp.responseText
        }
    })
}

displayPlayHistory()
