const axios = require('axios');
const cheerio = require('cheerio');

async function getHTML(url) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`Failed to retrieve the webpage. Status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`Request exception: ${error.message}`);
    return null;
  }
}

async function extractText(url, tagOption = 'h3') {
  const html = await getHTML(url);
  if (!html) {
    return null;
  }

  const $ = cheerio.load(html);
  const tags = $(tagOption).toArray();
  const extractedText = tags.map(tag => $(tag).text().trim());
  return extractedText;
}

const url = 'https://www.elsys-bg.org/novini-i-sybitija/novini/';
extractText(url).then(text => {
  console.log(text);
});


module.exports = {
    extractText
}