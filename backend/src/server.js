require('dotenv').config();
const app = require('./app');

const port = 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});
