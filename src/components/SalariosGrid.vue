<template>
  <section>
      
      <div id="app" style="background-color: #f1f5f9" >
          <div data-app style="left: 14px;">

            <v-card style="margin-left: 14px; max-width: 98%; margin-bottom: 20px;">

              <v-row align="center" justify="center" style="font-size: x-small; padding-left: 5px;" >
                <v-col>
                  <div style="text-align: left">Puesto</div>
                  <v-select
                  v-model="selectedPuesto"
                  :items="puestos"
                  label="Puestos"
                  dense
                  class="select mr-3"
                  >
                  </v-select>
                </v-col>
                <v-col>
                  <div style="text-align: left">Rangos</div>
                  <v-select
                  v-model="selectedRango"
                  :items="rangos"
                  label="Rangos"
                  dense
                  >
                  </v-select>
                </v-col>
                <v-col>
                  <div style="text-align: left">Antigüedad</div>
                  <v-text-field
                  v-model="selectedAntiguedad"
                  label="Antiguedad"
                  dense
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-btn color="primary" @click="searchEmpleados"><span style="font-size:0.5rem;">Buscar</span></v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="clearFilters"><span style="font-size:0.5rem;">Quitar Filtros</span></v-btn>
                </v-col>
                <v-dialog v-model="dialogIncrementar" max-width="600">
                  <v-card>
                    <v-card-title>Incrementar Sueldos</v-card-title>
                    <v-card-text>
                      <v-text-field v-model="inputPorcentaje" label="Ingrese porcentaje"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn @click="cancelar">Cancelar</v-btn>
                      <v-btn @click="incrementarSalarios" color="primary">OK</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-col>
                  <v-btn @click="btnIncrementarSalarios"><span style="font-size:0.5rem;">Incrementar Sueldos</span></v-btn>
                </v-col>
              </v-row>

            </v-card>

            <v-app style="left: 14px;">

              <v-card>
                <v-data-table 
                  :headers="headers"
                  :items="empleados"
                  item-key="id"
                  id="idTabla"
                  ref="tabla"
                  dense
                  :items-per-page="itemsPerPage"
                  :length="total_pages"
                  :search="search"
                  @pagination="handlePaginationUpdate"
                  @update:items-per-page="updateItemsPerPage"
                  :options.sync="options"
                  :server-items-length="totalEmpleados"
                > 
                  <template v-slot:[`item.id`]="{ value }">
                    <div class="text-truncate pa-0" style="font-size: x-small!important; padding: 0px">
                      {{ value }}
                    </div>
                  </template>
                  <template v-slot:[`item.nombre`]="{ value }">
                    <div class="text-truncate" style="padding-left: 0px; padding: 0px; font-size: x-small;">
                      {{ value }}
                    </div>
                  </template>
                  <template v-slot:[`item.apellido`]="{ value }">
                    <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                      {{ value }}
                    </div>
                  </template>
                  <template v-slot:[`item.antiguedad`]="{ value }">
                    <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                      {{ value }}
                    </div>
                  </template>
                  <template v-slot:[`item.puesto.descripcion`]="{ value }">
                    <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                      {{ value }}
                    </div>
                  </template>
                  <template v-slot:[`item.empleado_salario_salario`]="{ item }">
                    <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                    <div v-for="(salario, index) in item.empleado_salario_salario" :key="index">
                        {{ salario.salarioHistorico }} 
                      </div>
                    </div>
                  </template>
                  <template v-slot:[`item.empleado_salario_fecha`]="{ item }">
                    <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                    <div v-for="(salario, index) in item.empleado_salario_fecha" :key="index">
                        {{ salario.fechaSalario }} 
                      </div>
                    </div>
                  </template>
                  <template v-slot:[`item.empleado_salario_tipo`]="{ item }">
                    <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                    <div v-for="(salario, index) in item.empleado_salario_tipo" :key="index">
                        {{ salario.tipo }} 
                      </div>
                    </div>
                  </template>
                  <template v-slot:no-data>
                    No hay datos
                  </template>
                </v-data-table>
              </v-card>

            </v-app>

          </div>  
      </div>

  </section>
</template>



