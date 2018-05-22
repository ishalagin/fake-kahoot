let displaybox = document.getElementById('displaybox')
/**
 * @module
 */

/**
 * @summary Server request to review answer
 * @function
 * @public
 */
let displayreview = () => {
  serverRequest('POST', '/review', '', (xmlhttp) => {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      reviewlist = JSON.parse(xmlhttp.responseText)
      for (var i = 0; i < reviewlist.length; i++) {
        var ndiv = document.createElement('div')
        var ndiv2 = document.createElement('div2')
        var ndiv3 = document.createElement('hr')
        ndiv2.className = 'question'
        ndiv.className = 'answer'
        ndiv3.className = 'line'
        ndiv.innerHTML = reviewlist[i][1]
        ndiv2.innerHTML = reviewlist[i][0]
        displaybox.appendChild(ndiv2)
        displaybox.appendChild(ndiv)
        displaybox.appendChild(ndiv3)
      }
    }
  })
}

displayreview()
