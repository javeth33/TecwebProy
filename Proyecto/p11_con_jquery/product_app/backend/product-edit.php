<?php
    require_once __DIR__ . '/vendor/autoload.php';

    // Usar el namespace de la clase Update
    use TECWEB\MYAPI\Update\Update;

    // 3. Crear instancia
    $prodObj = new Update('marketzone', 'root', '');

    // 4. Usar el método 'edit' como pide el UML
    $producto = file_get_contents('php://input');
    $prodObj->edit($producto);

    echo $prodObj->getData();
?>