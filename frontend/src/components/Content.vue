<template>
    
    <div class="page-content-wrapper">
                <!-- BEGIN Page Header -->
                
<header class="page-header" role="banner">
        <!-- we need this logo when user switches to nav-function-top -->
        <div class="page-logo">
            <a href="#" class="page-logo-link press-scale-down d-flex align-items-center position-relative" data-toggle="modal" data-target="#modal-shortcut">
                <img src="https://cobranza-afc.s3.amazonaws.com/img/st-openlabs.png?AWSAccessKeyId=AKIARU3Z4PW6K4DHXLFW&amp;Signature=McjcxAdJ3hOBuC3%2B3F7F2NVDt90%3D&amp;Expires=1640191392" alt="Fast Check App" aria-roledescription="logo">
                <span class="page-logo-text mr-1">Fast Check</span>
                <span class="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
                <i class="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i>
            </a>
        </div>
        <!-- DOC: nav menu layout change shortcut -->
        <div class="hidden-md-down dropdown-icon-menu position-relative">
            <a href="#" class="header-btn btn js-waves-off" data-action="toggle" data-class="nav-function-hidden" title="Hide Navigation">
                <i class="ni ni-menu"></i>
            </a>
            <ul>
                <li>
                    <a href="#" class="btn js-waves-off" data-action="toggle" data-class="nav-function-minify" title="Minify Navigation">
                        <i class="ni ni-minify-nav"></i>
                    </a>
                </li>
                <li>
                    <a href="#" class="btn js-waves-off" data-action="toggle" data-class="nav-function-fixed" title="Lock Navigation">
                        <i class="ni ni-lock-nav"></i>
                    </a>
                </li>
            </ul>
        </div>
        <!-- DOC: mobile button appears during mobile width -->
        <div class="hidden-lg-up">
            <a href="#" class="header-btn btn press-scale-down waves-effect waves-themed" data-action="toggle" data-class="mobile-nav-on">
                <i class="ni ni-menu"></i>
            </a>
        </div>
        <!-- <div class="search">
            <form class="app-forms hidden-xs-down" role="search" action="page_search.html" autocomplete="off">
                <input type="text" id="search-field" placeholder="Search for anything" class="form-control" tabindex="1">
                <a href="#" onclick="return false;" class="btn-danger btn-search-close js-waves-off d-none" data-action="toggle" data-class="mobile-search-on">
                    <i class="fal fa-times"></i>
                </a>
            </form>
        </div> -->
        <div class="ml-auto d-flex">
            <!-- activate app search icon (mobile) -->
            <div class="hidden-sm-up">
                <a href="#" class="header-icon" data-action="toggle" data-class="mobile-search-on" data-focus="search-field" title="Search">
                    <i class="fal fa-search"></i>
                </a>
            </div>
           
            <div>
                
                <a href="#" data-toggle="dropdown" title="" class="header-icon d-flex align-items-center justify-content-center ml-2">
                    <img src="@/assets/img/anonimo.png" class="profile-image rounded-circle" alt="">
                    <!-- you can also add username next to the avatar with the codes below:
                            <span class="ml-1 mr-1 text-truncate text-truncate-header hidden-xs-down">Me</span>
                            <i class="ni ni-chevron-down hidden-xs-down"></i> -->
                </a>
                <div class="dropdown-menu dropdown-menu-animated dropdown-lg">
                    <div class="dropdown-header bg-trans-gradient d-flex flex-row py-4 rounded-top">
                        <div class="d-flex flex-row align-items-center mt-1 mb-1 color-white">
                            <span class="mr-2">
                                
                                <img src="@/assets/img/anonimo.png" class="rounded-circle profile-image">
                            </span>
                            <div class="info-card-text">
                                <div class="fs-lg text-truncate text-truncate-lg"> </div>
                                <span class="text-truncate text-truncate-md opacity-80"></span>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-divider m-0"></div>
                    <!-- tracker:0005973 -->
                    <!-- <a href="#" class="dropdown-item" data-action="app-reset">
                        <span data-i18n="drpdwn.reset_layout">Reset Layout</span>
                    </a>
                    <a href="#" class="dropdown-item" data-toggle="modal" data-target=".js-modal-settings">
                        <span data-i18n="drpdwn.settings">Settings</span>
                    </a> -->
                    <div class="dropdown-divider m-0"></div>
       
                    <div class="dropdown-divider m-0"></div>
                    <a class="dropdown-item fw-500 pt-3 pb-3" href="/Acceso/Logout">
                        <span data-i18n="drpdwn.page-logout">Cerrar sesión</span>
                        <span class="float-right fw-n">@</span>
                    </a>
                </div>
            </div>
        </div>
    </header>
                <!-- END Page Header -->
                <!-- BEGIN Page Content -->
                <!-- the #js-page-content id is needed for some plugins to initialize -->
                <main id="js-page-content" role="main" class="page-content">                    
                <router-view/>

                </main>
                <!-- this overlay is activated only when mobile menu is triggered -->
                <div class="page-content-overlay" data-action="toggle" data-class="mobile-nav-on"></div> <!-- END Page Content -->
                <!-- BEGIN Page Footer -->
                <footer class="page-footer" role="contentinfo">
                    <div class="d-flex align-items-center flex-1 text-muted">
                        <span class="hidden-md-down fw-700">Todos los derechos reservados a <a href="http://www.st.cl" class="text-primary fw-500" title="st-computacion.com" target="_blank">ST-Computación</a></span>
                    </div>
                    <div>
                        
                    </div>
                </footer>

                
            </div>
</template>
