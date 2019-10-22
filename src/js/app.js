const submitButton = document.getElementById('button')
let totalTime = 0
const userName = document.querySelector('#nameOfUser')
const urlLink = 'http://vhost3.lnu.se:20080/question/1'
let willYouCountinue = false
let givenAnswer = null
let recievedObj = {}
function removeNameEntering () {
  const divMain = document.querySelector('#inputName')
  const toRemove = document.querySelector('#toBeRemoved')
  divMain.removeChild(toRemove)
}
submitButton.addEventListener('click', function () {
  userName.textContent = document.querySelector('#usernameInput').value
  removeNameEntering()
  window.fetch(urlLink).then(responseFromServer => {
    responseFromServer.json().then(finalParse => { console.log(finalParse); recievedObj = finalParse }).then(() => {
      const theBody = document.querySelector('body')
      const questionField = document.createElement('div')
      const questionShow = document.createTextNode(recievedObj.question)
      questionField.appendChild(questionShow)
      theBody.appendChild(questionField)
      const answerInput = document.createElement('input')
      answerInput.type = 'text'
      theBody.appendChild(answerInput)
      const answerButton = document.createElement('input')
      answerButton.id = 'answerSubmit'
      answerButton.type = 'submit'
      answerButton.value = 'Send'
      theBody.appendChild(answerButton)
      let countDown = 0
      const timer = setInterval(() => {
        console.log(countDown)
        countDown++
        if (countDown === 20) {
          willYouCountinue = false
          totalTime += countDown
          clearInterval(timer)
          console.log('No you didnt')
        }
      }, 1000)
      answerButton.addEventListener('click', () => {
        givenAnswer = answerInput.value
        willYouCountinue = true
        totalTime += countDown
        countDown = 20
        clearInterval(timer)
        console.log('yes you did')
      })
      console.log('you came this far')
    })
  })
})
