// JSON BASE A MOSTRAR EN FORMULARIO
/*
var baseJSON = {
    "precio": 0.0,
    "unidades": 1,
    "modelo": "XX-000",
    "marca": "NA",
    "detalles": "NA",
    "imagen": "img/default.png"
};
*/

// Variable global para almacenar los productos listados
var globalProductos = [];

/**
 * Bloque de inicialización de jQuery.
 * Se ejecuta una vez que el DOM está completamente cargado.
 */
$(document).ready(function() {
    init();
    $('#search-form').on('submit', buscarProducto); 
    $('#product-form').on('submit', agregarProducto);

    // Listeners para validación en tiempo real al perder el foco (blur)
    $('#precio, #unidades, #modelo, #marca, #detalles').on('blur', function() {
        validateField($(this));
    });

    // Listener especial para el nombre que incluye validación asíncrona
    $('#name').on('blur', function() {
        validateField($(this));
    });

    // NUEVO: Listener para validación de nombre de producto en tiempo real (con debounce)
    let nameTypingTimer;
    const doneTypingInterval = 500; // 500ms de espera
    $('#name').on('input', function() {
        clearTimeout(nameTypingTimer);
        const field = $(this);
        // Primero, se limpian los mensajes de validaciones previas
        field.removeClass('is-invalid is-valid');
        
        nameTypingTimer = setTimeout(() => {
            validateField(field); // Ejecuta la validación después de que el usuario deja de teclear
        }, doneTypingInterval);
    });


    // Listeners delegados para botones en la tabla
    $("#products").on('click', '.product-delete', eliminarProducto);
    $("#products").on('click', '.product-edit', editarProducto); // NUEVO: Listener para editar

    // NUEVO: Listener para el botón de cancelar edición
    $('#product-form').on('click', '#cancel-edit', resetForm);

    // Búsqueda en tiempo real al teclear
    $('#search').on('input', function() {
        buscarProducto();
    });
});

// FUNCIÓN CALLBACK AL CARGAR LA PÁGINA
function init() {
    resetForm(); // Usamos resetForm para inicializar el formulario
    listarProductos();
}

