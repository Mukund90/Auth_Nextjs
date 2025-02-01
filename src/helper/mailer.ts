import User_data from "@/model/UserModel";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import jwt from "jsonwebtoken";

export const SendEmail = async ({ email, emailType, userId }: any) => {
  try {
  
    const Secret_key = process.env.SECRET_KEY as string; 
    const token = jwt.sign({ id: userId._id }, Secret_key, { expiresIn: '1h' });

    if (emailType === "VERIFY") {
      await User_data.findByIdAndUpdate(userId, {
        VerifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000, 
      });
    } else if (emailType === "RESET") {
      await User_data.findByIdAndUpdate(userId, {
        forgetPasswordToken: token,
        forgetPasswordTokenExpiry: Date.now() + 3600000, 
      });
    }

    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

    const oAuthClient = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuthClient.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await oAuthClient.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "jhamukund365@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token as string,
      },
    });

    const mailOptions = {
      from: "jhamukund365@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `<p>Click <a href="http://localhost:3000/VerifyEmailToken?token=${token}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }, or copy and paste this link in your browser.</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error(`Something went wrong while sending the mail: ${error}`);
    throw new Error("Mail sending failed");
  }
};
