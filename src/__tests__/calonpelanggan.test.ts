import app, { mongoose, redisClient } from "../index"
import request from "supertest"
let token: string;
let tokenType: string;

let pelangganID : number;
beforeAll( async () => {
  await mongoose.connect( process.env.MONGO_URI as string )
  await redisClient.connect()
  const response = await request( app ).post( "/v1/auth/login" ).send( {
    username: "angela12",
    password: "angela123"
  } ).expect( 200 )
  token = response.body.data.token
  tokenType = response.body.data.type
} )
afterAll( async () => {
  await mongoose.connection.close()
  await redisClient.disconnect()
} )
describe( "CALONPELANGGAN Endpoint", () => {
  const createObject = {
    "nama": "TESTNAMA",
    "kelasPelanggan": 30001,
    "umur": 25,
    "noWA": "080912345678",
    "alamat": "Jalan Test Nomor XX, Nama Kecamatan",
    "statusPelanggan": "Calon"
  }
  describe( "/v1/calonpelanggan", () => {
    test( "Router path", async () => {
      await request( app ).get( "/v1/calonpelanggan" ).send().expect( 200 )
    } )
  } )
  describe( "/v1/calonpelanggan/create", () => {
    test( "Provide absolutely no body", async () => {
      await request( app ).post( "/v1/calonpelanggan/create" ).send().set( {
        "Content-Type": "application/json",
      } ).expect( 400 )
    } )
    test( "Provide an incomplete body", async () => {
      await request( app ).post( "/v1/calonpelanggan/create" ).send( {
        "nama": "TESTNAMA",
        "kelasPelanggan": 30001,
        "umur": 25,
        "noWA": "080912345678"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 400 )
    } )
    test( "Provide a wrong data type in the body", async () => {
      await request( app ).post( "/v1/calonpelanggan/create" ).send( {
        "nama": "TESTNAMA",
        "kelasPelanggan": 30001,
        "umur": 25,
        "noWA": 80912345678,
        "alamat": "Jalan Test Nomor XX, Nama Kecamatan"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 400 )
    } )
    test( "Create a new calonpelanggan object", async () => {
      const response = await request( app ).post( "/v1/calonpelanggan/create" ).send( createObject ).set( {
        "Content-Type": "application/json",
      } ).expect( 200 )
      expect( response.body.data ).toHaveProperty( "calonPelangganID" )
      expect( response.body.data ).toHaveProperty( "nama" )
      expect( response.body.data ).toHaveProperty( "kelasPelanggan" )
      expect( response.body.data ).toHaveProperty( "umur" )
      expect( response.body.data ).toHaveProperty( "noWA" )
      expect( response.body.data ).toHaveProperty( "alamat" )
      expect( response.body.data ).toHaveProperty( "statusPelanggan" )
      expect( response.body.data ).toHaveProperty( "tanggalPendaftaran" )
      pelangganID = response.body.data.calonPelangganID;
      expect( response.body.data.calonPelangganID ).toBe( pelangganID )
    } )
  } )
  describe( "/v1/calonpelanggan/list/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/calonpelanggan/list/" + pelangganID ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to get a created object from the database", async () => {
      await request( app ).get( "/v1/calonpelanggan/list/" + pelangganID ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
    } )
    test( "Attempt to get a non-existent object from the database", async () => {
      await request( app ).get( "/v1/calonpelanggan/list/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/calonpelanggan/list", () => {
    test( "Provide no auth", async () => {
      await request( app ).get( "/v1/calonpelanggan/list?limit=5" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "List 5 objects from the database", async () => {
      const response = await request( app ).get( "/v1/calonpelanggan/list?limit=5" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 5 )
    } )
    test( "Search for a created object in the database", async () => {
      const response = await request( app ).get( "/v1/calonpelanggan/list?search=080912345678").set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 1 )
    } )
  } )
  describe( "/v1/calonpelanggan/update/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).patch( "/v1/calonpelanggan/update/THISDOESNTEXIST" ).send( {
        alamat: "Jalan Test Nomor XX, Nama Kecamatan"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to edit a non-existent object", async () => {
      await request( app ).patch( "/v1/calonpelanggan/update/THISDOESNTEXIST" ).send( {
        alamat: "Jalan Test Nomor XX, Nama Kecamatan"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Edit the created object", async () => {
      const response = await request( app ).patch( "/v1/calonpelanggan/update/" + pelangganID ).send( {
        nama: "TESTNAMA",
        kelasPelanggan: 30002,
        umur: 24,
        noWA: "080912345678",
        alamat: "Jalan Test Nomor XX, Nama Kecamatan Saya",
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.kelasPelanggan ).toBe( 30002 )
      expect( response.body.data.umur ).toBe( 24 )
      expect( response.body.data.alamat ).toBe( "Jalan Test Nomor XX, Nama Kecamatan Saya" )
    } )
  } )
  describe( "/v1/calonpelanggan/delete/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).delete( "/v1/calonpelanggan/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to delete a non-existent object in the database", async () => {
      await request( app ).delete( "/v1/calonpelanggan/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Delete the created object from the database", async () => {
      const response = await request( app ).delete( "/v1/calonpelanggan/delete/" + pelangganID ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.calonPelangganID ).toBe( pelangganID )
      expect( response.body.data.nama ).toBe( createObject.nama )
    } )
  } )
} )