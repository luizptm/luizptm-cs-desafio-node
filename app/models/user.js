var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var schemaUser = new Schema({
    id: { type: String, required: true },
    salt: { type: String, required: true },
    nome: { type: String, trim: true, required: true },
    email: { type: String, lowercase: true, index: { unique: true } },
    senha: { type: String, trim: true, required: true },
    telefones: [{ numero: Number, ddd: Number }],
    data_criacao: Date,
    data_atualizacao: { type: Date, default: Date.now },
    ultimo_login: Date,
    token: String
});

var user = new mongoose.Schema(schemaUser);

user.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});
//3
user.methods.verifyPassword = function(password, next) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return next(err);
        next(isMatch);
    });
};

module.exports = mongoose.model('User', schemaUser);