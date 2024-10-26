import dotenv from "dotenv";
import { initializeDatabase } from "@/config";
import { validateEnvironmentVariables } from "@/helpers";
import { app } from "@/app";

dotenv.config();
validateEnvironmentVariables();
initializeDatabase();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
