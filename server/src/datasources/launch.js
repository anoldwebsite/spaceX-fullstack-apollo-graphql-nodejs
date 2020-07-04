const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';//REST API link
    }

    async getAllLaunches() {
        const response = await this.get('launches');//returns an array
        return Array.isArray(response)
            ? response.map(launch => this.launchReducer(launch))//we will write launchReducer method soon
            : [];//return an empty array if response is not an array
    };

    launchReducer(launch) {
        return {
            id: launch.flignt_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            misson: {
                name: launch.misson_name,
                missionPatchSmall: launch.links.misson_patch_small,
                missionPatchLarge: launch.links.misson_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type
            }
        }
    };

    async getLaunchById({ launchId }) {
        const response = await this.get('launches', { flight_number: launchId });
        return this.launchReducer(response[0]);
    };

    async getLaunchesByIds({ launchIds }) {
        return Promise.all(
            launchIds.map(launchId => this.getLaunchById({ launchId }))
        );
    }
}

module.exports = LaunchAPI;