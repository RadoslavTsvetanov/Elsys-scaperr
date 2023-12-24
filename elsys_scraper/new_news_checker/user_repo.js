const mongoose = require("mongoose");
const db_name = "GYM";

const uri = `mongodb+srv://KURO:KURO@task-manager.8d8g6sk.mongodb.net/${db_name}?retryWrites=true&w=majority`;
// Mongoose schema for User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  latestPost: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
});

// Mongoose model based on the userSchema
const User = mongoose.model("Userss", userSchema);

// UserRepo class utilizing the User model
class UserRepo {
  //TODO ask if it should be better to include the username in the contructor
  constructor() {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async add_user_email(username, email) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { email: email },
        { new: true, useFindAndModify: true }
      ).exec();

      if (!updatedUser) {
        console.error("User not found");
        return null; // Or handle as needed
      }

      console.log("Updated user:", updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Error updating user email:", err);
      throw err; // Re-throw the error to be caught by the calling function
    }
  }

  async get_all_users_with_emails() {
    try {
      const users = await User.find({});
      let users_with_email = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i] && users[i].email != "") {
          users_with_email.push(users[i].email);
        }
      }
      console.log("emails", users_with_email);
      return users_with_email;
    } catch (err) {
      return err;
    }
  }

  async createUser(username) {
    try {
      const newUser = new User({
        username,
        latestPost: "",
      });

      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async updateLatestPost(username, newLatestPost) {
    try {
      const user = await User.findOneAndUpdate(
        { username: username },
        { latestPost: newLatestPost }
      );
      if (!user) {
        throw new Error("User not found");
      }

      user.latestPost = newLatestPost;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw new Error("Failed to update latest post");
    }
  }

  async getLatestPost(username) {
    try {
      const user = await User.findOne({ username });
      return user.latestPost;
    } catch (err) {
      return err;
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
  UserRepo,
};
