<?php
namespace TECWEB\MYAPI\Update; 

use TECWEB\MYAPI\Core\DataBase; 

class Update extends DataBase { 
 
    private $response = array();

    public function __construct($db, $user='root', $pass='') {
        parent::__construct($user, $pass, $db);
    }
    
    /**
     * Lógica de product-edit.php
     */
    public function edit($jsonString) {
        $data = [
            'status'  => 'error',
            'message' => 'La consulta falló'
        ];
        if(!empty($jsonString)) {
            $jsonOBJ = json_decode($jsonString);
            $id = $jsonOBJ->id;
            
            $sql = "UPDATE productos SET 
                        nombre = '{$jsonOBJ->nombre}', 
                        marca = '{$jsonOBJ->marca}', 
                        modelo = '{$jsonOBJ->modelo}', 
                        precio = {$jsonOBJ->precio}, 
                        detalles = '{$jsonOBJ->detalles}', 
                        unidades = {$jsonOBJ->unidades}, 
                        imagen = '{$jsonOBJ->imagen}'
                    WHERE id = {$id}";
            
            if($this->conexion->query($sql)){
                $data['status'] =  "success";
                $data['message'] =  "Producto actualizado";
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