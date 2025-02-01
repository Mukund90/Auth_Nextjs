import User_data from "@/model/UserModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import connectMongo from "@/dbConfig/dbconnection";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

connectMongo();

export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const { email, password } = reqbody;
    const verifieduser = await User_data.findOne({ email });

    if (!verifieduser) {
      return NextResponse.json(
        {
          msg: "Users doesno't Exists",
          sucess: false,
        },
        { headers: { "Content-Type": "Application/json" }, status: 400 }
      );
    }

    const verificationPassword = await bcrypt.compare(
      password,
      verifieduser.password
    );

    if (!verificationPassword) {
      return NextResponse.json(
        {
          msg: "Wrong password",
          sucess: false,
        },
        { headers: { "Content-Type": "Application/json" }, status: 404 }
      );
    }

    const Secret_key = process.env.SECRET_KEY as string;

    const Jwt_cookies = jwt.sign(
      { username: verifieduser.email, email: verifieduser.password },
      Secret_key,
      { expiresIn: "1h" }
    );

    const cookies_data = await cookies();

    cookies_data.set("token", Jwt_cookies, {
      httpOnly: true,
    });

    return NextResponse.json(
      {
        msg: "Successfully Logged In!",
        success: true,
      },
      {
        headers: new Headers({
          "Content-Type": "application/json",
          token: cookies_data.get("token")?.value || "",
        }),
      }
    );
  } catch (error: any) {
    console.log(`something might wrong ${error.message}`);
  }
}