// FUNCIÓN CALLBACK AL CARGAR LA PÁGINA O AL AGREGAR UN PRODUCTO
function listarProductos() {
    $.ajax({
        url: './backend/product-list.php',
        type: 'GET',
        dataType: 'json', 
        success: function(productos) {
            // SE VERIFICA SI EL OBJETO JSON TIENE DATOS
            if (productos && Object.keys(productos).length > 0) {
                globalProductos = productos; // NUEVO: Guardar productos en variable global
                let template = '';

                // Uso de $.each para iterar sobre la colección
                $.each(productos, function(index, producto) {
                    let descripcion = '';
                    descripcion += '<li>precio: ' + producto.precio + '</li>';
                    descripcion += '<li>unidades: ' + producto.unidades + '</li>';
                    descripcion += '<li>modelo: ' + producto.modelo + '</li>';
                    descripcion += '<li>marca: ' + producto.marca + '</li>';
                    descripcion += '<li>detalles: ' + producto.detalles + '</li>';

                    template += `
                        <tr productId="${producto.id}">
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                            <td class="text-right"> <button class="product-edit btn btn-info btn-sm mr-2">
                                    Editar
                                </button>
                                <button class="product-delete btn btn-danger btn-sm">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `;
                });
                // Uso de jQuery para insertar la plantilla
                $("#products").html(template);
            } else {
                globalProductos = []; // Limpiar si no hay productos
                $("#products").html('<tr><td colspan="4">No hay productos para mostrar.</td></tr>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error al listar productos: " + textStatus, errorThrown);
        }
    });
}

// FUNCIÓN CALLBACK DE FORMULARIO "Buscar"
function buscarProducto(e) {
    if (e) e.preventDefault();

    var search = $('#search').val();

    if (!search.trim()) {
        $("#product-result").attr("class", "card my-4 d-none"); // Ocultar si está vacío
        // Si el campo está vacío, mostrar todos los productos
        listarProductos();
        return;
    }

    // Uso de $.ajax para la conexión asíncrona GET
    $.ajax({
        url: './backend/product-search.php',
        type: 'GET',
        data: {
            search: search
        }, 
        dataType: 'json',
        success: function(productos) {
            if (productos && Object.keys(productos).length > 0) {
                let template = '';
                let template_bar = '';

                $.each(productos, function(index, producto) {
                    let descripcion = '';
                    descripcion += '<li>precio: ' + producto.precio + '</li>';
                    descripcion += '<li>unidades: ' + producto.unidades + '</li>';
                    descripcion += '<li>modelo: ' + producto.modelo + '</li>';
                    descripcion += '<li>marca: ' + producto.marca + '</li>';
                    descripcion += '<li>detalles: ' + producto.detalles + '</li>';

                    template += `
                        <tr productId="${producto.id}">
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                            <td class="text-right">
                                <button class="product-edit btn btn-info btn-sm mr-2">
                                    Editar
                                </button>
                                <button class="product-delete btn btn-danger btn-sm">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `;

                    template_bar += `
                        <li>${producto.nombre}</li>
                    `;
                });
                // Uso de jQuery para manipulación del DOM y clases
                $("#product-result").attr("class", "card my-4 d-block");
                $("#container").html(template_bar);
                $("#products").html(template);
            } else {
                $("#products").html('<tr><td colspan="4">No se encontraron productos.</td></tr>');
                $("#product-result").attr("class", "card my-4 d-block");
                $("#container").html('<li>No se encontraron resultados para la búsqueda.</li>');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error al buscar productos: " + textStatus, errorThrown);
        }
    });
}

// FUNCIÓN CALLBACK DE BOTÓN "Agregar Producto" O "MODIFICAR PRODUCTO"
function agregarProducto(e) {
    e.preventDefault();

    // 5.2 Validar todos los campos antes de enviar
    let isFormValid = true;
    $('#name, #precio, #unidades, #modelo, #marca, #detalles').each(function() {
        if (!validateField($(this))) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        // Muestra un mensaje general si el formulario no es válido
        let template_bar = `<li style="list-style: none;">Por favor, corrige los errores en el formulario.</li>`;
        $("#product-result").attr("class", "card my-4 d-block");
        $("#container").html(template_bar);
        return;
    }

    // ----- INICIO DE LÓGICA DE EDICIÓN -----
    let id = $('#productId').val();
    let isEdit = id ? true : false;
    let url = isEdit ? './backend/product-edit.php' : './backend/product-add.php';
    // ----- FIN DE LÓGICA DE EDICIÓN -----

    // Construir el objeto JSON desde los campos del formulario
    const finalJSON = {
        nombre: $('#name').val(),
        precio: $('#precio').val(),
        unidades: $('#unidades').val(),
        modelo: $('#modelo').val(),
        marca: $('#marca').val(),
        detalles: $('#detalles').val(),
        imagen: $('#imagen').val()
    };

    // Asignar imagen por defecto si el campo está vacío
    if (!finalJSON['imagen'] || finalJSON['imagen'].trim() === "") {
        finalJSON['imagen'] = "img/default.png";
    }

    // ----- INICIO DE LÓGICA DE EDICIÓN -----
    if (isEdit) {
        finalJSON['id'] = id; // Agregar el ID al JSON si estamos editando
    }
    // ----- FIN DE LÓGICA DE EDICIÓN -----


    // La validación detallada ya se hizo, se elimina el bloque de 'errores'
    // let errores = []; ...

    // SE OBTIENE EL STRING DEL JSON FINAL PARA EL ENVÍO POST
    productoJsonString = JSON.stringify(finalJSON);

    $.ajax({
        url: url, // URL dinámica (agregar o editar)
        type: 'POST',
        contentType: "application/json;charset=UTF-8", 
        data: productoJsonString,
        dataType: 'json',
        success: function(respuesta) {
            console.log(respuesta);
            let template_bar = `
                <li style="list-style: none;">status: ${respuesta.status}</li>
                <li style="list-style: none;">message: ${respuesta.message}</li>
            `;

            $("#product-result").attr("class", "card my-4 d-block");
            $("#container").html(template_bar);

            resetForm(); // NUEVO: Resetear formulario en éxito
            listarProductos();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error al agregar/editar producto: " + textStatus, errorThrown);
        }
    });
}

// FUNCIÓN CALLBACK DE BOTÓN "Eliminar" (Manejada por delegación)
function eliminarProducto(e) {
    e.preventDefault(); 

    if (confirm("De verdad deseas eliinar el Producto")) {

        var id = $(this).closest('tr').attr("productId");

        $.ajax({
            url: './backend/product-delete.php',
            type: 'GET',
            data: {
                id: id
            },
            dataType: 'json',
            success: function(respuesta) {
                console.log(respuesta);
                let template_bar = `
                    <li style="list-style: none;">status: ${respuesta.status}</li>
                    <li style="list-style: none;">message: ${respuesta.message}</li>
                `;

                $("#product-result").attr("class", "card my-4 d-block");
                $("#container").html(template_bar);

                listarProductos();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Error al eliminar producto: " + textStatus, errorThrown);
            }
        });
    }
}

// NUEVA FUNCIÓN: Se activa al presionar el botón "Editar"
function editarProducto(e) {
    e.preventDefault();
    let id = $(this).closest('tr').attr("productId");
    // Buscar el producto en nuestro almacén global
    let producto = globalProductos.find(p => p.id == id);

    if (producto) {
        // Llenar el campo oculto con el ID
        $('#productId').val(producto.id);
        // Llenar los campos del formulario
        $('#name').val(producto.nombre);
        $('#precio').val(parseFloat(producto.precio));
        $('#unidades').val(parseInt(producto.unidades));
        $('#modelo').val(producto.modelo);
        $('#marca').val(producto.marca);
        $('#detalles').val(producto.detalles);
        $('#imagen').val(producto.imagen);


        // Cambiar UI del formulario
        $('#product-form button[type="submit"]').text('Modificar Producto');
        
        // Agregar botón de cancelar si no existe
        if ($('#cancel-edit').length === 0) {
            $('#product-form button[type="submit"]').after(
                '<button type="button" id="cancel-edit" class="btn btn-secondary btn-block mt-2">Cancelar Edición</button>'
            );
        }
        
        // Mover el scroll de la página hacia arriba
        window.scrollTo(0, 0);
    }
}

// NUEVA FUNCIÓN: Restablece el formulario al estado inicial
function resetForm() {
    // Restablecer el formulario (limpia todos los campos)
    $('#product-form').trigger('reset');
    
    // Limpiar el ID oculto
    $('#productId').val('');

    // Eliminar clases de validación de todos los campos
    $('#product-form .form-control').removeClass('is-invalid is-valid');

    // Restaurar los valores base en los campos
    /*
    $('#precio').val(baseJSON.precio);
    $('#unidades').val(baseJSON.unidades);
    $('#modelo').val(baseJSON.modelo);
    $('#marca').val(baseJSON.marca);
    $('#detalles').val(baseJSON.detalles);
    $('#imagen').val(baseJSON.imagen);
    */

    // Cambiar el texto del botón principal
    $('#product-form button[type="submit"]').text('Agregar Producto');

    // Eliminar el botón de cancelar
    $('#cancel-edit').remove();
}

// NUEVA FUNCIÓN: Valida un campo individual del formulario
function validateField(field) {
    const id = field.attr('id');
    const value = field.val();
    let message = '';

    // Remover estado de error/éxito previo
    field.removeClass('is-invalid is-valid');
    field.next('.invalid-feedback').text(''); // Limpiar mensaje

    // Función para mostrar el error
    const showError = (msg) => {
        field.addClass('is-invalid');
        field.next('.invalid-feedback').text(msg);
    };

    switch (id) {
        case 'name':
            if (!value || value.trim() === '') {
                showError('El nombre es requerido.');
                return false;
            }
            if (value.length > 100) {
                showError('El nombre debe tener 100 caracteres o menos.');
                return false;
            }
            
            // NUEVO: Verificación asíncrona de existencia del nombre
            const productId = $('#productId').val();
            $.ajax({
                url: './backend/product-check-name.php', // Script de backend a crear
                type: 'POST',
                data: { nombre: value, id: productId },
                dataType: 'json',
                success: function(response) {
                    if (response.exists) {
                        showError('Este nombre de producto ya existe.');
                    } else {
                        field.addClass('is-valid');
                    }
                }
            });
            // La validación asíncrona no retorna un estado inmediato
            return true; // Se asume válido hasta que el servidor responda

        case 'precio':
            if (value === '') message = 'El precio es requerido.';
            else if (isNaN(value) || Number(value) <= 99.99) message = 'El precio debe ser un número mayor a 99.99.';
            break;
        case 'unidades':
            if (value === '') message = 'Las unidades son requeridas.';
            else if (isNaN(value) || Number(value) < 0) message = 'Las unidades deben ser un número mayor o igual a 0.';
            break;
        case 'modelo':
            if (!value || value.trim() === '') message = 'El modelo es requerido.';
            else if (value.length > 25) message = 'El modelo debe tener 25 caracteres o menos.';
            else if (!/^[a-zA-Z0-9\-]+$/.test(value)) message = 'El modelo solo puede contener letras, números y guiones.';
            break;
        case 'marca':
            if (value === 'NA') message = 'Debe seleccionar una marca.';
            break;
        case 'detalles':
            if (value && value.length > 250) message = 'Los detalles deben tener 250 caracteres o menos.';
            break;
    }

    if (message) {
        showError(message);
        return false; // Inválido
    } else {
        // Si no hay mensaje de error, el campo es válido
        field.addClass('is-valid');
        return true; // Válido
    }
}