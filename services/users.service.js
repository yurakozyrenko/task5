const User = require('../models/users');

class UsersService {
    async getUser(data) {
        const user = await User.findOne(data);
        return user;
    }

    async createUser(user) {
        const newUser = new User(user);
        newUser.save();
        return newUser;
    }
}
module.exports = new UsersService();
