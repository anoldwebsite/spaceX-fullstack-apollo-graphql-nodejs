import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Header, Loading } from "../components";
import { CartItem, BookTrips } from "../containers";
import { RouteComponentProps } from "@reach/router";
import * as GetCartItemsTypes from "./__generated__/GetCartItems";

export const GET_CART_ITMES = gql`
  query GetCartItems {
    cartItems @client
  }
`;

interface CartProps extends RouteComponentProps {}
//Now, we call the useQuery to bind our component to the GetCartItems query.
const Cart: React.FC<CartProps> = () => {
  const { data, loading, error } = useQuery<GetCartItemsTypes.GetCartItems>(
    GET_CART_ITMES
  );
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header>My Cart</Header>

      {!data || (!!data && data.cartItems.length === 0) ? (
        <p data-testid="empty-message">No items in your cart!</p>
      ) : (
        //False case i.e., the cart is not empty and there are launches in the cart.
        <Fragment>
          {!!data &&
            data.cartItems.map((launchId: any) => (
              <CartItem key={launchId} launchId={launchId} />
            ))}
          <BookTrips cartItems={!!data ? data.cartItems : []} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
