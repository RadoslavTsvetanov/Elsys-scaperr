const axios = require("axios");

describe("Backend API Tests", () => {
  const PORT = 3000; // Replace with your server's port
  const baseURL = `http://localhost:${PORT}`;

  it("should create user", async () => {
    const userData = {
      username: "newUser123",
      // Add other properties for the user if required
    };

    const response = await axios({
      method: "POST",
      url: `${baseURL}/user/create_user`,
      data: userData,
    });
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });

  it("should fetch latest news", async () => {
    const response = await axios({
      method: "GET",
      url: `${baseURL}/user/get_latest_news`,
    });
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });

  it("should get last post for a user", async () => {
    const username = "newUser123";
    const response = await axios({
      method: "GET",
      url: `${baseURL}/user/get_last_post/`,
      params: { username },
    });
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });

  it("should update last seen for a user", async () => {
    const postData = {
      username: "newUser123",
      post: "New post",
    };

    const response = await axios({
      method: "POST",
      url: `${baseURL}/user/update_last_seen`,
      data: postData,
    });
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });

  it("should subscribe a user", async () => {
    const userData = {
      username: "newUser123",
      email: "newUser123@example.com",
    };

    const response = await axios({
      method: "POST",
      url: `${baseURL}/user/subscribe_user`,
      data: { username: "newUser123", email: "lo_ol@abv.bg" },
    });
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });
});
