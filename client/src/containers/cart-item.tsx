import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import LaunchTile from '../components/launch-tile';
import {LAUNCH_TILE_DATA} from '../pages/launches';
import * as LaunchDetailTypes from '../pages/__generated__/LaunchDetails';//The contents of LaunchDetails will be automatically generated and should not be edited

export const GET_LAUNCH = gql`
    query GetLaunch($launchId: ID!) {
        launch(id: $launchId){
            ...LaunchTile
        }
    }
    ${LAUNCH_TILE_DATA}
`;

interface CartItemProps extends LaunchDetailTypes.LaunchDetailsVariables {};

const CartItem: React.FC<CartItemProps> = ({ launchId }) => {
    const { data, loading, error } = useQuery(
        GET_LAUNCH,
        {
            variables: 
            {
                launchId
            }
        }
    );
    if(loading) return <p>Loading...</p>
    if(error) return <p>ERROR: {error.message}</p>
    return data && <LaunchTile launch={data.launch} />
};

export default CartItem;