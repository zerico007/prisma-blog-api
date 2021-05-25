import express from "express";
import http from "http";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 4000;

const server = http.createServer(app);

const onListening = () => console.log(`Listening on Port ${port}`);

server.listen(port);
server.on("listening", onListening);

app.use("/user", userRoutes);

app.use("/auth", authRoutes);

app.use("/post", postRoutes);
