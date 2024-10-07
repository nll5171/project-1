/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/***/ (() => {

eval("// Handle response from the fetch request. parseResponse exists\r\n// to prevent parsing a HEAD request\r\nconst handleResponse = async (response, parseResponse) => {\r\n    //Grab the content section so that we can write to it\r\n    const content = document.querySelector('#content');\r\n\r\n    //Based on the status of the response, write something.\r\n    switch (response.status) {\r\n        case 200:\r\n            content.innerHTML = `<b>Success</b>`;\r\n            break;\r\n        case 201:\r\n            content.innerHTML = `<b>Created</b>`;\r\n            break;\r\n        case 204:\r\n            content.innerHTML = `<b>Updated</b>`;\r\n            break;\r\n        case 400:\r\n            content.innerHTML = `<b>Bad Request</b>`;\r\n            break;\r\n        default:\r\n            content.innerHTML = `<b>Not Found</b>`;\r\n            break;\r\n    }\r\n\r\n    //If we should parse a response (meaning we made a get request)\r\n    if (parseResponse && response.status !== 204) {\r\n        //Parse the response to json. This is an async function, so we will await it.\r\n        let obj = await response.json();\r\n        console.log(obj);\r\n\r\n        // Don't add \"Message: \" if parsing 200 request\r\n        if (response.status !== 200) {\r\n            content.innerHTML += `<p>Message: ${obj.message}</p>`;\r\n        } else {\r\n            //To display the data easily, we will just stringify it again and display it.\r\n            let jsonString = JSON.stringify(obj.users);\r\n            content.innerHTML += `<p>${jsonString}</p>`;\r\n        }\r\n    }\r\n};\r\n\r\n//function to send request. Marked async because of await\r\nconst requestUpdate = async (userForm) => {\r\n\r\n    //Grab the url and method from the html form below\r\n    let url = '/getPokemonNames?type=fire';\r\n    const method = userForm.querySelector('#methodSelect').value;\r\n\r\n    console.log(url);\r\n\r\n    //Await our fetch response. Go to the URL, use the right method, and attach the headers.\r\n    let response = await fetch(url, {\r\n        method,\r\n        headers: {\r\n            'Accept': 'application/json'\r\n        },\r\n    });\r\n\r\n    // Check if request should send back a response, or just status code for HEAD\r\n    handleResponse(response, method === 'get');\r\n};\r\n\r\nconst sendPost = async (nameForm) => {\r\n    const url = nameForm.getAttribute('action');\r\n    const method = nameForm.getAttribute('method');\r\n\r\n    const nameField = nameForm.querySelector('#nameField');\r\n    const ageField = nameForm.querySelector('#ageField');\r\n\r\n    const formData = `name=${nameField.value}&age=${ageField.value}`;\r\n\r\n    let response = await fetch(url, {\r\n        method: method,\r\n        headers: {\r\n            'Content-Type': 'application/x-www-form-urlencoded',\r\n            'Accept': 'application/json',\r\n        },\r\n        body: formData,\r\n    });\r\n\r\n    // Once response exists, handle it\r\n    handleResponse(response, true);\r\n}\r\n\r\nconst init = () => {\r\n    //grab form for user retrieval\r\n    const userForm = document.querySelector('#userForm'); // Receiving users\r\n    const nameForm = document.querySelector('#nameForm'); // Adding users\r\n\r\n    //function to handle our request. In this case, it also cancels the built in html form action\r\n    const getPokemonNames = (e) => {\r\n        e.preventDefault();\r\n        requestUpdate(userForm);\r\n        return false;\r\n    }\r\n\r\n    const addUser = (e) => {\r\n        e.preventDefault();\r\n        sendPost(nameForm);\r\n        return false;\r\n    }\r\n\r\n    //add event listener\r\n    userForm.addEventListener('submit', getPokemonNames);\r\n    nameForm.addEventListener('submit', addUser);\r\n};\r\n\r\nwindow.onload = init;\n\n//# sourceURL=webpack://http_api_two/./client/client.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/client.js"]();
/******/ 	
/******/ })()
;