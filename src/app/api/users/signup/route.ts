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

    // Check if the user already exists
    const ifExists = await User_data.findOne({ email });
    if (ifExists) {
      return NextResponse.json(
        { msg: "User already exists with this Email!" },
        { status: 409 }
      );
    }

    // Basic password validation (you can expand this)
    if (password.length < 8) {
      return NextResponse.json(
        { msg: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user in the database
    const savedUser = await User_data.create({
      username,
      email,
      password: hashedPassword,
    });

    // Send a verification email
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
    console.error("Error during registration:", error); // Log error for debugging

    return NextResponse.json(
      { error: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
