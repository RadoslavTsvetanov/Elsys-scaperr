const axios = require('axios');

describe('Backend API Tests', () => {
  const PORT = 3000; // Replace with your server's port
  const baseURL = `http://localhost:${PORT}`;
  it("should create user",async () => {
    const response = await axios.get(`${baseURL}/user/create_user`)
  })
  it('should fetch latest news', async () => {
    const response = await axios.get(`${baseURL}/user/get_latest_news`);
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });

  it('should get last post for a user', async () => {
    const username = 'testuser';
    const response = await axios.get(`${baseURL}/user/get_last_post/?username=${username}`);
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });

  it('should update last seen for a user', async () => {
    const data = {
      username: 'testuser',
      post: 'New post',
    };
    const response = await axios.post(`${baseURL}/user/update_last_seen`, data);
    expect(response.status).toBe(200);
    // Add more assertions based on the response data if needed
  });
});
