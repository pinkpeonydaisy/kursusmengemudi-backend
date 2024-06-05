import app, { mongoose, redisClient } from "../index"
import request from "supertest"
import bcrypt from "bcrypt"
let token: string;
let tokenType: string;
beforeAll( async () => {
  await mongoose.connect( process.env.MONGO_URI as string )
  await redisClient.connect()
  const response = await request( app ).post( "/v1/auth/login" ).send( {
    username: "owner",
    password: "Owner123"
  } ).expect( 200 )
  token = response.body.data.token
  tokenType = response.body.data.type
} )
afterAll( async () => {
  await mongoose.connection.close()
  await redisClient.disconnect()
} )

let createuser_id: number;

describe( "ADMINKURSUS Endpoint", () => {
  const createObject = {
    "username": "TEST",
    "password": "test12345",
  }
  describe( "/v1/adminkursus", () => {
    test( "Router path", async () => {
      await request( app ).get( "/v1/adminkursus" ).send().expect( 200 )
    } )
  } )
  describe( "/v1/adminkursus/create", () => {
    test( "Provide no auth", async () => {
      await request( app ).post( "/v1/adminkursus/create" ).send().set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Provide absolutely no body", async () => {
      await request( app ).post( "/v1/adminkursus/create" ).send().set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide an incomplete body", async () => {
      await request( app ).post( "/v1/adminkursus/create" ).send( {
        "password": "test12345",
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide a wrong data type in the body", async () => {
      await request( app ).post( "/v1/adminkursus/create" ).send( {
        // password should have minimum 8 characters consists of combination of letters and numbers
        "username": "test",
        "password": "test12",
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )

    test("Create a new adminkursus object successfully", async () => {
      const validData = {
        username: "testusername123",
        password: "testpassword12345",
      };
    
      const response = await request(app)
        .post("/v1/adminkursus/create")
        .send(validData)
        .set({
          "Content-Type": "application/json",
          "Authorization": `${tokenType} ${token}`
        }).expect(200)
        expect( response.body.data ).toHaveProperty( "user_id" )
        expect( response.body.data ).toHaveProperty( "username" )
        expect( response.body.data ).toHaveProperty( "password_hash" )
        expect( response.body.data ).toHaveProperty( "tipe_user" )

        createuser_id = response.body.data.user_id;
        expect( response.body.data.user_id ).toBe( createuser_id )

  
    
    });
    test( "Create a duplicate object", async () => {
      await request( app ).post( "/v1/adminkursus/create" ).send( {
        username : "testusername123",
      }
       ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )


  } )
  describe( "/v1/adminkursus/list/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/adminkursus/list/" + createuser_id ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to get a created object from the database", async () => {
      await request( app ).get( "/v1/adminkursus/list/" + createuser_id ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
    } )
    test( "Attempt to get a non-existent object from the database", async () => {
      await request( app ).get( "/v1/adminkursus/list/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/adminkursus/list", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/adminkursus/list?limit=5" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "List 5 objects from the database", async () => {
      const response = await request( app ).get( "/v1/adminkursus/list?limit=5" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 5 )
    } )
    test( "Search for a created object in the database", async () => {
      const response = await request( app ).get( "/v1/adminkursus/list?search=testusername123").set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 1 )
    } )

  } )
  describe( "/v1/adminkursus/update/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).patch( "/v1/adminkursus/update/THISDOESNTEXIST" ).send( {
        username: "testabc"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to edit a non-existent object", async () => {
      await request( app ).patch( "/v1/adminkursus/update/THISDOESNTEXIST" ).send( {
        username: "testabc"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Edit the created object", async () => {
      const updatedData = {
        username: "testabc12345",
        password: "test123456789",
      };

      const response = await request( app ).patch( "/v1/adminkursus/update/" + createuser_id )
      .send(updatedData)
      .set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
        
      } ).expect( 200 )
      expect(response.body.data.username).toBe(updatedData.username);
      const isPasswordMatch = bcrypt.compareSync(updatedData.password, response.body.data.password_hash);
      expect(isPasswordMatch).toBe(true);
    } )
  } )
  describe( "/v1/adminkursus/delete/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).delete( "/v1/adminkursus/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to delete a non-existent object in the database", async () => {
      await request( app ).delete( "/v1/adminkursus/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Delete the created object from the database", async () => {
      const response = await request( app ).delete( "/v1/adminkursus/delete/" + createuser_id ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.user_id ).toBe( createuser_id)
    } )
  } )
} )