const { extractText } = require("./extracter");
const { EmailSender } = require("./email_sender");
const { UserRepo } = require("./user_repo");
require("dotenv").config();
const fs = require("fs");

function get_info() {
  try {
    if (!fs.existsSync("./last_news.json")) {
      fs.writeFileSync("./last_news.json", "", "utf8");
      console.log("File created: last_news.json");
      return null;
    }

    const data = fs.readFileSync("./last_news.json", "utf8");
    if (!data) {
      console.log("The file is empty.");
      return null;
    }

    const info = JSON.parse(data);
    return info;
  } catch (err) {
    console.error("Error reading JSON file:", err);
    return null;
  }
}

function saveNews(info) {
  try {
    fs.writeFileSync("./last_news.json", JSON.stringify(info), "utf8");
    console.log("Data written to JSON file successfully!");
  } catch (err) {
    console.error("Error writing to JSON file:", err);
  }
}

function isNewNewsAvailable(savedInfo, newsInfo) {
  return (
    !savedInfo ||
    !savedInfo.text ||
    !newsInfo ||
    !newsInfo.text ||
    savedInfo.text.length === 0 ||
    newsInfo.text.length === 0 ||
    savedInfo.text[0] !== newsInfo.text[0]
  );
}

async function notifyUsers(emails, email_sender, text) {
  for (const email of emails) {
    try {
      await send_email(
        email_sender,
        email,
        "New News Alert",
        `Check out the latest news! -> ${text[0]} `
      );
      console.log(`Email sent to ${email} successfully!`);
    } catch (emailError) {
      console.error(`Error sending email to ${email}:`, emailError);
    }
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

async function checkForNewNews() {
  try {
    const url = "https://www.elsys-bg.org/novini-i-sybitija/novini/";
    const text = await extractText(url);
    let savedInfo = get_info();

    const newsInfo = { text };
    if (isNewNewsAvailable(savedInfo, newsInfo)) {
      saveNews(newsInfo);
      const user_repo = new UserRepo();
      const emails = await user_repo.get_all_users_with_emails();
      console.log(emails);

      const email_sender = new EmailSender(
        "gmail",
        "radoslavcvetanov5@gmail.com",
        process.env.pass
      );

      await notifyUsers(emails, email_sender, text);
    } else {
      console.log("No new news found.");
    }
  } catch (err) {
    console.error("Error occurred while checking for new news:", err);
  }
}

async function main() {
  const everyMinute = 60 * 1000;
  // Call checkForNewNews initially and then every minute
  await checkForNewNews();
  setInterval(checkForNewNews, everyMinute);
}

main();
