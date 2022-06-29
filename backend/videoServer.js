const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const PORT = 8080;
const APP_ID = "";
const APP_CERTIFICATE = '';
const app = express();

const nocache = (req,res,next)=>{
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires','-1');
    res.header('Pragma','no-cache');
    next();

}

const generateAccessToken = (req,res) =>{
    res.header('Acess-Control-Allow-Origin','*');
    const channelName = req.query.channelName;
    console.log(channelName);
    if(!channelName){
        return res.status(500).json({'error':'channel is required'});
    }
    let uid = req.query.uid;
    if(!uid || uid == ''){
        uid=0;
    }
    let role = RtcRole.SUBSCRIBER;
    if(req.query.role == 'publisher'){
        role = RtcRole.PUBLISHER;
    }
    let expireTime = req.query.expireTime;
    if(!expireTime || expireTime ==''){
        expireTime = 3600;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,uid, role, privilegeExpireTime);
    console.log(token);
    return res.json({'token':token});



}

app.get('/access_token', nocache, generateAccessToken);
app.listen(PORT, () =>{
    console.log('Listening on port :',PORT);
})