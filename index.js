let express = require("express");
const bp = require("body-parser");
const app = express();
const cp = require("cookie-parser");
const csurf = require("csurf");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let admin = require("firebase-admin");
let serviceAccount = require("./brrrgrrr-30225-firebase-adminsdk-czh5h-0db6511c5c.json")

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
let ingredients = {
  buns:[],
  fillers:[],
  non_veg_patties:[],
  veg_patties:[],
  sauces:[],
  cheese:[],
}
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
async function refreshIngredientData() {
  db.collection("buns")
    .get()
    .then((i) => {
      i.docs.forEach((j) => {
        let obj = j.data();
        obj.id = j.id;
        ingredients.buns.push(obj);
      });
    })
    .catch((e) => console.log(e));
    db.collection("cheese")
    .get()
    .then((i) => {
      i.docs.forEach((j) => {
        let obj = j.data();
        obj.id = j.id;
        ingredients.cheese.push(obj);
      }); 
    })
    .catch((e) => console.log(e));
    db.collection("fillers")
    .get()
    .then((i) => {
      i.docs.forEach((j) => {
        let obj = j.data();
        obj.id = j.id;
        ingredients.fillers.push(obj);
      });
    })
    .catch((e) => console.log(e));
    db.collection("non_veg_patties")
    .get()
    .then((i) => {
      i.docs.forEach((j) => {
        let obj = j.data();
        obj.id = j.id;
        ingredients.non_veg_patties.push(obj);
      });
    })
    .catch((e) => console.log(e));
    db.collection("sauces")
    .get()
    .then((i) => {
      i.docs.forEach((j) => {
        let obj = j.data();
        obj.id = j.id;
        ingredients.sauces.push(obj);
      });
    })
    .catch((e) => console.log(e));
    db.collection("veg_patties")
    .get()
    .then((i) => {
      i.docs.forEach((j) => {
        let obj = j.data();
        obj.id = j.id;
        ingredients.veg_patties.push(obj);
      });
    })
    .catch((e) => console.log(e));
}
refreshIngredientData(); 

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

