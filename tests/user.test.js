var expect = require("chai").expect;
var bcrypt = require("bcryptjs");
var Browser = require('zombie');
var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('../models/user');
var subjectCollection = require('../models/subject');

Browser.localhost(process.env.IP, process.env.PORT);
var User;

before(function (done) {
    // ORM indítása
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(subjectCollection));
    waterlineConfig.connections.default.adapter = 'memory';

    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {

    function getUserData() {
        return {
                neptun: 'abcdef',
                password: 'jelszo',
                surname: 'Gipsz',
                forename: 'Jakab',
        };
    }

    beforeEach(function (done) {
        User.destroy({}, function (err) {
            done();
        });
    });
    
    it('should be able to create a user', function () {
        return User.create(getUserData())
        .then(function (user) {
            expect(user.neptun).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
    });

    it('should be able to find a user', function() {
        return User.create(getUserData())
        .then(function(user) {
            return User.findOneByNeptun(user.neptun);
        })
        .then(function (user) {
            expect(user.neptun).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
    });
    
    it('should be able to update a user', function() {
    var newForename = 'Bela';
    
    return User.create(getUserData())
    .then(function(user) {
        var id = user.id;
        return User.update(id, { forename: newForename });
    })
    .then(function (userArray) {
        var user = userArray.shift();
        expect(user.neptun).to.equal('abcdef');
        expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
        expect(user.surname).to.equal('Gipsz');
        expect(user.forename).to.equal(newForename);
        });
    });
    
    describe('#validPassword', function() {
    it('should return true with right password', function() {
         return User.create(getUserData()).then(function(user) {
             expect(user.validPassword('jelszo')).to.be.true;
         })
    });
    it('should return false with wrong password', function() {
         return User.create(getUserData()).then(function(user) {
             expect(user.validPassword('titkos')).to.be.false;
         })
    });
    });

describe('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
});
});