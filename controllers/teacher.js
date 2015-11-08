// controllers/error.js
var express = require('express');
var router = express.Router();


router.get('/all', function (req, res) {
    req.app.models.subject.find().then(function (subjects) {
        //megjelenítés
        res.render('teacher/all', {
            subjects: subjects,
            messages: req.flash('info'),
        });
    });
});
router.get('/delete:id', function (req, res){
    var id = req.params.id;
    req.app.models.subject.findOneById(id)
    .then(function (subject) {
    
        subject.destroy();
        
        req.flash('info', 'Tantárgy sikeresen törölve.');
        res.redirect('/teacher/all');
    });
    
});
router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('teacher/new', {
        validationErrors: validationErrors,
        data: data,
    });
});
router.get('/edit:id', function (req, res) {
    var id = req.params.id;
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    req.app.models.subject.findOneById(id).then(function (subject) {
        console.log(subject);
        res.render('teacher/edit', {
            validationErrors: validationErrors,
            data : subject,
        });
    });
});
router.post('/edit:id', function (req, res) {
    // adatok ellenőrzése
    var id = req.params.id;
    req.checkBody('tantargy', 'Hibás tantárgy').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('kredit', 'Hibás kredit').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/teacher/edit' + id);
    }
    else {
        // adatok elmentése (ld. később) és a tantárgylista megjelenítése
        req.app.models.subject.update({id : id},{
            status: 'new',
            subjectname: req.body.tantargy,
            creditvalue: req.body.kredit,
            description: req.body.leiras
        })
        .then(function (subject) {
            req.flash('info', 'Tantárgy sikeresen frissitve!');
            res.redirect('/teacher/all');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
});

router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('tantargy', 'Hibás tantárgy').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('kredit', 'Hibás kredit').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/teacher/new');
    }
    else {
        // adatok elmentése (ld. később) és a tantárgylista megjelenítése
        req.app.models.subject.create({
            status: 'new',
            subjectname: req.body.tantargy,
            creditvalue: req.body.kredit,
            description: req.body.leiras
        })
        .then(function (subject) {
            req.flash('info', 'Tantárgy sikeresen felvéve!');
            res.redirect('/teacher/all');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
});

module.exports = router;