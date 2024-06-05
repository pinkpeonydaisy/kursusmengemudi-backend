import app, { mongoose, redisClient } from "../index"
import request from "supertest"
let token: string;
let tokenType: string;
beforeAll( async () => {
  await mongoose.connect( process.env.MONGO_URI as string )
  await redisClient.connect()
} )
afterAll( async () => {
  await mongoose.connection.close()
  await redisClient.disconnect()
} )
describe( "KENDARAAN Endpoint", () => {
  describe( "ROOT Functions", () => {
    test( "Root Fetch", async () => {
      await request( app ).get( "/" ).send().expect( 200 )
    } )
    test( "Invalid route handler", async () => {
      await request( app ).get( "/INVALIDROUTE" ).send().expect( 404 )
    } )
  } )
  describe( "Routers", () => {
    test( "Version Route", async () => {
      await request( app ).get( "/v1" ).send().expect( 200 )
    } )
  } )
} )