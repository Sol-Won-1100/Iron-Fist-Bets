
function addUser(e) {
    e.preventDefault()
    if(e.target.newUser.value != '') {
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: e.target.newUser.value
        })
    }).then(res => res.json()).then(getUsers())
} else {
    console.log('You need a user name dummy')
}
}

function getInitialEvents() {
    fetch('http://localhost:3000/events')
    .then(res => res.json())
    .then(events => events.forEach(populateEvent))
}

function populateEvent(eventObj) {
    let body = document.querySelector('#currentEventsBody')
    let row = document.createElement('tr') //make a row
    let eventTitle = document.createElement('td')//make a event title data cell
    let bets = document.createElement('td')//make a event title data cell
    let wager = document.createElement('td')//make a event title data cell
    let outcome = document.createElement('td')//make a event title data cell
    let paid = document.createElement('td')//make a event title data cell
    let timestamp = document.createElement('td')//make a event title data cell
    
    row.id = `R${eventObj.id}`

    eventTitle.textContent = eventObj.betTitle
    eventTitle.className = 'table'

    populateBets(eventObj.id)
    bets.classList.add('table', 'bets')


    wager.textContent = eventObj.wager
    wager.className = 'table'

    outcome.textContent = 'Coming Soon'
    outcome.className = 'table'

    paid.textContent = eventObj.settled
    paid.className = 'table'

    timestamp.textContent = eventObj.timestamp
    timestamp.className = 'table'


    row.append(eventTitle, bets, wager, outcome, paid, timestamp)
    body.append(row)
}

function populateBets (id) {
    fetch(`http://localhost:3000/bets?eventId=${id}`)
    .then(res => res.json())
    .then(data => {

        let newUl = document.createElement('ul')
        
        data.forEach((element) => {
        let newLi = document.createElement('li')
        newLi.textContent = element.prediction
        newUl.append(newLi)
        })
        let betsCell = document.querySelector(`#R${id} .bets`)
        betsCell.append(newUl)
    }
        )

}

function getUsers() {
    fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(populateUserDropdown)
}

function populateUserDropdown(userObjArray) {
    let user1 = document.querySelector('#userSelection1')
    let user2 = document.querySelector('#userSelection2')
    user1.innerHTML = ''
    user2.innerHTML = ''


    userObjArray.forEach(user => {
        let option1 = document.createElement('option')
        let option2 = document.createElement('option')

        option1.textContent = user.name
        option1.value = `${user.id}`
        option2.textContent = user.name
        option2.value = `${user.id}`

        user1.append(option1)
        user2.append(option2)
    })
}

function newEventPost(e){
    e.preventDefault()
    let newEventObj = {
        betTitle: e.target.newEvent.value,
        wager: e.target.wager.value,
        timestamp: Date(),
        determined: false,
        settled: false
    }
    fetch(`http://localhost:3000/events`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEventObj)
    }).then(res => res.json())
    .then(data => postBets(data, e))

}

// // function postBets(eventObj, e) {
// //     console.log(eventObj)
// //     console.log(e)
    
// //     let betObj1 = {
// //         prediction: e.target.newBet1.value,
// //         eventId: eventObj.id,
// //         userId: e.target[""]
// //     }

// //     fetch(``)
// }
const userSelectionId1 = document.querySelector('#userSelection1')
userSelectionId1.addEventListener('change', updateUserFormId1)

function updateUserFormId1 (e) {
    console.log(e.target.value)
}

function init() {
    const userInputForm = document.querySelector('#addUser')
    userInputForm.addEventListener('submit', addUser)
    const newEventForm = document.querySelector('#testForm')
    newEventForm.addEventListener('submit', newEventPost)
    let currentUserId1
    let currentUserId2
    getInitialEvents()
    getUsers()
}

init()