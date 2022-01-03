<template>
    <aside class="page-sidebar">
                <!--  LOGO SOBRE MENU-->
        <div class="page-logo">
            <!-- tracker:0005973 -->
            <!-- <a href="#" class="page-logo-link press-scale-down d-flex align-items-center position-relative" data-toggle="modal" data-target="#modal-shortcut"> -->
                <a href="/">
                    
                <img src="@/assets/img/st-openlabs.png" alt="Fast Check" style="height: 28px;">
                </a>
                <span class="page-logo-text mr-1"></span>
                <span class="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
                <!-- <i class="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i> -->
            <!-- </a> -->
        </div>
        <nav id="js-primary-nav" class="primary-nav js-list-filter" role="navigation">
        <div class="nav-filter">
            <div class="position-relative">
                <input type="text" id="nav_filter_input" placeholder="Filter menu" class="form-control" tabindex="0">
                <a href="#" onclick="return false;" class="btn-primary btn-search-close js-waves-off" data-action="toggle" data-class="list-filter-active" data-target=".page-sidebar">
                    <i class="fal fa-chevron-up"></i>
                </a>
            </div>
        </div>
        <ul id="js-nav-menu" class="nav-menu js-nav-built">


<li class="open" v-on:click="rolesUsuariosMenu=trueFalse(rolesUsuariosMenu)">
    <a href="#" title="Tables" data-filter-tags="roles" class=" waves-effect waves-themed" aria-expanded="true">
        <i class="fal fa-users"></i>
        <span class="nav-link-text" data-i18n="nav.tables">Roles y Usuarios</span>
        <b class="collapse-sign">
            <em class="fal" v-bind:class = "rolesUsuariosMenu?'fa-angle-up':'fa-angle-down'"></em>
        </b>
    </a>
    <ul style="display: block;" v-if="rolesUsuariosMenu">
        <li>
            <a href="/Usuarios" title="Accordions" data-filter-tags="ui components accordions" class=" waves-effect waves-themed">
                <i class="fa fa-user"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Usuarios</span>
            </a>
        </li>
        <li>
            <a href="/Perfiles" title="Accordions" data-filter-tags="ui components accordions" class=" waves-effect waves-themed">
                <i class="fa fa-id-badge"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Perfiles</span>
            </a>
        </li>
    </ul>
</li>


    <!-- Por ahora para poder testear todos pueden acceder a estos mantenedores -->
<li v-on:click="mantenedoresMenu=trueFalse(mantenedoresMenu)">
    <a href="#" title="Tables" data-filter-tags="roles" class=" waves-effect waves-themed">
        <i class="fal fa-cog"></i>
        <span class="nav-link-text" data-i18n="nav.tables">Mantenedores</span>
    <b class="collapse-sign"><em class="fal" v-bind:class = "mantenedoresMenu?'fa-angle-up':'fa-angle-down'"></em></b></a>
    
    <ul style="display: block;" v-if="mantenedoresMenu">
        
        <li>
            <a href="/Tribunal" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-gavel"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordionss">Tribunal</span>
            </a>
        </li>
        
        
        <li>
            <a href="/Clasificacion" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-filter"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordionss">Clasificación</span>
            </a>
        </li>
        
        
        <li>
            <a href="/Calificador" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-tags"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Calificadores</span>
            </a>
        </li>
        
        
        
        <li>
            <a href="/Delimitadores" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-exclamation-circle"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Delimitadores</span>
            </a>
        </li>
        
        
        
        <li>
            <a href="/TipoEjecutoria" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-gavel"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Tipos de Ejecutoria</span>
            </a>
        </li>
        
        
        
        <li>
            <a href="/TipoSentencia" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-gavel"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Tipos de Sentencia</span>
            </a>
        </li>
        
        
        
        <li>
            <a href="/Region" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-globe"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Regiones</span>
            </a>
        </li>
        
        
        <li>
            <a href="/Monto" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-dollar-sign"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Monto UF</span>
            </a>
        </li>
        
        
        <li>
            <a href="/MontoTopeRenta" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-dollar-sign"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Monto Tope Renta</span>
            </a>
        </li>
        
        
        <li>
            <a href="/Empresa" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-globe"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Empresas</span>
            </a>
        </li>
        
        
        
        <li>
            <a href="/Configuracion" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
                <i class="fal fa-globe"></i>
                <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Configuración</span>
            </a>
        </li>
        
    </ul>
    
</li>


<li>
    <a href="/Documentos" title="Tables" data-filter-tags="configuración" class=" waves-effect waves-themed">
        <i class="fa fa-file-alt"></i>
        <span class="nav-link-text" data-i18n="nav.ui_components_accordions">Documentos Ingresados</span>
    </a>
</li>



<li>
    <a href="/CasoDemandante" title="Accordions" data-filter-tags="ui components accordions" class=" waves-effect waves-themed">
        <i class="fa fa-id-badge"></i>
        <span class="nav-link-text" data-i18n="nav.tables">Casos Demandantes</span>
    </a>
</li>
<li>
    <a href="/Demandante/ArchivoCarga1" title="Accordions" data-filter-tags="ui components accordions" class=" waves-effect waves-themed">
        <i class="fa fa-id-badge"></i>
        <span class="nav-link-text" data-i18n="nav.tables">Descargar Ficha</span>
    </a>
</li>
<li>
    <a href="/CargaMasiva" title="Accordions" data-filter-tags="ui components accordions" class=" waves-effect waves-themed">
        <i class="fa fa-upload"></i>
        <span class="nav-link-text" data-i18n="nav.tables">Carga Masiva</span>
    </a>
</li>


</ul>
<div class="filter-message js-filter-message bg-success-600"></div>
</nav>
</aside>
</template>

<script>
export default {
  name: 'Nav',
    data() {
    return {
        menuOpen: true,
        rolesUsuariosMenu:false,
        mantenedoresMenu:false,
    };
  },
  methods: {
      trueFalse(val) 
      {
          console.log(val)
            if(val)
                return false
            else
                return true
    },
  }
}
</script>