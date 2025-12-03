<?php
    require_once __DIR__ . '/vendor/autoload.php';

    // Usar el namespace de la clase Read
    use TECWEB\MYAPI\Read\Read;

    $prodObj = new Read('Proyec', 'root', '');
    $prodObj->list();

    echo $prodObj->getData();
?>