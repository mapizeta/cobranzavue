<template>
                    
<div id="panel-0" class="panel panel0">
    <div> 
        <div style="float: right;">
            <button class="btn btn-panel waves-effect waves-themed bg-transparent fs-xl w-auto h-auto rounded-0" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Pantalla Completa">
                <i class="fal fa-expand"></i>
            </button>        
        </div>
    </div>
    <div class="panel-container show">
        
        <div id="panel-2" class="panel">
            <div class="panel-hdr">
                <i class="fa fa-user pr-3"></i>
                <h2>Mantenedor Usuarios</h2>     
            </div>
            <div class="panel-container show">
                <div class="row table-responsive">
                    <table id="Totals" class="table" style="white-space: pre">
                        <!-- Totales (ToDo) -->
                    </table>
                </div>

                
                <div id="panel-1" class="panel">
                    <div class="panel-hdr">
                        <h2>
                            <i class="fal fa-filter color-primary-500 pr-3"></i>
                            Criterios de búsqueda 
                        </h2>
                        <div class="panel-toolbar">
                            <a data-toggle="collapse" href="#colapsable-1" role="link" aria-expanded="true" aria-controls="colapsable-1">
                            <i class="fal fa-window-minimize"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col">
                        <div class="collapse multi-collapse" id="colapsable-1">
                            <div id="SearchPanel" class="panel-content table-responsive container">
        
                            <div class="row form-group"><div class="col-md-4"><label>Nombre de Usuario</label><input type="text" class="form-control form-control-sm"></div><div class="col-md-4"><label>Nombre</label><input type="text" class="form-control form-control-sm"></div><div class="col-md-4"><label>Apellidos</label><input type="text" class="form-control form-control-sm"></div><div class="col-md-4"><label>Mail</label><input type="text" class="form-control form-control-sm"></div><div class="col-md-4"><label>Fono</label><input type="text" class="form-control form-control-sm"></div><div class="col-md-4"><label>Perfil</label><select multiple="" class="form-control form-control-sm select2-hidden-accessible" data-select2-id="select2-data-1-9fi4" tabindex="-1" aria-hidden="true"><option value="0" data-select2-id="select2-data-3-biey">Basic</option></select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="select2-data-2-3p25" style="width: auto;"><span class="selection"><span class="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="false"><ul class="select2-selection__rendered" id="select2-j8s4-container"></ul><span class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="0" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" autocomplete="off" aria-describedby="select2-j8s4-container" placeholder="" style="width: 0.75em;"></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span></div></div></div>
                            <div class="panel-content py-2 rounded-bottom border-faded border-left-0 border-right-0 border-bottom-0 text-muted">
                                <div class="row form-group">
                                    <div class="col-md-9">
                                        <button onclick="$DT.Search($SearchPanel.Object)" id="Search" class="btn btn-primary waves-effect waves-themed"><span class="fas fa-search"></span> Buscar </button>
                                        <button onclick="$SearchPanel.Clear()" id="Clear" class="btn btn-default waves-effect waves-themed"><span class="fas fa-eraser"></span> Limpiar filtros</button>
                                        <!-- <button OnClick="$DT.Search($Form.Bean)" id="Search" class="btn btn-primary waves-effect waves-themed"><span class="fas fa-search"></span> Buscar </button>
                                        <button OnClick="$Form.Clear()" id="Clear" class="btn btn-default waves-effect waves-themed"><span class="fas fa-eraser"></span> Limpiar filtros</button> -->
                                    </div>
                                    
                                    <div class="col-md-3">
                                            <button onclick="DownloadExcel()" class="btn btn-primary waves-effect waves-themed" type="button">
                                            <i class="fa fa-download"></i> Exportar resultados
                                            </button>
                                            <!-- <a onclick="DescargarListado(2)" class="dropdown-item">CSV</a> -->
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div class="panel-content">
                    <!-- <div class="row form-group">
                        <button id="BtnDelete" onclick="DeleteSelected()" class="btn btn-danger waves-effect waves-themed" disabled=""> Eliminar seleccionados <span class="fa fa-times"></span> </button>
                    </div> -->
                    
                    <div class="row form-group">
                        <div class="col-md-12" id="Notifications">
                            
                        <div class="alert alert-undefined alert-dismissible fade show" role="alert" tabindex="-1" style="display: none;"><text></text><button type="button" class="close" data-hide="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div></div>
                    </div>
                    
                    <!-- 
                        <Div Class="row form-group">
                        <Button Id="BtnDelete" OnClick="DeleteSelected('TblDemandas')" disabled Class="btn btn-primary"> Eliminar seleccionados <Span Class="fa fa-times"></Span> </Button>
                        </Div>
                    -->
                    
                    <div class="row">
                        <div class="table-responsive" id="Container"><div id="DataTables_Table_0_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer"><div class="row"><div class="col-sm-12 col-md-6"><div class="dataTables_length" id="DataTables_Table_0_length"><label>Mostrar <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" class="custom-select custom-select-sm form-control form-control-sm"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> Registros</label></div></div><div class="col-sm-12 col-md-6"></div></div><div class="row"><div class="col-sm-12"><table id="DataTables_Table_0" class="dataTable no-footer table table-striped table-sm" role="grid" aria-describedby="DataTables_Table_0_info" style="width: 985px;"><thead class="bg-primary-500"><tr role="row"><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 26.4px;" aria-label=""><input type="Checkbox" onclick="Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[1].__Input_Checkbox_Header__(this, 'Col1')"></th><th class="sorting_asc" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" style="width: 201.2px;" aria-sort="ascending" aria-label="Nombre de Usuario: activate to sort column descending">Nombre de Usuario</th><th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" style="width: 96.2px;" aria-label="Nombre: activate to sort column ascending">Nombre</th><th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" style="width: 108.2px;" aria-label="Apellidos: activate to sort column ascending">Apellidos</th><th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" style="width: 92.2px;" aria-label="Mail: activate to sort column ascending">Mail</th><th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" style="width: 92.2px;" aria-label="Fono: activate to sort column ascending">Fono</th><th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" style="width: 71.2px;" aria-label="Perfil: activate to sort column ascending">Perfil</th><th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" style="width: 44.2px;" aria-label=": activate to sort column ascending"></th></tr></thead><tbody><tr role="row" class="odd"><td><input type="Checkbox" onchange="$DemandaCol1Changed({ Sender: this, ColumnData: Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[1].__CheckboxClosures__[&quot;Col1&quot;] })" onclick="Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[1].__Input_Checkbox__Stack__({ Sender: this, ColName: 'Col1' })"></td><td class="sorting_1"><text style="cursor: pointer;" onclick="Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[1].__Inline_Input_Text__({ Sender: this, Event: event, Name: &quot;username&quot; })">Admin</text></td><td>(Completar)</td><td>(Completar)</td><td>(Completar)</td><td>(Completar)</td><td><text style="cursor: pointer;" onclick="Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[1].__Inline_Input_Select__({ Sender: this, Event: event, Name: &quot;profile_code&quot; })">Basic</text></td><td><button onclick="ModalNewPass(this)" class="btn btn-primary btn-xs"><span class="fa fa-key"></span></button></td></tr></tbody></table></div></div><div class="row"><div class="col-sm-12 col-md-5"><div class="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">Mostrando 1 a 1 de 1 Entradas</div></div><div class="col-sm-12 col-md-7"><div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate"><ul class="pagination"><li class="paginate_button page-item previous disabled" id="DataTables_Table_0_previous"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="0" tabindex="0" class="page-link">Anterior</a></li><li class="paginate_button page-item active"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="1" tabindex="0" class="page-link">1</a></li><li class="paginate_button page-item next disabled" id="DataTables_Table_0_next"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="2" tabindex="0" class="page-link">Siguiente</a></li></ul></div></div></div></div></div>
                    </div>
                    <div class="row">
                        <div id="UPag" class="panel-content py-2 rounded-bottom border-faded border-left-0 border-right-0 border-bottom-0 text-muted">
                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="container">
                            
                            <button class="btn btn-primary mr-2 waves-effect waves-themed" style="" id="BtnAdd"> <text>Nuevo Usuario</text> <span class="fal fa-plus"></span> </button>
                            
                            
                            <button id="BtnDelete" onclick="DeleteSelected()" class="btn btn-danger waves-effect waves-themed mr-2" disabled=""> Eliminar seleccionados <span class="fa fa-times"></span> </button>
                            
                            
                        </div>                      
                    </div>
                </div>
                
            </div>
        </div>

    </div>
    <!-- <input type="text" class="money form-control" /> -->
</div>
</template>