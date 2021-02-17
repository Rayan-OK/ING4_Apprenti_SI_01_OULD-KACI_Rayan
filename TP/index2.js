const express = require("express");

const app = express();

const path=require("path");

const bodyParser=require("body-parser");


const router = express.Router();


app.use(express.static('file2'));
app.use(bodyParser());


router.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, "file2/app.html"));
});

router.get('/rayan', (req, res) =>{
  res.json("You are viewing my profile !");
});

router.get('/delete', (req, res)=>{
  res.sendFile(path.join(__dirname, "file2/app.html"));

  console.log(list);
});

let user1 = {
  username:"Mercury",
  address:"Solar System",
};

let list=[user1];
router.post('/user',(req,res)=>{

  console.log("Req ", req.body);
  const{username,address}=req.body;

  const user={
    username:username,
    address:address,
  }

  list.push(user);
  res.json({msg:"We receive your data", data:list});
});

router.post('delete/user', (req, res)=>{
  console.log("Req", req.body);
  const position = req.body;
  list.splice(position,1);
  console.log("Liste:",list);
  res.json({msg:"User deleted successfully", data:list});
})





router.get("*", (req, res)=>{
  res.json("Page not found...");
});

app.use("/", router);

app.listen(8080, () =>{
  console.log("App is startint at port", 8080);
}); //required