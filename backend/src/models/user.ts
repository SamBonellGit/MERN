import { InferSchemaType, Schema, model } from "mongoose";

// New scheme to allow users to sign up.

const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true, select: false}, // not returned by default due to select false, this is done for security purposes
    password: { type: String, required: true, select: false},
    
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);