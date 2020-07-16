import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { GET_LAUNCH_DETAILS } from "../pages/launch";
import Button from "../components/button";
import * as LaunchDetailTypes from "../pages/__generated__/LaunchDetails";

export const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`;

export const CANCEL_TRIP = gql`
  mutation cance($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface ActionButtonProps
  extends Partial<LaunchDetailTypes.LaunchDetails_launch> {}

const ActionButton: React.FC<ActionButtonProps> = ({
  isBooked,
  id,
  isInCart,
}) => {
  const [mutate, { loading, error }] = useMutation(
    isBooked
      ? CANCEL_TRIP //True case. If it is already booked, then the button has been clicked to cancel it.
      : TOGGLE_CART, //false case. If it is not booked then call the addOrRemoveFromCart resolver to add or remove it from the local cache.
    {
      variables: { launchId: id },
      refetchQueries: [
        {
          query: GET_LAUNCH_DETAILS,
          variables: {
            launchId: id,
          },
        },
      ],
    }
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>An error has occured.</p>;

  return (
    <div>
      <Button onClick={() => mutate()}>
        {
          isBooked
            ? "Cancel this Trip"
            : //false case i.e., the trip is not booked.
            //Check if the the trip hass been added to the cart or not
            isInCart
            ? "Remove from Cart" //Yes the trip is in the cart
            : "Add to Cart" //No the trip is not in the cart.
        }
      </Button>
    </div>
  );
};

export default ActionButton;
