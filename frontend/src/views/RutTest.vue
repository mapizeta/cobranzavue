<template>
<ol class="breadcrumb page-breadcrumb">
                        <li class="breadcrumb-item"><a href="javascript:void(0);"><i class="fal fa-home"></i> Inicio </a></li>
                        <li class="position-absolute pos-top pos-right d-none d-sm-block"><span class="js-get-date">Miercoles 22 de Diciembre de 2021</span></li>
                    </ol>
                    <div class="subheader">
                        <h1 class="subheader-title">
                            <i class="subheader-icon fal fa-"></i>AFC Cobranza<span class="fw-300"></span>
                            <small>
                                Sistema de validación de cobranza
                            </small>
                        </h1>
                        <div class="subheader-block">
                        
                        </div>
                    </div>

                    <div class="alert alert-primary alert-dismissible">
                            <!-- <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">
                                        <i class="fal fa-times"></i>
                                    </span>
                                </button> -->
                        <div class="d-flex flex-start w-100">
                            <div class="mr-2 hidden-md-down">
                                <span class="icon-stack icon-stack-lg">
                                    <i class="base base-6 icon-stack-3x opacity-100 color-primary-500"></i>
                                    <i class="base base-10 icon-stack-2x opacity-100 color-primary-300 fa-flip-vertical"></i>
                                    <i class="fal fa-info icon-stack-1x opacity-100 color-white"></i>
                                </span>
                            </div>
                            <div class="d-flex flex-fill">
                                <div class="flex-fill">
                                    <div id="row">
                                        <span class="h2">Validación de cobranza automatizada</span>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            
                                            <img src="@/assets/img/icono-ia.png" style="width: 200px;">
                                        </div>
                                        <div class="col-sm-9 left">
                                            <ul>
                                                <br>
                                                <li>
                                                    <p class="h3 lead">Automatizar el procesamiento de documentos judiciales para establecer si procede una cobranza ante juicios con sentencia&ZeroWidthSpace;</p>
                                                </li>
                                                <li>
                                                    <p class="h3 lead">Revisión y mantención de documentos&ZeroWidthSpace;</p>
                                                </li>
                                                <li>
                                                    <p class="h3 lead">Analisis de demandas laborales&ZeroWidthSpace;</p>
                                                </li>
                                                <li>
                                                    <p class="h3 lead">Usuarios y perfiles auto-administrables&ZeroWidthSpace;</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <Rut/>
                    <div>
                        <!--
                        <input v-rut v-model="rut">
                        <h1 v-if="rut">Válido</h1>
                        -->
                    </div>

</template>

<script>
//import Vue from "vue";
//import vueRut from "vue-rut"
//import {createApp} from 'vue'

//const app = createApp(vueRut)
//app.mount('#app')
//app.directive('rut')
import Rut from '@/components/Rut.vue'

export default {
  components:{Rut},
    data() {
    return {
      rut: ""
    };
  }

  
}

</script>