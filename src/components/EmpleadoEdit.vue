<template>
  <section>
    
    <div id="app" style="background-color: #f1f5f9" >
      <div data-app style="left: 14px;">
        <v-card style="margin-left: 14px; max-width: 98%; margin-bottom: 20px;">

          <v-row align="center" justify="center" style="font-size: x-small; padding-left: 5px;" >
            <v-col>
              <div style="text-align: left">Nombre</div>                  
              <v-text-field v-model="empleado.nombre" dense></v-text-field>
            </v-col>
            <v-col>
              <div style="text-align: left">Apellido</div>                  
              <v-text-field v-model="empleado.apellido" dense></v-text-field>
            </v-col>
            <v-col>
              <div style="text-align: left">Antiguedad</div>                  
              <v-text-field v-model="empleado.antiguedad" dense></v-text-field>
            </v-col>
            <v-col>
              <div style="text-align: left">Salario</div>                  
              <v-text-field v-model="empleado.salario" dense></v-text-field>
            </v-col>
            <v-col>
              <div style="text-align: left; margin-bottom: 10px;">Puestos</div>
              <v-select
              v-model="empleado.puesto_id"
              :items="puestos"
              label="Puesto"
              dense
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="primary" @click="saveEmpleado"><span style="font-size:0.5rem;">Guardar Descuento</span></v-btn>
            </v-col>
          </v-row>

        </v-card>
      </div>  
    </div>  

  </section>
</template>


<script>
  import EmpleadoService from "../services/empleado.service";
  import PuestoService from "../services/puesto.service";
  //import moment from 'moment';

  export default {
    data: () => ({
        dialogLoading: false,
        empleados: [],
        itemsPerPage: 10,
        totalEmpleados: 0,
        options: {},
        total_pages: 1,
        selectedPuesto: '',
        puestos: [],
        page: '',
        empleado: {
          id: null,
          nombre: '',
          apellido:'',
          antiguedad:'',
          salario:''         
        },
    }),

    methods: {
      loadEmpleado: async function () {
        if (this.$route.params.mode === 'edit') {
          try {
            //let idEmpleado = localStorage.getItem("idEmpleado")
            const { data } = await EmpleadoService.mostrar(this.$route.params.id.id);
            this.empleado = data;

          } catch (error) {
            console.error("Ocurrió un error al obtener el empleado:", error);
          }
        }
      },

      saveEmpleado: async function () {
        try {
          if (this.$route.params.mode === 'edit') {
            await EmpleadoService.modificar(this.empleado, this.empleado.id);
            this.$toast.success("Empleado actualizado exitosamente");
            this.$router.push('/admin/home');
          } else {
            await EmpleadoService.guardar(this.empleado);
            this.$toast.success("Empleado registrado exitosamente");
            this.$router.push('/admin/home');
          }
        } catch (error) {
          this.$toast.error("Error al registrar el empleado: " + error.response.data.message);
        }
      },

      getPuestos: async function () {
        const { data } = await PuestoService.listar();
        this.puestos = data.map(puesto => ({ value: puesto.id, text: puesto.descripcion }));
      },

      handlePaginationUpdate(pagination) {
        this.getEmpleados();
        this.page = pagination.page;
        this.total_pages = pagination.total_pages;
      },

      updateItemsPerPage(itemsPerPage) {
            this.itemsPerPage = itemsPerPage;
            this.getEmpleados();
      },

      editEmpleado(item) {
          this.$router.push({ name: 'EmpleadoEdit', params: { id: item } });
      },      
    },

    mounted: async function() {
      this.getPuestos();
      this.loadEmpleado();
    },

  }
</script>


<style>

.v-application--wrap {
    max-width: 98%;
}

.my-header-style {
  color: #6f8fb9 !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
  font-size: 0.6rem !important;
}

.v-input {
  font-size: 0.5rem !important;
}

.v-list-item {
  font-size: 0.5rem !important;
}

label {
  font-size: 0.5rem !important;
}

/* .v-list-item{
  font-size: 0.5rem !important;
} */

.v-list-item__title{
  font-size: 0.5rem !important;
}


.v-data-footer__select {
    font-size: 0.5rem;
}

.v-data-footer__select .v-select__selections .v-select__selection--comma {
    font-size: 0.5rem;
}

.v-data-footer__pagination {
    font-size: 0.5rem;
}


.v-application .text-start {
    padding-left: 5px!important;
}

.theme--light.v-application {
    background: #f1f5f9;
}
/*v-label theme--light"*/

</style>