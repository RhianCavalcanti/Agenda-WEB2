const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();

require('dotenv').config();

const { auth, requiresAuth } = require('express-openid-connect');
app.use(
	auth({
		authRequired:false,
		auth0Logout:true,
		issuerBaseURL:process.env.ISSUER_BASE_URL,
		baseURL:process.env.BASE_URL,
		clientID:process.env.CLIENT_ID,
		secret:process.env.SECRET,
	})
)

//app.get('/', (req, res)=> {
	//res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
//});
app.listen(3000, function () {
	console.log("listening on 3000");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());

MongoClient.connect(
	"mongodb+srv://teste:123@cluster0.xkuyy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useUnifiedTopology: true }
)
	.then((client) => {
		console.log("Connected to Database");
		const db = client.db("crud-with-auth");
		const contactsCollection = db.collection("contacts");
		// app.use(/* ... */)
		app.get("/", (req, res) => {
			db.collection("contacts")
				.find()
				.toArray((err, result) => {
					if (err) return console.log(err);
					res.render("index.ejs", { contacts: result });
				});
		});
		app.post("/contacts",requiresAuth(), (req, res) => {
			contactsCollection
				.insertOne(req.body)
				.then((result) => {
					res.redirect("/");
				})
				.catch((error) => console.error(error));
		});
		app.put("/contacts", (req, res) => {
			db.collection("contacts").findOneAndUpdate(
				{ name: "person" },
				{
					$set: {
						name: req.body.name,
						quote: req.body.number,
					},
				},
				{
					sort: { _id: -1 },
					upsert: true,
				},
				(err, result) => {
					if (err) return res.send(err);
					res.send(result);
				}
			);
		});
		app.delete("/contacts", requiresAuth(), (req, res) => {
			db.collection("contacts").findOneAndDelete(
				{ name: req.body.name },
				(err, result) => {
					if (err) return res.send(500, err);
					res.send("Contato deletado");
				}
			);
		});
	})
	.catch(console.error);
