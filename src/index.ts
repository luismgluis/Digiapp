import express, { Application } from "express";
import * as startup from "./startup";
const app: Application = express();

startup.setupServer(app);
startup.startServer(app);
