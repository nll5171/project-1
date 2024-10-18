// Handle response from the fetch request. parseResponse exists
// to prevent parsing a HEAD request
const handleResponse = async (response, parseResponse) => {
    //Grab the content section so that we can write to it
    const content = document.querySelector('#request-output');

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

const requestUpdate = async (form, url) => {
    const method = form.querySelector('#method-select').value;

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

// Handles repeated code for getPokemonNames and getPokemon, since they 
// function the same, just with different outputs
const formatRequest = (form, urlPath) => {
    let name = form.querySelector('#pkmnName').value;
    let typeUnformatted = form.querySelector('#pkmnType').value;
    let type = typeUnformatted.split(', ').join(',');
    let id = form.querySelector('#pkmnID').value;

    // Format url
    let url = `${urlPath}?`;
    if (name) url += `name=${name}`;
    if (type) url += `type=${type}`;
    if (id) url += `id=${id}`;

    requestUpdate(form, url);
}

const init = () => {
    const pkmnNamesForm = document.querySelector('#collapsePokemonNames');
    const pkmnForm = document.querySelector('#collapsePokemon');
    const pkmnNumberForm = document.querySelector('#collapsePokemonNumber');
    const allPkmnForm = document.querySelector('#collapseAllPokemon');

    const getPokemonNames = () => {
        formatRequest(pkmnNamesForm, '/getPokemonNames');
    };

    const getPokemon = () => {
        formatRequest(pkmnForm, '/getPokemon');
    };

    const getPokemonByNumber = () => {
        let id = pkmnNumberForm.querySelector('#pkmnID').value;

        let url = '/getPokemonByNumber?';
        if (id) url += `id=${id}`;

        requestUpdate(pkmnNumberForm, url);
    };

    const getAllPokemon = () => {
        requestUpdate(allPkmnForm, '/getAllPokemon');
    }

    //add event listener
    pkmnNamesForm.querySelector('#search-btn').addEventListener('click', getPokemonNames);
    pkmnForm.querySelector('#search-btn').addEventListener('click', getPokemon);
    pkmnNumberForm.querySelector('#search-btn').addEventListener('click', getPokemonByNumber);
    allPkmnForm.querySelector('#search-btn').addEventListener('click', getAllPokemon);
};

window.onload = init;