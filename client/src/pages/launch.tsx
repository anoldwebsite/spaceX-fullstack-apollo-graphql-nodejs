import React, { Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Loading, Header, LaunchDetail } from "../components";
import { ActionButton } from "../containers";
import * as LaunchDetailsTypes from "./__generated__/LaunchDetails";
import { LAUNCH_TILE_DATA } from "./launches";

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site 
      rocket {
        type 
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchProps extends RouteComponentProps {
  launchId?: any;
}

const Launch: React.FC<LaunchProps> = ({ launchId }) => {
  const { data, loading, error } = useQuery<
    LaunchDetailsTypes.LaunchDetails,
    LaunchDetailsTypes.LaunchDetailsVariables
  >(GET_LAUNCH_DETAILS, {
    variables: { launchId },
  });

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) return <p>Not Found</p>;

  return (
    <Fragment>
      <Header
        image={
          data.launch && data.launch.mission && data.launch.mission.missionPatch
        }
      >
        {data && data.launch && data.launch.mission && data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </Fragment>
  );
};

export default Launch;
