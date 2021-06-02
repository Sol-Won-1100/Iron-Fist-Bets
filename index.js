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
        console.log(newUl)
        console.log(betsCell)
    }
        )

}

function init() {
    const userInputForm = document.querySelector('#addUser')
    userInputForm.addEventListener('submit', addUser)
    
    getInitialEvents()
}

init()