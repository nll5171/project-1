// Handle response from the fetch request. parseResponse exists
// to prevent parsing a HEAD request
const handleResponse = async (response, parseResponse) => {
    //Grab the content section so that we can write to it
    const content = document.querySelector('#content');

    //Based on the status of the response, write something.
    switch (response.status) {
        case 200:
            content.innerHTML = `<b>Success</b>`;
            break;
        case 201:
            content.innerHTML = `<b>Created</b>`;
            break;
        case 204:
            content.innerHTML = `<b>Updated</b>`;
            break;
        case 400:
            content.innerHTML = `<b>Bad Request</b>`;
            break;
        default:
            content.innerHTML = `<b>Not Found</b>`;
            break;
    }

    //If we should parse a response (meaning we made a get request)
    if (parseResponse && response.status !== 204) {
        //Parse the response to json. This is an async function, so we will await it.
        let obj = await response.json();
        console.log(obj);

        // Don't add "Message: " if parsing 200 request
        if (response.status !== 200) {
            content.innerHTML += `<p>Message: ${obj.message}</p>`;
        } else {
            //To display the data easily, we will just stringify it again and display it.
            let jsonString = JSON.stringify(obj.users);
            content.innerHTML += `<p>${jsonString}</p>`;
        }
    }
};

//function to send request. Marked async because of await
// const requestUpdate = async (userForm) => {

//     //Grab the url and method from the html form below
//     let url = '/getPokemonNames?type=fire';
//     const method = userForm.querySelector('#methodSelect').value;

//     console.log(url);

//     //Await our fetch response. Go to the URL, use the right method, and attach the headers.
//     let response = await fetch(url, {
//         method,
//         headers: {
//             'Accept': 'application/json'
//         },
//     });

//     // Check if request should send back a response, or just status code for HEAD
//     handleResponse(response, method === 'get');
// };

const requestUpdate = async (form, url) => {
    console.log(form.querySelector('#method-select'));
    const method = form.querySelector('#method-select').value;
    console.log(url);

    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        },
    });

    // Check if request should send back a response, or just status code for HEAD
    handleResponse(response, method === 'get');
};

const sendPost = async (nameForm) => {
    const url = nameForm.getAttribute('action');
    const method = nameForm.getAttribute('method');

    const nameField = nameForm.querySelector('#nameField');
    const ageField = nameForm.querySelector('#ageField');

    const formData = `name=${nameField.value}&age=${ageField.value}`;

    let response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    // Once response exists, handle it
    handleResponse(response, true);
}

const init = () => {
    const pkmnNamesForm = document.querySelector('#collapsePokemonNames');
    const pkmnForm = document.querySelector('#collapsePokemon');
    const pkmnNumber = document.querySelector('#collapsePokemonNumber');
    const allPkmn = document.querySelector('#collapseAllPokemon');

    //grab form for user retrieval
    const userForm = document.querySelector('#userForm'); // Receiving users
    const nameForm = document.querySelector('#nameForm'); // Adding users

    const getPokemonNames = (e) => {
        let name = pkmnNamesForm.querySelector('#pkmnName').value;
        let typeUnformatted = pkmnNamesForm.querySelector('#pkmnType').value;
        let type = typeUnformatted.split(', ').join(',');
        let id = pkmnNamesForm.querySelector('#pkmnID').value;

        // Format url
        let url = '/getPokemonNames?';
        if (name) url += `name=${name}`;
        if (type) url += `type=${type}`;
        if (id) url += `id=${id}`;

        requestUpdate(pkmnNamesForm, url);
    }

    //function to handle our request. In this case, it also cancels the built in html form action
    const getUsers = (e) => {
        e.preventDefault();
        requestUpdate(userForm);
        return false;
    }

    const addUser = (e) => {
        e.preventDefault();
        sendPost(nameForm);
        return false;
    }

    //add event listener
    pkmnNamesForm.querySelector('#search-btn').addEventListener('click', getPokemonNames);

    userForm.addEventListener('submit', getUsers);
    nameForm.addEventListener('submit', addUser);
};

window.onload = init;