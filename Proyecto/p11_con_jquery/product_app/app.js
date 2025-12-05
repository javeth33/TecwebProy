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
                        
                        $('#task-result').hide();
                        
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
                            `;
                        });
                        
                        $('#tasks').html(template);
                    }
                } 
            })
        } else {
            fetchTasks();
            $('#task-result').hide();
        }
    });

    $('#task-form').submit(function(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append('nombre', $('#name').val());
        formData.append('autor', $('#author').val());
        formData.append('departamento', $('#department').val());
        formData.append('empresa', $('#company').val());
        formData.append('fecha', $('#date').val());
        formData.append('descripcion', $('#description').val());
        formData.append('id', $('#taskId').val());
        
        if($('#file')[0].files.length > 0) {
            formData.append('archivo', $('#file')[0].files[0]);
        }

        
        let url = edit === false ? 'backend/resource-add.php' : 'backend/product-edit.php';

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            contentType: false, 
            processData: false, 
            success: function(response) {
                console.log(response);
                let res = JSON.parse(response);
                alert(res.message); 
                
                fetchTasks(); 
                
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
        
        $.post('backend/product-single.php', {id}, function(response) {
            const task = JSON.parse(response);
            
            $('#name').val(task.nombre);
            $('#author').val(task.autor);
            $('#department').val(task.departamento);
            $('#company').val(task.empresa);
            $('#date').val(task.fecha_creacion); 
            $('#description').val(task.descripcion);
            $('#taskId').val(task.id);
            
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