const app = require('express');
const router = app.Router();
const supp = require('../dbsupp');

router.get('/:id_p', async(req, res, next)=>{
    if(req.session.user){
        let item = await supp.getproducto(req.params.id_p);
    
        res.render('addproduct', {nombre: item[0].Nombre, descripcion : item[0].Descripcion, precio: item[0].precio, foto: item[0].pic, id_p: item[0].id_p});

    }else{
        if(req.session.admin){
            let item = await supp.getproducto(req.params.id_p);

            res.render('addproduct', {nombre: item[0].Nombre, descripcion : item[0].Descripcion, precio: item[0].precio, foto: item[0].pic, id_p: item[0].id_p});
        }else{
            res.redirect('/login');
        }
    };
})

router.post('/', async(req, res, next)=>{
    if(req.session.user || req.session.admin){
        let order = req.session.deli;
        let data = {
            id_o_pc : order,
            id_p_pc : req.body.id_p,
            cantip : req.body.cantidad,
            coment : req.body.comentarios
        };
        let ok = await supp.addcarrito(data);
        if (ok){
            res.redirect('/step1/');
        }else{
            alert('error')
        }        
    }else{
        res.redirect('/login');
    };
})


module.exports = router;