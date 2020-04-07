const app = require('express');
const router = app.Router();
const supp = require('../dbsupp');
const timer = require('../timer');
const check = require('../check');


router.get('/', async (req, res, next)=>{
    if(req.session.user){
        let id_o = req.session.deli;
        let obj = await supp.getdeli(id_o);
        if (await check.issend(id_o)){
            let obj2 = await geticon(obj);
            res.render('step4', {title: 'Step 4: Order status', st1: obj2.st1, st2: obj2.st2, st3: obj2.st3, st4: obj2.st4, order: id_o});
        }else{
            res.render('step4', {title: 'Step 4: Order status', msj: 'Your order has not been sent, please start over'})
        }
    }else if(req.session.admin){
        res.redirect('/paneladmin')
    }else{
        res.redirect('/login');
    };
});


async function geticon(obj){
    let activeTime = timer.JSFecha(obj[0].Active);
    let status={
        st1: ((obj[0].stp1 == 0) ? 'Waiting for confirmation' : await getstatus(obj[0].stp1, activeTime, 0)),
        st2: ((obj[0].stp1 == 0) ? 'Waiting for confirmation' : await getstatus(obj[0].stp2, activeTime, obj[0].stp1+15)),
        st3: ((obj[0].stp1 == 0) ? 'Waiting for confirmation' : await getstatus(obj[0].stp3, activeTime, obj[0].stp2+15)),
        st4: ((obj[0].stp1 == 0) ? 'Waiting for confirmation' : await getstatus(obj[0].completado, activeTime, obj[0].stp3+5))
    };

    return status
};

async function getstatus(st, timeActive, lastst){
    let msj = '';
    if(st > 0){
        let expectedTime = timer.tiempoTranscurrido(timeActive, st)
        let digitaltime = timer.JSClock(expectedTime);
        msj =  'OK \n' + digitaltime;
    }else{
        let expectedTime = timer.tiempoTranscurrido(timeActive, lastst)
        let digitaltime = timer.JSClock(expectedTime);
        msj = 'expected at \n' + digitaltime;
    };
    
    return msj

}

module.exports = router;
