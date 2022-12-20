const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProxies() {
  const proxyList = [];

  // Send an HTTP request to the proxy list website
  const response = await axios.get('https://free-proxy-list.net/');

  // Load the HTML response into cheerio
  const $ = cheerio.load(response.data);

  // Extract the list of proxies from the HTML
  $('table tr').each((index, element) => {
    const ipAddress = $(element).find('td:nth-child(1)').text();
    const port = $(element).find('td:nth-child(2)').text();
    const proxy = `${ipAddress}:${port}`;
    proxyList.push(proxy);
  });

  // Test each proxy to see if it is working
  const workingProxies = [];
  for (const proxy of proxyList) {
    try {
      const response = await axios.get('https://www.google.com', {
        proxy: {
          host: proxy,
          port: 8080
        }
      });
      if (response.status === 200) {
        workingProxies.push(proxy);
      }
    } catch (error) {
      // Do nothing, just continue to the next proxy
    }
  }

  // Save the working proxies to a file or database
  console.log(workingProxies);
}

scrapeProxies();
