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
describe( "KENDARAAN Endpoint", () => {
  const createObject = {
    "nomorKendaraan": "TESTINGPURPOSES",
    "namaKendaraan": "Honda Jazz",
    "jenisTransmisi": "MATIC",
    "jumlahKilometer": 70000,
    "tanggalTerakhirService": "1700202801",
    "statusKetersediaan": "AVAILABLE",
    "statusKendaraan": "READY"
  }
  describe( "/v1/kendaraan", () => {
    test( "Router path", async () => {
      await request( app ).get( "/v1/kendaraan" ).send().expect( 200 )
    } )
  } )
  describe( "/v1/kendaraan/create", () => {
    test( "Provide no auth", async () => {
      await request( app ).post( "/v1/kendaraan/create" ).send().set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Provide absolutely no body", async () => {
      await request( app ).post( "/v1/kendaraan/create" ).send().set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide an incomplete body", async () => {
      await request( app ).post( "/v1/kendaraan/create" ).send( {
        "nomorKendaraan": "TESTINGPURPOSES",
        "namaKendaraan": "Honda Jazz",
        "jenisTransmisi": "MATIC",
        "jumlahKilometer": 70000,
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide a wrong data type in the body", async () => {
      await request( app ).post( "/v1/kendaraan/create" ).send( {
        "nomorKendaraan": "TESTINGPURPOSES",
        "namaKendaraan": "Honda Jazz",
        "jenisTransmisi": "MATIC",
        "jumlahKilometer": "THIS IS SUPPOSED TO BE A NUMBER",
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Create a new kendaraan object", async () => {
      const response = await request( app ).post( "/v1/kendaraan/create" ).send( createObject ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data ).toHaveProperty( "nomorKendaraan" )
      expect( response.body.data ).toHaveProperty( "namaKendaraan" )
      expect( response.body.data ).toHaveProperty( "jenisTransmisi" )
      expect( response.body.data.nomorKendaraan ).toBe( createObject.nomorKendaraan )
    } )
    test( "Create a duplicate object", async () => {
      await request( app ).post( "/v1/kendaraan/create" ).send( createObject ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/kendaraan/list/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/kendaraan/list/" + createObject.nomorKendaraan ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to get a created object from the database", async () => {
      await request( app ).get( "/v1/kendaraan/list/" + createObject.nomorKendaraan ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
    } )
    test( "Attempt to get a non-existent object from the database", async () => {
      await request( app ).get( "/v1/kendaraan/list/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/kendaraan/list", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/kendaraan/list?limit=5" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "List 5 objects from the database", async () => {
      const response = await request( app ).get( "/v1/kendaraan/list?limit=5" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 5 )
    } )
    test( "Search for a created object in the database", async () => {
      const response = await request( app ).get( "/v1/kendaraan/list?search=TESTINGPURPOSES" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 1 )
    } )
  } )
  describe( "/v1/kendaraan/update/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).patch( "/v1/kendaraan/update/THISDOESNTEXIST" ).send( {
        jenisTransmisi: "MANUAL"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to edit a non-existent object", async () => {
      await request( app ).patch( "/v1/kendaraan/update/THISDOESNTEXIST" ).send( {
        jenisTransmisi: "MANUAL"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Edit the created object", async () => {
      const response = await request( app ).patch( "/v1/kendaraan/update/" + createObject.nomorKendaraan ).send( {
        jumlahKilometer: 200,
        tanggalTerakhirService: "2022-1-1",
        statusKetersediaan: "IN USE",
        statusKendaraan: "SERVICE",
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.jumlahKilometer ).toBe( 200 )
      expect( response.body.data.statusKetersediaan ).toBe( "IN USE" )
      expect( response.body.data.statusKendaraan ).toBe( "SERVICE" )
    } )
  } )
  describe( "/v1/kendaraan/delete/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).delete( "/v1/kendaraan/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to delete a non-existent object in the database", async () => {
      await request( app ).delete( "/v1/kendaraan/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Delete the created object from the database", async () => {
      const response = await request( app ).delete( "/v1/kendaraan/delete/" + createObject.nomorKendaraan ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.nomorKendaraan ).toBe( createObject.nomorKendaraan )
      expect( response.body.data.namaKendaraan ).toBe( createObject.namaKendaraan )
    } )
  } )
} )