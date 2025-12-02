<?php
    require_once __DIR__ . '/vendor/autoload.php';

    // Usar el namespace de la clase Read
    use TECWEB\MYAPI\Read\Read;

    $prodObj = new Read('marketzone', 'root', '');

    if( isset($_GET['search']) ) {
        $search = $_GET['search'];
        $prodObj->search($search);
    }
    
    echo $prodObj->getData();
?>