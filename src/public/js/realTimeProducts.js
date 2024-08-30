const socket = io()

let ulProductos = document.getElementById("productos")

socket.on("nuevoProducto", producto=> {
    ulProductos.innerHTML += `<li>${producto}</li>`
})

socket.on("productoBorrado", productos=> {
    ulProductos.innerHTML=""
    productos.forEach(prod => {
        ulProductos.innerHTML += `<li>${prod.title}</li>`
    })
})