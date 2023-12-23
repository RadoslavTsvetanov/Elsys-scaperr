const mongoose = require('mongoose');
const db_name = "GYM";

const uri = `mongodb+srv://KURO:KURO@task-manager.8d8g6sk.mongodb.net/${db_name}?retryWrites=true&w=majority`;
// Mongoose schema for User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  latestPost: {
    type: String,
    default: '' 
  }
});

// Mongoose model based on the userSchema
const User = mongoose.model('Userss', userSchema);

// UserRepo class utilizing the User model
class UserRepo { //TODO ask if it should be better to include the username in the contructor
  constructor() {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); 
  }

  async createUser(username) {
    try {
      const newUser = new User({
        username,
        latestPost: ''
      });

      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async updateLatestPost(username, newLatestPost) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }

      user.latestPost = newLatestPost;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update latest post');
    }
  }

  async getLatestPost(username){
    try {
        const user = await User.findOne({username})
        return user.latestPost
    }catch(err){
        return err
    }
  }
}

// // Example usage
// (async () => {
//   const userRepo = new UserRepo();

//   try {
//     // Create a user
//     // const createdUser = await userRepo.createUser('example_user');
//     // console.log('Created user:', createdUser);

//     // // Update latest post for the user
//     const updatedUser = await userRepo.updateLatestPost('example_user', 'New latest post');
//     console.log('Updated user:', updatedUser);

//     console.log(await userRepo.getLatestPost('example_user'))
//   } catch (error) {
//     console.error('Error:', error.message);
//   } finally {
//     mongoose.disconnect();
//   }
// })();

module.exports = {
    UserRepo
}
