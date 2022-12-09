const http = require("http");

const populateHTML = (readingContent) => {
  return `<main style="background-color: burlywood height: 100vh; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center;">
      <h1>${headingContent}</h1>
    </main>`;
};

http
  .createServer((request, response) => {
    const { url, method } = request;
    const chunks = [];

    request
      .on("error", (error) => {
        response.statusCode = 400;
        response.setHeader("Content-Type", "application/json");
        response.write(JSON.stringify(error));
        response.end();
      })
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", () => {
        console.log(chunks);

        const body = Buffer.concat(chunks).toString();
        const responseBody = {
          url,
          method,
          responseBody,
        };

        response.on("error", (error) => {
            response.statusCode = 500;
            response.setHeader("Content-Type", "application/json");
            response.write(JSON.stringify(error));
            response.end();
        })

        switch (url) {
          case "/":
            // do something
            response.setHeader("Content-Type", "text/html");
            response.write(populateHTML("Raise the Anthem, Burlywood."));
            break;
          case "/about":
            // send about json info
            const details = {
              name: "Name",
              city: "WhateverTown",
            };

            response.setHeader("Content-Type", "aplication/json");
            response.write(JSON.stringify(details));
            break;
          case "/echo":
            //echo info back to client
            response.setHeader("Content-Type", "aplication/json");
            response.write(JSON.stringify(responseBody));
            break;
          default:
            // 404 mot found
            response.setHeader("Content-Type", "text/html");
            response.write(
              populateHTML(
                "404 Not Found. Try <a href=`http://localhost:3000`>this</a>"
              )
            );
        }

        return response.end();
      });
  })
  .listen(3000, () => console.log("Server listening on port 3000..."));
