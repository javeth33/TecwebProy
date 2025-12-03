<?php
    use TECWEB\MYAPI\Read\Read;
    require_once __DIR__ . '/vendor/autoload.php';

    // CORRECCIÓN: Conectamos a 'Proyec' (antes decía marketzone)
    $read = new Read('Proyec');

    if(isset($_POST['search'])) {
        $search = $_POST['search'];
        $read->search($search);
    }

    echo $read->getData();
?>