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
describe( "AUTH Endpoint", () => {
  describe( "/v1/auth", () => {
    test( "Router path", async () => {
      await request( app ).get( "/v1/auth" ).send().expect( 200 )
    } )
  } )
  describe( "/v1/auth/login", () => {
    const url = "/v1/auth/login"
    test( "If body is not provided", async () => {
      await request( app ).post( url ).expect( 400 ).send().expect( 400 )
    } )
    test( "If a body property is not provided", async () => {
      await request( app ).post( url ).send( {
        username: "test"
      } ).expect( 400 )
    } )
    test( "If provide a username but wrong password", async () => {
      const response = await request( app ).post( url ).send( {
        username: "owner",
        password: "thisIsAWrongPassword12"
      } ).expect( 400 )
      expect( response.body.message ).toBe( "Invalid Credentials" )
    } )
    test( "If username is not registered in the databsae", async () => {
      const response = await request( app ).post( url ).send( {
        username: "wrong_user",
        password: "thisIsAWrongPassword12"
      } ).expect( 400 )
      expect( response.body.message ).toBe( "Invalid Credentials" )
    } )
    test( "If username and password is both valid", async () => {
      const response = await request( app ).post( url ).send( {
        username: "owner",
        password: "Owner123"
      } ).expect( 200 )
      expect( response.body ).toHaveProperty( "data" )
      expect( response.body.data ).toHaveProperty( "type" )
      expect( response.body.data ).toHaveProperty( "token" )
      expect( response.body.data.type ).toBe( "Bearer" )
      token = response.body.data.token;
      tokenType = response.body.data.type;
    } )
  } )
  describe( "/v1/verify/:token", () => {
    test( "If a valid token is provided", async () => {
      const url = "/v1/auth/verify/" + token
      const response = await request( app ).get( url ).send().expect( 200 )
      expect( response.body.message ).toBe( "OK" )
      expect( response.body.data ).toHaveProperty( "user_id" )
    } )
    test( "If an invalid token is provided", async () => {
      const brokenTokenArray = token.split( "" )
      brokenTokenArray[ 10 ] = "a"
      const brokenTokenString = brokenTokenArray.join( "" )
      await request( app ).get( "/v1/auth/verify/" + brokenTokenString ).send().expect( 400 )
    } )
  } )
} )