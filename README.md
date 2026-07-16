# StudyNotion

An ed-tech platform (MERN stack) where instructors can create and sell courses, and students can enroll, watch lectures and track progress.

## What it does

- Students can browse/search courses, buy them (Razorpay), watch video lectures, leave ratings/reviews, ask questions (AI assistant), take notes, download resources, and track their learning paths
- Instructors can create courses with sections & sub-sections (video upload via Cloudinary), attach downloadable resources (PDFs, files), see their earnings dashboard
- Admin panel for managing users, courses, categories, and viewing transactions
- Gamification system - earn points for enrolling, completing lectures/courses, posting reviews & discussions
- Learning paths - get personalized course recommendations based on your interests
- Discussion forums on each lecture
- Course recommendations based on tags you've already enrolled in
- AI-powered lecture assistant with auto-transcription

## Key Features

### Video Player
- Popup to start from beginning or continue
- Mark as completed, rewatch, prev/next navigation

### AI Lecture Assistant
- Ask questions about any lecture (Summarize, Quiz, Key Concepts, Explain Simply)
- Auto-generates transcript from video using Whisper (Groq)
- Extracts audio via ffmpeg to handle large videos (keeps under 25MB limit)
- Conversational chat with context (maintains last 6 messages)
- Uses lecture title + description + transcript as context for LLM (Llama 3.1)

### Timestamped Notes
- Students can add notes at any point while watching a video
- Click timestamp to jump to that point in the video
- Edit, delete notes inline
- Stored per user, per course, per lecture

### Course Wishlist
- Wishlist page in student dashboard
- Add to cart directly from wishlist

### Search
- Search bar on homepage and search results page
- Searches by course name, description, and tags (regex, case-insensitive)
- Paginated results (12 per page) with Previous/Next navigation
- Shows rating, price, instructor, student count

### Gamification (Points + Leaderboard)
- Points awarded automatically on backend:
  - Course enrolled: +10
  - Lecture completed: +5
  - Course completed: +50
  - Review given: +15
  - Discussion posted: +10
- Leaderboard shows top 20 students

### Session Management
- Inactivity-based timeout (1 hour of no activity)
- Activity tracking: clicks, scrolls, keypress, page navigation, video playing

### Admin Panel
- Platform stats dashboard (users, revenue, courses, enrollments)
- User management (toggle status, delete)
- Course moderation (toggle publish/draft)
- Category management (create/delete categories)
- Transaction history

## Tech Used

- React + Redux Toolkit + Tailwind + Framer Motion (frontend)
- Node/Express + MongoDB with Mongoose (backend)
- JWT for auth (access token + refresh token)
- Cloudinary for video/image/file uploads
- Razorpay for payments
- Nodemailer for emails
- Groq SDK for AI (Llama 3.1 chat + Whisper transcription)
- fluent-ffmpeg for audio extraction
- jwt-decode for client-side token validation
- react-hot-toast for notifications
- Swiper for course carousels

## How to run

You need Node >= 18, MongoDB (Atlas), Cloudinary account, Razorpay test keys, Groq API key.

```bash
git clone https://github.com/jayesh-kumavat/StudyNotion
cd StudyNotion
npm install
npm run install:all
```

Create `backend/.env`:
```
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/StudyNotion
PORT=4000
MAIL_HOST=smtp.gmail.com
MAIL_USER=<your-email>
MAIL_PASS=<app-password>
JWT_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
CLOUDINARY_FOLDER_NAME=StudyNotion
RAZORPAY_KEY_ID=<key-id>
RAZORPAY_KEY_SECRET=<key-secret>
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=<your-admin-email>
GROQ_API_KEY=<groq-api-key>
```

Create `frontend/.env`:
```
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_RAZORPAY_KEY=<razorpay-key-id>
```

Then run:
```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 4000) using concurrently.

Or run them separately:
```bash
npm run dev:frontend
npm run dev:backend
```

To make yourself admin, sign up normally then in MongoDB:
```js
db.users.updateOne({ email: "youremail@gmail.com" }, { $set: { accountType: "Admin" } })
```

## API Endpoints

| Route | What it does |
|-------|-------------|
| /api/v1/auth | signup, login, logout, OTP, password reset, refresh token |
| /api/v1/profile | user details, update profile, enrolled courses, instructor dashboard |
| /api/v1/course | CRUD courses/sections/subsections, search (paginated), ratings, progress, video timestamps |
| /api/v1/payment | razorpay capture & verify, free enrollment |
| /api/v1/contact | contact us form submission |
| /api/v1/gamification | points profile, leaderboard |
| /api/v1/learning-path | generate & manage learning paths |
| /api/v1/discussion | course discussions, replies, likes, delete |
| /api/v1/recommendation | personalized, trending courses |
| /api/v1/admin | platform stats, user/course management, transactions |
| /api/v1/features | notes CRUD, wishlist toggle/get, resource upload/delete |
| /api/v1/lecture-assistant | AI chat, transcript check |


## Upcoming Enhancements

- Will add Socket.io for real-time discussion forum
- Will add Redis caching layer for faster response times
- Will use ClamAV for virus scanning of uploaded files
- Will use Elasticsearch for faster search results

## License

For educational purposes only.
