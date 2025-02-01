import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        msg: "Logout sucessfully!",
        status: "Sucessfully!",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (error) {
    console.log("Something went wrong while logOut", error);
  }
}
