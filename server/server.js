const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");

dotenv.config();
connectDb(); // Connect to the database
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Ensure this points to the right directory

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Working');
});

// Register Handlebars partials
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Home route
app.get("/home", (req, res) => {
    res.render("home", {
        username: "Jai Chopra",
        posts: "time pass"
    });
});

// All users route (Assuming 'users' is defined somewhere)
app.get("/alluser", (req, res) => {
    const users = []; // Replace with actual users array
    res.render("alluser", {
        users: users, 
    });
});

// User routes
app.use("/api/register", require("./routes/userRoutes")); // Registration route
app.use("/api/login", require("./routes/userRoutes")); // Login route

// Error handling middleware
app.use(errorHandler); // Use your error handler middleware

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});