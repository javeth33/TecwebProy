<?php
use TECWEB\MYAPI\Read\Read;
require_once __DIR__ . '/vendor/autoload.php';

// Instancia la clase Read con tu base de datos
$read = new Read('Proyec');

if(isset($_POST['id'])) {
    // Llama a la función single($id) que agregamos hace poco a tu clase Read
    $read->single($_POST['id']);
}

echo $read->getData();
?>