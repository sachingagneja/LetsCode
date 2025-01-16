# LetsCode

A full-stack web application that provides a platform for users to solve coding questions, contribute new ones, and engage in a community chat. The application ensures a moderated environment with a profanity filter and includes features for both users and administrators.

## Features

### User Features
- **Solve Coding Questions:** Users can solve coding challenges added by the admin. (Currently supports C++ only.)
- **Contribute Questions:** Users can submit new coding problems for admin approval.
- **Query Resolution:** Users can ask queries related to coding challenges, which are addressed by the admin.
- **Community Chat:** A real-time chat feature for community interaction, equipped with a profanity filter.

### Admin Features
- **Add Challenges:** Admins can add coding problems for users to solve.
- **Approve Submissions:** Admins review and approve questions contributed by users.
- **Query Resolution:** Admins resolve user queries submitted through the platform.
- **User Moderation:** Admins are notified if a user uses profanity in the community chat. After three reports, the user's account is deleted.

### Community Moderation
- **Profanity Filter:** Messages with swear words are flagged, and the user is reported.
- **User Account Deletion:** Accounts are deleted after three profanity reports to ensure a safe and respectful environment.

## Tech Stack

- **Frontend:** React.js (Located in the `frontend` folder)
- **Backend:** Node.js, Express.js (Located in the `backend` folder)
- **Database:** MongoDB
- **Real-Time Communication:** Socket.io (for the chat feature)
- **Language Support:** C++ (coding challenges)

## Project Structure

```
LetsCode-new
├── frontend/      # React.js application
├── backend/       # Node.js and Express.js server
└── README.md      # Project documentation
```

## Installation and Setup

### Prerequisites
- Node.js and npm installed on your machine
- MongoDB server running locally or via a cloud service

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the client:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     MONGO_URI = <your_mongodb_connection_string>
     PORT = 5000
     EMAIL= <your email>
     SMTP_PASS = <your_smtp_pass>
     ```

4. Start the server:
   ```bash
   npm start
   ```

### Run the Application
- Ensure both the frontend and backend are running.
- Access the application at `http://localhost:3000` in your browser.

## Future Improvements
- Support for additional programming languages.
- Enhanced user profile features and analytics.
- Advanced moderation and reporting system for community chat.

---

### Project Links
- **GitHub Repository:** [LetsCode-new](https://github.com/sachingagneja/LetsCode)
