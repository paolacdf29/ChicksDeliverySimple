const express = require('express');
const router = express.Router();
const supp = require('../dbsupp');
const format = require('../formato');
const timer = require('../timer');
const check = require('../check');

router.get('/:id_deli', async(req,res,next)=>{
    if(req.session.admin || req.session.user){
        let id_o = req.params.id_deli;
        let order = await supp.getdeli(id_o);
        let user = await supp.getperson(order[0].id_c_d);
        if (user[0].permisos == 1){
            user = await format.getrealclient(order);
        }
        let preorder = await supp.getpreorder(id_o);
        let productos = await format.showorder(preorder);
        let cuenta = await format.checkme(productos);
        let time1 = await timer.startime(order);
        let time2 = await timer.finishtime(order);
        let status;
        if(await check.isactive(id_o)){
            status = 'On course'
        }else{
            status = 'finished';
        }
        res.render('order', { user: user, productos: productos, total: cuenta, id: id_o, activeTime: time1, finishTime: time2, status: status});
    }else{
        res.redirect('/login');
    }
})

module.exports = router;
