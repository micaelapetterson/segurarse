import { http } from "./Http"

export default {
    listar(page=1, limit, puesto, rango, antiguedad){

        if(rango == '>'){
            rango = '%3E';
        }else if(rango == '<'){
            rango = '%3C';
        }else{
            rango = '='
        }
        return http().get(`/getEmpleados?page=${page}&limit=${limit}&puesto=${puesto}&signo=${rango}&antiguedad=${antiguedad}`);
    },
    incrementar(datos){
        return http().post("/incrementarSalarios", datos);
    },
}

