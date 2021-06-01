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
    
    eventTitle.textContent = eventObj.betTitle
    bets.innerHTML = 'Bets' //populateBets(eventObj.id)
    wager.textContent = eventObj.wager
    outcome.textContent = 'Coming Soon'
    paid.textContent = eventObj.settled
    timestamp.textContent = eventObj.timestamp

    row.append(eventTitle, bets, wager, outcome, paid, timestamp)
    body.append(row)
}


function init() {
    const userInputForm = document.querySelector('#addUser')
    userInputForm.addEventListener('submit', addUser)
    
    getInitialEvents()
}

init()