import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";



// sets a root to "/" and responds with "hello world" when called



const port = env.PORT || 5000;


mongoose.connect(env.MONGO_CONNECTION_STRING).then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Sam's App running on http://localhost:${port}`);
  });
})
.catch(console.error);
