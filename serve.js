const express = require('express');
const fallback = require('express-history-api-fallback');

const app = express();

const root = `${__dirname}/dist`;
app.use(express.static(root));

// history fallback
app.use(fallback('index.html', { root }));
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server is listening on port ${port}`));
