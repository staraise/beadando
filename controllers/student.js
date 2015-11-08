// controllers/error.js
var express = require('express');
var router = express.Router();

router.get('/mysubjects', function (req, res) {
    req.app.models.usrelation.find({ uid: req.user.id }).then(function(relations) {
        req.app.models.subject.find().then(function(allsubject) {
            var keys = [];
            var k = 0;
            var allCredit = 0;
            for (var i = 0; i < relations.length; i++) {
                for(var j = 0; j < allsubject.length; j++){
                    if(relations[i].sid == allsubject[j].id){
                        keys[k] = allsubject[j];
                        allCredit += allsubject[j].creditValue;
                        k = k+1;
                    }
                }
            }
            res.render('student/mysubjects', {
            subjects: keys,
            allcredit : allCredit,
            messages: req.flash('info'),
            });
        });
    });
});

router.get('/registrate', function (req, res) {
    req.app.models.usrelation.find({ uid: req.user.id }).then(function(relations) {
        req.app.models.subject.find().then(function(allsubject) {
            for (var i = 0; i < allsubject.length; i++) {
                var signedup = false;
                for(var j = 0; j < relations.length && !signedup; j++){
                    signedup = relations[j].sid == allsubject[i].id;              
                }
                allsubject[i].signedup = signedup;
            }
            res.render('student/registrate', {
            subjects: allsubject,
            messages: req.flash('info'),
            });
        });
    });
});


router.get('/signup:id', function (req, res){
    var id = req.params.id;
    req.app.models.usrelation.findOne({ uid: req.user.id, sid : id }, function(err, usrelation) {
        if (err) { throw err}
        if (usrelation) {
            req.flash('info', 'Már jelentkeztel');
            res.redirect('/student/registrate');
            return;
        }
        req.app.models.usrelation.create({ uid: req.user.id, sid : id}).exec(function (createdObject){
            req.flash('info', 'Tantárgy sikeresen felvéve.');
            res.redirect('/student/registrate');
        })
        ;
    });
    
    
});

router.get('/resign:id', function (req, res){
    var id = req.params.id;
    req.app.models.usrelation.findOne({uid : req.user.id, sid : id})
    .then(function (subject) {
        //console.log(subject);
        subject.destroy();
        
        req.flash('info', 'A tantárgyról sikeresen lejelentkeztél.');
        res.redirect('/student/registrate');
    });
    
    
});


module.exports = router;