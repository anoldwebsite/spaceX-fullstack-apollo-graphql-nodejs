import gql from "graphql-tag";
import { ApolloCache } from "apollo-cache";
import * as GetCartItemTypes from "./pages/__generated__/GetCartItems";
import * as LaunchTileTypes from "./pages/__generated__/LaunchTile";
import { Resolvers } from "apollo-client";

import { GET_CART_ITMES } from "./pages/cart";
/*
    We are extending the type of our server schema and wrapping 
    it in the gql function. Using the extend keyword allows to 
    combine both schemas inside developer tooling like Apollo
     VSCode and ApolloDevTools.
*/
/*
    We can also add local fields to server data by extending
     types from our server. Here, we are adding the
      isInCart local field to the Launch type we receive
       back from our graph API.
*/
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Launch: ResolverMap;
  Mutation: ResolverMap;
}

export const resolvers: AppResolvers = {
  Launch: {
    isInCart: (launch: LaunchTileTypes.LaunchTile, _, { cache }): boolean => {
      const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems>({
        query: GET_CART_ITMES,
      });

      if (queryResult) {
        return queryResult.cartItems.includes(launch.id);
      }
      return false;
    },
  },
  Mutation: {
    addOrRemoveFromCart: (_, { id }: { id: string }, { cache }): string[] => {
      const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems, any>({
        query: GET_CART_ITMES,
      });
      if (queryResult) {
        const { cartItems } = queryResult;
        /**
         * Now, that we have our cart data, we either remove or add the cart item's
         * id passed into the mutation to the list.
         */
        const data = {
          cartItems: cartItems.includes(id)
            ? cartItems.filter((i) => i !== id) //true case - remove the item from the list
            : [...cartItems, id], //false case - add item to the list
        };
        cache.writeQuery({
          query: GET_CART_ITMES,
          data,
        });
        return data.cartItems;
      }
      return []; //If there are no items in the cart, return [].
    },
  },
};
