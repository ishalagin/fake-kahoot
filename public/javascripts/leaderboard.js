let categoryType = document.getElementById('ltrivia_category')
let difficultyType = document.getElementById('ltrivia_difficulty')
let scoreDisplay = document.getElementById('scoreDisplay')

/**
 * @module
 */

/**
 * @function
 */
let displayQuizResultCateogry = () => {
    serverRequest('POST', '/leaderboardCategory',
    `chosenCategory=${categoryType.options[categoryType.selectedIndex].value}` +
    `&chosenDifficulty=${difficultyType.options[difficultyType.selectedIndex].value}`,
    (xmlhttp) => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        scoreDisplay.innerHTML = '<div class="scoreDisplayRow scoreDisplayRowHeader">\n' +
                '<div id="userRank" class="leaderboardDisplayColumn">\n' +
                '<p class="displayInfo">RANK</p>\n' +
                '</div>\n' +
                '<div id="userName" class="leaderboardDisplayColumn">\n' +
                '<p class="displayInfo", id="scoreTextSort">NAME</p>\n' +
                '</div>\n' +
                '<div id="userStreak" class="leaderboardDisplayColumn">\n' +
                '<p class="displayInfo">STREAK</p>\n' +
                '</div>\n' +
                '<div id="userScore" class="leaderboardDisplayColumn">\n' +
                '<p class="displayInfo">SCORE</p>\n' +
                '</div>\n' +
                '<div id="userDate" class="leaderboardDisplayColumn">\n' +
                '<p class="displayInfo">DATE</p>\n' +
                '</div>\n' +
                '</div>\n'
        scoreDisplay.innerHTML += xmlhttp.responseText
      }
    })
}

displayQuizResultCateogry()
