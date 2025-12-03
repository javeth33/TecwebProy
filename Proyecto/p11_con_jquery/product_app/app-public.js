$(document).ready(function() {
    fetchResources();

    $('#search-input').keyup(function() {
        let search = $('#search-input').val();
        if(search) {
            $.ajax({
                url: 'backend/product-search.php',
                type: 'POST',
                data: {search},
                success: function(response) {
                    let tasks = JSON.parse(response);
                    renderTable(tasks);
                }
            });
        } else {
            fetchResources();
        }
    });

    function fetchResources() {
        $.ajax({
            url: 'backend/product-list.php',
            type: 'GET',
            success: function(response) {
                let tasks = JSON.parse(response);
                renderTable(tasks);
            }
        });
    }

    // Reemplaza tu función renderTable por esta:
    function renderTable(tasks) {
        let template = '';
        tasks.forEach(task => {
            let fileLink = `uploads/${task.ruta_archivo}`;
            let icon = getFileIcon(task.tipo_archivo);

            template += `
                <tr>
                    <td class="icon-col">${icon}</td>
                    <td>${task.nombre}</td>
                    <td>${task.autor}</td>
                    <td>${task.descripcion}</td>
                    <td>
                        <a href="${fileLink}" 
                            target="_blank" 
                            class="btn btn-info btn-download"
                            onclick="registerDownload(${task.id}, '${task.tipo_archivo}')">
                            Descargar
                        </a>
                    </td>
                </tr>
            `;
        });
        $('#catalogo-body').html(template);
    }

    // --- AGREGA ESTA FUNCIÓN AL FINAL DE TU ARCHIVO ---
    // Esta función avisa al backend sin detener la descarga
    window.registerDownload = function(id, tipo) {
        $.post('backend/register-download.php', {id: id, tipo: tipo}, function(response) {
            console.log("Descarga registrada: " + response);
        });
    }

    function getFileIcon(ext) {
        if(!ext) return '📁';
        ext = ext.toLowerCase();
        if (ext === 'pdf') return '📄';
        if (ext.match(/(doc|docx)/)) return '📝';
        if (ext.match(/(xls|xlsx)/)) return '📊';
        if (ext.match(/(zip|rar|7z)/)) return '📦';
        if (ext.match(/(jpg|png|jpeg|gif)/)) return '🖼️';
        if (ext.match(/(exe|jar|msi)/)) return '⚙️';
        return '📁';
    }
});