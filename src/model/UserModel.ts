import { error } from "console";
import mongoose, { Document, Model, Schema, model } from "mongoose";



mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log(`Database Connected successfully!`);
  })
  .catch((err) => {
    console.log(`Something went wrong while connecting to the Database: ${err}`);
  });

interface User extends Document {
  username: string;
  email: string;
  password: string;
  IsVerified: boolean;
  IsAdmin: boolean;
  forgetPasswordToken: string;
  forgetPasswordTokenExpiry: Date;
  VerifyToken: string;
  verifyTokenExpiry: Date;
}

const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, "Username should be Correct"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email should be valid"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required!"],
  },
  IsVerified: {
    type: Boolean,
    default: false,
  },
  IsAdmin: {
    type: Boolean,
    default: false,
  },
  forgetPasswordToken: {
    type: String,
  },
  forgetPasswordTokenExpiry: {
    type: Date,
  },
  VerifyToken: {
    type: String,
    default:undefined
  },
  verifyTokenExpiry: {
    type: Date,
    default:undefined
  },
});

const User_data: Model<User> = mongoose.models.User_data || model<User>("User_data", UserSchema);

export default User_data;
