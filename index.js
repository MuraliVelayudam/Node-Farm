const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require("./templates/modules/replaceTemplate");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const productView = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const cardView = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const server = http.createServer((request, response) => {
  const { pathname, query } = url.parse(request.url);

  //overview-------
  if (pathname === "/" || pathname === "overview") {
    response.writeHead(200, {
      "Content-type": "html",
    });
    const cardHtml = dataObj.map((ele) => replaceTemplate(cardView, ele));

    const output = overview.replace("{%PRODUCT_CARDS%}", cardHtml);
    response.end(output);
  }
  //products---------
  else if (pathname === "/product") {
    response.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.slice(3)];
    const output = replaceTemplate(productView, product);
    response.end(output);
  }
  //api--------------
  else if (pathname === "/api") {
    response.writeHead(200, {
      "Content-type": "application/json",
    });
    response.end(data);
  }
  //Page Not Found--------
  else {
    response.writeHead(404, {
      "Content-type": "text/html",
    });
    response.end("<h1>Page Not Found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server Started");
});
