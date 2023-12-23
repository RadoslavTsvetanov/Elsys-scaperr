const { extractText } = require("./extracter");
const { EmailSender } = require("./email_sender");
const { UserRepo } = require("./user_repo");
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

function send_emails(email_sender, recipient, subject, message) {
  email_sender.send_email();
}

function checkForNewNews() {
  const url = "https://www.elsys-bg.org/novini-i-sybitija/novini/";
  extractText(url)
    .then((text) => {
      // Process the extracted text (e.g., parse news info)
      const newsInfo = { text }; // Assuming text is the news information
      const savedInfo = get_info();
      if (savedInfo && savedInfo.text !== newsInfo.text) {
        saveNews(newsInfo);
        const user_repo = new UserRepo();
        const emails = user_repo.get_all_users_with_emails();
        console.log(emails);
        const email_sender = new EmailSender(
          "gmail",
          "radsolavcvetanov5@gmail.com",
          process.env.pass
        );
      } else {
        console.log("No new news found.");
      }
    })
    .catch((err) => {
      console.error("Error extracting text:", err);
    });
}

function main() {
  const everyMinute = 60 * 1000;
  // Call checkForNewNews initially and then every minute
  checkForNewNews();
  setInterval(checkForNewNews, everyMinute);
}

main();
