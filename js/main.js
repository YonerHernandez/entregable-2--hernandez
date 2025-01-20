let titulo = document.getElementById("titulo-primario")

titulo.innerText = "Suplementos ValeraSport"

let nombreInput = document.getElementById("nombre")
let btnSaludo = document.getElementById("btn-saludo")
let mensajeBienvenida = document.getElementById("mensaje-bienvenida")

btnSaludo.addEventListener("click", () => {
    let nombre = nombreInput.value
    if (nombre) {
        mensajeBienvenida.innerHTML = `Hola: <strong>${nombre}</strong> Bienvenido a nuestro catálogo de Suplementos.`
    } else {
        mensajeBienvenida.innerHTML = "Por favor ingresa tu nombre."
    }
})

const productos = [
    { nombre: "Aumentador de Peso", precio: 300 },
    { nombre: "Proteina", precio: 250 },
    { nombre: "Creatina", precio: 250 },
    { nombre: "Multivitaminico", precio: 200 },
    { nombre: "Omega 3", precio: 400 },
]

let carrito = []

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
}

const catalogoDiv = document.getElementById("catalogo")
const carritoDiv = document.getElementById("carrito")
const mensajeDiv = document.getElementById("mensaje")

document.getElementById("btn-mostrar-catalogo").addEventListener("click", () => {
    let menu = "<h3>Productos Disponibles:</h3><ul>"
    productos.forEach((producto, index) => {
        menu += `<li>${index + 1}. ${producto.nombre}: ${producto.precio}USD <button onclick="agregarAlCarrito(${index})">Agregar al Carrito</button></li>`
    })
    menu += "</ul>"
    catalogoDiv.innerHTML = menu;
    mensajeDiv.innerHTML = "<p>Genial, excelente opción, este es nuestro catálogo disponible en estos momentos..!! :)</p>"
});

function agregarAlCarrito(index) {
    carrito.push(productos[index])
    mensajeDiv.innerHTML = `<p>¡Estupendo! Agregaste: ${productos[index].nombre}</p>`
    actualizarCarrito()
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

document.getElementById("btn-mostrar-carrito").addEventListener("click", () => {
    mostrarCarrito()
});

function mostrarCarrito() {
    if (carrito.length === 0) {
        carritoDiv.innerHTML = "<p>El carrito está vacío.</p>"
    } else {
        let carritoContenido = "<h3>Productos en el carrito:</h3><ul>"
        carrito.forEach((producto, i) => {
            carritoContenido += `<li>${i + 1}. ${producto.nombre}: ${producto.precio}USD <button onclick="eliminarDelCarrito(${i})">Eliminar del Carrito</button></li>`
        });
        carritoContenido += "</ul>"
        
        carritoContenido += `<h4>Total: ${calcularTotal()}USD</h4>`
        carritoDiv.innerHTML = carritoContenido;
    }
}

function eliminarDelCarrito(index) {
    const productoEliminado = carrito.splice(index, 1)
    mensajeDiv.innerHTML = `<p>Producto eliminado del carrito: ${productoEliminado[0].nombre}</p>`
    actualizarCarrito()
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function actualizarCarrito() {
    let carritoContenido = "<h3>Productos en el carrito:</h3><ul>"
    carrito.forEach((producto, i) => {
        carritoContenido += `<li>${i + 1}. ${producto.nombre}: ${producto.precio}USD <button onclick="eliminarDelCarrito(${i})">Eliminar del Carrito</button></li>`
    })

    carritoContenido += "</ul>"
    carritoContenido += `<h4>Total: ${calcularTotal()}USD</h4>`
    carritoDiv.innerHTML = carritoContenido
}

function calcularTotal() {
    
    return carrito.reduce((total, producto) => total + producto.precio, 0)
}


document.getElementById("btn-salir").addEventListener("click", () => {
    mensajeDiv.innerHTML = "<p>¡Hasta luego!</p>"
    catalogoDiv.innerHTML = ""
    carritoDiv.innerHTML = ""
    localStorage.removeItem("carrito")
})
