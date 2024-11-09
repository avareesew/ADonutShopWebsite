// Import Express and MySQL
const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = 3000;

// Set up the public directory for static files
app.use(express.static("public"));

//old connection so i can get will's photos
// MySQL connection
const db = mysql.createConnection({
  host: "pythondonutsdb.c1qsomceyx8i.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Password1",
  database: "donuts",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`DonutShopWebsite app listening at port number: ${port}`);
});

// Endpoint to get donuts based on category
app.get("/donuts", (req, res) => {
  const category = req.query.category || "all"; // default to 'all'

  // SQL query based on category
  let query = "SELECT name, image FROM donut_flavors";
  if (category !== "all") {
    query += ` WHERE category = '${category}'`;
  }

  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Function to fetch donuts (to be included in the client-side script)
function fetchDonuts(category) {
  fetch(`/donuts?category=${category}`)
    .then((response) => response.json())
    .then((data) => {
      const donutList = document.getElementById("donut-list");
      donutList.innerHTML = ""; // Clear previous results

      // Create and display each donut item
      data.forEach((donut) => {
        const donutItem = document.createElement("div");
        donutItem.className = "donut-item";

        const donutImage = document.createElement("img");
        donutImage.src = donut.image; // Assuming your DB has an image URL
        donutItem.appendChild(donutImage);

        const donutName = document.createElement("h3");
        donutName.textContent = donut.name;
        donutItem.appendChild(donutName);

        donutList.appendChild(donutItem);
      });
    })
    .catch((error) => console.error("Error fetching donuts:", error));
}
