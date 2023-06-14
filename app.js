const bp=require("body-parser");
const exp=require("express");
const re=require("request");
const https=require("https");

const app=exp();
app.use(exp.static("public"));
app.use(bp.urlencoded({extended:true}));

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res)
{
    var fname=req.body.f;
    var lname=req.body.l;
    var email=req.body.e;

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:
                {
                  FNAME:fname,
                  LNAME:lname,
                }
            }
        ]
    };
    //console.log(fname,lname,email);
    const jsonData=JSON.stringify(data);
    const url="https:us17.api.mailchimp.com/3.0/lists/827640d252";
    const options={
        method:"POST",
        auth:"likitha:15799245af5bfe4c8824ce0df67eb869-us17"
    }
    const request = https.request(url,options,function(response)
    {
        if(response.statusCode===200) 
        {
            res.sendFile(__dirname+"/success.html")
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data",function(data)
        {
            console.log(JSON.parse(data));
        })
        
    })
    request.write(jsonData);
    request.end();
})
app.post("/failure",function(req,res)
{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function()
{
    console.log("server is running on port 3000");
})

//15799245af5bfe4c8824ce0df67eb869-us17 api key
//id 827640d252