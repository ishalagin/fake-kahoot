let scoreHistory = document.getElementById('scoreHistoryWrap')

let displayPlayHistory = () => {
    serverRequest('POST', '/playerhistory', '', (xmlhttp) => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            scoreHistory.innerHTML = '<div id="scoreHistoryWrap">\n' +
            '<h1>Score History</h1>\n' +
            xmlhttp.responseText + '\n</div>'
            console.log(scoreHistory.innerHTML)
        }
    })
}

displayPlayHistory()
