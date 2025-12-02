<?php
use TECWEB\MYAPI\Create\Create;

require_once __DIR__ . '/vendor/autoload.php';

$create = new Create('marketzone'); // Asegúrate que 'marketzone' sea el nombre de tu BD

$response = array(
    'status'  => 'error',
    'message' => 'Error en la subida del archivo'
);

// Verificamos si se envió un archivo y si no hubo error
if(isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
    
    // Definir directorio de subida
    $uploadDir = '../../uploads/'; // Ajusta la ruta según tu estructura
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generar nombre único para evitar sobrescribir
    $fileName = uniqid() . '_' . basename($_FILES['archivo']['name']);
    $targetPath = $uploadDir . $fileName;
    $fileType = pathinfo($targetPath, PATHINFO_EXTENSION);

    // Mover el archivo a la carpeta uploads
    if(move_uploaded_file($_FILES['archivo']['tmp_name'], $targetPath)) {
        
        // El archivo se subió bien, ahora preparamos los datos para la Clase Create
        // Recogemos los datos del $_POST (ya no es php://input)
        $data = array(
            'nombre' => $_POST['nombre'],
            'autor' => $_POST['autor'],
            'departamento' => $_POST['departamento'],
            'empresa' => $_POST['empresa'],
            'fecha' => $_POST['fecha'],
            'descripcion' => $_POST['descripcion'],
            'ruta_archivo' => $fileName, // Guardamos solo el nombre del archivo
            'tipo_archivo' => $fileType
        );

        // Convertimos a JSON para mantener tu arquitectura original
        $jsonString = json_encode($data);
        
        // Llamamos a tu clase original
        $create->add($jsonString);
        
        // Obtenemos la respuesta de la clase
        echo $create->getData();
        exit;
    }
}

echo json_encode($response);
?>