const submitButton = document.getElementById('button')
const userName = document.querySelector('#nameOfUser')
function removeNameEntering () {
  const divMain = document.querySelector('#inputName')
  const toRemove = document.querySelector('#toBeRemoved')
  divMain.removeChild(toRemove)
}
submitButton.addEventListener('click', function () {
  userName.textContent = document.querySelector('#usernameInput').value
  removeNameEntering()
})
