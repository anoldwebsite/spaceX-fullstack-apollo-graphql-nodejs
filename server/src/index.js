const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user')

const store = createStore();//createStore() sets up our SQLite database.

//Create a new instance of the server and 
//pass the imported schema via the typeDefs property.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        LaunchAPI: new LaunchAPI(),
        UserAPI: new UserAPI({ store })//Pass the database to the UserAPI constructor
    })
});

server.listen().then(({ url }) => {
    console.log(`Server is ready at ${url}`);
});

