let mongo = require('./mongo')
let mongoClient = new MongoClient('mongodb+srv://user1:user@example.7j3yd.mongodb.net/admin?retryWrites=true&w=majority',  {useNewUrlParser: true, useUnifiedTopology: true})
let connectToMongoDb = async () => {
	await mongo().then(MongoClient => {
		try{
			console.log('Connected to mongoDB!')
		} finally{
			console.log("ok")
		}
	})
}
connectToMongoDb()
let express = require("express")
let app = express()

let PORT = process.env.PORT || 80

let http = require("http")
let server = http.createServer(app).listen(PORT)

let bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html')
})
app.post('/send', urlencodedParser, function(req, res){
	console.log(req.body.data)
	res.sendFile(__dirname + '/index.html')
	let data = {word: req.body.data}

	mongoClient.connect(function(err, client){
		if(err){
			console.log('Error 1111111:' + err)
		}
		client.db('all').collection('words').insertOne(data, function(err, results){
			if(err){
				console.log('Error 22222222:' + err)
			}
		})
		client.db('all').collection('words').find().toArray(function(err, results){
			if(err){
				console.log('Error 33333333:' + err)
			}
			console.log(results)
		})
		
	})
})
app.post('/delete', urlencodedParser, function(req, res){
	res.sendFile(__dirname + '/index.html')
	let data = req.body.data
	console.log(data)
	mongoClient.connect(function(err, client){
		if(err){
			console.log(err)
		}
		client.db('all').collection("words").deleteOne({word: data}, function(err, result){
			if(err){
				console.log(err)
			}
		})
	})
})
app.get('/show', function(req, res){

	mongoClient.connect(function(err, client){
		if(err){
			console.log(err)
		}
		client.db('all').collection('words').find().toArray(function(err, results){
			if(err){
				console.log(err)
			}
			res.send(JSON.stringify(results))
	        console.log('done')
		})
	})

})