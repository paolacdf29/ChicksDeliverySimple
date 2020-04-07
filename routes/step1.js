const app = require('express');
const router = app.Router();
const supp = require('../dbsupp');
const format = require('../formato')
const check = require('../check');
let carrito = 0;

router.get('/', async (req, res, next)=>{
    if(req.session.user || req.session.admin){
        let cate = await supp.getcat(1);
        let obj = await supp.getproductos();
        let id_o = req.session.deli;
        carrito = await format.countelement(await supp.getpreorder(req.session.deli));
        if(await check.issend(id_o)){
            res.redirect('/step4');
        }else{
            if(req.session.user){
                res.render('admstep1', {title: 'Step 1: Choose your food', products: obj, cart: carrito, cats: cate, order: req.session.deli});
            }else if(req.session.admin){
                res.render('admstep1', {title: 'Step 1: Choose your food', products: obj, cart: carrito, cats: cate, order: req.session.deli});
            }
        }
    }else{
        res.redirect('/login');
    }
})

router.get('/carrito', async(req, res, next)=>{
    if(req.session.user || req.session.admin){
        let id_order = req.session.deli;
        let obj = await supp.getpreorder(id_order);
        let obj2 = await format.showorder(obj);
        let total= await format.checkme(obj2);
    
        res.render('carrito', {product: obj2, check: total});
    }else{
        res.redirect('/login');
    };
})

router.get('/carrito/delete/:id_reserva', async(req, res, next)=>{
    if(req.session.user){
        let reserva = await supp.getreserva(req.params.id_reserva);
        if(await check.issend(reserva[0].id_o_pc)){
            res.redirect('/step1/carrito')
        }else{
            let ok = await supp.borrame('precompra', req.params.id_reserva);
            if (ok){
                res.redirect('/step1/carrito')
            }else{
                console.log('no se pudo borrar');
            };
        }
    }else{
        res.redirect('/login');
    };
})


module.exports = router;