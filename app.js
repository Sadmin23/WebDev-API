//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if (!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added a new article.")
        } else {
            res.render(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if (err)
            res.send("Successfully deleted all articles.")
        else
            res.send(err);
    });
});

app.route("/articles/:Name")

.get(function(req, res){

    Article.findOne({title: req.params.Name}, function(err, foundArticle){
        if (foundArticle)
            res.send(foundArticle);
        else
            res.send("No articles found!");
    });
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.Name},
        {title: req.body.title, content: req.body.content},
        {overwrite: false},
        function(err){
            if (!err)
                res.send("Successfully updated articles");
        }
    );
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.Name},
        {$set: req.body},
        function(err){
            if (!err)
                res.send("Successfully updated article.");
            else
                res.send(err);
        }
    );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
