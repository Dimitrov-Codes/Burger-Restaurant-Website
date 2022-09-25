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
const storage = admin.storage();
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
        console.log(obj);
        burgers.push(obj);
      });
    })
    .catch((e) => console.log(e));
}
refreshBurgerData();

async function addBurgers(){
  bgs = [{type:"nv",name:"BLT Burger", price:210.0,desc:"Bacon, lettuce and tomato meet a grilled burger patty topped with Heluva Good Bacon Horseradish Dip to make each bite extra lipsmacking",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/BLT-BURGER.png?alt=media&token=37d55882-f10f-4964-a18c-173a179d586a"},
  {type:"nv",name:"Cheese Grilled Lamb Burger", price:250.0,desc:"tender and delicious Lamb lightly seasoned with shallots and garlic powder. And topped with smoked Gouda cheese .",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/cheese_grilled_lamb_burger.png?alt=media&token=3f9e0f6d-f165-4aff-a0d3-b23709505420"},
  {type:"nv",name:"Chicken Burger", price:210.0,desc:"These burgers are loaded with tender & succulent chicken patties, dressed with a simple sauce",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/chicken_burger.png?alt=media&token=f8cb0042-7edb-4166-a839-4b7b73be48a4"},
  {type:"nv",name:"Crab Burger", price:250.0,desc:"Perfectly seasoned and grilled ground beef patty topped with delicate crab meat in a light, flavorful sauce.",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/crab_burger.png?alt=media&token=ed28ef0a-afea-48a8-ae02-c601eaf0de9e"},
  {type:"nv",name:"Fish Burger", price:220.0,desc:"Crispy fish burger with easy garlic lemon mayo and a pile of crispy and totally addictive shoestring fries",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/fish_burger.png?alt=media&token=3a50e309-3539-4343-991e-302576013790"},
  {type:"nv",name:"Classic Lamb Burger", price:210.0,desc:"These succulent, juicy patties are packed full of flavour topped with cool, creamy mint yogurt.",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/juicy_lamb_burger.png?alt=media&token=dd5428cf-6357-43b5-bc2b-5c479a9c1df1"},
  {type:"nv",name:"Mexican Twist", price:230.0,desc:"It's smokey, it's spicy and it's loaded with your favourite Mexican toppings like guac and salsa,",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Mexican-Twist.png?alt=media&token=f55beb1f-eda4-49cc-9046-4ffe51788372"},
  {type:"nv",name:"Salmon Burger", price:230.0,desc:"Topped with melty Havarti & caramelized onions and seasoned with Old Bay, these salmon burgers are the best ever! ",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/salmon_burger.png?alt=media&token=8d89bdff-f549-46ab-b890-7eb77cbccba6"},
  {type:"nv",name:"Shrimp Burger", price:250.0,desc:"Crispy shrimp patties and melted cheese wrapped around buttery brioche buns to give a burst of flavor in every bite.",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/shrimp_burger-removebg-preview.png?alt=media&token=da63886b-c1d6-4fb1-9617-e283e5e4192c"},
  {type:"nv",name:"Tuna Burger", price:250.0,desc:"Inspired by Asian flavors,These ahi tuna burgers are packed with green onions, fresh ginger, soy sauce and a dollop spicy mayo! ",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/tuna_burger.png?alt=media&token=dd2f94fd-28f5-41a9-ac86-fc01249c9e44"}]
  for(let i of bgs){
    let j = JSON.parse(JSON.stringify(i));
    await db.collection("burgers").add(j);
    console.log("added : " + j);
  }
}
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

app.listen(process.env.PORT || 3000, () => {
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