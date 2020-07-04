const { gql } = require('apollo-server');
/*
The schema will go inside the gql function 
(between the backticks). The language used to write the
 schema is GraphQL's schema definition language (SDL).
*/
/*
To be able to fetch a list of upcoming rocket launches, 
we should define a Launch type.
The Launch object has a collection of fields. 
A field type can be either an object or a scalar type. 
A scalar type is primitive e.g., ID, String, Boolean, Int. 
The scalar types
resolves to a single value.
*/
const typeDefs = `
    type Launch{
        id: ID!
        site: String
        mission: Mission 
        rocket: Rocket
        isBooked: Boolean! 
    }
    type Rocket {
        id: ID!
        name: String
        type: String
    }
    type User{
        id: ID!
        email: String!
        trips: [Launch]!
    }
    type Mission {
        name: String
        missionPatch(size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }

    type TripUpdateResponse{
        success: Boolean!
        message: String
        launches: [Launch]
    }

    type Query {
        launches: [Launch]!
        launch(id: ID!): Launch 
        me: User
    }
    
    type Mutation {
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        cancelTrip(launchId: ID!): TripUpdateResponse!
        login(email: String): String 
    }
`;

module.exports = typeDefs;