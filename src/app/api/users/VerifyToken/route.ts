import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/dbConfig/dbconnection";
import User_data from "@/model/UserModel";



connectMongo();

export async function POST(request: NextRequest) {
  try {
    const headersToken = request.headers.get("token");

    if (!headersToken) {
      return NextResponse.json({ msg: "Token not provided" }, { status: 400 });
    }

    const isdata = await User_data.findOne({
      VerifyToken: headersToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });



    if (!isdata) {
      return NextResponse.json(
        {
          msg: "Token is invalid or expired",
          
        },
        { status: 400 }
      );
    }


    isdata.IsVerified = true;
    
    await isdata.save();

    return NextResponse.json(
      {
        msg: "Email successfully verified!",
        sucess:"true"
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Something went wrong while processing the token:", err);
    return NextResponse.json(
      {
        msg: "Server error",
      },
      { status: 500 }
    );
  }
}
