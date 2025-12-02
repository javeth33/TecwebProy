<?php
namespace TECWEB\MYAPI\Delete; 

use TECWEB\MYAPI\Core\DataBase;

class Delete extends DataBase { 
 
    private $response = array();

    public function __construct($db, $user='root', $pass='') {
        parent::__construct($user, $pass, $db);
    }
    
    /**
     * Lógica de product-delete.php
     */
    public  function delete($id) {
        $data = [
            'status'  => 'error',
            'message' => 'La consulta falló'
        ];
        if(isset($id)) {
            $sql = "UPDATE productos SET eliminado=1 WHERE id = {$id}";
            if ($this->conexion->query($sql)) {
                $data['status'] =  "success";
                $data['message'] =  "Producto eliminado";
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