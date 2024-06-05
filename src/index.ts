import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import { createClient } from "redis";

import notFound from "./lib/notfound";
import errorHandler from "./lib/error";
import { limiter } from "./lib/ratelimit";
import versionRouter from "./versions/versionrouter";
import authStrategy from "./middleware/auth";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
const NODE_ENV = ( process.env.NODE_ENV || "PROD" ).toUpperCase();
const MONGO_URI = process.env.MONGO_URI || null;
const REDIS_URL = process.env.REDIS_URL || null;

if ( NODE_ENV !== "PROD" && NODE_ENV !== "DEV" && NODE_ENV !== "TEST" ) throw new Error( NODE_ENV );
if ( MONGO_URI === null || MONGO_URI === undefined ) throw new Error( "MONGO_URI is not provided" );
if ( REDIS_URL === null ) throw new Error( "REDIS_URI is not provided" );

passport.use( authStrategy );

const redisClient = createClient( {
	url: REDIS_URL,
	disableOfflineQueue: false,

} );
redisClient.on( "error", ( err: Error ) => console.error( err ) );
redisClient.on( "connect", () => console.log( "Connecting to Redis" ) );
redisClient.on( "ready", () => console.log( "Connected to Redis" ) );
redisClient.on( "reconnecting", () => console.log( "Reconnecting to Redis" ) );

mongoose.connection.on( "connected", () => console.log( "Connected to MongoDB" ) );
mongoose.connection.on( "error", ( err: Error ) => console.error( err ) );

app.set( "trust proxy", 1 );

app.use( express.json() );
app.use( morgan( "dev" ) );
app.use( bodyParser.json() );
app.use( helmet() );
app.use( limiter );
app.use( compression( {
	level: 1,
} ) );

const whitelist = [ /.*localhost.*$/, /.*rpl-frontend-psi.vercel.app.*$/ ];
app.use( cors( {
	origin: ( origin, callback ) => {
		if ( NODE_ENV === "DEV" || origin === undefined ) return callback( null, true );
		for ( const originCheck of whitelist ) if ( originCheck.test( origin as string ) ) return callback( null, true );
		return callback( new Error( "Not Allowed by CORS" ) );
	},
	credentials: true,
	methods: [ "GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH" ],
	allowedHeaders: [
		"Authorization",
		"Origin",
		"Accept",
		"Content-Type",
		"X-Forwarded-For",
	],
	optionsSuccessStatus: 204,
} ) );
app.use( versionRouter );
app.use( errorHandler );
app.use( notFound );

/* istanbul ignore if */
if ( NODE_ENV !== "TEST" ) app.listen( PORT, async () => {
	await mongoose.connect( MONGO_URI );
	await redisClient.connect();
	console.log( `Running on port ${PORT}` );
	console.log( `Running on ${NODE_ENV}` );
} );

export { redisClient, mongoose };
export default app;