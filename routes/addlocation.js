var express = require('express');
var router = express.Router();


router.get('/',function(req,res,next){
    res.render('addlocation',{message:'Add New Location',result:''});
});

router.post('/',function(req,res,next){
    var dbconnection = req.app.locals.db;
    dbconnection.bind('places');

    var name = req.body.name;
    var category = req.body.category;
    var latitude = req.body.lat;
    var longitude = req.body.long;
    var coord = new Array(Number(latitude),Number(longitude));
    console.log(req.body);

    var newdata = {
        name:name,
        category:category,
        location:coord
    };
console.log(newdata);
    dbconnection.places.insert(newdata,function(err,datainserted){
        if(err){
            throw err;
            res.render('error',err)
        }
        else{
            console.dir('Data Inserted'+JSON.stringify(datainserted));
            dbconnection.close();
            res.render('addlocation',{message:'',result:'Location Added'});
        }
    });
});

module.exports = router;