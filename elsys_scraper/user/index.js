const express = require("express");
const { extractText } = require("./extracter");
const { UserRepo } = require("./user_repo");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Middleware to initialize UserRepo
app.use((req, res, next) => {
  req.userRepo = new UserRepo();
  next();
});

// Route to get latest news
app.get("/user/get_latest_news", async (req, res) => {
  try {
    const news = await extractText(
      "https://www.elsys-bg.org/novini-i-sybitija/novini/"
    );
    return res.json(news);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Route to subscribe a user
app.post("/user/subscribe_user", (req, res, next) => {
  console.log(req.body);
  try {
    const updated = req.userRepo.add_user_email(
      req.body.username,
      req.body.email
    );
    return res.json({ updated });
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});

// Route to get last post for a user
app.get("/user/get_last_post/", async (req, res, next) => {
  try {
    const lastSeen = await req.userRepo.getLatestPost(req.query.username);
    return res.json({ status: "success", data: lastSeen });
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});

// Route to update last seen for a user
app.post("/user/update_last_seen", async (req, res, next) => {
  try {
    await req.userRepo.updateLatestPost(req.body.username, req.body.post);
    return res.json({ status: "success" });
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});

// Route to create a new user
app.post("/user/create_user", async (req, res, next) => {
  try {
    const new_user = await req.userRepo.createUser(req.body.username);
    return res.json({ status: "success", data: new_user });
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
