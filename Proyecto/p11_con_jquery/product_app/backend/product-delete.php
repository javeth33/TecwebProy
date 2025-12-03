<?php
    require_once __DIR__ . '/vendor/autoload.php';

    // Usar el namespace de la clase Delete
    use TECWEB\MYAPI\Delete\Delete;

    // CORRECCIÓN AQUÍ: Cambiamos 'marketzone' por 'Proyec'
    $prodObj = new Delete('Proyec', 'root', '');

    // NOTA: Asegúrate de usar POST porque tu app.js usa $.post
    if( isset($_POST['id']) ) {
        $id = $_POST['id'];
        $prodObj->delete($id);
    }
    
    echo $prodObj->getData();
?>