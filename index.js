let express = require('express');
const bp = require('body-parser');
const app = express();
const ejs = require('ejs');

app.use(bp.urlencoded({extended:true}));
app.use(express.static('public'));

app.set("view-engine","ejs");

app.listen(3000,()=>{console.log("http://localhost:3000")});

//Obtain data about current menu
let burgers=[
    {id:123,name:"Chicken Cheese Burger",desc:"Juicy chicken burger topped with cheddar cheese Dynamo sauce",img:'/Chicken-Cheese-Burger.png', price:12.99},
    {id:123,name:"Chicken Cheese Burger",desc:"Juicy chicken burger topped with cheddar cheese Dynamo sauce",img:'/Chicken-Cheese-Burger.png', price:12.99},
    {id:123,name:"Chicken Cheese Burger",desc:"Juicy chicken burger topped with cheddar cheese Dynamo sauce",img:'/Chicken-Cheese-Burger.png', price:12.99},
    {id:123,name:"Chicken Cheese Burger",desc:"Juicy chicken burger topped with cheddar cheese Dynamo sauce",img:'/Chicken-Cheese-Burger.png', price:12.99},
    {id:123,name:"Chicken Cheese Burger",desc:"Juicy chicken burger topped with cheddar cheese Dynamo sauce",img:'/Chicken-Cheese-Burger.png', price:12.99},
    {id:123,name:"Chicken Cheese Burger",desc:"Juicy chicken burger topped with cheddar cheese Dynamo sauce",img:'/Chicken-Cheese-Burger.png', price:12.99},
    {id:123,name:"Chicken Cheese Burger",desc:"Juicy chicken burger topped with cheddar cheese Dynamo sauce",img:'/Chicken-Cheese-Burger.png', price:12.99},
]

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});


app.get("/login",(req,res)=>{

    res.sendFile(__dirname + "/login.html");
}); 

app.get("/order",(req,res)=>{
    // console.log(burgers);
    res.render("order.ejs", {burgers:burgers});
}); 

app.get("/add", (req,res)=>{
    console.log(req.query);
    let q;
    console.log(typeof req.query.id)
    for(let i of burgers){
        if (i.id == req.query.id){
            console.log(i);
            res.send(i);
            break;
        }
    }
});