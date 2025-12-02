<?php
    require_once __DIR__ . '/vendor/autoload.php';

    // Usar el namespace de la clase Delete
    use TECWEB\MYAPI\Delete\Delete;

    $prodObj = new Delete('marketzone', 'root', '');

    if( isset($_GET['id']) ) {
        $id = $_GET['id'];
        $prodObj->delete($id);
    }
    
    echo $prodObj->getData();
?>