import app, { mongoose, redisClient } from "../index"
import request from "supertest"
let token: string;
let tokenType: string;
let kelasmengemudiID : number;
let insertedPlatNomorKendaraan: string;

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
describe( "KELASMENGEMUDI Endpoint", () => {
  const createObject = {
    "namaKelas": "TESTINGKELAS",
    "hargaKelas": 100000,
    "jumlahSesi": 2,
    "platNomorKendaraan": "B9888KI"
  }
  describe( "/v1/kelasmengemudi", () => {
    test( "Router path", async () => {
      await request( app ).get( "/v1/kelasmengemudi" ).send().expect( 200 )
    } )
  } )
  describe( "/v1/kelasmengemudi/create", () => {
    test( "Provide no auth", async () => {
      await request( app ).post( "/v1/kelasmengemudi/create" ).send().set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Provide absolutely no body", async () => {
      await request( app ).post( "/v1/kelasmengemudi/create" ).send().set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide an incomplete body", async () => {
      await request( app ).post( "/v1/kelasmengemudi/create" ).send( {
        namaKelas: "TESTINGKELAS",
        hargaKelas: 1000000,
        jumlahSesi: 2
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide a wrong data type in the body", async () => {
      await request( app ).post( "/v1/kelasmengemudi/create" ).send( {
        namaKelas: "TESTINGKELAS",
        hargaKelas: "NOTNUMBER",
        jumlahSesi: 2,
        platNomorKendaraan: "B9888KI"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide a platNomorKendaraan that's not in Kendaraan", async () => {
      await request( app ).post( "/v1/kelasmengemudi/create" ).send( {
        namaKelas: "TESTINGKELAS",
        hargaKelas: 1000000,
        jumlahSesi: 2,
        platNomorKendaraan: "TEST123"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
      insertedPlatNomorKendaraan = "TEST123";
      const getKendaraan = async () => {
        const cekKendaraan = await request ( app ).get( "/v1/kendaraan/list/" + insertedPlatNomorKendaraan ).send().set( {
          "Content-Type": "application/json",
          "Authorization": `${tokenType} ${token}`
        } ).expect( 200 )
        expect( insertedPlatNomorKendaraan ).not.toBe( cekKendaraan.body.data.nomorKendaraan)
      }
    } )
    test( "Create a new kelasmengemudi object", async () => {
      const response = await request( app ).post( "/v1/kelasmengemudi/create" ).send( createObject ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data ).toHaveProperty( "kelasMengemudiID" )      
      expect( response.body.data ).toHaveProperty( "namaKelas" )
      expect( response.body.data ).toHaveProperty( "hargaKelas" )
      expect( response.body.data ).toHaveProperty( "jenisKendaraan" )
      expect( response.body.data ).toHaveProperty( "totalJamKursus")
      expect( response.body.data ).toHaveProperty( "jumlahSesi" )
      expect( response.body.data ).toHaveProperty( "platNomorKendaraan" )
      expect( response.body.data ).toHaveProperty( "namaKendaraan" )
      expect( response.body.data.totalJamKursus ).toBe( createObject.jumlahSesi*2 )
      kelasmengemudiID = response.body.data.kelasMengemudiID;
      expect( response.body.data.kelasMengemudiID ).toBe( kelasmengemudiID )
      insertedPlatNomorKendaraan = response.body.data.platNomorKendaraan;
      const getKendaraan = async () => {
        const cekKendaraan = await request ( app ).get( "/v1/kendaraan/list/" + insertedPlatNomorKendaraan ).send().set( {
          "Content-Type": "application/json",
          "Authorization": `${tokenType} ${token}`
        } ).expect( 200 )
        expect( response.body.data.platNomorKendaraan ).toBe( cekKendaraan.body.data.nomorKendaraan )
        expect( response.body.data.namaKendaraan ).toBe( cekKendaraan.body.data.namaKendaraan )
        expect( response.body.data.jenisKendaraan ).toBe( cekKendaraan.body.data.jenisTransmisi )
      }
    } )
    test( "Attempt to create a duplicate object", async () => {
      await request( app ).post( "/v1/kelasmengemudi/create" ).send( createObject ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/kelasmengemudi/list/:id", () => {
    test( "Attempt to get a created object from the database", async () => {
      await request( app ).get( "/v1/kelasmengemudi/list/" + kelasmengemudiID ).set( {
        "Content-Type": "application/json"
      } ).expect( 200 )
    } )
    test( "Attempt to get a non-existent object from the database", async () => {
      await request( app ).get( "/v1/kelasmengemudi/list/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json"
      } ).expect( 400 )
    } )
  } )
  describe( "/v1/kelasmengemudi/list", () => {
    test( "List 5 objects from the database", async () => {
      const response = await request( app ).get( "/v1/kelasmengemudi/list?limit=5" ).set( {
        "Content-Type": "application/json"
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 5 )
    } )
    test( "Search for a created object in the database", async () => {
      const response = await request( app ).get( "/v1/kelasmengemudi/list?search=TESTINGKELAS" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.length ).toBe( 1 )
    } )
  } )
  describe( "/v1/kelasmengemudi/update/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).patch( "/v1/kelasmengemudi/update/THISDOESNTEXIST" ).send( {
        namaKelas: "NEWTESTINGKELAS"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to edit a non-existent object", async () => {
      await request( app ).patch( "/v1/kelasmengemudi/update/THISDOESNTEXIST" ).send( {
        namaKelas: "NEWTESTINGKELAS"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Attempt to edit the created object with platNomorKendaraan that's not in Kendaraan", async () => {
      const response = await request( app ).patch( "/v1/kelasmengemudi/update/" + kelasmengemudiID ).send( {
        namaKelas: "NEWTESTINGKELAS",
        jumlahSesi: 5,
        platNomorKendaraan: "TEST123"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
      insertedPlatNomorKendaraan = response.body.data.platNomorKendaraan;
      const getKendaraan = async () => {
        const cekKendaraan = await request ( app ).get( "/v1/kendaraan/list/" + insertedPlatNomorKendaraan ).send().set( {
          "Content-Type": "application/json",
          "Authorization": `${tokenType} ${token}`
        } ).expect( 200 )
        expect( response.body.data.platNomorKendaraan ).not.toBe( cekKendaraan.body.data.nomorKendaraan)
      }
    } )
    test( "Edit the created object", async () => {
      const response = await request( app ).patch( "/v1/kelasmengemudi/update/" + kelasmengemudiID ).send( {
        namaKelas: "NEWTESTINGKELAS",
        jumlahSesi: 5,
        platNomorKendaraan: "B99NO"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.namaKelas ).toBe( "NEWTESTINGKELAS" )
      expect( response.body.data.jumlahSesi ).toBe( 5 )
      insertedPlatNomorKendaraan = response.body.data.platNomorKendaraan;
      const getKendaraan = async () => {
        const cekKendaraan = await request ( app ).get( "/v1/kendaraan/list/" + insertedPlatNomorKendaraan ).send().set( {
          "Content-Type": "application/json",
          "Authorization": `${tokenType} ${token}`
        } ).expect( 200 )
        expect( response.body.data.platNomorKendaraan ).toBe( cekKendaraan.body.data.nomorKendaraan)
        expect( response.body.data.namaKendaraan ).toBe( cekKendaraan.body.data.namaKendaraan )
        expect( response.body.data.jenisKendaraan ).toBe( cekKendaraan.body.data.jenisTransmisi )
      }
    } )
  } )
  describe( "/v1/kelasmengemudi/delete/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).delete( "/v1/kelasmengemudi/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to delete a non-existent object in the database", async () => {
      await request( app ).delete( "/v1/kelasmengemudi/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Delete the created object from the database", async () => {
      const response = await request( app ).delete( "/v1/kelasmengemudi/delete/" + kelasmengemudiID ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.kelasMengemudiID ).toBe( kelasmengemudiID )
    } )
  } )
} )