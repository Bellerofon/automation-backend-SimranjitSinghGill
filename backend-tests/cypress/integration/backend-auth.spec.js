
import * as clientHelpers from '../helpers/clientHelpers'

const LOGIN_URL = 'http://localhost:3000/api/login'

describe('testing auth', function(){
    
    it('Create a new client', function(){
        clientHelpers.createClientRequest(cy)
    })
    it('Get all Clients', function(){
        clientHelpers.getAllClientsRequest(cy)
    })
    it('Delete a Client', function(){
        clientHelpers.deleteRequestAfterGet(cy)
    })
    // it('Create a client and delete it', function(){
    //     clientHelpers.createClientRequestAndDelete(cy)
    // })
    it('Logout', function(){
        clientHelpers.preformValidLogut(cy)
    })
})