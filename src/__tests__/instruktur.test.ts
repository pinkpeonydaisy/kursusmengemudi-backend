import app, { mongoose, redisClient } from "../index"
import request from "supertest"
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
describe( "INSTRUKTUR Endpoint", () => {
  const createObject = {
    "nikInstruktur": "1234567891234567",
    "namaLengkap": "Fannie Cormier",
    "alamatInstruktur": "26599 Bobby Mountains",
    "noTelp": "+621234567890",
    "noRekening": "74874568"
  }
  describe( "/v1/instruktur", () => {
    test( "Router path", async () => {
      await request( app ).get( "/v1/instruktur" ).send().expect( 200 )
    } )
  } )
  describe( "/v1/instruktur/create", () => {
    test( "Provide no auth", async () => {
      await request( app ).post( "/v1/instruktur/create" ).send().set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Provide absolutely no body", async () => {
      await request( app ).post( "/v1/instruktur/create" ).send().set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide an incomplete body", async () => {
      await request( app ).post( "/v1/instruktur/create" ).send( {
        "nikInstruktur": "1234567891234567",
        "namaLengkap": "Fannie Cormier",
        "alamatInstruktur": "26599 Bobby Mountains",
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide a wrong data type in the body", async () => {
      await request( app ).post( "/v1/instruktur/create" ).send( {
        "nikInstruktur": "1234567891234567",
        "namaLengkap": "Fannie Cormier",
        "alamatInstruktur": "26599 Bobby Mountains",
        "noTelp": 621234567890,
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Create a new instruktur object", async () => {
      const response = await request( app ).post( "/v1/instruktur/create" ).send( createObject ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data ).toHaveProperty( "nikInstruktur" )
      expect( response.body.data ).toHaveProperty( "namaLengkap" )
      expect( response.body.data ).toHaveProperty( "alamatInstruktur" )
      expect( response.body.data.nikInstruktur ).toBe( createObject.nikInstruktur )
    } )
    test( "Create a duplicate object", async () => {
      await request( app ).post( "/v1/instruktur/create" ).send( createObject ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/instruktur/list/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/instruktur/list/" + createObject.nikInstruktur ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to get a created object from the database", async () => {
      await request( app ).get( "/v1/instruktur/list/" + createObject.nikInstruktur ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
    } )
    test( "Attempt to get a non-existent object from the database", async () => {
      await request( app ).get( "/v1/instruktur/list/8888999911118888" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/instruktur/list", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/instruktur/list?limit=5" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "List 5 objects from the database", async () => {
      const response = await request( app ).get( "/v1/instruktur/list?limit=5" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 5 )
    } )
    test( "Search for a created object in the database", async () => {
      const response = await request( app ).get( "/v1/instruktur/list?search=1234567891234567" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 1 )
    } )
  } )
  describe( "/v1/instruktur/update/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).patch( "/v1/instruktur/update/8888999911118888" ).send( {
        namaLengkap: "Bob Corni"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to edit a non-existent object", async () => {
      await request( app ).patch( "/v1/instruktur/update/8888999911118888" ).send( {
        namaLengkap: "Bob Corni"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Edit the created object", async () => {
      const response = await request( app ).patch( "/v1/instruktur/update/" + createObject.nikInstruktur ).send( {
        namaLengkap: "Bob Corni",
        alamatInstruktur: "Jalan Manggis No 4",
        noTelp: "+6281999888789",
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.namaLengkap ).toBe( "Bob Corni" )
      expect( response.body.data.alamatInstruktur ).toBe( "Jalan Manggis No 4" )
      expect( response.body.data.noTelp ).toBe( "+6281999888789" )
    } )
  } )
  describe( "/v1/instruktur/delete/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).delete( "/v1/instruktur/delete/8888999911118888" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to delete a non-existent object in the database", async () => {
      await request( app ).delete( "/v1/instruktur/delete/8888999911118888" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Delete the created object from the database", async () => {
      const response = await request( app ).delete( "/v1/instruktur/delete/" + createObject.nikInstruktur ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.nikInstruktur ).toBe( createObject.nikInstruktur )
      expect( response.body.data.noRekening ).toBe( createObject.noRekening )
    } )
  } )
} )