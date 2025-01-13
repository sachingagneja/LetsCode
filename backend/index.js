const express = require("express");
const User = require("./models/userSchema");
const { mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Ques = require("./models/questions");
const userQuestion = require("./models/contributedQues");
const Query = require("./models/query");
const questions = require("./models/questions");
const port = process.env.PORT || 3000;
const app = express();
require("dotenv").config();
const db_URI = process.env.DB_URI;
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const tmp = require("tmp-promise");
const fs = require("fs");
const { exec, spawn } = require("child_process");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");
const newMsg = require("./models/messages");
const { report } = require("process");
const keep_alive = require("./keep_alive.js");
app.use(cors());
app.use(bodyParser.json());
const email = process.env.EMAIL;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

mongoose
  .connect(db_URI)
  .then(() => console.log("Connection successful"))
  .catch((error) => console.log(`Error Connecting to Database ${error}`));


function verifytoken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send("Authentication required for this action");
  }

  try {
    const tokenParts = token.split(" ");
    const decoded = jwt.verify(tokenParts[1], "SECRET_KEY");
    const currentTime = Math.floor(Date.now() / 1000);
    const lastActivity = decoded.lastActivity;
    const inactivePeriod = 5 * 60 * 60;

    if (currentTime - lastActivity > inactivePeriod) {
      return res.status(401).send("Token Expired due to inactivity");
    }
    decoded.lastActivity = currentTime;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: email,
    pass: process.env.SMTP_PASS,
  },
});

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser || existingEmail) {
      return res.status(203).json({ message: "Username/Email already exists" });
    }
    if (password.length < 8) {
      return res
        .status(204)
        .json({ message: "Password length should be atleast 8" });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 8);
      const newUser = new User({
        username: username,
        password: hashedPassword,
        email: email,
        isAdmin: false,
        quesSolved: [{}],
        quesSolvedNum: { easy: 0, medium: 0, hard: 0 },
        reports: 0,
      });
      await newUser.save();
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      if (
        !bcrypt.compareSync(password, findUser.password) ||
        findUser.username !== username ||
        findUser.email !== email
      ) {
        res.status(401).json({ message: "Invalid Username/Password/Email" });
      } else {
        const tokenPayload = {
          username: findUser.username,
          isAdmin: findUser.isAdmin,
        };
        const token = jwt.sign(tokenPayload, "SECRET_KEY");
        res.status(201).json({ token, isAdmin: findUser.isAdmin });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/:username/addQues", verifytoken, async (req, res) => {
  const { quesName, difficulty, description, constraints, testcases } =
    req.body;
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user.isAdmin) {
      const ques = new Ques({
        quesName,
        difficulty,
        description,
        constraints,
        testcases,
      });
      await ques.save();
      return res.json({ message: "Question added successfully" });
    } else {
      return res
        .status(401)
        .json({ message: "You are not authorized for this action" });
    }
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
  }
});

app.post("/:username/contribute", verifytoken, async (req, res) => {
  const { username } = req.params;
  const { quesName, description, isApproved } = req.body;
  try {
    const user = await User.findOne({ username });
    const toEmail = user.email;
    const userQues = new userQuestion({
      contributedBy: username,
      quesName,
      description,
      isApproved: isApproved || false,
    });
    await userQues.save();
    const mailOptions = {
      from: email,
      to: toEmail,
      subject: "Thank you for your Contribution",
      text: `Thank you ${username} for this contribution we will notify you once we verify this question`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "Thank you for your contribution" });
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
  }
});

app.post("/:username/query", verifytoken, async (req, res) => {
  const { username } = req.params;
  const { email, query } = req.body;

  try {
    const queries = new Query({
      username: username,
      email,
      query,
      isResolved: false,
    });
    await queries.save();
    const mailOptions = {
      from: "sachingagneja789@gmail.com",

      to: email,
      subject: `Query Recieved`,
      text: `Recieved Your Query will contact you soon`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: "Query Recieved" });
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
    console.log(error);
  }
});

