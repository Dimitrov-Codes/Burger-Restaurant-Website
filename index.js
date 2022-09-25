let express = require("express");
const bp = require("body-parser");
const app = express();
const cp = require("cookie-parser");
const csurf = require("csurf");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let admin = require("firebase-admin");
let serviceAccount = require("brrrgrrr-30225-firebase-adminsdk-czh5h-0db6511c5c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://brrrgrrr-30225-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const csrfMiddleware = csurf({ cookie: true });

const db = admin.firestore();
const rdb = admin.database().ref("/");

let burgers = [];
// 
//Obtain data about current menu
function refreshBurgerData() {
  db.collection("burgers")
    .get()
    .then((i) => {
      i.docs.forEach((j) => {
        let obj = j.data();
        obj.id = j.id;
        burgers.push(obj);
      });
    })
    .catch((e) => console.log(e));
}
refreshBurgerData();

app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cp());
app.use(csrfMiddleware);
app.use(express.json());

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.set("view-engine", "ejs");

app.listen(3000, () => {
  console.log("http://localhost:3000");
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/order", (req, res) => {
  res.render("order.ejs", { burgers: burgers });
});

app.get("/add", (req, res) => {
  console.log(req.query);
  let q;
  console.log(typeof req.query.id);
  for (let i of burgers) {
    if (i.id == req.query.id) {
      console.log(i);
      res.send(i);
      break;
    }
  }
});

app.post("/sessionLogin", (req, res) => {
  // console.log(req.body);
  const idToken = req.body.idToken.toString();
  const name = req.body.name;
  const email = req.body.email;
  const address = req.body.address;
  const uid = req.body.uid;
  console.log(idToken);

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.send({ status: "success" });
        if (uid !== undefined) {
          rdb
            .orderByChild("users")
            .equalTo(uid)
            .once("value", (snapshot) => {
              if (snapshot.exists()) {
                console.log("exists!");
              } else {
                rdb.child("users/" + uid).set({ address });
              }
            });
        }
      },
      (error) => {
        console.log(error);
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});
app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});

app.get("/profile", function (req, res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {
      console.log("------------LOGIN DATA -----------------");
      console.log("Logged in:", userData);
      console.log("Display Name:" + userData.displayName);
      rdb
        .child("users")
        .child(userData.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log("exists!");
            console.log(snapshot);
            snapshot = snapshot.val();
            console.log(snapshot);
            res.render("profile.ejs", {
              data: {
                name: userData.name,
                password: userData.password,
                email: userData.email,
                address: snapshot.address,
              },
            });
          } else {
            console.log("Snapshot does not exist (value)-> " + snapshot.val());
            res.redirect("/login");
          }
        });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/login");
    });
});

app.post("/updateProfile", (req, res) => {
  console.log(req.body);
  admin
    .auth()
    .updateUser(req.body.uid, {
      displayName: req.body.name,
    })
    .then((userRecord) => {
      res.end(JSON.stringify({ status: "success" }));
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully updated user", userRecord.toJSON());
    })
    .catch((error) => {
      console.log("Error updating user:", error);
    });
});








// const listAllUsers = (nextPageToken) => {
  //   // List batch of users, 1000 at a time.
  //   admin
  //     .auth()
  //     .listUsers(1000, nextPageToken)
  //     .then((listUsersResult) => {
  //       let users=[];
  //       listUsersResult.users.forEach((userRecord) => {
  //         console.log("user", userRecord.toJSON().uid);
  //         users.push(userRecord.toJSON().uid);
  //       });
  //       admin
  //         .auth()
  //         .deleteUsers(users)
  //         .then((deleteUsersResult) => {
  //           console.log(
  //             `Successfully deleted ${deleteUsersResult.successCount} users`
  //           );
  //           console.log(
  //             `Failed to delete ${deleteUsersResult.failureCount} users`
  //           );
  //           deleteUsersResult.errors.forEach((err) => {
  //             console.log(err.error.toJSON());
  //           });
  //         })
  //         .catch((error) => {
  //           console.log("Error deleting users:", error);
  //         });
  
  //       if (listUsersResult.pageToken) {
  //         // List next batch of users.
  //         listAllUsers(listUsersResult.pageToken);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error listing users:", error);
  //     });
  // };
  // // Start listing users from the beginning, 1000 at a time.
  // listAllUsers();