// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { currencyExchange, addCurrency, getCurrency } from './controllers/currencyController'; // Asumpcja, że kontrolery są zdefiniowane w pliku currencyController.ts


dotenv.config();
const app: Express = express();

const port = process.env.PORT || 3000;


app.get("/health-check", (req: Request, res: Response) => {
  res.send("health check OK");
});

// Użyj body-parser przed zdefiniowaniem punktów końcowych
app.use(bodyParser.json());

// Endpoint do wymiany walut
app.post("/currencyExchange", currencyExchange);

// Endpoint do dodawania nowych kursów walut
app.post("/currency", addCurrency);

// Endpoint do pobierania wszystkich kursów walut
app.get("/currency", getCurrency);

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