app.get("/:username/display-queries", verifytoken, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user.isAdmin) {
      await Query.deleteMany({ isResolved: true });
      const queries = await Query.find();
      res.json({ queries });
    } else {
      res
        .status(401)
        .json({ message: "You are not authourized to perform this action" });
    }
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
  }
});

app.get("/display-ques", verifytoken, async (req, res) => {
  try {
    const ques = await questions.find({});
    res.status(201).json(ques);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

app.get("/:queryId/show-query", verifytoken, async (req, res) => {
  const { qId } = req.params;
  try {
    const user = await Query.findOne(qId);
    res.status(201).send(user);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

app.put("/:queryId/resolve", async (req, res) => {
  const { queryId } = req.params;
  try {
    const query = await Query.findOneAndUpdate(
      { _id: queryId },
      { isResolved: true },
      { new: true },
    );
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    const email = query.email;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email not provided in the query" });
    }
    const mailOptions = {
      from: "sachingagneja789@gmail.com",
      to: email,
      subject: `Query Resolved with: ${queryId}`,
      text: `Query With ${queryId} resolved successfully`,
    };

    await transporter.sendMail(mailOptions);

    const query1 = await Query.findOneAndDelete({ isResolved: true });

    res.status(201).json({ query1 });
  } catch (error) {
    console.error("Error resolving query:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/:qId/added", async (req, res) => {
  const { qId } = req.params;
  try {
    const findUname = await userQuestion.findOne({ _id: qId });
    const username = findUname.contributedBy;
    const user = await User.findOne({ username });
    const toEmail = user.email;
    await userQuestion.findOneAndUpdate(
      { _id: qId },
      { isApproved: true },
      { new: true },
    );

    const mailOptions = {
      from: email,
      to: toEmail,
      subject: "Question accepted",
      text: `Thankyou ${username} for your contribution to the coding community.`,
    };

    await transporter.sendMail(mailOptions);

    const quesDel = await userQuestion.findOneAndDelete({ isApproved: true });
    return res.status(201).json({ quesDel });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/:username/display-contributed", verifytoken, async (req, res) => {
  try {
    const ques = await userQuestion.find();
    res.status(200).send(ques);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

app.get("/:qid/approve-question", verifytoken, async (req, res) => {
  const { qid } = req.params;
  try {
    const id = new ObjectId(qid);
    const ques = await userQuestion.findOne({ _id: id });
    if (!ques) return res.status(404).send("Not found");
    res.status(200).json({ ques });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/:qId/reject", verifytoken, async (req, res) => {
  const { qId } = req.params;
  const { msg } = req.body;

  try {
    const id = new ObjectId(qId);
    const ques = await userQuestion.findOne({ _id: id });
    const del = await userQuestion.findOneAndDelete({ _id: id });
    const uName = ques.contributedBy;
    const user = await User.findOne({ username: uName });
    const toEmail = user.email;
    const mailOptions = {
      from: email,
      to: toEmail,
      subject: "Attention!!",
      text: `Thank you ${uName} for your contribution but we won't be able to add this to our 
question base because ${msg}`,
    };
    transporter.sendMail(mailOptions);
    res.status(201).json({ del });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/display-users", verifytoken, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

app.get("/:username/userInfo", verifytoken, async (req, res) => {
  const { username } = req.params;
  try {
    const userInfo = await User.findOne({ username });
    res.status(200).send(userInfo);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

app.put("/:username/make-admin", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { username: username },
      { isAdmin: true },
    );
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

app.put("/:username/remove-admin", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { username: username },
      { isAdmin: false },
    );
    await user.save();
    res.status(201).send("updated successfully");
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

app.get("/:qId/ques-details", async (req, res) => {
  const { qId } = req.params;
  const ques = await Ques.findOne({ _id: qId });
  return res.status(200).send(ques);
});

app.post("/:qId/compile-cpp", async (req, res) => {
  const { code } = req.body;
  const { qId } = req.params;

  try {
    const ques = await Ques.findOne({ _id: qId });
    if (!ques) {
      return res.status(404).send("Question not found");
    }

    const testcases = ques.testcases;
    const { path, cleanup } = await tmp.file({ postfix: ".cpp" });
    await fs.promises.writeFile(path, code);

    exec(`g++ -o ${path}.exe ${path}`, async (error, stdout, stderr) => {
      cleanup();

      if (error) {
        console.log(error);
        return res.status(501).send(stderr);
      }

      let passedCases = 0;
      const results = [];

      for (const testcase of testcases) {
        const { input: testcaseInput, output } = testcase;

        const inputToUse = testcaseInput;

        const command = `${path}.exe`;
        const childProcess = spawn(command);

        childProcess.stdin.write(inputToUse + "\n");
        childProcess.stdin.end();

        let result = "";

        childProcess.stdout.on("data", (data) => {
          result += data.toString();
        });

        childProcess.on("exit", (exitCode) => {
          if (exitCode === 0 && result.trim() === output.trim()) {
            passedCases++;
            results.push({ input: inputToUse, output, result: "Passed" });
          } else {
            results.push({ input: inputToUse, output, result: "Failed" });
          }

          if (results.length === testcases.length) {
            const passedPercentage = (passedCases / testcases.length) * 100;
            res.send({
              passedCount: passedCases,
              totalCount: testcases.length,
              passedPercentage,
              results,
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
});

app.put("/:qId/:username/solved", async (req, res) => {
  const { qId, username } = req.params;
  try {
    const ques = await Ques.findOne({ _id: qId });

    const user1 = await User.findOne({ username });
    if (user1.quesSolved.find((q) => q.name === ques.quesName)) {
      return res.status(400).send("Question Already Solved");
    }

    const user = await User.findOneAndUpdate(
      { username },
      { $addToSet: { quesSolved: { name: ques.quesName } } },
      { new: true },
    );

    if (ques.difficulty === "easy") user.quesSolvedNum.easy++;
    else if (ques.difficulty === "medium") user.quesSolvedNum.medium++;
    else user.quesSolvedNum.hard++;

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/forgot-pass", verifytoken, async (req, res) => {
  const { email } = req.body;
  const { newPass } = req.body;
  try {
    const user = await User.findOne({ email });
    if (newPass.length < 8) {
      return res.status(400).json({ message: "Minimum password length is 8" });
    }
    if (user && !user.isAdmin) {
      const updatedPass = bcrypt.hashSync(newPass, 8);
      if (bcrypt.compareSync(newPass, user.password)) {
        return res.json({ message: "New and old password can not be same" });
      } else {
        user.password = updatedPass;
        await user.save();
        return res
          .status(201)
          .json({ message: "Password updated successfully" });
      }
    }
    if (user && user.isAdmin) {
      res
        .status(401)
        .json({ message: "Contact Administration if forgot password" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(501).json({ message: "Internal Server Error" });
  }
});

app.post("/:username/chat-room", async (req, res) => {
  const { username } = req.params;
  const { message } = req.body;
  io.emit("welcome", `${username} joined the chat`);
  const newMessage = new newMsg({
    username: username,
    message: message,
  });

  await newMessage.save();

  res.send("POST request received");
});
io.on("connection", (socket) => {
  socket.on("join", (username) => {
    io.emit("join-greet", `${username}, Joined the chat!!`);
  });
  socket.on("send-msg", ({ username, message }) => {
    io.emit("rec-msg", { username, message });
  });
});

app.get("/display-messages", verifytoken, async (req, res) => {
  const mess = await newMsg.find();
  res.json({ mess });
});

app.patch("/:username/updateReportCount", async (req, res) => {
  const { username } = req.params;
  try {
    await User.findOneAndUpdate(
      { username: username },
      { $inc: { reports: 1 } },
      { new: true },
    );
    console.log("reported");
    res.status(200).send("User Reported");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/:username/deleteUser", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user.reports >= 5) {
      await User.findOneAndDelete({ username: username });
      return res.status(200).send("User successfully deleted");
    } else res.status(201).send("Warning sent");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/test", (req, res) => {
  console.log("testing done");
});

app.all("/*", (req, res) => {
  res.status(404).send("Page Not Found");
});

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