async function addIngredients(){

  buns=[
    {stock:250,name:"Brioche",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fbrioche_bun-removebg-preview.png?alt=media&token=4c2271a3-94f8-4ec4-aaee-ea9c56e9b868",price:45},
    {stock:250,name:"Ciabatta",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fciabatta-removebg-preview.png?alt=media&token=214dd791-9ded-4cbf-a6c4-fa65f9d52250",price:45},
    {stock:250,name:"English Muffins",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fenglish-muffins-split-removebg-preview.png?alt=media&token=2199f7bd-d8e0-4a79-a649-9ed1ee4d955b",price:45},
    {stock:250,name:"Kaiser Roll",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fkaiser_roll-removebg-preview.png?alt=media&token=0b61f55e-ea2e-4ba1-b670-e53aac57f8bc",price:45},
    {stock:250,name:"Lettuce",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Flettuce_bun-removebg-preview.png?alt=media&token=52006ea8-c9af-462b-aede-ff84fb5f47cb",price:45},
    {stock:250,name:"Ol' reliable",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fplain_bun-removebg-preview.png?alt=media&token=2231bba5-d83c-478e-8918-ac716b3cd1ec",price:45},
    {stock:250,name:"Potato",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fpotato_bun-removebg-preview.png?alt=media&token=db85447e-981f-4014-a149-16eeb0783ddb",price:45},
    {stock:250,name:"Pretzel",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fpretzel-removebg-preview.png?alt=media&token=a86d1d35-6124-4ef7-a0e2-2da5aa1bea55",price:45},
    {stock:250,name:"Sesame topped Bun",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fsesame_seed_bun-removebg-preview.png?alt=media&token=54371eba-ea1c-4181-a912-5267614b1997",price:45},
    {stock:250,name:"Sliced Bread",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FBuns%2Fsliced_bread-removebg-preview.png?alt=media&token=3e519c2a-48dd-46f6-b09f-ab6ee740aa0f",price:45}
  ]
  ch=[
    {stock:250,name:"American Cheese",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Famerican_cheese-removebg-preview.png?alt=media&token=a59c0449-f9b1-4c7e-b8bc-863b909edd1d",price:45},
    {stock:250,name:"Brie",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Fbrie-removebg-preview.png?alt=media&token=1ca52fff-7fff-4081-a87f-51eeadfc66b4",price:45},
    {stock:250,name:"Cheddar",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Fcheddar-removebg-preview.png?alt=media&token=75512abc-f59f-4806-a19f-a2417db37888",price:45},
    {stock:250,name:"Monetary Jack",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Fmonetary_jack-removebg-preview.png?alt=media&token=93d695ec-925d-4504-8204-86bad79bd7d6",price:45},
    {stock:250,name:"Pepper Jack",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Fpepper_jack-removebg-preview.png?alt=media&token=a7f35015-20c4-497e-950c-9889d0af1750",price:45},
    {stock:250,name:"Provolone",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Fprovolone-removebg-preview.png?alt=media&token=f4e03b9e-127e-45b5-ae94-fea5a2508090",price:45},
    {stock:250,name:"Smoked Gouda",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Fsmoked_gouda-removebg-preview.png?alt=media&token=a9805464-9f78-4280-8e95-c967e2c9dee2",price:45},
    {stock:250,name:"Stilton",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FCheese%2Fstilton-removebg-preview.png?alt=media&token=dde653b4-5fac-473d-8c72-2c6452a7935b",price:45}
  ]
  fil=[
    {stock:250,name:"Brocolli",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fbrocoli-removebg-preview.png?alt=media&token=ed1a3a5c-119a-450f-a836-e4380410dceb",price:45},
    {stock:250,name:"Capscicum",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fcapsicum-removebg-preview.png?alt=media&token=862479dc-d8cc-4912-9e45-c7c7768bb3a2",price:45},
    {stock:250,name:"Cauliflower",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fcauliflower-removebg-preview.png?alt=media&token=4186da6f-1872-493a-bcee-59c1b59f3b96",price:45},
    {stock:250,name:"Green Chillies",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fgreen_chilli-removebg-preview.png?alt=media&token=e6fbbe17-8434-481f-a45f-b0cb8d504db5",price:45},
    {stock:250,name:"Mushroom",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fmushroom-removebg-preview.png?alt=media&token=bbe66da3-5bb1-4bb9-b4a9-a61cceef5aae",price:45},
    {stock:250,name:"Omellete",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fomellete-removebg-preview.png?alt=media&token=3d01e61f-bf27-436c-897a-f4d0e9b40fc1",price:45},
    {stock:250,name:"Potato",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fpotato-removebg-preview.png?alt=media&token=28a22a40-7ddc-49ff-9d27-c9a2d250db92",price:45},
    {stock:250,name:"Red Chillies",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fred_chili-removebg-preview.png?alt=media&token=373ce1dc-2627-4793-afb3-c0a7b090546a",price:45},
    {stock:250,name:"Spinach",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Fspinach-removebg-preview.png?alt=media&token=28d60f78-bc08-4195-af32-564b7cc0d8cb",price:45},
    {stock:250,name:"Tomatoes",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FFillers%2Ftomato-removebg-preview.png?alt=media&token=7513beae-a682-4bcb-8456-438fa3ef60b",price:45},

  ]
  nv=[
    {stock:250,name:"BBQ Sauced Chicken",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fbbq_saused_chicken-removebg-preview.png?alt=media&token=7b7ac671-2077-425b-895a-9b90dc78d77f",price:45},
    {stock:250,name:"Butter Lamb",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fbutter_lamb-removebg-preview.png?alt=media&token=b5dc021f-9a3f-4106-99c9-3dc68a698806",price:45},
    {stock:250,name:"Crab Pie",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fcrab_pie-removebg-preview.png?alt=media&token=1c72abbd-43fe-4092-973a-5886ce3d278b",price:45},
    {stock:250,name:"Fish Fingers",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Ffish_fingers-removebg-preview.png?alt=media&token=5b534618-ca77-4366-9ac6-badae91685a0",price:45},
    {stock:250,name:"Grilled Chicken",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fgrilled_chicken-removebg-preview.png?alt=media&token=610e1994-5ce6-468f-b2d9-644c77aece4c",price:45},
    {stock:250,name:"Juicy Lamb",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fjuicy_lamb-removebg-preview.png?alt=media&token=9a774ef9-7076-423b-a5f6-245c388f8740",price:45},
    {stock:250,name:"Salmon",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fsamon_patty-removebg-preview.png?alt=media&token=a5ff9158-8dd9-4a1f-86ed-14b0e9a04255",price:45},
    {stock:250,name:"Shrimps",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fshrimps-removebg-preview.png?alt=media&token=07fa5dde-8fe9-43b4-80b7-f65921f339be",price:45},
    {stock:250,name:"Wicked Tuna",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FNon-Veg-Patties%2Fwicked_tuna-removebg-preview.png?alt=media&token=6238879e-9add-4fb6-91d4-2b18f8389cc1",price:45},
  ]
  sauces = [
    {stock:250,name:"Aioli",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Faioli-removebg-preview.png?alt=media&token=e2c7c7dc-bec0-4f6f-86ed-671a77cf5bb6",price:45},
    {stock:250,name:"BBQ Sauce",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Fbasic_bq_sauce-removebg-preview.png?alt=media&token=1c27af16-5c72-4d21-b829-2ace7b6a4bae",price:45},
    {stock:250,name:"Cheese Sauce",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Fcheese_sauce-removebg-preview.png?alt=media&token=1b3097e4-788b-4d60-838e-160188924636",price:45},
    {stock:250,name:"Chilli Sauce",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Fchili_sauce-removebg-preview.png?alt=media&token=e448fe74-7a5e-4b6d-a154-6cdcd56388d3",price:45},
    {stock:250,name:"Mayo",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Fmayo-removebg-preview.png?alt=media&token=d6a40a11-27d0-4e87-9fb0-4f400f50a385",price:45},
    {stock:250,name:"Relish",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Frelish_sauce-removebg-preview.png?alt=media&token=a3649493-b26d-4fd9-87e9-3e772ca1ff77",price:45},
    {stock:250,name:"Spicy Beer Mustard",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Fspicy_beer_mustard_sauce-removebg-preview.png?alt=media&token=5e0cfa03-d794-4a10-8ef5-cb685dde45ff",price:45},
    {stock:250,name:"Thai Sweet Chilli",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Fthai_sweet_chili_sauce-removebg-preview.png?alt=media&token=49f38006-5810-4707-9d5c-ec218a758191",price:45},
    {stock:250,name:"Ketchup",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Ftomato_sauce-removebg-preview.png?alt=media&token=5a92bce6-4f3e-4e31-8abb-083b47470eda",price:45},
    {stock:250,name:"Yellow Mustard",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FSauces%2Fyellow_mustard_sauce-removebg-preview.png?alt=media&token=c52f026e-f1d0-4acf-8888-ea489b45694f",price:45},

  ]
  vp=[
    {stock:250,name:"Black Beans",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_black_beans_delicacy-removebg-preview.png?alt=media&token=1637375a-4e6f-4461-b672-0e8e44f3be98",price:45},
    {stock:250,name:"Farm Delicacy",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_farm_delicacy-removebg-preview.png?alt=media&token=541583c1-35af-4042-bcd1-f8cc9fa889a8",price:45},
    {stock:250,name:"Grilled Cauliflower",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_grilled_cauliflower-removebg-preview.png?alt=media&token=ee118078-81cd-40ec-9e4d-89c498e7767c",price:45},
    {stock:250,name:"Grilled Mushrooms",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_grilled_mushroom_swiss-removebg-preview.png?alt=media&token=55cc0f6d-3e0b-47d2-9673-2469f3f09496",price:45},
    {stock:250,name:"Grilled Panner",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_grilled_panner-removebg-preview.png?alt=media&token=dabf6a2d-83f0-4740-9772-f375e84d98b8",price:45},
    {stock:250,name:"Grilled Veggies",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_grilled_veggie-removebg-preview.png?alt=media&token=6ce9bd12-b28e-4292-9adc-b96257bc6bce",price:45},
    {stock:250,name:"Portobello Mushroom",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_grilled_veggie-removebg-preview.png?alt=media&token=6ce9bd12-b28e-4292-9adc-b96257bc6bcettps://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients/Veg-Patties/patty_-_portobello_mushroom-removebg-preview.png",price:45},
    {stock:250,name:"Regular Veg Patty",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_regular_veggie-removebg-preview.png?alt=media&token=51673954-e485-4532-84ca-773e5dd38570",price:45},
    {stock:250,name:"Teriyaki Jackfruit",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_teriyaki_jackfruit-removebg-preview.png?alt=media&token=8abfdc02-ff54-40cf-b646-a6fd2685e3d5",price:45},
    {stock:250,name:"Chillies",img:"https://firebasestorage.googleapis.com/v0/b/brrrgrrr-30225.appspot.com/o/Ingredients%2FVeg-Patties%2Fpatty_-_the_chillies-removebg-preview.png?alt=media&token=b03587eb-e679-410c-92af-913a3ae9efe8",price:45},

  ]
  // {name:"",img:"https://firebasestorage.googleapis.com",price:45},
  ings = [
    buns,
    ch,
    fil,
    nv,
    sauces,
    vp,
  ]

  // for(let i of ings){
    buns.forEach((k)=>{
      let j = JSON.parse(JSON.stringify(k));
      db.collection("buns").add(JSON.parse(JSON.stringify(k)));
      console.log(j);
    })
    ch.forEach((k)=>{
      let j = JSON.parse(JSON.stringify(k));
      db.collection("cheese").add(JSON.parse(JSON.stringify(k)));
      console.log(j);

    })
    fil.forEach((k)=>{
      let j = JSON.parse(JSON.stringify(k));
      db.collection("fillers").add(JSON.parse(JSON.stringify(k)));
            console.log(j);
    })
    nv.forEach((k)=>{
      let j = JSON.parse(JSON.stringify(k));
      db.collection("non_veg_patties").add(JSON.parse(JSON.stringify(k)));
            console.log(j);
    })
    vp.forEach((k)=>{
      let j = JSON.parse(JSON.stringify(k));
      db.collection("veg_patties").add(JSON.parse(JSON.stringify(k)));
            console.log(j);
    })
    sauces.forEach((k)=>{
      let j = JSON.parse(JSON.stringify(k));
      db.collection("sauces").add(JSON.parse(JSON.stringify(k)));
            console.log(j);
    })
    
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
app.get("/checkout",(req,res)=>{
  res.render("checkout.ejs");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/order", (req, res) => {
  res.render("order.ejs", { burgers: burgers });
});
app.get("/create",(req,res)=>{
  res.render("create.ejs", {buns : ingredients.buns,
                            nvp:ingredients.non_veg_patties,
                            vp:ingredients.veg_patties,
                            sauces:ingredients.sauces,
                            cheese:ingredients.cheese,
                            fillers:ingredients.fillers,
                          })
})

//Complex Login page Requests
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
            res.render("profile.ejs", {data:
               {
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


//REQUESTS 
app.get("/getBurgerData", (req, res) => {
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
app.get("/getIngredientData", (req, res) => {
  // console.log(req.query);
  let q;
  // console.log(typeof req.query.id);
  let ingredient = ingredients[req.query.type];
  // console.log(ingredient);
  for (let i of ingredient) {
    if (i.id == req.query.id) {
      // console.log(i);
      res.send(i);
      break;
    }
  }
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