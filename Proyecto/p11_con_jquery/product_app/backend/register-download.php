<?php
// backend/register-download.php
namespace TECWEB\MYAPI\Stats;
require_once __DIR__ . '/vendor/autoload.php';

// Conexión simple
$conexion = mysqli_connect('localhost', 'root', '', 'Proyec');

if(isset($_POST['id']) && isset($_POST['tipo'])) {
    $id = $_POST['id'];
    $tipo = $_POST['tipo'];
    
    // Insertamos el registro de descarga
    $sql = "INSERT INTO bitacora (id_recurso, tipo_archivo) VALUES ($id, '$tipo')";
    mysqli_query($conexion, $sql);
    
    echo "Registrado";
}
?>