import { createApp } from "./app";
import { myDataSource } from "./utils/database";

const app = createApp();

const PORT = 8080;

myDataSource.initialize().then(() => console.log("database connected"));

app.listen(PORT, () => {
  console.log(`server start : http://localhost:${PORT}/`);
});
