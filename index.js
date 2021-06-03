
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
    })
    .then(res => res.json())
    .then(() => {
        e.target.newUser.value = ''
        getUsers()
    })
} else {
    console.log('You need a user name dummy')
}
}

function getInitialEvents() {
    let body = document.querySelector('#currentEventsBody')
    body.innerHTML = ''
    
    fetch('http://localhost:3000/events?determined=false')
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
    
    let timestamp = document.createElement('td')//make a event title data cell
    
    row.id = `R${eventObj.id}`

    eventTitle.textContent = eventObj.betTitle
    eventTitle.className = 'table'

    populateBets(eventObj.id)
    bets.classList.add('table', 'bets')

    wager.textContent = eventObj.wager
    wager.className = 'table'

    // outcome.textContent = 'Who won?'
    outcome.classList.add('table', 'outcome', 'flexButts')
    addNamesToButts(eventObj.id)

    timestamp.textContent = eventObj.timestamp
    timestamp.className = 'table'


    row.append(eventTitle, bets, wager, outcome, timestamp)
    body.append(row)

     let collapsibleTable = document.querySelector('#active')
     collapsibleTable.style.maxHeight = 'max-content'
    
}

function getDeterminedEvents() {
    let body = document.querySelector('#determinedEventsBody')
    body.innerHTML = ''
    
    fetch('http://localhost:3000/events?determined=true')
    .then(res => res.json())
    .then(events => events.forEach(populateDeterminedEvent))
}

function populateDeterminedEvent(eventObj) {
    let body = document.querySelector('#determinedEventsBody')
    let row = document.createElement('tr') //make a row
    let eventTitle = document.createElement('td')//make a event title data cell
    let bets = document.createElement('td')//make a event title data cell
    let wager = document.createElement('td')//make a event title data cell
    let outcome = document.createElement('td')//make a event title data cell
    let paid = document.createElement('td')//make a event title data cell
    let paidButt = document.createElement('button')
    let timestamp = document.createElement('td')//make a event title data cell
    
    row.id = `R${eventObj.id}`

    eventTitle.textContent = eventObj.betTitle
    eventTitle.className = 'table'

    populateBets(eventObj.id)
    bets.classList.add('table', 'bets')

    wager.textContent = eventObj.wager
    wager.className = 'table'

    outcome.textContent = `${eventObj.victor} won the bet!`
    outcome.classList.add('table', 'outcome')

    paid.className = 'table'
    paidButt.textContent = 'Loser Paid'
    paidButt.addEventListener('click', (e) => loserPaid(e, eventObj.id))
    paid.append(paidButt)


    timestamp.textContent = eventObj.timestamp
    timestamp.className = 'table'


    row.append(eventTitle, bets, wager, outcome, paid, timestamp)
    body.append(row)
}

function loserPaid(e, id) {
    fetch(`http://localhost:3000/events/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            settled: true,
            determined: 'complete'
        })
    })
    .then(res => res.json())
    .then(() => {
        getDeterminedEvents()
        getSettledEvents()
    })
}

function getSettledEvents() {
    let body = document.querySelector('#settledEventsBody')
    body.innerHTML = ''
    
    fetch('http://localhost:3000/events?settled=true')
    .then(res => res.json())
    .then(events => events.forEach(populateSettledEvent))
}

function populateSettledEvent(eventObj) {
    let body = document.querySelector('#settledEventsBody')
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

    outcome.textContent = `${eventObj.victor} won the bet!`
    outcome.classList.add('table', 'outcome')

    paid.className = 'table'
    paid.textContent = 'Loser Paid'

    timestamp.textContent = eventObj.timestamp
    timestamp.className = 'table'

    row.append(eventTitle, bets, wager, outcome, paid, timestamp)
    body.append(row)
}

function addNamesToButts(id) {
    fetch(`http://localhost:3000/bets?eventId=${id}`)
    .then(res => res.json())
    .then(betsArray => {

        let outCell = document.querySelector(`#R${id} .outcome`)
        
        betsArray.forEach((bet) => {
        fetch(`http://localhost:3000/users/${bet.userId}`)
        .then(res => res.json())
        .then(user => {
            let outButt = document.createElement('button')
            outButt.classList.add('flexButtItem', 'button')
            outButt.textContent =`${user.name} wins!`
            outButt.value = user.name
            outButt.addEventListener('click', (e) => chooseVictor(e, id))
            outCell.append(outButt)
        })

    }
        )
    })
}

function chooseVictor(e, id) {
    
    fetch(`http://localhost:3000/events/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            victor: e.target.value,
            determined: true
        })
    })
    .then(res => res.json())
    .then(() => {
        getInitialEvents()
        getDeterminedEvents()
    })
}

function populateBets (id) {
    fetch(`http://localhost:3000/bets?eventId=${id}`)
    .then(res => res.json())
    .then(data => {

        let newUl = document.createElement('ul')
        
        data.forEach((element) => {
        fetch(`http://localhost:3000/users/${element.userId}`)
        .then(res => res.json())
        .then(user => {
        
        let newLi = document.createElement('li')
        newLi.textContent =`${user.name} bets that: ${element.prediction}`
        newUl.append(newLi)
        })
        let betsCell = document.querySelector(`#R${id} .bets`)
        betsCell.append(newUl)
    }
        )
    })
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
    if(e.target.newEvent.value != '' && e.target.wager.value != '' && e.target.newBet1.value != '' && e.target.newBet2.value != ''){
        let newDate = new Date()
        let newEventObj = {
        betTitle: e.target.newEvent.value,
        wager: e.target.wager.value,
        timestamp: newDate.toDateString(),
        determined: false,
        settled: false
    }
    e.target.newEvent.value = ''
    e.target.wager.value = ''

    fetch(`http://localhost:3000/events`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEventObj)
    }).then(res => res.json())
    .then(data => postBets(data, e))
} else {
    console.log('Fields cannot be empty')
}
}

function postBets(eventObj, e) {
    
    let betObj1 = {
         prediction: e.target.newBet1.value,
         eventId: eventObj.id,
         userId: e.target.userSelection1.value
    }

    let betObj2 = {
        prediction: e.target.newBet2.value,
        eventId: eventObj.id,
        userId: e.target.userSelection2.value
    }

    e.target.newBet1.value = ''
    e.target.newBet2.value = ''

    let promise1 = fetch(`http://localhost:3000/bets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(betObj1)
    })
    .then(res => res.json())
    .then()

    let promise2 = fetch(`http://localhost:3000/bets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(betObj2)
    })
    .then(res => res.json())
    .then()

    Promise.all([promise1, promise2])
    .then(getInitialEvents())
}

// function refresh() {
//     getDeterminedEvents()
//     getInitialEvents()
//     getSettledEvents()
// }

function createCollapsibles() {
    
    const collapsible = document.getElementsByClassName('collapsible');

    for(let i = 0; i < collapsible.length; i++) {
        collapsible[i].addEventListener('click', function() {
            console.log('clicked!')
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if(content.style.maxHeight) {
               content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
            console.log(content)
            console.log(content.style.maxHeight)
        });
    }
}

function init() {
    const userInputForm = document.querySelector('#addUser')
    userInputForm.addEventListener('submit', addUser)
    const newEventForm = document.querySelector('#testForm')
    newEventForm.addEventListener('submit', newEventPost)

    createCollapsibles()

    getInitialEvents()
    getUsers()
    getDeterminedEvents()
    getSettledEvents()
}

init()