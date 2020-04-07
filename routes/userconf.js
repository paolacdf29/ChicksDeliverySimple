const express = require('express');
const router = express.Router();
const supp = require('../dbsupp');
const format = require('../formato');
const md5 = require('md5')

router.get('/', async (req, res, next)=>{
    if(req.session.user){
        let user = await supp.getperson(req.session.user);
        let orders = await format.contfinishorders(req.session.user);
        res.render('userconf', {usuario: user, forders: orders});
    }else if(req.session.admin){
        let user = await supp.getperson(req.session.admin)
        res.render('adminconf', {admin: user})
    }else{
        res.redirect('/login');
    }
})

router.get('/changepass', async (req, res, next)=>{
    if(req.session.user || req.session.admin){
        res.render('newpass');
    }else{
        res.redirect('/login');
    }
})

router.post('/changepass', async(req,res,next)=>{
    if(req.session.user || req.session.admin){
        let id_user;
        if(req.session.user){
            id_user = req.session.user;
        }else if(req.session.admin){
            id_user = req.session.admin;
        }
        let user = await supp.getperson(id_user);
        let oldpass = md5(req.body.oldpass);
        let newpass1 = req.body.newpass1;
        let newpass2 = req.body.newpass2;
        if (checkpasswords(newpass1, newpass2) && checkpasswords(user[0].password_client, oldpass)){
            await supp.changepassword(user[0].id_client, md5(newpass1));
            res.render('newpass', {msj: 'Your password has been change correctly'})
        }else{
            res.render('newpass', {msj: "Ups, one of the password don't match"})
        }
    }else{
        res.redirect('/login');
    }


})

function checkpasswords(pass1, pass2){
    if (pass1 == pass2){
        return true;
    }else{
        return false;
    }
}

module.exports = router;