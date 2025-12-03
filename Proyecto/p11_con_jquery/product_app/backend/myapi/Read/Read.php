<?php
namespace TECWEB\MYAPI\Read; 

use TECWEB\MYAPI\Core\DataBase; 

class Read extends DataBase {
 
    private $response = array();

    public function __construct($db, $user='root', $pass='') {
        parent::__construct($user, $pass, $db);
    }
    
    // LISTAR TODO
    public function list() {
        $this->response = array();
        // SQL corregido para tabla recursos
        if ($result = $this->conexion->query("SELECT * FROM recursos WHERE eliminado = 0")) {
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            if(!is_null($rows)){
                $this->response = $rows;
            }
            $result->free();
        } else {
            $this->response = array('status' => 'error', 'message' => 'Query Error: ' . mysqli_error($this->conexion));
        }
    }

    // BUSCAR (Aquí estaba el fallo principal)
    public function search($search) {
        $this->response = array();
        
        // CORRECCIÓN: Buscamos en 'recursos' y en sus campos reales (nombre, autor, descripcion)
        $sql = "SELECT * FROM recursos 
                WHERE (id LIKE '%{$search}%' 
                    OR nombre LIKE '%{$search}%' 
                    OR autor LIKE '%{$search}%' 
                    OR descripcion LIKE '%{$search}%') 
                AND eliminado = 0";
        
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
    
    // Función para obtener un solo recurso (usada en Editar)
    public function single($id) {
        $this->response = array();
        $sql = "SELECT * FROM recursos WHERE id = {$id}";
        
        if ($result = $this->conexion->query($sql)) {
            $row = $result->fetch_assoc();
            if(!is_null($row)){
                foreach($row as $key => $value) {
                    $this->response[$key] = utf8_encode($value);
                }
            }
            $result->free();
        } else {
            $this->response = array('status' => 'error', 'message' => 'Query Error: ' . mysqli_error($this->conexion));
        }
    }

    // (Opcional) singleByName si la usas en otro lado
    public function singleByName($name) {
        $this->response = array(); 
        $stmt = $this->conexion->prepare("SELECT * FROM recursos WHERE nombre = ? AND eliminado = 0");
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