<?php
use TECWEB\MYAPI\Create\Create;

require_once __DIR__ . '/vendor/autoload.php';

ini_set('display_errors', 0);
error_reporting(E_ALL);


$response = array(
    'status'  => 'error',
    'message' => 'Error desconocido inicial'
);

try {
    
    $create = new Create('Proyec', 'root', ''); 
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión BD: ' . $e->getMessage()]);
    exit;
}

if(isset($_FILES['archivo'])) {
    
    if ($_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
        $phpFileUploadErrors = [
            0 => 'There is no error, the file uploaded with success',
            1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
            2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
            3 => 'The uploaded file was only partially uploaded',
            4 => 'No file was uploaded',
            6 => 'Missing a temporary folder',
            7 => 'Failed to write file to disk.',
            8 => 'A PHP extension stopped the file upload.',
        ];
        $errorCode = $_FILES['archivo']['error'];
        $response['message'] = "Error PHP al subir: " . ($phpFileUploadErrors[$errorCode] ?? "Código $errorCode");
    } else {
        
        $uploadDir = '../uploads/'; 
        
        if (!is_dir($uploadDir)) {
            if(!mkdir($uploadDir, 0777, true)){
                echo json_encode(['status' => 'error', 'message' => 'No se pudo crear la carpeta uploads. Créala manualmente en la raíz.']);
                exit;
            }
        }

        $fileName = uniqid() . '_' . basename($_FILES['archivo']['name']);
        $targetPath = $uploadDir . $fileName;
        $fileType = pathinfo($targetPath, PATHINFO_EXTENSION);

        if(move_uploaded_file($_FILES['archivo']['tmp_name'], $targetPath)) {
            
            $data = array(
                'nombre' => $_POST['nombre'] ?? 'Sin nombre',
                'autor' => $_POST['autor'] ?? 'Anonimo',
                'departamento' => $_POST['departamento'] ?? '',
                'empresa' => $_POST['empresa'] ?? '',
                'fecha' => $_POST['fecha'] ?? date('Y-m-d'),
                'descripcion' => $_POST['descripcion'] ?? '',
                'ruta_archivo' => $fileName, 
                'tipo_archivo' => $fileType
            );

            $jsonString = json_encode($data);
            $create->add($jsonString);
            
            echo $create->getData();
            exit;
            
        } else {
            $response['message'] = "Falló move_uploaded_file. Verifica permisos en la carpeta uploads.";
        }
    }
} else {
    $response['message'] = "No se recibió ningún archivo (FILES['archivo'] está vacío). Revisa el enctype del form.";
}

echo json_encode($response);
?>