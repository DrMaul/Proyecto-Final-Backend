const addProduct = async (pid) => {
    
    let inputCart = document.getElementById("cart")
    let cid = inputCart.value

    console.log(`Codigo producto: ${pid}, Codigo Carrito: ${cid}`)

    try {
        let cartResponse = await fetch(`/api/carts/${cid}/product/${pid}`, {method:"post"})
        if(cartResponse.status === 200){
        let datos = await cartResponse.json()
        console.log(datos)
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
    
}

const setTicket = async (cid) => {
    let response = await fetch(`/api/carts/${cid}/purchase`, {method:"get"})
    if(response.status === 200){
        setTimeout(() => {
            window.location.reload()
        }, 5000);
        console.log("Compra finalizada")
    }

}