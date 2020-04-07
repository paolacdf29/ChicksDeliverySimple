const app = require('express');
const router = app.Router();
const supp = require('../dbsupp');
const format = require('../formato');
const check = require('../check');


router.get('/', async (req, res, next)=>{
    if(req.session.user || req.session.admin){
        let id_c= '';
        if(req.session.user){
            id_c = req.session.user
        }else{
            id_c = req.session.admin
        }
        let id_order = req.session.deli;
        let client =await supp.getperson(id_c);
        let obj = await supp.getpreorder(id_order);
        if(obj.length == 0){
            res.redirect('/step1');
        }
        let obj2 = await format.showorder(obj);
        let total=await format.checkme(obj2);
        carrito = await format.countelement(await supp.getpreorder(id_order));
        if(await check.issend(id_order)){
            res.redirect('/step4');
        }else{
            res.render('step3', {title: 'Step 3: Confirm info', cart: carrito, client: client, product: obj2, check: total, order: id_order});
        }
    }else{
        res.redirect('/login');
    };
});

router.get('/ready', async(req, res, next)=>{
    if(req.session.user || req.session.admin){
        let ok = await supp.listo(req.session.deli);
        if (ok){
            res.redirect('/step4')
        }else{
            res.redirect('/step1')
            // res.render('step3', {title: 'Step 3: Confirm info', client: client, product: obj2, check: total, order: id_order, msj: 'ha ocurrido un error'});
        };

    }else{
        res.redirect('/login');
    };

});

router.get('/delete/:id_reserva', async(req,res,next)=>{
    if(req.session.user || req.session.admin){
        let reserva = req.params.id_reserva;
        let ok = await supp.borrame('precompra', reserva);
        if(ok){
            res.redirect('/step3')
        }else{
            console.log('no se pudo borrar');
        };

    }else{
        res.redirect('/login');
    };
});

module.exports = router;
