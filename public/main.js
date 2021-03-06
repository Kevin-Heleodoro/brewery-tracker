// Buttons
const searchUserBtn = document.querySelector('#search-users-button');
const searchIdBtn = document.querySelector('#search-user-id-button');
const addUserBtn = document.querySelector('#add-user');
const homeBtn = document.querySelector('#home-btn');
const submitUserBtn = document.querySelector('#submit-user-btn');
const updateBrewBtn = document.querySelector('#update-brews-btn');
const deleteBtn = document.querySelector('.delete-btn');

// Sections
const resultsDisplay = document.querySelector('.search-results-display')
const searchBar = document.querySelector('.search-bar')
const form = document.querySelector('.form-container')
const updateBox = document.querySelector('.update-container')

// Event Listeners
searchUserBtn.addEventListener('click', getAllUsers);
searchIdBtn.addEventListener('click', getOneUser);
addUserBtn.addEventListener('click', createUserForm);
homeBtn.addEventListener('click', resetPage);
submitUserBtn.addEventListener('click', addUser);
updateBrewBtn.addEventListener('click', updateBrews);

// Return all users in database
async function getAllUsers(){
        try {
        // Local
        // const res = await fetch('http://localhost:3000/users'); 

        // Deployed
        const res = await fetch('https://warm-basin-38859.herokuapp.com/users');
        const data = await res.json()
        populateUsers(data)
    } catch (error) {
        console.error(error)
    }
}

// Return a specific user from db
async function getOneUser(){
    const userId = document.querySelector('#userId').value

    try {
        // Local
        // const res = await fetch(`http://localhost:3000/users/${userId}`)

        // Deployed
        const res = await fetch(`https://warm-basin-38859.herokuapp.com/users/${userId}`);
        const data = await res.json()

        populateUsers(data)

        let btn = document.createElement('button');
        btn.type = "button"
        btn.className = "delete-btn"
        btn.innerText = "Delete user"
        btn.addEventListener('click', deleteUser);
        resultsDisplay.appendChild(btn);

    } catch (err) {
        let p = document.createElement('p');
        p.innerText = `ID #${userId} does not exist.`
        resultsDisplay.replaceChildren(p)
        console.error(err)
    }
}

// Add a user to the db
async function addUser(){
    let city = document.querySelector('#user-city').value
    let name = document.querySelector('#user-name').value
    let state = document.querySelector('#user-state').value
    let fav_breweries = document.querySelector('#fav-brewery').value
    let brewArr = fav_breweries.split(',')

    const newUser = {
        name: name,
        fav_breweries: brewArr,
        city: city,
        state: state
    };

    try {
        const res = await fetch(`https://warm-basin-38859.herokuapp.com/users/`, {
        // const res = await fetch(`http://localhost:3000/users/` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        // console.log(newUser)
        const data = await res.json();
        if(data){
            populateUsers(newUser)
        }
    } catch (err) {
        console.log(err)
    }
}

// Updates breweries by user id
async function updateBrews() {
    const id = document.querySelector('#user-id-update').value;
    const breweries = document.querySelector('#new-brew').value;
    const brewArr = breweries.split(',')
    const updateObj = {
    fav_breweries: brewArr,
        id: id
    }
    try {
        const res = await fetch(`https://warm-basin-38859.herokuapp.com/users/${id}`);
        // const res = await fetch(`http://localhost:3000/users/${id}`)
        const data = await res.json()
        
        if(data) {
            const res = await fetch(`https://warm-basin-38859.herokuapp.com/users/`, {
            // const res = await fetch(`http://localhost:3000/users/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateObj)
            })

            const data = await res.json()
        } 
    } catch (err) {
        let p = document.createElement('p');
        let br = document.createElement('br');
        p.innerText = `ID #${id} does not exist.`
        updateBox.prepend(p)
        updateBox.prepend(br)
        console.error(err)
    }
}

//Delete a user
async function deleteUser(){
    let id = document.querySelector('#userId').value
    try {
        const res = await fetch(`https://warm-basin-38859.herokuapp.com/users/`, {
        // const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const data = await res.json()

        let p = document.createElement('p')
        p.innerText = `\nUser #${id} has been deleted ...`
        resultsDisplay.replaceChildren(p)
    } catch (err) {
        console.log(err)
    }
}

// Populates the search results area with user information
function populateUsers(data) {
    resultsDisplay.replaceChildren()
    
    // For all users
    if(data.length > 1) {
        data.forEach((user) => {
            const {id, name, fav_breweries, city, state} = user
            
            let p = document.createElement('p')
            p.innerText = `\n${id}. ${name.toUpperCase()} from ${city}, ${state}\nFavorite breweries are:`
            resultsDisplay.appendChild(p)
    
            fav_breweries.forEach((b) => {
                let li = document.createElement('li')
                li.innerText = `${b}`
                resultsDisplay.appendChild(li)
            })
        })
    } 
    // For a single user
    else {
        const {id, name, fav_breweries, city, state} = data
        
        let p = document.createElement('p')
        p.innerText = `\n${id}. ${name.toUpperCase()} from ${city}, ${state}\nFavorite locations are:`
        resultsDisplay.appendChild(p)
    
        fav_breweries.forEach((b) => {
            let li = document.createElement('li')
            li.innerText = `${b}`
            resultsDisplay.appendChild(li)
        })
    }
}

function createUserForm() {
    if (form.style.display === "flex") {
        console.log('Form is already up')
    } else {
        form.style.display = "flex"
        resultsDisplay.style.display = "none"
        searchBar.style.display = "none"
        brewSearchForm.style.display = "none"
    }
}

function resetPage(){
    searchBar.style.display = "flex"
    resultsDisplay.style.display = "flex"
    form.style.display = "none"
    brewSearchForm.style.display = "none"
    resultsDisplay.replaceChildren()
}