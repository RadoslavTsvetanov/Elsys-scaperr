const { extractText } = require("./extracter");
const { EmailSender } = require("./email_sender");
const { UserRepo } = require("./user_repo");
require("dotenv").config();
const fs = require("fs");

function get_info() {
  try {
    const data = fs.readFileSync("./last_news.json", "utf8");
    if (!data) {
      console.log("The file is empty.");
      return null;
    }
    const info = JSON.parse(data);
    return info;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("The file does not exist.");
      return null;
    }
    console.error("Error reading JSON file:", err);
    return null;
  }
}

function saveNews(info) {
  fs.writeFile("./last_news.json", JSON.stringify(info), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
      return;
    }
    console.log("Data written to JSON file successfully!");
  });
}

async function checkForNewNews() {
  try {
    const url = "https://www.elsys-bg.org/novini-i-sybitija/novini/";
    const text = await extractText(url);

    // Process the extracted text (e.g., parse news info)
    const newsInfo = { text }; // Assuming text is the news information
    const savedInfo = get_info();

    if (/*savedInfo.text !== newsInfo.text*/ true) {
      saveNews(newsInfo);
      const user_repo = new UserRepo();
      const emails = await user_repo.get_all_users_with_emails();
      console.log(emails);

      const email_sender = new EmailSender(
        "gmail",
        "radoslavcvetanov5@gmail.com",
        process.env.pass
      );

      emails.forEach(async (email) => {
        await send_email(
          email_sender,
          email,
          "New News Alert",
          "Check out the latest news!"
        );
      });
    } else {
      console.log("No new news found.");
    }
  } catch (err) {
    console.error("Error occurred while checking for new news:", err);
  }
}

async function send_email(email_sender, recipient, subject, message) {
  try {
    await email_sender.sendEmail(recipient, subject, message);
    console.log(`Email sent to ${recipient} successfully!`);
  } catch (err) {
    console.error(`Error sending email to ${recipient}:`, err);
  }
}

async function main() {
  const everyMinute = 60 * 1000;
  // Call checkForNewNews initially and then every minute
  await checkForNewNews();
  setInterval(checkForNewNews, everyMinute);
}

main();
