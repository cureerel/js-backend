// require ('dotenv').config({path: './env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from './app.js'

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000


;( async () => {
 try { 
    await connectDB()

app.on("error",  (err) => {
    console.log("App error", err)
})

app.listen( PORT, () => {
    console.log(`App is listening on ${PORT}`)
})
} catch (err){
    console.log("Startp error", err)
    process.exit(1);
}
}) ();





/* 
// basic approach
(async () => {
  try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      app.on("error", (error) => {
        console.log("ERROR ", error)
        throw error
      });

      app.listen(process.env.PORT, () => {
        console.log(`app is listening on ${process.env.PORT}`)
      })
  } catch (error) {
    console.log("ERROR ", error);
    throw error;
  }
})();

*/
