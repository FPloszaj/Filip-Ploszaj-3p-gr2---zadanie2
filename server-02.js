var express = require("express")
var app = express()
var hbs = require('express-handlebars');
var formidable = require('formidable');
const Datastore = require('nedb')
const PORT = 3000;

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

app.use(express.urlencoded({
    extended: true
}));

var path = require("path")
const context = { docsy: [] }
app.get('/handle', (req, res) => {
    let obj = {
        a: req.query.cb1 == 'on' ? "TAK" : "NIE",
        b: req.query.cb2 == 'on' ? "TAK" : "NIE",
        c: req.query.cb3 == 'on' ? "TAK" : "NIE",
        d: req.query.cb4 == 'on' ? "TAK" : "NIE"
    }

    coll1.insert(obj, function (err, newDoc) {
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        console.log("losowe id dokumentu: " + newDoc._id)

        coll1.find({}, function (err, docs) {

            console.log(docs)
            ctx = { docsy: docs }
            res.render('index.hbs', ctx)
        });
    });

})




app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');

app.get("/", function (req, res) {
    coll1.find({}, function (err, docs) {

        console.log(docs)
        ctx = { docsy: docs }
        res.render('index.hbs', ctx)
    });
})

app.get("/delete", function(req, res){
    let id = req.query.id
    coll1.remove({_id:id}, function(err, numDoc){
        console.log('Usunięto rekord : ' + numDoc + " " + id)

    coll1.find({}, function (err, docs) {

        console.log(docs)
        ctx = { docsy: docs }
        res.render('index.hbs', ctx)
    });
    })
})

app.get("/edit", function(req, res){
    let id = req.query.id
    
    coll1.find({}, function (err, docs) {
        docs.forEach(element => {
            if(element._id == id)
                element.edit=true
        });
    
    ctx = { docsy: docs }
    res.render('index.hbs', ctx)
    })
})

app.get("/accept", function (req, res) {
    coll1.update({ _id: req.query.id }, { $set: {a: req.query.a, b: req.query.b, c: req.query.c, d: req.query.d} }, {}, function (err, numUpdated) {
        coll1.find({}, function (err, docs) {
            console.log(docs)
            ctx = { docsy: docs }
            res.render('index.hbs', ctx)
        });
     })
})

app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

