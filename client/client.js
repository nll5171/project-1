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
            // let jsonString = JSON.stringify(obj.users);
            // content.innerHTML += `<p>${jsonString}</p>`;

            // Technically, each object result should have one array in it, the
            // names are just different so this avoids having to deal with that
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // Get the array of either objects or strings
                    let list = obj[key];

                    for (let i = 0; i < list.length; i++) {
                        let item = list[i];

                        // setup columns to be responsive
                        let column = document.createElement('div');
                        column.classList.add('col-2');
                        column.classList.add('col-md-4');
                        column.classList.add('col-xl-3');

                        let card = document.createElement('div');
                        let cardBody = document.createElement('div');
                        card.classList.add('card');
                        cardBody.classList.add('card-body');

                        // Check if it's outputting a list of all Pokemon data, or just names
                        if (typeof item === 'object' && item !== null) {
                            // Create image and add it to the card
                            let cardImage = document.createElement('img');
                            cardImage.classList.add('card-img-top');
                            cardImage.src = item['img'];
                            card.appendChild(cardImage);

                            // Setup head of the card
                            let cardHead = document.createElement('div');
                            cardHead.classList.add('card-header');
                            cardHead.innerHTML = `<b>${item['num']}</b> ${item['name']}`;
                            card.appendChild(cardHead);

                            let cardBodyHTML = `<ul><li>Height: ${item['height']}</li><li>Weight: ${item['weight']}</li>`;

                            // Iterate through all the Pokemon's weaknesses
                            let weaknesses = item['weaknesses'];
                            if (weaknesses) {
                                cardBodyHTML += `<li>Weaknesses:<ul>`;

                                for (let j = 0; j < weaknesses.length; j++)
                                    cardBodyHTML += `<li>${weaknesses[j]}</li>`;

                                cardBodyHTML += `</ul></li>`;
                            }

                            let nextEvolutions = item['next_evolution'];
                            if (nextEvolutions) {
                                cardBodyHTML += `<li>Next evolution(s):<ol>`;

                                // Format each simple JSON object as one unordered list element
                                for (let j = 0; j < nextEvolutions.length; j++) {
                                    let evolution = nextEvolutions[j];
                                    cardBodyHTML += `<li>${evolution['num']}: ${evolution['name']}</li>`;
                                }

                                cardBodyHTML += `</ol></li>`;
                            }

                            cardBody.innerHTML = cardBodyHTML;
                        } else {
                            cardBody.innerHTML = item;
                        }

                        card.appendChild(cardBody);
                        column.appendChild(card);
                        content.appendChild(column);
                    }
                }
            }
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
    };

    //add event listener
    pkmnNamesForm.querySelector('#search-btn').addEventListener('click', getPokemonNames);
    pkmnForm.querySelector('#search-btn').addEventListener('click', getPokemon);
    pkmnNumberForm.querySelector('#search-btn').addEventListener('click', getPokemonByNumber);
    allPkmnForm.querySelector('#search-btn').addEventListener('click', getAllPokemon);
};

window.onload = init;