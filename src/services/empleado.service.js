import { http } from "./Http"

export default {
    listar(page=1, limit){
        return http().get(`/getEmpleados?page=${page}&limit=${limit}`);
    },
    guardar(datos){
        return http().post("/empleado", datos);
    },
    mostrar(id){
        return http().get("/empleado/"+id);
    },
    modificar(datos, id){
        return http().put("/empleado/"+id, datos);
    },
    eliminar(id){
         return http().delete("/empleado/"+id);
    }
}