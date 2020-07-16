import React, { Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import * as GetLaunchListTypes from "./__generated__/GetLaunchList";
import { Loading, Header, LaunchTile, Button } from "../components";

/*
  We define a GraphQL fragment by giving it a name. You can give it any name. Here we have givine it the name LaunchTile.
  A fragment is defined on a schema. We have defined LaunchTile on schema Launch.
  We import a GraphQL fragment after defining it. We have defined it here so, we need to 
  import it in any other file that we want to use this fragment. We will import it in launch.tsx.
  Let's use this fragment here first and then we will import and use it in launch.tsx
*/
export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;
/*
Let's define a query to fetch a list of launches by calling the 
launches query from our schema. The launches query returns an object 
type with a list of launches, in addition to the cursor of the paginated
list and whether or not the list hasMore launches. We need to wrap the
query with the gql function in order to parse it inot an AST.
*/
export const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

/* Now, let's pass that query to Apollo's useQuery component to render the list. */
interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const { data, loading, error, fetchMore } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) return <p>Not Found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.launches &&
      data.launches.hasMore && ( //If we have more launches then show the button
          <Button
            onClick={() =>
              //Once the button is clicked call fetchMore function from Apollo
              fetchMore(
                //fetchMore function receives new variables for the list of launches query, which is represented by our cursor.
                {
                  variables: {
                    after: data.launches.cursor,
                  },
                  //We define function updateQuery to tell Apollo how to update
                  //the list of launches in the cache. To do this, we take the
                  //previous query result and combine it with the new query
                  //resut from fetchMore function provided by Apollo
                  updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                    if (!fetchMoreResult) return prev; //Return the previous query results if no more launches are available
                    return {
                      ...fetchMoreResult,
                      launches: {
                        ...fetchMoreResult.launches,
                        launches: [
                          ...prev.launches.launches,
                          ...fetchMoreResult.launches.launches,
                        ],
                      },
                    };
                  },
                }
              )
            }
          >
            Load More
          </Button>
        )}
    </Fragment>
  );
};
/*
Now, that we have fetchMore, let's connect it to a Load More button to fetch
more items when it is clicked. To do this, we will need to specify an 
updateQuery function on the return object from fetchMore that tells the 
Apollo cache how to update our query with the new items we're fetching.
*/
/*
Right now we are mappig over an array of 20 launches. This means that we 
are fetching only 20 launches. To fetch all launches, the whole list of 
launches, we need to build a pagination feature that displays Load More button
for loading more items on the screen. 

Pagination with Apollo is very easy as we have jto desturcture fetchMore function
from the useQuery above.  We have a built-in helper in Apollow to do it for us.
*/

export default Launches;
