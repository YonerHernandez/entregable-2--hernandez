document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []
    const mensajeDiv = document.getElementById("mensaje")
    const catalogoDiv = document.getElementById("catalogo")
    let productos = []

    const titulo = document.getElementById("titulo-primario")
    if (titulo) titulo.innerText = "Suplementos ValeraSport"

    fetch("./db/data.json")
        .then(response => response.json())
        .then(data => {
            productos = data
            document.getElementById("btn-mostrar-catalogo")?.addEventListener("click", mostrarCatalogo)
        })
        .catch(err => {
            mensajeDiv.innerHTML = "<p>Error al cargar los productos. Inténtalo más tarde.</p>"
            mensajeDiv.style.color = "red"
        })

    const btnSaludo = document.getElementById("btn-saludo")
    const mensajeBienvenida = document.getElementById("mensaje-bienvenida")
    const inputNombre = document.getElementById("nombre")

    if (btnSaludo) {
        btnSaludo.addEventListener("click", () => {
            const nombre = inputNombre.value.trim()
            if (nombre) {
                mensajeBienvenida.innerHTML = `Hola: <strong>${nombre}</strong> Bienvenido a nuestro catálogo de Suplementos.`
                inputNombre.value = ''
            } else {
                mensajeBienvenida.innerHTML = "<p>Por favor, ingresa tu nombre.</p>"
            }
        })
    }

    function mostrarCatalogo() {
        if (!productos.length) {
            mensajeDiv.innerHTML = "<p>No hay productos disponibles en este momento.</p>"
            return
        }
        catalogoDiv.innerHTML = 
            `<h3>Productos Disponibles:</h3>
            <ul>
                ${productos.map((producto, index) => 
                    `<li>
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" />
                        <span>${producto.nombre}: ${producto.precio} USD</span>
                        <button class="btn-agregar" data-index="${index}">Agregar al Carrito</button>
                    </li>`
                ).join('')}
            </ul>`

        document.querySelectorAll(".btn-agregar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                agregarAlCarrito(e.target.dataset.index)
            })
        })

        mensajeDiv.innerHTML = "<p>Genial, aquí está nuestro catálogo disponible.</p>"
    }

    function agregarAlCarrito(index) {
        let producto = productos[index]
        let productoEnCarrito = carrito.find(item => item.nombre === producto.nombre)
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++
        } else {
            productoEnCarrito = {...producto, cantidad: 1}
            carrito.push(productoEnCarrito)
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContadorCarrito()

        Toastify({
            text: `¡Estupendo! Agregaste: ${producto.nombre}`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, rgb(10, 221, 80), rgb(103, 21, 170))",
            stopOnFocus: true,
        }).showToast()
    }

    function mostrarCarrito() {
        const productosCarritoDiv = document.getElementById("productos-carrito")
        if (!productosCarritoDiv) return

        productosCarritoDiv.innerHTML = carrito.length === 0
            ? "<p>El carrito está vacío.</p>"
            : 
                `<h3>Productos en el carrito:</h3>
                <ul>
                    ${carrito.map((producto, i) => 
                        `<li>
                            ${producto.nombre} - ${producto.precio} USD 
                            <span>Cantidad: ${producto.cantidad}</span>
                            <button class="btn-aumentar" data-index="${i}">+</button>
                            <button class="btn-disminuir" data-index="${i}">-</button>
                            <button class="btn-eliminar" data-index="${i}">Eliminar</button>
                        </li>`
                    ).join('')}
                </ul>
                <h4>Total: ${calcularTotal()} USD</h4>`

        document.querySelectorAll(".btn-aumentar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                aumentarCantidad(e.target.dataset.index)
            })
        })
        
        document.querySelectorAll(".btn-disminuir").forEach(btn => {
            btn.addEventListener("click", (e) => {
                disminuirCantidad(e.target.dataset.index)
            })
        })

        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                eliminarDelCarrito(e.target.dataset.index)
            })
        })
    }

    function aumentarCantidad(index) {
        carrito[index].cantidad++
        localStorage.setItem("carrito", JSON.stringify(carrito))
        mostrarCarrito()
    }
    function disminuirCantidad(index) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--
            localStorage.setItem("carrito", JSON.stringify(carrito))
            mostrarCarrito()
        } else {
            eliminarDelCarrito(index)
        }
    }

    function eliminarDelCarrito(index) {
        const productoEliminado = carrito.splice(index, 1)
        localStorage.setItem("carrito", JSON.stringify(carrito))
        actualizarContadorCarrito()
        mostrarCarrito()

        Toastify({
            text: `Producto eliminado: ${productoEliminado[0].nombre}`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, rgb(10, 221, 80), rgb(103, 21, 170))",
            stopOnFocus: true,
        }).showToast()
    }

    function calcularTotal() {
        return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
    }

    function actualizarContadorCarrito() {
        const btnMostrarCarrito = document.getElementById("btn-mostrar-carrito")
        if (btnMostrarCarrito) {
            btnMostrarCarrito.innerText = `Mostrar Carrito (${carrito.length})`
        }
    }

    if (document.getElementById("productos-carrito")) {
        mostrarCarrito()
    }

    document.getElementById("btn-mostrar-carrito")?.addEventListener("click", () => {
        window.location.href = "./pages/carrito.html"
    })
})

const btnFinalizarCompra = document.getElementById("btn-finalizar-compra")
if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", () => {
        document.getElementById("formulario-container").style.display = "block"
    })
}

const formularioCompra = document.getElementById("formulario-compra")
if (formularioCompra) {
    formularioCompra.addEventListener("submit", (e) => {
        e.preventDefault()

        const nombreComprador = document.getElementById("nombre-comprador").value
        const emailComprador = document.getElementById("email-comprador").value
        const direccionComprador = document.getElementById("direccion-comprador").value

        if (nombreComprador && emailComprador && direccionComprador) {
            localStorage.removeItem("carrito")

            carrito = []
            document.getElementById("comprobante-compra").innerHTML = 
                `<h3>¡Gracias por tu compra, ${nombreComprador}!</h3>
                <p>Te enviaremos los detalles a <strong>${emailComprador}</strong> y enviaremos tu pedido a:</p>
                <p><strong>${direccionComprador}</strong></p>`

            document.getElementById("productos-carrito").innerHTML = "<p>El carrito está vacío.</p>"

            Toastify({
                text: "Compra realizada con éxito",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, rgb(100, 23, 119), rgb(103, 21, 170))",
                stopOnFocus: true,
            }).showToast()
        } else {
            alert("Por favor, completa todos los campos.")
        }
    })
}
