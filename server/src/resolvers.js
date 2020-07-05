const { paginateResults } = require('./utils');

module.exports = {
    Query: {
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.LaunchAPI.getAllLaunches();
            //We want these launches in reverse order.
            allLaunches.reverse();
            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches
            });
            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                hasMore: launches.length
                    ? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor
                    : false
            };
        },
        launch: (_, { id }, { dataSources }) =>
            dataSources.LaunchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    },

    Mission: {
        //The default size is 'LARGE' if not provided
        //mission, the first parameter is the parent
        //In the second parameter we destructure size from the arguments
        //We can assign default value to size here as well
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge
        }
    },

    Launch: {
        isBooked: async (launch, _, { dataSources }) => {
            dataSources.UserAPI.isBookedOnLaunch({ launchId: launch.id })

        }
    },

    User: {
        trips: async (_, __, { dataSources }) => {
            //get ids of launches by this user.
            const launchIds = await dataSources.UserAPI.getLaunchIdsByUser();
            if (!launchIds.length) return [];
            return dataSources.LaunchAPI.getLaunchesByIds({ launchIds }) || []
        }
    }
};