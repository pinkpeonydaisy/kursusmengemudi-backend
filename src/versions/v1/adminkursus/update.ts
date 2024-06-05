import { Request, Response, NextFunction } from "express";
import { UpdateAdmin } from "../../../validation/admin";
import { DefaultResponse, User } from "../../../..";
import user from "../../../schema/user";
import bcrypt from "bcrypt";

const Update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Invalid Credentials");
    const userid = req.params.id;
    const updateQuery = UpdateAdmin.validate(req.body);
    if (updateQuery.error) throw updateQuery.error;

    const hashedPassword: string|null =
      updateQuery.value.password!==null && updateQuery.value.password!==undefined
        ? await new Promise<string>((resolve, reject) => {
            bcrypt.hash(updateQuery.value.password, 8, (err, hash) => {
              if (err) reject(err);
              resolve(hash);
            });
          })
        : null;

    if (updateQuery.value.password && !hashedPassword) throw new Error("Failed hashing password");

    const update: User = await user.findOneAndUpdate(
      { user_id: userid },
      {
        $set: {
          ...(hashedPassword && { password_hash: hashedPassword}), 
          username: updateQuery.value.username 
        }
      },
      {
        upsert: false,
        returnDocument: "after",
        projection: {
          user_id: true,
          username: true,
          password_hash: true,
          tipe_user: true,
          created_at: true,
          created_by: true
        }
      }
    ).catch((err) => err);

    if (update instanceof Error) throw update;
    if (update === null)
      throw new Error("The provided user_id is not found in the database");

    return res.status(200).json({
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        user_id: update.user_id,
        username: update.username,
        password_hash: update.password_hash,
        tipe_user: update.tipe_user,
        created_at: update.created_at,
        created_by: update.created_by
      }
    } as DefaultResponse);
  } catch (e) {
    next(e);
  }
};

export default Update;
