declare const process: any;
const express = require("express")
const LnurlAuth = require("passport-lnurl-auth");
const passport = require("passport");
const session = require("express-session");
import cors from "cors";
import { NextFunction, Request,Response } from "express-serve-static-core";
import path from "path";
const routes = require("./src/routes/router");
// import { initNode, node } from "./helpers/node";
import { Socket } from "socket.io";
const port = process.env.PORT || 3000;

const config = {
  host: process.env.API_HOST,
  url: process.env.API_URL,
};

const app = express();
app.use(express.json()); 




app.use(
  cors({
    origin: process.env.PROJECT_URL,
    credentials: true,
  })
);

// if (!config.url) {
//   config.url = "http://" + config.host + ":" + config.port;
// }

app.use(
  session({
    secret: "12345",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const map = {
  user: new Map(),
};

passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

passport.deserializeUser(function (id: string, done: any) {
  done(null, map.user.get(id) || null);
});

passport.use(
  new LnurlAuth.Strategy(function (linkingPublicKey: string, done: any) {
    let user = map.user.get(linkingPublicKey);
    if (!user) {
      user = { id: linkingPublicKey };
      map.user.set(linkingPublicKey, user);
    }
    done(null, user);
  })
);

app.use(passport.authenticate("lnurl-auth"));

app.get("/", function (req: any, res: Response) {
  if (!req.user) {
    return res.send(
      'You are not authenticated. To login go <a href="/login">here</a>.'
    );
    // return res.redirect('/login');
  }
  res.send("Logged-in");
});

app.get(
  "/login",
  function (req: any, res: Response, next:NextFunction) {
    if (req.user) {
      // Already authenticated.
      return res.redirect(process.env.PROJECT_URL || "https://bit-send.xyz");
    }
    next();
  },
  new LnurlAuth.Middleware({
    callbackUrl: config.url + "/login",
    cancelUrl: process.env.PROJECT_URL,
    loginTemplateFilePath: path.join(__dirname, "login.html"),
  })
);

app.get("/user", (req: any, res: Response) => {
  res.send(req.user);
});

app.get(
  "/logout",
  function (
    req: any,
    res: Response,
    next: NextFunction
  ) {
    if (req.user) {
      req.session.destroy(function (err:any) {
        if (err) {
          return next(err);
        }
        res.json({ message: "user logged out" })
      });
    }
    next();
  }
);

app.use(routes);


const server = app.listen(port, config.host, function () {
  console.log("Server listening on port: " + port);
});


const io = require("socket.io")(server, {
  cors: {
    origin: [process.env.PROJECT_URL],
  },
});



//check if the invoice is settled. If it is settled, then run the next step functions

io.on("connection", async (socket: Socket) => {
  console.log("User connected", socket.id);
  socket.on("payment-completed", (message) => {
    io.emit("is-typing",message)
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  })
})

process.on("uncaughtException", (error: Error) => {
  console.error(error);
});

process.on("beforeExit", (code: number) => {
  try {
    server.close();
  } catch (error:any) {
    console.error(error);
  }
  process.exit(code);
});
