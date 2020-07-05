const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

class UserAPI extends DataSource {
    constructor({ store }) {
        super();
        this.store = store;
    }

    /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
    initialize(config) {
        this.context = config.context;
    }

    async findOrCreateUser({ email: emailArg } = {}) {
        const email = (this.context && this.context.user)
            ? this.context.user.email
            : emailArg;
        if (!email || !isEmail.validate(emailArg)) return null;
        const users = this.store.users.findOrCreate(
            {
                where: { email }
            }
        );
        return (users && users[0]) ? users[0] : null;
    }

    async bookTrips({ launchIds }) {
        const userId = this.context.user.id;
        if (!userId) return;
        let bookedTrips = [];
        for (const launchId of launchIds) {
            const res = await this.bookTrips({ launchId });
            if (res) bookedTrips.push(res);
        }
        return bookedTrips;
    }

    async bookTrip({ launchId }) {
        const userId = this.context.user.id;
        if (!userId) return;
        const res = await this.store.trips.findOrCreate(
            {
                where: {
                    userId,
                    launchId
                }
            }
        );
        const bookedTrip = res && res.length ? res[0].get() : null;
        return bookedTrip ? bookedTrip : false;
    }

    async cancelTrip({ launchId }) {
        const userId = this.context.user.id;
        return (!!this.store.trips.destroy(
            {
                where: {
                    userId,
                    launchId
                }
            }
        ));//returns a boolean  due to the double bang !!
    }

    async getLaunchIdsByUser() {
        const userId = this.context.user.id;
        const trips = await this.store.trips.findAll(
            {
                where: {
                    userId
                }
            }
        );
        return (trips && trips.length)
            ? trips//If trips were found then return trips only for this user and filter the others.
                .map(trip => trip.dataValues.launchId)//This returns an array of all launchids for the trips for this user.
                .filter(lid => !!lid)//lid stands for launchid. So we filter the ids of trips for this user only and return them as array of trip ids for this user.
            : [];//In case of no trips for this user return an empty array.
    }

    async isBookedOnLaunch({ launchId }) {
        if (!this.context || !this.context.user) return false;
        const userId = this.context.user.id;
        const found = await this.store.trips.findAll(
            {
                where: {
                    userId,
                    launchId
                }
            }
        );
        return (found && found.length > 0);//true or false
    }
}

module.exports = UserAPI;