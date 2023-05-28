import express, { Request, Response, NextFunction } from "express";
const LnurlAuth = require("passport-lnurl-auth");
const passport = require("passport");
const session = require("express-session");
import cors from "cors";
import path from "path";
const routes = require("./routes/router");
import bodyParser from "body-parser";
import { initNode, node } from "./helpers/node";
import { Socket } from "socket.io";
import { Session } from "express-session";

const app = express();
app.use(bodyParser.json()); 



interface User {
  id: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

const config = {
  host: "localhost",
  port: 3000,
  url: "http://localhost:3000",
};

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

app.get("/", function (req: Request, res: Response) {
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
  function (req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      // Already authenticated.
      return res.redirect("http://localhost:3001/");
    }
    next();
  },
  new LnurlAuth.Middleware({
    callbackUrl: config.url + "/login",
    cancelUrl: "http://localhost:3001/",
    loginTemplateFilePath: path.join(__dirname, "login.html"),
  })
);

app.get("/user", (req: Request, res: Response) => {
  res.send(req.user);
});

app.get(
  "/logout",
  function (
    req: Request<{}, {}, {}, {}, Session>,
    res: Response,
    next: NextFunction
  ) {
    if (req.user) {
      req.session.destroy(function (err) {
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

initNode().then(() => {
  console.log("Lightning node initialized!");
  console.log("Starting server...");
  io.on("connection", async (socket: Socket) => {
    let subscriber = await node.subscribeInvoices();
    subscriber.on("data", (invoice) => {
      console.log(invoice);
      if (invoice.settled === true) {
        socket.emit("payment-completed", invoice);
      }
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });
  });
});

const server = app.listen(config.port, config.host, function () {
  console.log("Server listening at " + config.url);
});

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3001"],
  },
});

process.on("uncaughtException", (error: Error) => {
  console.error(error);
});

process.on("beforeExit", (code: number) => {
  try {
    server.close();
  } catch (error) {
    console.error(error);
  }
  process.exit(code);
});
