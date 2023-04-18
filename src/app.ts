// routes/index.js에서 route 설정

// Path: app.js
import "reflect-metadata";
import express, { json, urlencoded } from "express";
import router from "./routes/index";

const createApp = () => {
  const app = express();
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(router);

  return app;
};

export { createApp };
