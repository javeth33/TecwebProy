<?php
namespace TECWEB\MYAPI\Update; 

use TECWEB\MYAPI\Core\DataBase; 

class Update extends DataBase { 
 
    private $response = array();

    public function __construct($db, $user='root', $pass='') {
        parent::__construct($user, $pass, $db);
    }
    
    public function edit($jsonString) {
        $data = [
            'status'  => 'error',
            'message' => 'Error al intentar actualizar el recurso'
        ];
        
        if(!empty($jsonString)) {
            $jsonOBJ = json_decode($jsonString);
            $id = $jsonOBJ->id;
            
            // LÓGICA INTELIGENTE:
            // Verificamos si en el JSON viene una ruta de archivo nueva.
            
            if (!empty($jsonOBJ->ruta_archivo)) {
                // CASO A: El usuario subió un archivo nuevo -> Actualizamos TODO (incluyendo ruta y tipo)
                $sql = "UPDATE recursos SET 
                            nombre = '{$jsonOBJ->nombre}', 
                            autor = '{$jsonOBJ->autor}', 
                            departamento = '{$jsonOBJ->departamento}', 
                            empresa = '{$jsonOBJ->empresa}', 
                            fecha_creacion = '{$jsonOBJ->fecha}', 
                            descripcion = '{$jsonOBJ->descripcion}', 
                            ruta_archivo = '{$jsonOBJ->ruta_archivo}',
                            tipo_archivo = '{$jsonOBJ->tipo_archivo}'
                        WHERE id = {$id}";
            } else {
                // CASO B: El usuario NO subió archivo -> Actualizamos SOLO EL TEXTO (respetamos el archivo viejo)
                $sql = "UPDATE recursos SET 
                            nombre = '{$jsonOBJ->nombre}', 
                            autor = '{$jsonOBJ->autor}', 
                            departamento = '{$jsonOBJ->departamento}', 
                            empresa = '{$jsonOBJ->empresa}', 
                            fecha_creacion = '{$jsonOBJ->fecha}', 
                            descripcion = '{$jsonOBJ->descripcion}'
                        WHERE id = {$id}";
            }
            
            if($this->conexion->query($sql)){
                $data['status'] =  "success";
                $data['message'] =  "Recurso actualizado correctamente";
            } else {
                $data['message'] = "ERROR: No se ejecutó $sql. " . mysqli_error($this->conexion);
            }
        }
        $this->response = $data;
    }
    
    public function getData() {
        return json_encode($this->response, JSON_PRETTY_PRINT);
    }
}