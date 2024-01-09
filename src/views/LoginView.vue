<template>
    <div>
      <v-container>
        <v-card justify="center">
          <v-card-text>
            <img src="https://logodownload.org/wp-content/uploads/2014/09/google-logo-1.png" alt="Image" height="50" class="mb-3" />
            <div>Bienvenido</div>
            <span>Ingresar para continuar</span>
  
            <v-text-field type="text" id="email1" placeholder="Email address" v-model="usuario.email"></v-text-field>
            <span>{{ errors.email }}</span>
  
            <v-text-field type="password" id="password1" v-model="usuario.password" placeholder="Password"></v-text-field>
            <span>{{ errors.password }}</span>
  
            <v-spacer></v-spacer>
  
            <v-btn v-on:click="funIngresar">Ingresar</v-btn>
  
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import authService from "./../services/auth.service";
  
  </script>
  
  <script>

  const usuario = ref({ email: "admin@example.com", password: "password" });
  const errors = ref({});

  export default {
    methods: {
      async funIngresar() {
        try {
          const { data } = await authService.loginConLaravel(usuario.value);

          errors.value = {};
  
          localStorage.setItem("access_token", data.access_token);
  
          this.$router.push({
            path: '/admin/home'
          });
        } catch (error) {
          errors.value = error.response.data.errors || { general: "Error de inicio de sesión" };
          console.error("Error en la función funIngresar:", error);
        }
      },
    },
  };
  </script>