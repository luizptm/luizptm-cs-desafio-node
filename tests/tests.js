process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const Guid = require('guid');

const server = require('../server.js');
const User = require('../models/user')();

const should = chai.should();
chai.use(chaiHttp);
