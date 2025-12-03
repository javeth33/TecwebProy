<?php
namespace TECWEB\MYAPI\Delete; 

use TECWEB\MYAPI\Core\DataBase; 

class Delete extends DataBase { 
 
    private $response = array();

    public function __construct($db, $user='root', $pass='') {
        parent::__construct($user, $pass, $db);
    }
    
    public function delete($id) {
        $this->response = array(
            'status'  => 'error',
            'message' => 'La consulta falló'
        );
        
        if(!empty($id)) {
            // CORRECCIÓN AQUÍ: Cambiamos 'productos' por 'recursos'
            $sql = "UPDATE recursos SET eliminado = 1 WHERE id = {$id}";
            
            if($this->conexion->query($sql)){
                $this->response['status'] =  "success";
                $this->response['message'] =  "Recurso eliminado correctamente";
            } else {
                $this->response['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
            }
        }
    }
    
    public function getData() {
        return json_encode($this->response, JSON_PRETTY_PRINT);
    }
}