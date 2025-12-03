$(document).ready(function() {
    let edit = false;
    $('#task-result').hide();
    fetchTasks(); // Cargar lista al iniciar

    // --- BÚSQUEDA ---
    $('#search').keyup(function() {
        if($('#search').val()) {
            let search = $('#search').val();
            $.ajax({
                url: 'backend/product-search.php',
                data: {search},
                type: 'POST',
                success: function (response) {
                    if(!response.error) {
                        let tasks = JSON.parse(response);
                        let template = '';
                        tasks.forEach(task => {
                            template += `<li><a href="#" class="task-item">${task.nombre}</a></li>` 
                        });
                        $('#task-result').show();
                        $('#container').html(template);
                    }
                } 
            })
        }
    });

    // --- GUARDAR O EDITAR RECURSO ---
    $('#task-form').submit(function(e) {
        e.preventDefault();

        // Usamos FormData para enviar archivos + texto
        let formData = new FormData();
        formData.append('nombre', $('#name').val());
        formData.append('autor', $('#author').val());
        formData.append('departamento', $('#department').val());
        formData.append('empresa', $('#company').val());
        formData.append('fecha', $('#date').val());
        formData.append('descripcion', $('#description').val());
        formData.append('id', $('#taskId').val());
        
        // Agregar archivo solo si el usuario seleccionó uno
        if($('#file')[0].files.length > 0) {
            formData.append('archivo', $('#file')[0].files[0]);
        }

        // DECISIÓN CLAVE: ¿Es nuevo o es edición?
        // Si edit es true, usamos product-edit.php. Si es false, resource-add.php
        let url = edit === false ? 'backend/resource-add.php' : 'backend/product-edit.php';

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            contentType: false, // Necesario para enviar archivos
            processData: false, // Necesario para enviar archivos
            success: function(response) {
                console.log(response);
                let res = JSON.parse(response);
                alert(res.message); 
                
                fetchTasks(); // Recargar la lista
                
                // Resetear el formulario y el estado
                $('#task-form').trigger('reset');
                edit = false; 
                $('.card-header').text('Nuevo Recurso Digital');
                $('button[type="submit"]').text('Guardar Recurso');
                $('button[type="submit"]').removeClass('btn-warning').addClass('btn-primary');
            }
        });
    });

    // --- LISTAR RECURSOS ---
    function fetchTasks() {
        $.ajax({
            url: 'backend/product-list.php',
            type: 'GET',
            success: function(response) {
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    let fileLink = `uploads/${task.ruta_archivo}`;
                    
                    template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td>
                                <a href="#" class="task-item">${task.nombre}</a>
                            </td>
                            <td>${task.autor}</td>
                            <td>${task.fecha_creacion}</td>
                            <td>
                                <a href="${fileLink}" target="_blank" class="btn btn-sm btn-info">
                                    Descargar ${task.tipo_archivo}
                                </a>
                                <button class="task-delete btn btn-danger btn-sm">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `
                });
                $('#tasks').html(template);
            }
        });
    }

    // --- MODO EDICIÓN: LLENAR FORMULARIO ---
    $(document).on('click', '.task-item', function() {
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        
        // Pedimos los datos al servidor
        $.post('backend/product-single.php', {id}, function(response) {
            const task = JSON.parse(response);
            
            // Llenamos los campos
            $('#name').val(task.nombre);
            $('#author').val(task.autor);
            $('#department').val(task.departamento);
            $('#company').val(task.empresa);
            $('#date').val(task.fecha_creacion); // Asegúrate que en la BD se llame fecha_creacion
            $('#description').val(task.descripcion);
            $('#taskId').val(task.id);
            
            // Cambiamos el estado a "Editando"
            edit = true;
            $('.card-header').text('Editando: ' + task.nombre);
            $('button[type="submit"]').text('Actualizar (Subir archivo para reemplazar)');
            $('button[type="submit"]').removeClass('btn-primary').addClass('btn-warning');
        });
    });

    // --- ELIMINAR RECURSO ---
    $(document).on('click', '.task-delete', function() {
        if(confirm('¿Estás seguro de querer eliminar este recurso?')) {
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('backend/product-delete.php', {id}, function(response) {
                console.log(response);
                fetchTasks();
            });
        }
    });
});