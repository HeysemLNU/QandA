const submitButton = document.getElementById('button')
let totalTime = 0
const userName = document.querySelector('#nameOfUser')
let userNameString = ''
const urlLink = 'http://vhost3.lnu.se:20080/question/1'
let willYouCountinue = false
let givenAnswer = null
let recievedObj = {}
const finalScore = 0
function removeNameEntering () {
  const divMain = document.querySelector('#inputName')
  const toRemove = document.querySelector('#toBeRemoved')
  divMain.removeChild(toRemove)
}
function saveScore () {
  const scoreObj = {
    name: userNameString,
    time: totalTime,
    score: finalScore
  }
  localStorage.setItem(scoreObj.name, JSON.stringify(scoreObj))
}
function showScore () {
  const theBody = document.querySelector('body')
  for (let i = 0; i < localStorage.length; i++) {
    const playerScore = document.createElement('li')
    console.log(JSON.parse(localStorage.getItem(localStorage.key(i))))
    playerScore.textContent = JSON.parse(localStorage.getItem(localStorage.key(i))).name + ' ' + JSON.parse(localStorage.getItem(localStorage.key(i))).time
    theBody.appendChild(playerScore)
  }
}
submitButton.addEventListener('click', function () {
  userNameString = document.querySelector('#usernameInput').value
  userName.textContent = document.querySelector('#usernameInput').value
  removeNameEntering()
  window.fetch(urlLink).then(responseFromServer => {
    responseFromServer.json().then(finalParse => { console.log(finalParse); recievedObj = finalParse }).then(() => {
      const theBody = document.querySelector('body')
      const divMain = document.querySelector('#inputName')
      const questionField = document.createElement('div')
      const questionShow = document.createTextNode(recievedObj.question)
      questionField.appendChild(questionShow)
      divMain.appendChild(questionField)
      const answerInput = document.createElement('input')
      answerInput.type = 'text'
      divMain.appendChild(answerInput)
      const answerButton = document.createElement('input')
      answerButton.id = 'answerSubmit'
      answerButton.type = 'submit'
      answerButton.value = 'Send'
      divMain.appendChild(answerButton)
      let countDown = 0
      const timer = setInterval(() => {
        console.log(countDown)
        countDown++
        if (countDown === 20) {
          willYouCountinue = false
          totalTime += countDown
          clearInterval(timer)
          console.log('No you didnt')
          theBody.removeChild(divMain)
          showScore()
        }
      }, 1000)
      answerButton.addEventListener('click', () => {
        givenAnswer = answerInput.value
        willYouCountinue = true
        totalTime += countDown
        console.log(totalTime)
        clearInterval(timer)
      })
    })
  })
})
