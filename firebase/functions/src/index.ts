import * as Admin from "firebase-admin";
import * as Functions from "firebase-functions";
import axios from "axios";

Admin.initializeApp();

const API_URL = "https://api.openweathermap.org";

const IS_DEV = process.env.FUNCTIONS_EMULATOR;

const middlewareSetCORS = (handler: Function) => async (req: Functions.https.Request, res: Functions.Response<any>) => {
  const allowedOrigins = IS_DEV ? [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
  ] : [
    "https://keepgo-studio.github.io"
  ];

  if (!req.headers.origin) {
    res.status(400).send("Cannot recognize origin");
    return;
  }

  const url = allowedOrigins.find((url) => url === req.headers.origin);

  res.header({
    "Access-Control-Allow-Origin": url,
  });

  return handler(req, res);
}

export const checkOrigin = Functions.region(
  "asia-northeast3"
).https.onRequest(middlewareSetCORS(async (_: any, res: Functions.Response<any>) => {
  res.status(200).send("origin satisfied");
}));

export const getCurrentWeather = Functions.region(
  "asia-northeast3"
).https.onRequest(middlewareSetCORS(async (req: Functions.https.Request, res: Functions.Response<any>) => {
  const data = await axios.get(`${API_URL}/data/2.5/weather`, {
    params: {
      ...req.query,
      appid: process.env.API_ID,
      limit: 5
    }
  })
  .then(val => val.data)
  .catch(() => {});

  res.status(200).send(data);
}));

export const getCurrentGeo = Functions.region(
  "asia-northeast3"
).https.onRequest(middlewareSetCORS(async (req: Functions.https.Request, res: Functions.Response<any>) => {
  
  const data = await axios.get(`${API_URL}/geo/1.0/reverse`, {
    params: {
      ...req.query,
      appid: process.env.API_ID,
    }
  })
  .then(val => val.data)
  .catch(() => []);

  res.status(200).send(data);
}))