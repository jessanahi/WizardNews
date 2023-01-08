const express = require('express');
const app = express();
const morgan = require('morgan');
const postBank = require('./postBank');
app.use(morgan('dev'));

app.get("/", (req, res) => {
  const posts = postBank.list();
  const pagehtml = `<html>
    <head>
      <title>JKR is cancelled</title>
    </head>
    <body>
      <ul>
        ${posts.map(post => `<li>${post.title} by: ${post.name}</li>`)}
      </ul>
    </body>
  </html>`;
  res.send(pagehtml);
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
