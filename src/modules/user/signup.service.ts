import { getDB } from "../../lib/db"
import { CreateUserPayload } from "./signup.interface"
import bcrypt from "bcrypt";
const signUpUser = async (payload: CreateUserPayload) => {
    const {name, email, password, profilePhoto, phone, bio} = payload;

    const collection = getDB().collection("users");

    const existUser = await collection.findOne({
        email: payload.email
    });

    if(existUser){
        throw new Error("User already exist! Signup with new email.")
    }

     const hashPassword = await bcrypt.hash(password, 10);
    const userData = {
        name: name,
        email: email,
        password: hashPassword,
        profilePhoto: profilePhoto,
        phone: phone,
        bio: bio
    }
    const result = await collection.insertOne(userData);
    return result;
}

export const userService = {
    signUpUser
}