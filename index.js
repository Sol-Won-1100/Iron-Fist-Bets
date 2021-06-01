const userInputForm = document.querySelector('#addUser')
userInputForm.addEventListener('submit', addUser)
function addUser(e) {
    e.preventDefault()
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: e.target.newUser.value
        })
    }).then(res => res.json()).then(console.log)
}