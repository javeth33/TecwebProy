<?php
// backend/login.php
namespace TECWEB\MYAPI\Auth;
require_once __DIR__ . '/vendor/autoload.php';

// Usamos conexión directa para rápido, o puedes crear una clase Auth si prefieres
$conexion = mysqli_connect('localhost', 'root', '', 'Proyec');

$response = ['status' => 'error', 'message' => 'Credenciales incorrectas'];

if(isset($_POST['user']) && isset($_POST['pass'])) {
    $user = $_POST['user'];
    $pass = $_POST['pass'];

    // Consulta simple (Nota: Para producción real deberías usar password_hash)
    $sql = "SELECT * FROM usuarios WHERE usuario = '$user' AND password = '$pass'";
    $result = mysqli_query($conexion, $sql);

    if($result && mysqli_num_rows($result) > 0) {
        $response['status'] = 'success';
        // Aquí podríamos iniciar sesión con session_start()
        session_start();
        $_SESSION['usuario'] = $user;
    }
}

echo json_encode($response);
?>