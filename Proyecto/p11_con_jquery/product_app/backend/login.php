<?php
namespace TECWEB\MYAPI\Auth;
require_once __DIR__ . '/vendor/autoload.php';

$conexion = mysqli_connect('localhost', 'root', '', 'Proyec');

$response = ['status' => 'error', 'message' => 'Credenciales incorrectas'];

if(isset($_POST['user']) && isset($_POST['pass'])) {
    $user = $_POST['user'];
    $pass = $_POST['pass'];

    $sql = "SELECT * FROM usuarios WHERE usuario = '$user' AND password = '$pass'";
    $result = mysqli_query($conexion, $sql);

    if($result && mysqli_num_rows($result) > 0) {
        $response['status'] = 'success';
        session_start();
        $_SESSION['usuario'] = $user;
    }
}

echo json_encode($response);
?>