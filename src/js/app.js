const messageForMulti = 'You got your question! Now send me which alternative that is right (the key) as the answer via HTTP POST to the nextURL in JSON-format'
const theBody = document.querySelector('body')
const divMain = document.querySelector('#inputName')
const submitButton = document.getElementById('button')
let totalTime = 0
const userName = document.querySelector('#nameOfUser')
let userNameString = ''
let urlLink = 'http://vhost3.lnu.se:20080/question/1'
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
function removePrevious () {
  while (divMain.firstChild) {
    divMain.removeChild(divMain.firstChild)
  }
}
function mainEvent () {
  window.fetch(urlLink).then(responseFromServer => {
    responseFromServer.json().then(finalParse => { console.log(finalParse); recievedObj = finalParse }).then(() => {
      if (recievedObj.message === messageForMulti) {
        removePrevious()
        console.log('its multi')
        const questionField = document.createElement('div')
        const questionShow = document.createTextNode(recievedObj.question)
        questionField.appendChild(questionShow)
        divMain.appendChild(questionField)
        const options = Object.values(recievedObj.alternatives)
        let idNum = 0
        for (const choiceSelect of options) {
          idNum++
          const pick = document.createElement('input')
          pick.type = 'radio'
          pick.name = 'userChoice'
          pick.textContent = choiceSelect
          pick.value = choiceSelect
          pick.id = 'alt' + idNum
          console.log(pick.id)
          const spaces = document.createElement('br')
          const nameOfButton = document.createElement('label')
          nameOfButton.textContent = choiceSelect
          divMain.appendChild(pick)
          divMain.appendChild(nameOfButton)
          divMain.appendChild(spaces)
        }
        const answerButton2 = document.createElement('input')
        answerButton2.id = 'answerSubmit2'
        answerButton2.type = 'submit'
        answerButton2.value = 'Send'
        divMain.appendChild(answerButton2)
        let countDown = 0
        const timer = setInterval(() => {
          console.log(countDown)
          countDown++
          if (countDown === 20) {
            totalTime += countDown
            clearInterval(timer)
            console.log('No you didnt')
            theBody.removeChild(divMain)
            showScore()
          }
        }, 1000)
        answerButton2.addEventListener('click', () => {
          for (let i = 1; i < idNum + 1; i++) {
            const objId = '#alt' + i
            const radioSelector = document.querySelector(objId)
            if (radioSelector.checked === true) {
              givenAnswer = radioSelector.id
              totalTime += countDown
              console.log(totalTime)
              clearInterval(timer)
              const sendAsnwerObj = {
                answer: givenAnswer
              }
              urlLink = recievedObj.nextURL
              console.log(givenAnswer)
              console.log(urlLink)
              window.fetch(urlLink, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sendAsnwerObj)
              }).then(responseReply => {
                responseReply.json().then(responseObj => { recievedObj = responseObj }).then(() => {
                  console.log(recievedObj.message)
                  if (recievedObj.message === 'Correct answer!') {
                    urlLink = recievedObj.nextURL
                    console.log('you reached here')
                    return mainEvent()
                  }
                })
              })
            }
          }
        })
      } else {
        removePrevious()
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
            totalTime += countDown
            clearInterval(timer)
            console.log('No you didnt')
            theBody.removeChild(divMain)
            showScore()
          }
        }, 1000)
        answerButton.addEventListener('click', () => {
          givenAnswer = answerInput.value
          totalTime += countDown
          console.log(totalTime)
          clearInterval(timer)
          const sendAsnwerObj = {
            answer: givenAnswer
          }
          urlLink = recievedObj.nextURL
          console.log(givenAnswer)
          console.log(urlLink)
          window.fetch(urlLink, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendAsnwerObj)
          }).then(responseReply => {
            responseReply.json().then(responseObj => { recievedObj = responseObj }).then(() => {
              console.log(recievedObj)
              if (recievedObj.message === 'Correct answer!') {
                urlLink = recievedObj.nextURL
                console.log('you reached here')
                return mainEvent()
              }
            })
          })
        })
      }
    })
  })
}

submitButton.addEventListener('click', function () {
  userNameString = document.querySelector('#usernameInput').value
  userName.textContent = document.querySelector('#usernameInput').value
  removeNameEntering()
  mainEvent()
})
