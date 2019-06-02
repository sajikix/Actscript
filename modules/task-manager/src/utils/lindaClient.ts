import LindaClient from 'linda-client'

const lindaClient = new LindaClient()
lindaClient.connect('http://new-linda.herokuapp.com', 'saji')

export default lindaClient
