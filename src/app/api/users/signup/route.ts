import User_data from "@/model/UserModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { SendEmail } from "@/helper/mailer";
import connectMongo from "@/dbConfig/dbconnection";

connectMongo();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const ifExists = await User_data.findOne({ email });
    if (ifExists) {
      return NextResponse.json(
        { msg: "User already exists with this Email!" },
        { status: 409 }
      );
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const savedUser = await User_data.create({
      username,
      email,
      password: hashedPassword,
    });

    await SendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json(
      {
        status: "User Registered successfully!",
        success: true,
        data: savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
