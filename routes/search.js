var express = require('express');
var router = express.Router()

router.get('/',function(req,res,next){
    console.log('Here');
    res.render('search',{title:'Search',message:'Search Restaurant NearBy'});
});

router.get('/findNear',function(req,res,next){
    console.log('findNear');
       getData({req:req,res:res}).then(function(data){
            res.json(data);
       }).catch(function(error){
           res.json({error:error});
       });
});


function getData(httpObject){
    return new Promise(function(resolve,reject){
        console.log('here')
        console.log(httpObject.req.query);
        var dbconnection = httpObject.req.app.locals.db;
        dbconnection.bind('places');
        var category = httpObject.req.query.category;
        var longitude = httpObject.req.query.long;
        var latitude = httpObject.req.query.lat;
        var coord = new Array(Number(latitude),Number(longitude));

        console.log('cat : '+category);
        console.log('long : '+longitude);
        console.log('lat : '+latitude);

        var query ={'$and':[{category:category}, {location:{'$near':coord}}]};
        var projection = {_id:0,'name':1,'location':1};
        var result = [];
         dbconnection.places.find(query,projection).limit(3).each(function(err,data){
            if(err){
                console.log(err);
                throw err;
                reject('No Result Found');
            }
            else{
                if(data==null)
                    dbconnection.close();
                else{
                      console.log(data);
                      result.push(data);
                }
            }
            console.log('result '+data);
            resolve(result);
        });
    });
}
module.exports = router;