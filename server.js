const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const app = express();
const path = require("path");

dotenv.config();

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = require('./app/models');

// Connecting to MongoDB database
db.mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then( () => {
    console.log('\nConnected to the database!\n');
}).catch(err => {
    console.log('Cannot connect to the database!');
    process.exit();
})

require('./app/routes/link')(app);

// Serving static files on the dist folder;
app.use(express.static(path.join(__dirname, 'dist')));

// Serving static files in dist folder;
// Usually this dist folder files contains the build packages 
// from angular build.
app.use('/*', async (req, res) => {
    try {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    } catch (error) {
        console.log(error);
    }
})

// Seting port using environment or fallback to 3000 if not specified
const PORT = process.env.PORT || 3000;


// Starting the server live using listen() method
app.listen( PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


