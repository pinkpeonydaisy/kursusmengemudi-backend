import app, { mongoose, redisClient } from "../index"
import request from "supertest"
let token: string;
let tokenType: string;
let index: number;

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
describe( "PROPERTY Endpoint", () => {
  let currentObject: {
    description: string,
    faq: {
      question: string,
      answer: string
    }[]
  };
  const createObject = {
    "description": "TESTINGPURPOSES",
    "faq": [
      {
        "question": "TESTQUESTION1",
        "answer": "TESTANSWER1"
      }
    ],
  }
  describe( "/v1/property", () => {
    test( "Router path", async () => {
      await request( app ).get( "/v1/property" ).send().expect( 200 )
    } )
    test( "Provide no auth", async () => {
      const response = await request( app ).get( "/v1/property" ).send().set( {
        "Content-Type": "application/json"
      } ).expect( 200 )
      expect( response.body.data ).toHaveProperty( "description" )
      expect( response.body.data ).toHaveProperty( "faq" )
      currentObject = response.body.data;
      index = response.body.data.faq.length - 1
    } )
  } )
  describe( "/v1/property/description", () => {
    test( "Provide no auth", async () => {
      await request( app ).patch( "/v1/property/description" ).send().set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Provide absolutely no body", async () => {
      await request( app ).patch( "/v1/property/description" ).send().set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Attempt to edit the description with less than minimum characters", async () => {
      // Description should consist of minimum 10 characters
      await request( app ).patch( "/v1/property/description" ).send( {
        "description": "TEST"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Attempt to edit the description with more than maximum characters", async () => {
      // Description should consist of maximum 500 characters
      await request( app ).patch( "/v1/property/description" ).send( {
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Suspendisse vel justo ut arcu varius viverra. Nunc at tristique leo. Aenean vel tellus in neque ullamcorper pharetra. Duis lacinia, justo vel ultricies vulputate, nulla tortor vestibulum est, vitae ultrices dolor risus in sem. Sed vel ipsum eu massa feugiat iaculis non ac erat. Maecenas tristique purus nec est tristique, non cursus dolor iaculis. Integer at sem vel est facilisis imperdiet non at dolor. Curabitur ultrices dui in justo tempus, at euismod quam vestibulum. Suspendisse potenti. Fusce auctor, nunc eu lobortis tincidunt, justo elit cursus metus, non blandit velit elit a purus. In hac habitasse platea dictumst. Suspendisse potenti. Duis bibendum mi euismod, efficitur ex id, euismod lectus. Sed dignissim vulputate arcu id ullamcorper. Sed ultricies orci vel justo consectetur, vel congue leo tempus."
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Succesfully edit the description", async () => {
      const response = await request( app ).patch( "/v1/property/description" ).send( {
        "description": createObject.description
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.description ).toBe( createObject.description )
    } )
    test( "Revert the edited description", async () => {
      await request( app ).patch( "/v1/property/description" ).send( {
        description: currentObject.description
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
    } )
  } )
  describe( "/v1/property/faq", () => {
    test( "Provide absolutely no body", async () => {
      await request( app ).put( "/v1/property/faq" ).send().set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Provide an incomplete body", async () => {
      await request( app ).put( "/v1/property/faq" ).send( {
        "question": "TESTQUESTION2"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Attempt to create a new FAQ object with wrong data type for question", async () => {
      // Questions should consist of minimum 10 characters
      await request( app ).put( "/v1/property/faq" ).send( {
        "question": "TEST",
        "answer": "TESTANSWEREXAMPLE"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Attempt to create a new FAQ object with wrong data type for answer", async () => {
      // Answers should consist of minimum 10 characters
      await request( app ).put( "/v1/property/faq" ).send( {
        "question": "TESTQUESTIONEXAMPLE",
        "answer": "TEST"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Create a new FAQ object", async () => {
      const response = await request( app ).put( "/v1/property/faq" ).send( {
        "question": createObject.faq[ 0 ].question,
        "answer": createObject.faq[ 0 ].answer
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data ).toHaveProperty( "question" )
      expect( response.body.data ).toHaveProperty( "answer" )
      index = index + 1
    } )
  } )
  describe( "/v1/property/faq/update/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).patch( "/v1/property/faq/update/THISDOESNTEXIST" ).send( {
        question: "TESTQUESTION4"
      } ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to edit a non-existent object", async () => {
      await request( app ).patch( "/v1/property/faq/update/THISDOESNTEXIST" ).send( {
        question: "TESTQUESTION4"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Attempt to edit the created object with wrong data type", async () => {
      // Question should consist of minimum 10 characters
      const response = await request( app ).patch( "/v1/property/faq/update/" + index ).send( {
        question: "TEST"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Edit the created object", async () => {
      const response = await request( app ).patch( "/v1/property/faq/update/" + index ).send( {
        question: "TESTQUESTION4"
      } ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.question ).toBe( "TESTQUESTION4" )
      expect( response.body.data.answer ).toBe( createObject.faq[ 0 ].answer )
      createObject.faq[ 0 ].question = "TESTQUESTION4"
    } )
  } )
  describe( "/v1/property/faq/delete/:id", () => {
    test( "Provide no auth", async () => {
      await request( app ).delete( "/v1/property/faq/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
      } ).expect( 401 )
    } )
    test( "Attempt to delete a non-existent object in the database", async () => {
      await request( app ).delete( "/v1/property/faq/delete/THISDOESNTEXIST" ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 400 )
    } )
    test( "Delete the created object from the database", async () => {
      const response = await request( app ).delete( "/v1/property/faq/delete/" + index ).set( {
        "Content-Type": "application/json",
        "Authorization": `${tokenType} ${token}`
      } ).expect( 200 )
      expect( response.body.data.question ).toBe( createObject.faq[ 0 ].question )
      expect( response.body.data.answer ).toBe( createObject.faq[ 0 ].answer )
    } )
  } )
} )