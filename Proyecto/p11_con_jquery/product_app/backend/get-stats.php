<?php
namespace TECWEB\MYAPI\Stats;
require_once __DIR__ . '/vendor/autoload.php';

$conexion = mysqli_connect('localhost', 'root', '', 'Proyec');

$response = [
    'tipos' => [],
    'dias'  => [],
    'horas' => []
];

// 1. Gráfica por Tipo de Archivo
$sql_tipo = "SELECT tipo_archivo as etiqueta, COUNT(*) as cantidad FROM bitacora GROUP BY tipo_archivo";
$res_tipo = mysqli_query($conexion, $sql_tipo);
while($row = mysqli_fetch_assoc($res_tipo)) {
    $response['tipos'][] = $row;
}

// 2. Gráfica por Día de la Semana
// %w devuelve 0 (Domingo) a 6 (Sábado)
$sql_dia = "SELECT DATE_FORMAT(fecha, '%w') as dia_num, COUNT(*) as cantidad FROM bitacora GROUP BY dia_num ORDER BY dia_num";
$res_dia = mysqli_query($conexion, $sql_dia);
$dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Inicializamos en 0
$data_dias = array_fill(0, 7, 0);

while($row = mysqli_fetch_assoc($res_dia)) {
    $index = intval($row['dia_num']);
    $data_dias[$index] = intval($row['cantidad']);
}
$response['dias'] = [
    'etiquetas' => $dias_semana,
    'datos' => $data_dias
];

// 3. Gráfica por Hora del Día
$sql_hora = "SELECT HOUR(fecha) as hora, COUNT(*) as cantidad FROM bitacora GROUP BY hora ORDER BY hora";
$res_hora = mysqli_query($conexion, $sql_hora);

$horas_labels = [];
$horas_data = [];

while($row = mysqli_fetch_assoc($res_hora)) {
    $horas_labels[] = $row['hora'] . ":00";
    $horas_data[] = $row['cantidad'];
}
$response['horas'] = [
    'etiquetas' => $horas_labels,
    'datos' => $horas_data
];

echo json_encode($response);
?>