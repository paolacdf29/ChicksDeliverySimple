// const supp = require('../funciones')

// function stepready(id, id_o) {
//     document.getElementById(id).innerHTML = '<i class="fas fa-check-circle"></i>13:20hs';
//     console.log('el id del status es '+ id + ' y el id de la orden es '+ id_o);
// }

// async function delItem(id_pc){
//     console.log('intentando eliminar');
// }

function changemyaddress(){
    let addresselement = document.getElementById('address');
    if(addresselement.disabled) {
        addresselement.disabled = false;
    } else {
        addresselement.disabled = true;
    }
}

function showpassword() {
    // accedemos a p1 y a p2 (todo el elemento)
    let password1Element = document.getElementById('p1');
    
    // type es otra propiedad del DOM que me devuelve el tipo de elemento
    if(password1Element.type === "password") {
        password1Element.type = "text";
    } else {
        password1Element.type="password";

    }
}

// function doblecheckpass(){
//     let pass1 = document.getElementById('pass1');
//     let pass2 = document.getElementById('pass2');
//     // let sendbtn = document.getElementById('registrobtn')
//     if (pass1 != pass2){
//         console.log(pass1);
//         console.log(pass2);
//         document.getElementById("passmatch").innerHTML = "";
//     }else{
//         document.getElementById("passmatch").innerHTML = "passwords must match";

//     }
