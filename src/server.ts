import dotenv from "dotenv";
import { db } from "@/config";
import { validateEnvironmentVariables } from "@/helpers";
import app from "@/app";

dotenv.config();

validateEnvironmentVariables();

db.authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
