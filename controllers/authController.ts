import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "getstream";
import bcrypt from "bcrypt";
import { StreamChat } from "stream-chat";
import crypto from "crypto";
dotenv.config();
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const api_id = process.env.STREAM_API_ID;
export const signup = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      Username,
      Password,
      repeatPassword,
      phoneNumber,
      Avatar,
    } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const userID = crypto.randomBytes(16).toString("hex");
    const serverClient = connect(api_key, api_secret, api_id);
    const token = serverClient.createUserToken(userID);

    res
      .status(200)
      .json({ token, fullName, Username, userID, hashedPassword, phoneNumber });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { Username, Password } = req.body;
    const serverClient = connect(api_key, api_secret, api_id);
    const client = StreamChat.getInstance(api_key, api_secret);

    const { users }: any = await client.queryUsers(Username);
    if (!users.length) res.status(400).json({ message: "user not found" });
    const success = bcrypt.compare(Password, users[0].hashedPassword);
    const token = serverClient.createUserToken(users[0].id);

    if (success) {
      res.status(200).json({
        token,
        fullname: users[0].fullName,
        Username,
        userId: users[0].id,
      });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { login, signup };
