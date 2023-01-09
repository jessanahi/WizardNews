const { Router } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
const postBank = require("./postBank");
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const posts = postBank.list();
  const mainhtml = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
      <header><img src="/logo.png"/> Wizard News </header>
      ${posts
        .map(
          (post) => `
      <div class='news-item'>
        <p>
          <span class="news-position">${post.id}. ▲</span>
          <a href="/posts/${post.id}">${post.title}</a>
          <small>(by ${post.name})</small>
        </p>
        <small class="news-info">
          ${post.upvotes} upvotes | ${post.date}
        </small>
      </div>`
        )
        .join("")}
  </div>
</body>
</html>`;
  res.send(mainhtml);
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    throw new Error("Not Found");
  }
  const singlepagehtml = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
      ${post.title}
      ${post.name}
      ${post.date}
      ${post.content}
  </body>
  </html>
`;
  res.send(singlepagehtml);
});

const ErrorHandler = (err, req, res, next) => {
  res.status(404);
  console.error(err.stack);
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>Page Not Found</p>
      </div>
    </body>
    </html>`;
  res.send(html);
};

app.use(ErrorHandler);

// const asyncFunction = async (request, response, next) => {
//   try {
//     throw new Error(`processing error in request `);
//   } catch (error) {
//     next(error);
//   }
// };

// app.get("/posts/:id", async (err, req, res, next) => {
//   try {
//     const post = await client.query(baseQuery + "WHERE posts.id = $1", [
//       req.params.id,
//     ]);
//     res.send(postDetails(post));
//   } catch (error) {
//     next(error);
//   }
// });

// app.get("/", (req, res, next) => {
//   fs.readFile("/file-does-not-exist", (err, data) => {
//     if (err) {
//       next(err); // Pass errors to Express.
//     } else {
//       res.send(data);
//     }
//   });
// });

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
