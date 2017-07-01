var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
var mongoose   = require("mongoose");
var app        = express();
var user   = require('./app/models/user');

// Connect to DB
var dbname = "luizptm-cs-nodejs";
//var url = "mongodb://localhost:27017/" + dbname;
var url = "mongodb://admin:admin@ds032340.mlab.com:32340/luizptm-cs-nodejs";
//mongoose.connect(url);
mongoose.connect(url, {useMongoClient: true}).catch = function(onRejected) {
    return this.then(null, onRejected);
};
app.set('key', dbname);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// Starting Server
var port = 3003;
app.listen(port, function () {
    console.log( "Express at port " + port);
});

var apiRoutes = express.Router();

//http://localhost:8000/authenticate
apiRoutes.post('/authenticate', function(req, res) {
    user.findOne({
        name: req.body.nome
    }, function(error, user) {
        if (error)
            throw error;
        if (!user) {
            res.json({ success: false, message: 'User not found' });
        } else if (user) {
            user.verifyPassword(password, function(isMatch) {
                if (!isMatch) {
                    console.log("Attempt failed to login with " + user.username);
                    return res.send(401);
                }
                var expires = moment().add(7,'days').valueOf();
                var token = jwt.encode({
                    iss: user.id,
                    exp: expires
                }, app.get('key'));
                return res.json({
                    token : token,
                    expires: expires,
                    message: 'Token criado!!!',
                    user: user.toJSON()
                });
            });
        }
    });
});

apiRoutes.post('/authenticate', function(req, res) {
    user.findOne({
        name: req.body.nome
    }, function(error, user) {
        if (error)
            throw error;
        if (!user) {
            res.json({ success: false, message: 'User not found' });
        } else if (user) {
            user.verifyPassword(password, function(isMatch) {
                if (!isMatch) {
                    console.log("Attempt failed to login with " + user.username);
                    return res.send(401);
                }
                var expires = moment().add(7,'days').valueOf();
                var token = jwt.encode({
                    iss: user.id,
                    exp: expires
                }, app.get('key'));
                return res.json({
                    token : token,
                    expires: expires,
                    message: 'Token criado!!!',
                    user: user.toJSON()
                });
            });
        }
    });
});

apiRoutes.post('/save', function(req, res) {
    user.find({ Email: user.Email }).toArray(function (err, result) {
        if (err) {
            res.status(500).json({ "mensagem": "mensagem de erro" });
            db.close();
            return;
        }
        if (result.length > 0) {
            db.close();
            res.status(401).json({ "mensagem": "E-mail já existente" });
        }
        else {
            user.insert(user);
            db.close();
            res.status(200).json(user);
        }
    });
});

apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('key'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failing trying to authenticate the token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'Não há token.'
        });
    }
});

//http://localhost:8000/api
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Bem-Vindo!!! ' });
});

//http://localhost:8000/users
apiRoutes.get('/users', function(req, res) {
    user.find({}, function(error, users) {
        res.json(users);
    });
});

app.use('/api', apiRoutes);

