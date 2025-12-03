<?php
// backend/product-edit.php (Reemplaza todo el contenido anterior)

use TECWEB\MYAPI\Update\Update;
require_once __DIR__ . '/vendor/autoload.php';

// 1. Crear instancia (Asegúrate de usar tu BD correcta 'Proyec')
$prodObj = new Update('Proyec', 'root', '');

// 2. Preparar los datos que vienen del formulario (FormData llega a $_POST)
$data = array(
    'id' => $_POST['id'], 
    'nombre' => $_POST['nombre'],
    'autor' => $_POST['autor'],
    'departamento' => $_POST['departamento'],
    'empresa' => $_POST['empresa'],
    'fecha' => $_POST['fecha'],
    'descripcion' => $_POST['descripcion'],
    'ruta_archivo' => '', // Asumimos vacío al principio
    'tipo_archivo' => ''
);

// 3. Revisar si el usuario subió un archivo nuevo para reemplazar el anterior
if(isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
    
    $uploadDir = '../uploads/';
    // Crear carpeta si no existe
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = uniqid() . '_' . basename($_FILES['archivo']['name']);
    $targetPath = $uploadDir . $fileName;
    
    // Si se guarda correctamente, actualizamos los datos del array
    if(move_uploaded_file($_FILES['archivo']['tmp_name'], $targetPath)) {
        $data['ruta_archivo'] = $fileName;
        $data['tipo_archivo'] = pathinfo($targetPath, PATHINFO_EXTENSION);
    }
}

// 4. Convertir el array a JSON y pasárselo a tu clase Update
// (Tu clase Update.php espera un string JSON, así que se lo damos)
$prodObj->edit(json_encode($data));

// 5. Devolver respuesta
echo $prodObj->getData();
?>