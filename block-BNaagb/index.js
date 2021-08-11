var express=require('express');
var axios=require('axios');
var client=redis.create(6379);
client.on('error',(err)=>console.log(err));
var starwarsUrl='https://swapi.dev/api/people/';
var app=express()
app.get('/',(req,res)=>{res.send('<h2>Caching starwars</h2>')})

var checkCache=(req,res,next)=>{
    var catigory=req.query.id;
    client.get(catigory,async(err,data)=>{
        if(err) throw err;
        if(!data) return next();
        res.json({jobs:JSON.parse(data),info:'retrirvrd from cache'})
    })
}
app.get('/people/:id',checkCache,async(req,res)=>{
    var catigory=req.query.id;
    var people=await axios.get(starwarsUrl+`/${catigory}/`);
    client.setex(catigory,600,JSON.stringify(people));
    res.json({
        job:jobs.data,
        info:'retrieved from server'
    })
})
app.listen(3000,()=>console.log('Listen on Port 3k'))