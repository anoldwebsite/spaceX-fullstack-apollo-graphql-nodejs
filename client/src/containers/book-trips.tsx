import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "../components/button";
import { GET_LAUNCH } from "./cart-item";
import * as GetCartItemsTypes from "../pages/__generated__/GetCartItems";
import * as BookTripsTypes from "./__generated__/BookTrips";
//You can download the folder __generated__ from this link
// //https://github.com/apollographql/fullstack-tutorial/tree/master/start/client/src/containers

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface BookTripsProps extends GetCartItemsTypes.GetCartItems {}

const BookTrips: React.FC<BookTripsProps> = ({ cartItems }) => {
  const [bookTrips, { data }] = useMutation<
    BookTripsTypes.BookTrips,
    BookTripsTypes.BookTripsVariables
  >(BOOK_TRIPS, {
    variables: { launchIds: cartItems },
    refetchQueries: cartItems.map((launchId) => ({
      query: GET_LAUNCH,
      variables: { launchId },
    })),
    update(cache) {//Direct write to the Apollo client cache is done in the update function here.
      cache.writeData({
        data: {
          cartItems: [], //reset the cartItem after mutation
        },
      });
    },
  });

  return data && data.bookTrips && !data.bookTrips.success ? (
    <p data-testid="message">{data.bookTrips.message}</p>
  ) : (
    <Button onClick={() => bookTrips()}>
      Book All
    </Button>
  );
};

export default BookTrips;
