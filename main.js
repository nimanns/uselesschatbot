const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer(async (req, res) => {
  const { url, method } = req;
  if (url === "/") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error loading page1.html");
      }

      res.writeHead(200);
      res.end(data);
    });
  } else if (url.includes("/api")) {
    const urlObject = new URL(url, `http://${req.headers.host}`);
    const params = urlObject.searchParams;
    const prompt = params.get("prompt");
    //send json res
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.writeHead(200);
    //send json response
    const response = await askForPicture(prompt);
    res.end(JSON.stringify(response["output"]));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(4242, () => {
  console.log("Server is running...");
});

async function askForPicture(p_prompt) {
  const version =
    "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3";
  const myData = {
    version,
    input: {
      prompt: p_prompt,
    },
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(myData),
  };

  const URL = "https://replicate-api-proxy.glitch.me/create_n_get/";
  const replicate_response = await fetch(URL, options);
  const replicate_json = await replicate_response.json();
  return replicate_json;
}
