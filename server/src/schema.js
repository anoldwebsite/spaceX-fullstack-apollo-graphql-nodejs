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
//isBooked: Boolean! //with ! after Boolean, Launch.isBooked. GraphQL error: Cannot return null for non-nullable field 
//isBooked: Boolean //Without ! after Boolean Loads the launches but the individual detail page of launches is not shown.
const typeDefs = gql`
    type Launch {
        id: ID!
        site: String
        mission: Mission 
        rocket: Rocket
        isBooked: Boolean 
    }
    type Rocket {
        id: ID!
        name: String
        type: String
    }
    type User{
        id: ID!
        email: String!
        profileImage: String
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
        launches(
            """
            The number of results to show. Must be >= 1. Default = 20
            """
            pageSize: Int
            """
            If you add a cursor here, it will only return results _after_ this cursor
            """
            after: String
        ): LaunchConnection!
        launch(id: ID!): Launch 
        me: User
    }
    """
    Simple wrapper around our list of launches that contains a cursor to the 
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
    """
    type LaunchConnection {
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }
    
    type Mutation {
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        cancelTrip(launchId: ID!): TripUpdateResponse!
        login(email: String): String 
    }
`;

module.exports = typeDefs;