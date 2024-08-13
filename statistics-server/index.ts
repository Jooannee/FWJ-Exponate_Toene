import express, { Request, Response } from "express";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import bodyParser, { json } from "body-parser";

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
//disable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});
// Define a route handler for the root path
app.get("/", (req: Request, res: Response) => {
  res.send("");
});

function sortObjectKeys(obj: { [key: string]: any }): { [key: string]: any } {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObject: { [key: string]: any } = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = obj[key];
  });
  return sortedObject;
}

// Define a route handler for the root path
app.post(
  ["/mcgurk", "/disorders", "/instruments", "/hearing-test"],
  async (req: Request, res: Response) => {
    try {
      const reqPath = req.path;
      const pathName = reqPath.replace("/", "");
      // Extract JSON data from request body

      const jsonData = sortObjectKeys(req.body);

      // Check if request body is empty or not JSON
      if (!jsonData || typeof jsonData !== "object") {
        return res.status(400).send("Invalid JSON data");
      }

      // Check if CSV file exists, if not create it with headers based on JSON keys
      const csvFilePath = `${pathName}.csv`;
      let headers: string[] = Object.keys(jsonData);
      headers.push("id");
      headers.push("date");

      let fileAlreadyExists = fs.existsSync(csvFilePath);

      if (!fileAlreadyExists) {
        fs.writeFileSync(csvFilePath, headers.join(",") + "\n");
      }

      const id = fileAlreadyExists
        ? fs.readFileSync(csvFilePath, "utf8").split("\n").length - 1
        : 1;

      console.log(jsonData);

      const data = {
        ...jsonData,
        id,
        date: new Date().toISOString(),
      };

      // Create a CSV writer
      const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: headers,
        append: true,
      });

      // Write JSON data to CSV file
      await csvWriter.writeRecords([data]);

      res.status(200).send("Data added to CSV successfully");
    } catch (error) {
      console.error("Error adding data to CSV:", error);
      res.status(500).send("Internal server error");
    }
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
