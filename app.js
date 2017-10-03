var express   = require("express"), 
    bodyParser= require("body-parser"),
    methodOverride=require("method-override"),
    mongoose  = require("mongoose"),
    app       = express();
    
//mongoose.connect("mongodb://localhost/blogsDB");   
mongoose.connect("mongodb://rahmeen:password@ds157624.mlab.com:57624/blogsapp");   

//mongodb://<dbuser>:<dbpassword>@ds157624.mlab.com:57624/blogsapp

app.use(bodyParser.urlencoded({extended : true}));

//express sanitizer ALWAYS GOES BENEATH BODY PARSER!!

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));

var blogSchema= new mongoose.Schema({
    title  : String,
    image  : String,
    content: String,
    created: {type:Date, default:Date.now()},
    author : String
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
            res.redirect("/blogs");

    });

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
        {
            console.log(err);
        }
        else
         res.render("blogs", {blogs: blogs});
        });
   
    });

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundBlog){
        if(err)
        console.log("Error has occured");
        else
        res.redirect("/blogs/"+req.params.id);
    });
});    
    
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
        {
            console.log("Error has been made");
        }
        else
        {
             res.render("edit", {blog: foundBlog});
        }
    });
});


app.get("/blogs/new", function(req, res){
    res.render("new");
    
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
        {
            console.log("Error has been made! :/ ");
        }
        else
        {
            res.render("show", {blog: foundBlog});
        }
    });
});


app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
        {
            res.redirect("/blogs/new");
        }
        else
        res.redirect("/blogs");
    });
    
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(!err)
        {
            res.redirect("/blogs");
        }
        else
        {
            console.log("Error occured");
            
        }
        
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER ON DUTY, MALLADY");
    });

