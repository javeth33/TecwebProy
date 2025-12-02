<?php
namespace TECWEB\MYAPI\Read; 

use TECWEB\MYAPI\Core\DataBase; 

class Read extends DataBase {
 
    private $response = array();

    public function __construct($db, $user='root', $pass='') {
        parent::__construct($user, $pass, $db);
    }
    
    /**
     * Lógica de product-list.php
     */
    public function list() {
        $this->response = array();
        if ($result = $this->conexion->query("SELECT * FROM productos WHERE eliminado = 0")) {
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            if(!is_null($rows)){
                $this->response = $rows;
            }
            $result->free();
        } else {
            $this->response = array('status' => 'error', 'message' => 'Query Error: ' . mysqli_error($this->conexion));
        }
    }

    /**
     * Lógica de product-search.php
     */
    public function search($search) {
        $this->response = array();
        $sql = "SELECT * FROM productos WHERE (id = '{$search}' OR nombre LIKE '%{$search}%' OR marca LIKE '%{$search}%' OR detalles LIKE '%{$search}%') AND eliminado = 0";
        
        if ($result = $this->conexion->query($sql)) {
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            if(!is_null($rows)) {
                foreach($rows as $num => $row) {
                    foreach($row as $key => $value) {
                        $this->response[$num][$key] = utf8_encode($value);
                    }
                }
            }
            $result->free();
        } else {
            $this->response = array('status' => 'error', 'message' => 'Query Error: ' . mysqli_error($this->conexion));
        }
    }
    
    
    public function singleByName($name) {
        $this->response = array(); 
        $stmt = $this->conexion->prepare("SELECT * FROM productos WHERE nombre = ? AND eliminado = 0");
        $stmt->bind_param("s", $name); 
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $this->response = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        } else {
            $this->response = array('status' => 'error', 'message' => 'Query Error: ' . $stmt->error);
        }
        $stmt->close();
    }
    
   
    public function getData() {
        return json_encode($this->response, JSON_PRETTY_PRINT);
    }
}