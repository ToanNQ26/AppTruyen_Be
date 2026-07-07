import express from "express";
import morgan from "morgan";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import errorHandler from "./middlewares/errorHandler.js";
import storyRoute from "./routes/storyRoute.js";
import chapterRoute from "./routes/chapterRoute.js";
import genreRoute from "./routes/genreRoute.js";
import historyRoute from "./routes/historyRoute.js";
import favoriteRoute from "./routes/favoriteRoute.js";
import rateRoute from "./routes/rateRoute.js";
import commentRoute from "./routes/commentRoute.js";
import followRoute from "./routes/followRoute.js";
import viewDailyRouter from "./routes/viewDailyRouter.js"
import cors from "cors";

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://172.20.10.5:5173",
      "https://webtruyenbyquoctoan.netlify.app"
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoute);
app.use("/", authRoute);
app.use("/stories", storyRoute);
app.use("/chapter", chapterRoute);
app.use("/genres", genreRoute);
app.use("/histories", historyRoute);
app.use("/favorite", favoriteRoute);
app.use("/rate", rateRoute);
app.use('/comments', commentRoute);
app.use('/follows', followRoute);
app.use("/views", viewDailyRouter);
// Xử lý lỗi
app.use(errorHandler);
app.use((req, res) =>
  res.status(404).json({ message: "Not Found or Method Not Allowed" })
);

export default app;
