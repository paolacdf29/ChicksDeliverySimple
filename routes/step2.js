const app = require('express');
const router = app.Router();
const supp = require('../dbsupp');
const format = require('../formato');
const check = require('../check')


router.get('/', async(req, res, next)=>{
    if(req.session.user){
        let user = req.session.user;
        let obj =await supp.getperson(user);
        let carrito = await format.countelement(await supp.getpreorder(req.session.deli));
        if(await check.issend(req.session.deli)){
            res.redirect('/step4');
        }else{
            res.render('step2', {title: 'Step 2: info', info: obj, order: req.session.deli, cart: carrito});
        }
    }else if(req.session.admin){
        let carrito = await format.countelement(await supp.getpreorder(req.session.deli));
        if(await check.issend(req.session.deli)){
            res.redirect('/paneladmin');
        }else{
            res.render('admstep2', {title: 'Step 2: Check info', order: req.session.deli, cart: carrito});
        }
            
    }else{
        res.redirect('/login')
    }
})

router.post('/', async(req, res, next)=>{
    if(req.session.user){
        let id_d = req.session.deli;
        if (req.body.exampleRadios == 'option1'){
            let com = 'Delivery time: ' + req.body.PUtime;
            if (req.body.changeaddress){
                com = com + ',' + 'New address: ' + req.body.deli_add;
            }
            if (req.body.comentario) {
                com = com + ',' +'Comment: ' + req.body.comentario;
            }
            await supp.comentar(com, id_d)

            res.redirect('/step3');
    
        }else if(req.body.exampleRadios == 'option2'){
            let com = 'Pick up time: ' + req.body.PUtime;
            if(req.body.comentario){
                com = com + ',' +'Comment: ' + req.body.comentario;
            }
            await supp.comentar(com, id_d)

            res.redirect('/step3');
        }
        res.redirect('/step3');

    }else if(req.session.admin){
        let comentario = 'Name: ' + req.body.Cient_name + ',' + 'Phone: ' + req.body.client_cel;
        if (req.body.exampleRadios == 'option1'){
            comentario = comentario + ',' + 'Address: ' + req.body.deli_add + ',' + 'Delivery time: ' + req.body.PUtime;
        }else{
            comentario = comentario + ',' + 'Pick up time: ' + req.body.PUtime;
        }
        
        if (req.body.comentario){
            comentario = comentario + ',' + req.body.comentario;
        }
        await supp.comentar(comentario, req.session.deli)
        res.redirect('/step3');
        
    }else{
        res.redirect('/login');

    }
})

module.exports = router;