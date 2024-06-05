import express, { Request, Response } from "express";
import { DefaultResponse } from "../../../";
import authRouter from "./auth/authrouter";
import instrukturRouter from "./instruktur/instrukturrouter";
import kendaraanRouter from "./kendaraan/kendaraanrouter";
import adminkursusrouter from "./adminkursus/adminkursusrouter";
import calonpelangganrouter from "./CalonPelanggan/calonpelangganrouter";
import kelasmengemudirouter from "./kelasmengemudi/kelasmengemudirouter";
import propertyRouter from "./properties/propertyrouter";

const router = express.Router();

router.use( "/auth", authRouter );
router.use( "/instruktur", instrukturRouter );
router.use( "/kendaraan", kendaraanRouter );
router.use( "/adminkursus", adminkursusrouter );
router.use( "/CalonPelanggan", calonpelangganrouter );
router.use( "/kelasmengemudi", kelasmengemudirouter );
router.use( "/property", propertyRouter );

router.all( "/", ( req: Request, res: Response ) => {
  return res.status( 200 ).json( {
    status: 200,
    valid: true,
    code: "OK",
    message: "OK",
    data: {
      path: req.baseUrl,
      source: req.ip,
      hostname: req.hostname,
      time: new Date(),
    },
  } as DefaultResponse );
} );

export default router;