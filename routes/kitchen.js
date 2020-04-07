const express = require('express');
const router = express.Router();
const supp = require('../dbsupp');
const format = require('../formato')


router.get('/', async(req, res, next)=>{
    let orders =await kitchenformat()
        
    res.render('kitchen', {title: 'Bienvenido a la Kitchen', OrderList: orders});
})

async function kitchenformat(){
    let KO = []
    let data = await supp.kitchenorders();
    // estas son las ordenes que se encuentran en preparacion
    for (let i = 0; i < data.length; i++) {
        const element = data[i].id_d;
        let obj = await supp.getpreorder(element);
        let obj2 = await format.showorder(obj);
        KO[i] = {
            OrderNo: element,
            OrderProd: obj2
        };
    };
    return KO;
};


module.exports = router;