<?php
namespace TECWEB\MYAPI\Core;

abstract class DataBase {
    protected $conexion;

    // El constructor recibe los datos que le mandas desde Delete, Create, etc.
    public function __construct($user, $pass, $db) {
        $this->conexion = @mysqli_connect(
            'localhost',
            $user, // Recibe 'root'
            $pass, // Recibe ''
            $db    // Recibe 'Proyec'
        );

        if(!$this->conexion) {
            die('¡Base de datos NO conectada! Error: ' . mysqli_connect_error());
        }
        
        $this->conexion->set_charset("utf8"); 
    }

    public function __destruct() {
        if ($this->conexion) {
            $this->conexion->close();
        }
    }
}
?>