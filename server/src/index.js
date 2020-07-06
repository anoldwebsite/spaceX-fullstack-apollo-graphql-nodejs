require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user')

const store = createStore();//createStore() sets up our SQLite database.

// set up any dataSources our resolvers need
const dataSources = () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store }),
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    //const email = new Buffer(auth, 'base64').toString('ascii');

    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0] : null;

    return { user };
};

//Create a new instance of the server and 
//pass the imported schema via the typeDefs property.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context,
    engine: {
        reportSchema: true
    }
});

server.listen().then(({ url }) => {
    console.log(`Server is ready at ${url}`);
});


// export all the important pieces for integration/e2e tests to use
module.exports = {
    dataSources,
    context,
    typeDefs,
    resolvers,
    ApolloServer,
    LaunchAPI,
    UserAPI,
    store,
    server,
};