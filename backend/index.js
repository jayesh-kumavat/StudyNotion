const express = require('express');
const app = express();

const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');
const contactUsRoute = require('./routes/Contact');
const gamificationRoutes = require('./routes/Gamification');
const learningPathRoutes = require('./routes/LearningPath');
const discussionRoutes = require('./routes/Discussion');
const recommendationRoutes = require('./routes/Recommendation');
const adminRoutes = require('./routes/Admin');
const featuresRoutes = require('./routes/Features');
const lectureAssistantRoutes = require('./routes/LectureAssistant');

const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinaryConnect = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

//connect to db and cloudinary
dbConnect();
cloudinaryConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

//mount routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/contact', contactUsRoute);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/learning-path', learningPathRoutes);
app.use('/api/v1/discussion', discussionRoutes);
app.use('/api/v1/recommendation', recommendationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/features', featuresRoutes);
app.use('/api/v1/lecture-assistant', lectureAssistantRoutes);

//default route
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "StudyNotion API is running"
    });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
