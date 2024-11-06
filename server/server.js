const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");

const multer = require("multer")
const upload = multer({dest: 'uploads/'}) // upload folder

dotenv.config();
connectDb(); // Connect to the database
const app = express();
const PORT = process.env.PORT || 3001;

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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const uploads = multer({ storage: storage })

const Upload = require("./models/UploadModel")

app.post("/profile", upload.single('avatar'), async (req, res, next) => {
    try {
        const profileData = {
            avatar: {
                fileName: req.file.filename, // Use req.file.filename for file name
                filePath: req.file.path,     // Use req.file.path for file path
            },
        };

        const newProfile = new Upload(profileData);
        await newProfile.save();

        console.log("Profile saved:", newProfile);
        res.redirect("/home");
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).send("Error saving profile.");
    }
});
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

app.get("/getPhotos", async (req, res) => {
    try {
        // Assuming Upload is a model for your database
        const uploads = await Upload.find(); // Fetch all uploaded photos from the database
        res.render("users", { uploads }); // Pass the photos to the template

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching photos");
    }
});