<script>
  //import Vue from 'vue';
  import SalarioService from "../services/salario.service";
  import PuestoService from "../services/puesto.service";
  //import moment from 'moment';

  export default {

    data: () => ({
        dialogLoading: false,
        headers: [
            {
                text: 'Id',
                value: 'id',
                filterable: false, 
                sortable: false, 
                class: "hidden", 
                cellClass: "hidden",
                align: ' d-none'
            },
            { text: 'Nombre', value: 'nombre', filterable: true, width: '10%', class: 'my-header-style' },
            { text: 'Apellido', value: 'apellido', filterable: true, width: '10%', class: 'my-header-style' },
            { text: 'Antiguedad', value: 'antiguedad', filterable: true, width: '15%', class: 'my-header-style' },
            { text: 'Puesto', value: 'puesto.descripcion', filterable: true, width: '10%', class: 'my-header-style', slot: 'estado' },
            { text: 'Salario Hist.', value: 'empleado_salario_salario', sortable: false, width: '10%', class: 'my-header-style' },
            { text: 'Fecha Cambio', value: 'empleado_salario_fecha', sortable: false, width: '10%', class: 'my-header-style' },
            { text: 'Tipo', value: 'empleado_salario_tipo', sortable: false, width: '10%', class: 'my-header-style' },

        ],
        empleados: [],
        itemsPerPage: 10,
        totalEmpleados: 0,
        options: {},
        total_pages: 1,
        search: '',
        buscar: '',
        selectedPuesto: '',
        puestos: [],
        selectedRango: '',
        rangos: [
          { value: '>', text: 'Mayor que' },
          { value: '<', text: 'Menor que' },
          { value: '=', text: 'Igual' },
        ],
        selectedAntiguedad: '',
        page: '',

        dialogIncrementar: false,
        inputPorcentaje: ""        
    }),


    methods: {

      getEmpleados: async function () {

        const { data } = await SalarioService.listar(this.page, this.itemsPerPage, this.selectedPuesto, this.selectedRango, this.selectedAntiguedad);

        this.empleados = data.data.map(empleado => {
          return {
            ...empleado,
            empleado_salario_salario: empleado.registro_salarios.map(salario => salario),
            empleado_salario_fecha: empleado.registro_salarios.map(salario => salario),
            empleado_salario_tipo: empleado.registro_salarios.map(salario => salario),
          };
        });

        this.totalEmpleados = data.total
      },


      incrementarSalarios: async function () {
        
        try{
          const datos = {
            empleados: this.empleados,
            porcentaje: this.inputPorcentaje
          };

          await SalarioService.incrementar(datos);
          this.$toast.success("Sueldos incrementados");
        } catch (error) {         
          this.$toast.error(error.response.data.message);
        }

        this.inputPorcentaje = '';
        this.dialogIncrementar = false;
        this.getEmpleados();

      },


      getPuestos: async function () {
        const { data } = await PuestoService.listar();
        this.puestos = data.map(puesto => ({ value: puesto.id, text: puesto.descripcion }));
      },

      searchEmpleados(){
        this.getEmpleados();
      },

      clearFilters(){
        this.selectedPuesto = ''; 
        this.selectedRango = ''; 
        this.selectedAntiguedad = '';
      },
      
      btnIncrementarSalarios(){
        this.dialogIncrementar = true;
      },

      cancelar(){
        this.inputPorcentaje = '';
        this.dialogIncrementar = false;
      },
      
      handlePaginationUpdate(pagination) {
        this.page = pagination.page;
        this.total_pages = pagination.total_pages;
        this.getEmpleados();
      },

      updateItemsPerPage(itemsPerPage) {
            this.itemsPerPage = itemsPerPage;
            this.getEmpleados();
      },

    },


    watch: {
      options: {
        handler () {
          this.getEmpleados()
        },
        deep: true,
      },
    },
    
    mounted: async function() {
      console.log("ENTRA EN MOUNTED");
      this.getEmpleados();
      this.getPuestos();
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

.chip-active {
  color: #fff;
  background-color: #bef5f1;
}

.chip-inactive {
  color: #fff;
  background-color: #fedfe5;
}

</style>