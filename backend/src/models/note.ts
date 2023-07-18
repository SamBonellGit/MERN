import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String },
  },
  { timestamps: true }
);


type Note = InferSchemaType<typeof noteSchema>; // Added for typescript compatibility (created type)

export default model<Note>("Note", noteSchema);