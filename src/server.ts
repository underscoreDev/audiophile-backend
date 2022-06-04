import app from "./app";
import "dotenv/config";

const { PORT, HOST } = process.env;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on http://${HOST}:${PORT}`);
});
