var express = require('express');
var router = express.Router()

router.get('/',function(req,res,next){
    console.log(req.query);
    if(Object.keys(req.query).length ==0){
        res.render('search',{title:'Search',message:'Search Restaurant NearBy',result:[],found:''});
    }
    else{
        var dbconnection = req.app.locals.db;
        dbconnection.bind('places');
        var category = req.query.category;
        var longitude = req.query.long;
        var latitude = req.query.lat;
        var coord = new Array(Number(latitude),Number(longitude));
        
        var query ={'$and':[{category:category}, {location:{'$near':coord}}]};
        var projection = {_id:0,'name':1,'location':1};

        var result = [];
        dbconnection.places.find(query,projection).limit(3).each(function(err,data){
            if(err){
                throw err;
            }
            else{
                if(data==null)
                    dbconnection.close();
                else{
                    result.push(data)
                    console.log(data);
                }
            }
            console.log('result '+result);
            res.render('search',{title:'Search',message:'Search Restaurant NearBy',result:result,found:'Restaurants NearBy'});
        });
    }
});


module.exports = router;