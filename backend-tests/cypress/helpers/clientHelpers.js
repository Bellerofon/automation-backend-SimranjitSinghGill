/// <reference types="cypress" />

const faker = require('faker')

const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients/'
const ENDPOINT_POST_CLIENTS = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/logout'
const ENDPOINT_PUT_CLIENT = 'http://localhost:3000/api/client/'


const fakeName = faker.name.firstName()
const fakeEmail = faker.internet.email()
const fakePhone = faker.phone.phoneNumber()

function createRandomClientPayload() {

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }
    return payload
}
function getRequestAllClientsWithAssertion(cy, name, email, telephone) {
    // GET request to fetch all clients
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)

        cy.log(response.body[response.body.length - 1].id)
        cy.log(response.body.length)
    }))
}
function deleteRequestAfterGet(cy) {
    // GET request to fetch all clients
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        let lastId = response.body[response.body.length - 1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_CLIENT + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response.body)
            cy.log(responseAsString)
            expect(responseAsString).to.have.string('true')
        }))

    }))
}
function getAllClientsRequest(cy) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
        }))
    }))
}
function createClientRequest(cy) {
    cy.authenticateSession().then((response => {
        let fakeClientPayload = createRandomClientPayload()

        // POST request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))
        getRequestAllClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)
    }))
}
function createClientRequestEdit(cy) {
    cy.authenticateSession().then((response => {

        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const lastId = response.body[response.body.length - 1].id
            const lastCreated = response.body[response.body.length - 1].created
            // PuT request to edit client
            cy.request({
                method: "PUT",
                url: ENDPOINT_PUT_CLIENT + lastId,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body:{
                    "id": lastId,
                    "created": lastCreated,
                    "name": fakeName,
                    "email": fakeEmail,
                    "telephone": fakePhone
                }

            }).then((response => {

                const responseAsString = JSON.stringify(response.body)
                expect(responseAsString).to.have.string(response.body.name)
                getRequestAllClientsWithAssertion(cy, response.body.name, response.body.email, response.body.telephone)
            }))
            //getRequestAllClientsWithAssertion(cy, body[name], body[email], body[telephone])
        }))
    }))
}
// function createClientRequestAndDelete(cy){
//     cy.authenticateSession().then((response =>{
//         let fakeClientPayload = createRandomClientPayload()

//         // POST request to create a client
//         cy.request({
//             method: "POST",
//             url: ENDPOINT_POST_CLIENTS,
//             headers:{
//                 'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
//                 'Content-Type': 'application/json'
//         },
//         body:fakeClientPayload
//     }).then((response =>{
//         const responseAsString = JSON.stringify(response)
//         expect(responseAsString).to.have.string(fakeClientPayload.name)
//     }))

//     // delete
//         deleteRequestAfterGet(cy)

//     }))
// }
function preformValidLogut(cy) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: "GET",
            url: ENDPOINT_POST_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },

        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(response.status).to.eq(200)

        }))
    }))
}

module.exports = {
    createRandomClientPayload,
    getAllClientsRequest,
    createClientRequest,
    deleteRequestAfterGet,
    createClientRequestEdit,
    //createClientRequestAndDelete,
    preformValidLogut
}