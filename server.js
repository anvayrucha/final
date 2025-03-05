



// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const fs = require("fs");

// const app = express();
// const PORT = 3000;

// // Enable CORS
// app.use(cors());

// // Create uploads directory if it doesn't exist
// const uploadDir = "./uploads";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://jabili:mongoose@cluster.6jrks.mongodb.net/emps?retryWrites=true&w=majority&appName=Cluster", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log("MongoDB Connected"))
//     .catch(err => console.error("MongoDB Connection Error:", err));

// // Create User Schema
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     image: String
// });

// const User = mongoose.model("capture", userSchema);

// // Serve static images
// app.use("/uploads", express.static("uploads"));

// // Multer Storage Engine
// const storage = multer.diskStorage({
//     destination: uploadDir,
//     filename: (req, file, cb) => {
//         cb(null, "image-" + Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage });

// // Middleware
// app.use(express.static("public"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Handle image and data upload
// app.post("/upload", upload.single("image"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No image uploaded." });
//         }

//         const { name, email } = req.body;
//         const imageFilename = req.file.filename;

//         // Save data to MongoDB
//         const newUser = new User({ name, email, image: imageFilename });
//         await newUser.save();

//         res.json({
//             message: "Data stored successfully!",
//             imageUrl: `http://localhost:3000/uploads/${imageFilename}`
//         });
//     } catch (error) {
//         console.error("Error saving to MongoDB:", error);
//         res.status(500).json({ message: "Error saving data" });
//     }
// });



// // Fetch the latest user details
// app.get("/latest", async (req, res) => {
//     try {
//         const latestUser = await User.findOne().sort({ _id: -1 });

//         if (!latestUser) {
//             return res.status(404).json({ message: "No user found" });
//         }

//         res.json({
//             name: latestUser.name,
//             email: latestUser.email,
//             imageUrl: `http://localhost:3000/uploads/${latestUser.image}`
//         });
//     } catch (error) {
//         console.error("Error fetching user:", error);
//         res.status(500).json({ message: "Error fetching data" });
//     }
// });

// // Start server
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));






const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");


const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors({ origin: "*" }));

// Create uploads directory if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Connect to MongoDB
mongoose.connect("mongodb+srv://jabili:mongoose@cluster.6jrks.mongodb.net/emps?retryWrites=true&w=majority&appName=Cluster", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Create User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    image: String
});

const User = mongoose.model("capture", userSchema);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Storage Engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, "image-" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle image and data upload
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded." });
        }

        const { name, email } = req.body;
        const imageFilename = req.file.filename;

        // Save data to MongoDB
        const newUser = new User({ name, email, image: imageFilename });
        await newUser.save();

        res.json({
            message: "✅ Data stored successfully!",
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/${imageFilename}`
        });
    } catch (error) {
        console.error("❌ Error saving to MongoDB:", error);
        res.status(500).json({ message: "Error saving data" });
    }
});

// Fetch the latest user details
app.get("/latest", async (req, res) => {
    try {
        const latestUser = await User.findOne().sort({ _id: -1 });

        if (!latestUser) {
            return res.status(404).json({ message: "No user found" });
        }

        res.json({
            name: latestUser.name,
            email: latestUser.email,
            imageUrl: `${req.protocol}://${req.get("host")}/uploads/${latestUser.image}`
        });
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
