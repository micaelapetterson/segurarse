<script setup>
//import { computed, watch, ref } from 'vue';
</script>

<script>
import authService from "./../services/auth.service";

import Vuetify from 'vuetify';

export default {
  name: 'App',

  vuetify: new Vuetify(),
  data () {
    return {
      currentRoute: null,
      drawer: true,
      items: [
        { title: 'Empleados', icon: 'mdi-account', link:'/admin/home' },
        { title: 'Salarios', icon: 'mdi-cash', link:'/admin/salarios' },
        //{ title: 'login', icon: 'mdi-account-group-outline', link:'/' },
        { title: 'logout', icon: 'mdi-logout', action: "onSalir" },
      ],
      mini: true,
    }
  },
  

  methods: {

    handleItemClick(item) {
      if (item.action && typeof this[item.action] === 'function') {
        this[item.action]();
      } else if (item.link !== this.$route.fullPath) {
        this.$router.push(item.link);
      }
    },

    onSalir: async function () {
        try {
            await authService.salir();
            localStorage.removeItem("access_token");
            //router.push('/admin/home');
            this.$router.push({ path: '/' });
        } catch (error) {
            alert("Ocurrio un problema al salir")
        }
    },
  }
  
};
</script>


<template>

  <v-app>
    <v-card>

      <v-container fluid class="align-start px-0 d-flex flex-row">

        <v-navigation-drawer
          v-model="drawer"
          :mini-variant.sync="mini"
          permanent
        >
          <v-list-item class="px-2">
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-list-item-title>
              Bienvenido
            </v-list-item-title>
          </v-list-item>
    
          <v-divider></v-divider>
    
          <v-list dense>
            <v-list-item
              v-for="item in items"
              :key="item.title"
              @click="handleItemClick(item)"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
    
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          
        </v-navigation-drawer>
        <v-card flat class="grow"> 
              <router-view></router-view>
        </v-card>

      </v-container>
    </v-card>         
  </v-app>

</template>

<style lang="scss" scoped></style>
