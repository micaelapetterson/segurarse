<template>
  <section>
      
    <div id="app" style="background-color: #f1f5f9" >
      <div data-app style="left: 14px;">
              
        <div style="margin-left: 15px; left: 14px; text-align: left;">
          <v-row>
            <v-col class="text-right" style="margin-right: 20px;  margin-bottom: 20px;">
              <v-btn color="primary" @click="newEmpleado"><span style="font-size:0.5rem;">Nuevo Empleado</span></v-btn>
            </v-col>
          </v-row>
        </div>
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
              @pagination="handlePaginationUpdate"
              @update:items-per-page="updateItemsPerPage"
              :options.sync="options"
              :server-items-length="totalEmpleados"
            >
              <template v-slot:[`item.action1`]="{ item }">
                <div style="max-width: 10%; padding: 0px">
                  <v-btn icon x-small>
                    <v-icon @click="editEmpleado(item)">mdi-pencil</v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-slot:[`item.action2`]="{ item }">
                <div style="max-width: 10%; padding: 0px">
                  <v-btn icon x-small>
                    <v-icon @click="deleteEmpleado(item)">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-slot:[`item.id`]="{ value }">
                <div class="text-truncate pa-0" style="font-size: x-small!important; padding: 0px">
                  {{ value }}
                </div>
              </template>
              <template v-slot:[`item.nombre`]="{ value }">
                <div class="text-truncate" style="padding: 0px; font-size: x-small;">
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
              <template v-slot:[`item.salario`]="{ value }">
                <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                  {{ value }}
                </div>
              </template>
              <template v-slot:[`item.puesto.descripcion`]="{ value }">
                <div class="text-truncate" style="padding: 0px; font-size: x-small;">
                  {{ value }}
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
  import EmpleadoService from "../services/empleado.service";
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
            { text: 'Antiguedad', value: 'antiguedad', filterable: true, width: '10%', class: 'my-header-style' },
            { text: 'Salario', value: 'salario', filterable: true, width: '10%', class: 'my-header-style' },
            { text: 'Puesto', value: 'puesto.descripcion', filterable: true, width: '15%', class: 'my-header-style' },
            
            { text: 'Edit', value: 'action1', filterable: false, width: '20px', class: 'my-header-style' },
            { text: 'Del', value: 'action2', filterable: false, width: '20px', class: 'my-header-style' },
        ],
        empleados: [],
        itemsPerPage: 10,
        totalEmpleados: 0,
        options: {},
        total_pages: 1,
        page: '', 
    }),

    methods: {

      getEmpleados: async function () {
        const { data } = await EmpleadoService.listar(this.page, this.itemsPerPage);
        this.empleados = data.data;
        this.totalEmpleados = data.total
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

      editEmpleado(item) {
          localStorage['idEmpleado'] = JSON.stringify({ idEmpleado: item.id })
          this.$router.push({ name: 'EmpleadoEditView', params: { mode: "edit", id: item } });
      },

      nuevoEmpleado() {
          this.$router.push({ name: 'EmpleadoEditView', params: { mode: "new" } });
      },

      deleteEmpleado: async function (item) {
        if (confirm("¿Está seguro de eliminar el empleado?")) {
          try{
            await EmpleadoService.eliminar(item.id);
            this.$toast.success("Empleado eliminado");
            window.location.reload();
          } catch (error) {
            this.$toast.error("Error al eliminar");
          }
        }
      },

      newEmpleado() {
          this.$router.push({ name: 'EmpleadoEditView', params: { mode: "new" } });
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
      this.getEmpleados();
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