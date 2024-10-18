// Handle response from the fetch request. parseResponse exists
// to prevent parsing a HEAD request
const handleResponse = async (response, parseResponse) => {
    //Grab the content section so that we can write to it
    const content = document.querySelector('#request-output');

    let contentHTML = ``;
    contentHTML += `<h3 class='text-center'>`;

    //Based on the status of the response, write something.
    switch (response.status) {
        case 200:
            contentHTML += `<b>Success</b>`;
            break;
        case 201:
            contentHTML += `<b>Created</b>`;
            break;
        case 204:
            contentHTML += `<b>Updated</b>`;
            break;
        case 400:
            contentHTML += `<b>Bad Request</b>`;
            break;
        default:
            contentHTML += `<b>Not Found</b>`;
            break;
    }

    contentHTML += `</h3>`;
    content.innerHTML = contentHTML;

    //If we should parse a response (meaning we made a get request)
    if (parseResponse && response.status !== 204) {
        //Parse the response to json. This is an async function, so we will await it.
        let obj = await response.json();
        console.log(obj);

        // Don't add "Message: " if parsing 200 request
        if (response.status !== 200) {
            content.innerHTML += `<p class="text-center">Message: ${obj.message}</p>`;
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
                            if (item['img']) {
                                let cardImage = document.createElement('img');
                                cardImage.classList.add('card-img-top');
                                cardImage.src = item['img'];
                                card.appendChild(cardImage);
                            }

                            // Setup head of the card
                            let cardHead = document.createElement('div');
                            cardHead.classList.add('card-header');
                            cardHead.innerHTML = `<b>${item['num']}</b> ${item['name']}`;
                            card.appendChild(cardHead);

                            let cardBodyHTML = `<ul>`;

                            let types = item['type'];
                            cardBodyHTML += `<li>Type(s):<ul>`;

                            for (let j = 0; j < types.length; j++) 
                                cardBodyHTML += `<li>${types[j]}</li>`;

                            cardBodyHTML+= `</ul></li>`;

                            if (item['height']) cardBodyHTML += `<li>Height: ${item['height']}</li>`;
                            if (item['weight']) cardBodyHTML += `<li>Weight: ${item['weight']}</li>`;

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

                            // Assuming user adds tier to the list of properties, this will add it if it exists for the Pokemon
                            let tier = item['tier'];
                            if (tier) cardBodyHTML += `<li>Tier: ${tier}</li>`;

                            cardBodyHTML += `</ul>`;
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

const sendPost = async (url, formData) => {
    let response = await fetch(url, {
       method: 'POST',
       headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
       },
       body: formData,
    });

    // Once response exists, handle it
    handleResponse(response, true);
};

// Handles repeated code for getPokemonNames and getPokemon, since they 
// function the same, just with different outputs
const formatSearchRequest = (form, urlPath) => {
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
    const addPkmnForm = document.querySelector('#collapseAddPokemon');

    const getPokemonNames = () => {
        formatSearchRequest(pkmnNamesForm, '/getPokemonNames');
    };

    const getPokemon = () => {
        formatSearchRequest(pkmnForm, '/getPokemon');
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

    const addPokemon = () => {
        let id = addPkmnForm.querySelector('#pkmnID').value;
        let name = addPkmnForm.querySelector('#pkmnName').value;
        let typeUnformatted = addPkmnForm.querySelector('#pkmnType').value;
        let type = typeUnformatted.split(', ').join(',');
        let img = addPkmnForm.querySelector('#pkmnImg').value;
        let height = addPkmnForm.querySelector('#pkmnHeight').value;
        let weight = addPkmnForm.querySelector('#pkmnWeight').value;
        let weaknessesUnformatted = addPkmnForm.querySelector('#pkmnWeaknesses').value;
        let weaknesses = weaknessesUnformatted.split(', ');
        console.log(weaknesses);

        let num;

        // Solution from StackOverflow: https://stackoverflow.com/questions/10841773/javascript-format-number-to-day-with-always-3-digits
        if (id) num = ("00" + id).slice(-3);

        // Put the data into a usable format for POST request
        const formData = `id=${id}&name=${name}&type=${type}&img=${img}&height=${height}&weight=${weight}&weaknesses=${weaknesses}&num=${num}`;
        sendPost('/addPokemon', formData);
    };

    // GET/HEAD Requests
    pkmnNamesForm.querySelector('#search-btn').addEventListener('click', getPokemonNames);
    pkmnForm.querySelector('#search-btn').addEventListener('click', getPokemon);
    pkmnNumberForm.querySelector('#search-btn').addEventListener('click', getPokemonByNumber);
    allPkmnForm.querySelector('#search-btn').addEventListener('click', getAllPokemon);
    
    // POST Requests
    addPkmnForm.querySelector('#submit-btn').addEventListener('click', addPokemon);
};

window.onload = init;