<?php
namespace TECWEB\MYAPI\Create; 

use TECWEB\MYAPI\Core\DataBase; 

class Create extends DataBase { 
 
    private $response = array();

    public function __construct($db, $user='root', $pass='') {
        parent::__construct($user, $pass, $db);
    }
    
    public function add($jsonString) {
        $data = [ 
            'status'  => 'error',
            'message' => 'Error al intentar agregar el recurso'
        ];
        
        if(!empty($jsonString)) {
            $jsonOBJ = json_decode($jsonString);
            
            // Insertamos en la tabla RECURSOS
            $sql = "INSERT INTO recursos (nombre, autor, departamento, empresa, fecha_creacion, descripcion, ruta_archivo, tipo_archivo, eliminado) 
                    VALUES (
                        '{$jsonOBJ->nombre}', 
                        '{$jsonOBJ->autor}', 
                        '{$jsonOBJ->departamento}', 
                        '{$jsonOBJ->empresa}', 
                        '{$jsonOBJ->fecha}', 
                        '{$jsonOBJ->descripcion}', 
                        '{$jsonOBJ->ruta_archivo}', 
                        '{$jsonOBJ->tipo_archivo}', 
                        0
                    )";
            
            if($this->conexion->query($sql)){
                $data['status'] =  "success";
                $data['message'] =  "Recurso agregado correctamente";
            } else {
                $data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
            }
        }
        $this->response = $data;
    }
    
    public function getData() {
        return json_encode($this->response, JSON_PRETTY_PRINT);
    }
}