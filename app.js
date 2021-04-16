const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const MONGODB_URI="mongodb+srv://scarecrow:Test1234@clusteronline.ksueb.mongodb.net/Shop?retryWrites=true&w=majority";
mongoose.connect( MONGODB_URI || 'mongodb://localhost:27017/online', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () =>{
    console.log("Mongoose Is connected!!!")
});
app.use(express.static("public"));
app.set('view engine', 'ejs');

const shopSchema = new mongoose.Schema({
    uName: { type: String },
    pass: { type: String },
    email: { type: String },
    phone: { type: Number }
});
const cartSchema = new mongoose.Schema({
    uName: String,
    quantity: Number,
    color: String,
    category: { type: String },
    product: { type: String },
    brand: { type: String },
    price: { type: Number },
    img1: { type: String },
    buyer: { type: Number },
    reviews: { type: Number },
    votes: { type: Number },
    rating: { type: Number }
});
const allSchema = new mongoose.Schema({
    category: { type: String },
    product: { type: String },
    brand: { type: String },
    price: { type: Number },
    img1: { type: String },
    buyer: { type: Number },
    reviews: { type: Number },
    votes: { type: Number },
    rating: { type: Number }
});
let alwert;
let all;
let filter = [];
const Shop = mongoose.model('Shop', shopSchema);
const Pro = mongoose.model('Pro', allSchema);
const Cart = mongoose.model('Cart', cartSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home/:name", function (req, res) {
    const username = req.params.name;
    console.log(username);
    Cart.find({ uName: username }, function (err, get) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(get);
            console.log(get.length);
            let total = 0;
            let alltotal = [];
            for (var i = 0; i < get.length; i++) {
                total = total + get[i].price * (get[i].quantity);
                alltotal.push(get[i].price * (get[i].quantity));

            }
            console.log(total);
            console.log(alltotal);
            res.render("home", { username: username, cart: get, total: total, alltotal: alltotal });
        }
    });

});
app.post("/category", function (req, res) {
    console.log(req.body.search);
    console.log(req.body.ok);
    res.redirect(`/category/${req.body.ok}/${req.body.search}`);


});
app.get("/category/:no/:name", function (req, res) {
    const name = req.params.name;
    const no = req.params.no;
    console.log(name);
    console.log(no);
    let brandp = ["Real Me", "Mi", "One Plus", "Apple"];
    let brandf = ['Godrej Interio', 'Usha', 'Durian', 'Hustla'];
    let brandj = ["Tanishq","Senco Gold and Diamonds"];
    let brandsh = ["Park Avenue", "Zodiac", "Peter England"];
    let noname = [name, no];
    Pro.find({ category: name }, function (err, found) {
        if (err) {
            console.log(err)
        }
        else {
            if (name === "Phones") {
                console.log(brandp);
                res.render("cat", { title: name, pros: found, no: no, brand: brandp, noname: noname });

            }
            if (name === "Furniture") {
                console.log(brandp);
                res.render("cat", { title: name, pros: found, no: no, brand: brandf, noname: noname });

            }
            if (name === "Jewellery") {
                console.log(brandj);
                res.render("cat", { title: name, pros: found, no: no, brand: brandj, noname: noname });

            }

            if (name === "Shirts") {
                console.log(brandsh);
                res.render("cat", { title: name, pros: found, no: no, brand: brandsh, noname: noname });

            }
        }
    });
});
app.get("/allProducts/:name", function (req, res) {
    const name = req.params.name;
    console.log(name);
    Pro.find({}, function (err, finddetail) {
        if (err) {
            console.log(err);
        }
        else {
            Cart.find({ uName: name }, function (err, get) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(get);
                    console.log(get.length);
                    let total = 0;
                    let alltotal = [];
                    for (var i = 0; i < get.length; i++) {
                        total = total + get[i].price * (get[i].quantity);
                        alltotal.push(get[i].price * (get[i].quantity));

                    }
                    console.log(total);
                    console.log(alltotal);
                    res.render("all", { username: name, cart: get, total: total, alltotal: alltotal, pros: finddetail });
                }
            });
        }
    });
});
app.get("/product/:no/:id", function (req, res) {
    const getid = req.params.id;
    const no = req.params.no;
    console.log(no);
    console.log(getid);
    Pro.findById(getid, function (err, adventure) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(adventure.rating);
            res.render("each", { items: adventure, rating: adventure.rating, getid: getid, no: no })
        }
    });
});
app.post("/cart/:no", function (req, res) {
    console.log(req.body.quantity)
    console.log(req.body.color)
    console.log(req.body.cart)
    console.log(req.params.no);
    console.log(req.params.no.length);
    const name = req.params.no;
    console.log(name);
    Pro.findById(req.body.cart, function (err, get) {
        if (err) {
            console.log(err);
        }
        else {
            Shop.find({ uName: name }, function (err, gets) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(gets[0]);
                    console.log(get._id)
                    const Cart1 = new Cart({
                        uName: gets[0].uName,
                        quantity: req.body.quantity,
                        color: req.body.color,
                        category: get.category,
                        product: get.product,
                        brand: get.brand,
                        price: get.price,
                        img1: get.img1,
                        buyer: get.buyer,
                        reviews: get.reviews,
                        votes: get.votes,
                        rating: get.rating

                    });
                    console.log(Cart1);
                    Cart1.save((err) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Successfully Saved");
                        }
                    });
                    console.log(`/My-cart/${req.params.no}`);
                    res.redirect(`/My-cart/${name}`);
                }
            });
        }
    });

});
app.get("/My-cart/:name", function (req, res) {
    const name = req.params.name;
    Cart.find({ uName: name }, function (err, get) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(get);
            console.log(get.length);
            let total = 0;
            let alltotal = [];
            for (var i = 0; i < get.length; i++) {
                total = total + get[i].price * (get[i].quantity);
                alltotal.push(get[i].price * (get[i].quantity));

            }
            console.log(total);
            console.log(alltotal)
            res.render("cart", { username: name, cart: get, total: total, alltotal: alltotal });
        }
    });

});
app.get("/delete/:user/:id", function (req, res) {
    const id = req.params.id;
    const user = req.params.user;
    Cart.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect(`/My-cart/${user}`);
        }
    });
});
app.post("/filter", function (req, res) {
    console.log(req.body.price);
    console.log(req.body.brand);
    let j;
    let k;
    for (var i = 0; i < req.body.price.length; i++) {
        if (req.body.price[i] === "-") {
            k = i;
        }
    }
    for (var i = 0; i < req.body.type.length; i++) {
        if (req.body.type[i] === ",") {
            j = i;
        }
    }
    let low = req.body.price.substr(0, k);
    let high = req.body.price.substr(k + 1, req.body.price.length);
    console.log(low);
    console.log(high);
    let type = req.body.type.substr(0, j);
    let user = req.body.type.substr(j + 1, req.body.type.length);
    console.log(type);
    console.log(user);
    Pro.find({ category: type, brand: req.body.brand, price: { $gte: low, $lte: high } }, function (err, dom) {
        if (err) {
            console.log(err);
        }
        else {
            filter = [];
            for (var i = 0; i < dom.length; i++) {
                filter.push(dom[i]);
            }
            console.log(filter);
            res.redirect(`/${user}/${type}/filter_added`);
            console.log(`/${user}/${type}/filter_added`);
        }

    });


});
app.get("/:name/:category/filter_added", function (req, res) {
    const name = req.params.name;
    const cat = req.params.category;
    if (filter.length == 0) {
        res.render("oops", { name: name });
    }
    else {
        res.render("filter", { name: name, cat: cat, filter: filter });
    }
});
app.get("/", function (req, res) {
    res.render("index", { alert: all });
});
app.post("/", function (req, res) {
    console.log(req.body.user);
    console.log(req.body.pass);
    Shop.find({ uName: req.body.user, pass: req.body.pass }, function (err, finds) {
        if (err) {
            console.log(err);
        }
        else {
            if (finds.length!=0) {
                res.redirect(`/home/${req.body.user}`);
                console.log(finds[0].email);
            }
            else {
                let alt = "Incorrect Username or Password.Please Sign Up First!";
                console.log(alt);
                alwert = alt
                res.render("index", { alert: alwert });
            }
        }
    });
});
app.get("/about/:name",function(req,res){
    const name=req.params.name;
    res.render("about",{username:name});
});
app.get("/My_account/:name",function(req,res){
    const name=req.params.name;
    Shop.find({uName:name},function(err,doms){
        if(err){
            console.log(err);
        }
        else{
            res.render("my_account",{username:name,user:doms[0]});
        }
    });
});
app.get("/signUp", function (req, res) {
    res.render("signUp");
});
app.post("/signUp/user", function (req, res) {
    console.log(req.body.name);
    console.log(req.body.pass);
    console.log(req.body.mail);
    console.log(req.body.number);
    const Shop1 = new Shop({
        uName: req.body.name,
        pass: req.body.pass,
        email: req.body.mail,
        phone: req.body.number
    });
    console.log(Shop1);
    Shop1.save((err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("successful user");
        }
    });
    res.redirect("/");
});
app.get("/payment/:name", function (req, res) {
    const name = req.params.name;
    Shop.find({ uName: name }, function (err, dom) {
        if (err) {
            console.log(err);
        }
        else {
            if (dom.length == 0) {
                res.render("failed");
            }
            else {
                Cart.find({ uName: name }, function (err, get) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(get);
                        console.log(get.length);
                        let total = 0;

                        for (var i = 0; i < get.length; i++) {
                            total = total + get[i].price * (get[i].quantity);

                        }
                        console.log(total);

                        res.render("success", { name: name,total:total });
                        Cart.deleteMany({uName:name},function (err) {
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("deleted");
                            }
                        });
                    }
                });
            }
        }
    });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("It has started");
});
