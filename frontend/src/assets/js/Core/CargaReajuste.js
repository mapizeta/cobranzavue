var $ColumnTypes = $ColumnTypes || {};
$ColumnTypes.AccionesDemanda = $AccionesDemanda;
var $DemandanteDT;
var $CurrDemanda;

// $ColumnTypes.Input_Rit = function($Options){
//     console.log($Options);
// };

$(function(){

    $DT.__Inline_Input_Rit__ = function($Options){
        var $Control = $($Options.Sender);
        var $Parent = $Control.parent();
        var $OriginalValue = $Control.text();
        $Control.remove();
    
        var $Def = $DT.Columns[$Options.Name];
    
        var $InputText = new Debris.Components.Input_Rit($Def);
        if($OriginalValue != $Def.Empty){
            $InputText.Control.val($Control.text());
        }
        
        var $NoCancel = false;
        var $IsShowingErrors = false;
    
        var $Done = function(){
            if(!$InputText.IsValid){
                if($DT.NotificationPanel){
                    $NoCancel = true;
                    $DT.NotificationPanel.Time = 0;
                    $DT.NotificationPanel.Type = "danger";
                    $DT.NotificationPanel.Text = "Por favor corrija lo siguiente:<Br><Br><Ul><Li>" + $InputText.NoValidMsgs.reduce(function($c, $n){ return $c + "</Li>" + $n + "<Li>"; }) + "</Li></Ul>Presione Escape para cancelar";
                    $InputText.Control.focus();
                    $NoCancel = false;
                    $IsShowingErrors = true;
                    return;
                }
            }
            if($InputText.Control.val()==""){
                $Cancel();
                return;
            }
            if($Control.text() == $InputText.Control.val()){
                $Cancel();
                return;
            }
            $Control.text($InputText.Control.val());
            $InputText.Control.remove();
            $Parent.append($Control);
            var $Tr = $Parent.closest("Tr");
            var $Data = $DT.DataTable.row($Tr).data();
            $Data[$Options.Name] = $Control.text();
            $DT.Update({ 
                Bean: $Data,
                OnHttpError: function(){
                    var $K = new Debris.Modals.OkModal({ 
                        Text: "Se ha producido un error",
                        Title: "Error",
                        OkText: "Aceptar"
                    });
                    $K.Show();
                    $Control.text($OriginalValue);
                    $Cancel();
                }
                , AjaxData: {
                    __Fields__: JSON.stringify([$Options.Name])
                }
            });
            //$DT.DataTable.row($Tr).data($Data);
        };
        var $Cancel = function(){
            if(!$NoCancel){
                $InputText.Control.remove();
                $Parent.append($Control);
                if($IsShowingErrors){
                    $DT.NotificationPanel.Time = 1000;
                    $DT.NotificationPanel.Text = $DT.NotificationPanel.Text;
                }
            }
        };
    
        $Parent.append(
            $InputText.Control.addClass("form-control form-control-sm").on("keydown", function($Evt){
                if($Evt.keyCode == 13){
                    $Done();
                }
                if($Evt.keyCode == 27){
                    $Cancel();
                }
            }).on("blur", function($Evt){
                $Done();
            })
        );
        $InputText.Control.select();
    
    };

});

$ColumnTypes.Input_Rit = function($Options){
    var $Data = $Options.Data;
    if(!$Options.Data){
        $Data = $Options.Definition.Empty || "N/A";
    }
    if($Options.Definition.Inline){
        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $DT.Instance + "].__Inline_Input_Rit__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
    }else{
        return $Data;
    }
};

Debris.Components.Input_Rit = function Input_Rit($Options){
    var $This = this;
    var $Started = false;

    $Options.Property = {
        get: function(){
            return $This.Control.val();
        },
        set: function($Val) {
            $This.Control.val($Val);
        },
        enumerable: true
    };

    Debris.Components.Input_Text.call($This, $Options);

    // IMask($This.Control[0], {
    //     mask: "A-B-C"
    //     , definitions: {
    //         A: /^O$/
    //         , B: {
    //             mask: IMask.MaskedRange,
    //             from: 10,
    //             to: 999999
    //         }
    //         , C: /^\d{1,4}$/
    //     }
    // });

    IMask($This.Control[0], { 
        mask: "A-B-C",
        //lazy: false,
        blocks: {
            A: {
                mask: /^[O|T|M|E|S|U|V|I]$/
            }
            , B: {
                mask: "00[0][0][0][0]"
            }
            // , B: {
            //     mask: IMask.MaskedRange
            //     , from: 10
            //     , to: 999999
            // }
            , C: {
                mask: IMask.MaskedRange
                , from: 2007
                , to: 2999
            }
        }
    });

    // $This.Control.mask("A-B-C", {
    //     translation: {
    //         A: {
    //             pattern: "[OTEMESUVI]"
    //             //,fallback: "_"
    //         }
    //         , B: {
    //             pattern: "[0-9]{1,6}"
    //             //  , fallback: "_"
    //         }
    //         , C: {
    //             pattern: "[2][0-9]{1,3}"
    //             //, fallback: "2"
    //         }
    //     }
    //     , placeholder: "X-000000-0000"
    // });

    $Started = true;
};

function $AccionesDemanda($Conf){

    for (var i=0; i < $DT.DataTable.column(1).data().length; i ++) {
        
        var rowId = i
        var rowData = $DT.DataTable.row(i).data();
        var cell = $DT.DataTable.cell({ row: rowId, column : 7 }).node()

        switch (rowData.EstadoDemanda) {
    
            case 7: // Error 
                $(cell).css("background-color", "#ffb185");
                break;

            case 6: // Revisar Manual
                $(cell).css("background-color", "#effaa7");
                break;
        }

    }

    return "<Button OnClick='EditarDocumento(this);' Class='btn btn-primary btn-xs'><Span Class='fa fa-pencil'></Span>";
};

function QuitarDemandanteInDocumento($Sender){
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DTDemandanteInDocumento.row($Tr).data();
    var $DemandanteDT = $($Sender).closest("Table").DataTable();
    $DemandanteDT.row($Tr).remove().draw();
    $NuevosDemandantesInDocumento = $.grep($NuevosDemandantesInDocumento, function($e){ return $Data.Rut != $e.Rut; });
    console.log($Data);
}

var $DTDemandanteInDocumento;
var $NuevosDemandantesInDocumento;

function EditarDocumento($Sender) {

    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();
    console.log($Data);
    $CurrDemanda = $Data.Demanda;
    
    var HasError = false
    if ($Data.EstadoDemanda == 7 || $Data.EstadoDemanda == 6) {
        if ($Data.EstadoDemanda == 7) { var ErrorColor = "#ffb185"} else
        if ($Data.EstadoDemanda == 6) { var ErrorColor = "#effaa7"}
        HasError = true;
    }

    console.log(HasError);

    var $CommitUpdate = function(){
        $Panel1.Object.Demandantes = $NuevosDemandantesInDocumento;
        $DT.Update({ Bean: $Panel1.Object });
    };

    // console.log($Panel1);
    var $Modal = new Debris.Modals.YesNoModal({ 
        Title: "Editar Registro",
        YesText: "Guardar cambios", 
        NoText: "Descartar cambios",
        YesCallback: $CommitUpdate,
        CloseCallback: function(){
            if($Panel1.IsModified){
                var $Exit = new Debris.Modals.YesNoModal({ 
                    Title: "Confirmación",
                    Text: "¿Desea salir sin guardar los cambios?", 
                    YesText: "Sí", 
                    NoText: "No",
                    NoCallback: $Modal.Show
                });
                $Exit.Show();
            }
        }
    });
    
    //console.log($Modal);

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({ Container: $Modal.Body });
    
    var $Cell1;
    var $Cell2;
    var $AddFormControlClass = function($New){
        if($New.Conf.Init){
            $New.Conf.Init();
            if($New.Conf.Table){
                $New.Conf.Table.addClass("table").css({ width: "100%" });
            }
        }else{
            $New.Conf.Control.addClass("form-control");
        }
    };
    
    //var $InitDocumentoDemanda;
    var $InitDemandantes;
    var $InitInnerDocumento;
    var $CellDemandante;
    var $NuevoDemandanteSpan;
    var $NuevoDemandanteSubTitle;
    var $ListarDemandanteSpan;
    var $CellListarDemandante;
    var $EliminarDemandantesBtn;
    var $ListarDocumentosCell;
    var $ListarDocumentosSpan;

    $MainPanel
        .NewRow()
            .NewCell({ XS: 5, OnCreated: function($NewCell){ $Cell1 = $NewCell; } })
            .NewCell({ XS: 7, OnCreated: function($NewCell){ $Cell2 = $NewCell; } })
        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append(
                $("<H3></H3>")
                .append( ($NuevoDemandanteSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Nuevos Demandantes"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellDemandante.hasClass("collapsing")) return;
                    if($NuevoDemandanteSpan.hasClass("fa-caret-right")){
                        $NuevoDemandanteSpan.removeClass("fa-caret-right");
                        $NuevoDemandanteSpan.addClass("fa-caret-down");
                        $NuevoDemandanteSubTitle.animate({ opacity: 1 }, 200);
                        $CellDemandante.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                        $NotificacionDemandante.Container.parent().css({ display: "" });
                    }else{
                        $NuevoDemandanteSpan.addClass("fa-caret-right");
                        $NuevoDemandanteSpan.removeClass("fa-caret-down");
                        $NuevoDemandanteSubTitle.animate({ opacity: 0 }, 200);
                        $CellDemandante.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                        $NotificacionDemandante.Container.parent().css({ display: "none" });
                    }
                    $CellDemandante.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append( ($NuevoDemandanteSubTitle = $("<H7>").css({ opacity: 0 })).append("Agregar los siguientes demandantes a la demanda seleccionada (Rit <Text Class='RitValue'></Text> y Tribunal <Text Class='TribunalValue'></Text>)") )
        .NewRow()
            .NewCell({ XS: 12, OnCreated: function($NewCell){
                $CellDemandante = $NewCell;
            }})
        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append(
                $("<H3></H3>")
                .append( ($ListarDemandanteSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Demandantes"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellListarDemandante.hasClass("collapsing")) return;
                    if($ListarDemandanteSpan.hasClass("fa-caret-right")){
                        $ListarDemandanteSpan.removeClass("fa-caret-right");
                        $ListarDemandanteSpan.addClass("fa-caret-down");
                        $EliminarDemandantesBtn.animate({ opacity: 1 }, 200);
                        $ListarDemandanteSubTitle.animate({ opacity: 1 }, 200);
                        $CellListarDemandante.addClass("collapse").parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                        $CellListarDemandante.parent().next().addClass("form-group");
                        $EliminarDemandantesBtn.closest(".row").css({ display: "" });
                        //$CellListarDemandante.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $ListarDemandanteSpan.addClass("fa-caret-right");
                        $ListarDemandanteSpan.removeClass("fa-caret-down");
                        $EliminarDemandantesBtn.animate({ opacity: 0 }, 200);
                        $ListarDemandanteSubTitle.animate({ opacity: 0 }, 200);
                        $CellListarDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                        $CellListarDemandante.parent().next().removeClass("form-group");
                        $EliminarDemandantesBtn.closest(".row").css({ display: "none" });
                        //$CellListarDemandante.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $CellListarDemandante.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append( ($ListarDemandanteSubTitle = $("<H7>").css({ opacity: 0 })).append("Demandantes pertenecientes actualmente a la demanda seleccionada (Rit <Text Class='RitValue'></Text> y Tribunal <Text Class='TribunalValue'></Text>)") )
        .NewRow()
            .NewCell({ XS: 3 })
            .Append( 
                ($EliminarDemandantesBtn = $("<Button></Button>"))
                    .attr({ Class: "btn btn-primary", Id: "BtnDeleteDemandante", disabled: true })
                    .append("Eliminar demandantes seleccionados")
                    .on("click", DeleteSelectedDemandantes)
            )
            .NewCell({ XS: 3 })
            //.Append( $("<Button></Button>").attr({ Class: "btn btn-primary" }).append("Agregar Demandante").click(CrearDemandante) )
        .NewRow()
            .NewCell({ 
                XS: 12, 
                OnCreated: function($NewCell){
                    $NotificacionDemandante = new Debris.Components.Bootstrap.Notifications({ Container: $NewCell, Time: 5000 });
                }
            })
        .NewRow()
            .NewCell({ Xs: 12, OnCreated: function($NewCell){ $CellListarDemandante = $NewCell; } })
            .NewDebris({
                Type: "AjaxDataTable",
                Name: "TblDemandante",
                Args: {
                    Total: $JsonContext.DemandanteTotal
                    , Columns: $JsonContext.DemandanteCols
                    , ReadService: "/Demandante/Crud"
                    , CreateService: "/Demandante/Crud"
                    , UpdateService: "/Demandante/Crud"
                    , DeleteService: "/Demandante/Crud"
                    , ColumnTypes: {
                        // Inline_Checkbox: function($Options){
                        //     return "<Input Type='Checkbox' OnClick='$DemandaInlineCheckbox(this)'>";
                        // }
                    }
                    , NotificationPanel: $NotificacionDemandante
                    , OnDraw: $BlueHeader
                    , AjaxData: {
                        Demanda: $Data.Demanda
                    }
                },
                OnCreated: function($New){
                    $DemandanteDT = $New.Conf;
                    $InitDemandantes = function(){
                        $AddFormControlClass($New);
                        $DemandanteDT.Table.addClass("table-striped table-sm");
                    };
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .Append(
                $("<Hr>")
            )
        .NewRow()
            .NewCell({ XS: 4 })
            .Append(
                $("<H3>")
                .append( ($ListarDocumentosSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append("&nbsp;Documentos demanda")
                .css({ cursor: "pointer" }).on("click", function(){
                    if($CellListarDemandante.hasClass("collapsing")) return;
                    if($ListarDocumentosSpan.hasClass("fa-caret-right")){
                        $ListarDocumentosSpan.removeClass("fa-caret-right");
                        $ListarDocumentosSpan.addClass("fa-caret-down");
                        //$EliminarDemandantesBtn.animate({ opacity: 1 }, 200);
                        //$ListarDemandanteSubTitle.animate({ opacity: 1 }, 200);
                        // $ListarDocumentosCell.addClass("collapse").parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                        // $ListarDocumentosCell.parent().next().addClass("form-group");
                        //$EliminarDemandantesBtn.closest(".row").css({ display: "" });
                        //$ListarDocumentosCell.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $ListarDocumentosSpan.addClass("fa-caret-right");
                        $ListarDocumentosSpan.removeClass("fa-caret-down");
                        //$EliminarDemandantesBtn.animate({ opacity: 0 }, 200);
                        //$ListarDemandanteSubTitle.animate({ opacity: 0 }, 200);
                        // $ListarDocumentosCell.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                        // $ListarDocumentosCell.parent().next().removeClass("form-group");
                        //$EliminarDemandantesBtn.closest(".row").css({ display: "none" });
                        //$ListarDocumentosCell.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $ListarDocumentosCell.collapse("toggle");
                })
                
            )
        .NewRow()
            .NewCell({ Xs: 12, OnCreated: function($NewCell){ $ListarDocumentosCell = $NewCell; } })
            .NewDebris({
                Type: "AjaxDataTable",
                Name: "TblDocumentos",
                Args: {
                    Total: $JsonContext.Total
                    , Columns: { 
                        NombreArchivo: { Type: "Input_Text", Data: "NombreArchivo", Title: "Nombre de Archivo" },
                        FechaRecepcion: { Type: "Input_Text", Data: "FechaRecepcion", Title: "Fecha de Recepción" },
                        Clasificacion: { 
                            Type: $JsonContext.Columns.Clasificacion.Type, 
                            Data: $JsonContext.Columns.Clasificacion.Data, 
                            Title: $JsonContext.Columns.Clasificacion.Title, 
                            Values: $JsonContext.Columns.Clasificacion.Values
                        },
                        VistaPrevia: { Type: "AccionesDocumentoDemanda", Data: "VistaPrevia" }
                    }
                    , ReadService: "/Documento/Crud"
                    , UpdateService: "/Documento/Crud"
                    , AjaxData: {
                        Except: $Data.Id,
                        Demanda: $Data.Demanda
                    }
                    , ColumnTypes: {
                        AccionesDocumentoDemanda: function($Ops){
                            if($Ops.Row.Url){
                                //$Append = $("<Embed></Embed>").attr({ width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id });
                                return "<Button OnClick='VistaPreviaDocumentoDemanda(this)' Class='btn btn-primary btn-xs'><span class='fa fa-search'></span></Button>";
                            }else{
                                //$Append = $("<Label></Label>").append("No se ha ingresado un documento")
                                return "&lt;Sin documento&gt;";
                            }
                            // if($Ops.Row.Url){
                            //     return "<Button OnClick='VistaPreviaDocumentoDemanda(this)' Class='btn btn-primary btn-xs'><span class='fa fa-search'></span></Button>";
                            // }else{
                            //     return "<Sin documento>";
                            // }
                        }
                    }
                    , OnDraw: $BlueHeader
                }
                , OnCreated: function($New){
                    $DocumentoDemandaDT = $New.Conf;
                    $InitInnerDocumento = function(){
                        $AddFormControlClass($New);
                        $DocumentoDemandaDT.Table.addClass("table-striped table-sm");
                    };
                }
            })
    ;

    //console.log($MainPanel);
    //console.log($NotificacionDemandante);
    $InitDemandantes();
    $InitInnerDocumento();
    $DocumentoDemandaDT.Search({ Id: $Data.Id });
    //$InitDocumentoDemanda();
    
    var $Panel1 = new Debris.Misc.Bootstrap4Layout({ 
        Container: $Cell1,
        OnValidated: function(){
            if($NuevosDemandantesInDocumento.length){
                $Modal.Yes.attr({ disabled: false });
            }else{
                $Modal.Yes.attr({ disabled: !($Panel1.IsModified && $Panel1.Validation.IsValid) });
                //console.log($NuevosDemandantesInDocumento);
            }
        }
    });
    
    console.log($Panel1);

    $Panel1
        .NewRow()
        .NewCell({ XS: 4 })
            .NewLabel("Nuevo Archivo")
        .NewCell({ XS: 6 })
            .NewDebris({ Type: "Input_File", Name: "File", Args: { Accept: "application/pdf", Validations: { FileType: { Types: ["pdf"] } } } })
            .NewCell({
                XS: 2, OnCreated: function($New){ $New.closest(".table-responsive").removeClass("table-responsive"); }
            }).Append(
                ($RemoveFileBtn = $("<Button Class='btn btn-xs btn-danger'></Button>").append( 
                    $("<Span>").attr({ Class: "fa fa-times" })
                ).css({ display: "none" }))
            )
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Empresa")
            .NewCell({ XS: 6 })
                .NewDebris({ 
                    Type: "Input_Select2",
                    Name: "Empresa",
                    OnCreated: $AddFormControlClass,
                    Args: {
                        Value: $Data.Empresa,
                        Values: [{ "Text": "Seleccionar", Value: "" }].concat($JsonContext.EmpresasValues),
                        Title: "Empresa",
                        //Validations: { Required: {  } },
                        Parent: $Modal.Body
                    }
                })
                .NewCell({ XS: 1 }).Append(
                    $("<Div>").attr({ Class : "btn-group"}).append(
                        $("<Button>").attr({ Class: "btn btn-primary btn-xs" }).append($("<Span>").attr({ Class: "fa fa-plus" })).on("click", function(){
                            AgregarEmpresa(function($Res){
                                $Panel1.Conf.Empresa.Control.append($("<Option></Option>").attr({ value: $Res.Keys.Id }).append($Res.NewBean.RutEmpleador + " - " + ($Res.NewBean.Nombre || "N/A")))
                                $Panel1.Object.Empresa = $Res.Keys.Id;
                                $Panel1.OnValidated();
                            });
                        }),
                        


                        $BtnEditarEmpresa = $("<Button>")
                        .attr({ Class: "btn btn-primary btn-xs", disabled: true })
                        .append($("<Span>").attr({ Class: "fa fa-pencil" })).on("click", function(){ 
                            EditarEmpresaPorId($Panel1.Object.Empresa, function($Res){
                                $Panel1.Conf.Empresa.Control.find("option[value=" + $Res.NewBean.Id + "]").text($Res.NewBean.RutEmpleador);
                                $Panel1.Conf.Empresa.Control.select2("destroy");
                                //$Panel1.Conf.Empresa.Control.trigger("change");
                                $Panel1.Conf.Empresa.Control = $Panel1.Conf.Empresa.Control.select2({ dropdownParent: $Modal.Body });
                            });
                        })
                    )
                    
                )

        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("RIT")
            .NewCell({ XS: 8 })
                .NewDebris({ Type: "Input_Text", Name: "Rit", OnCreated: $AddFormControlClass, Args: { Value: $Data.Rit, Title: "Rit", Validations: { Required: {  }, Rit: {  } } } })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Tribunal")
            .NewCell({ 
                XS: 8, 
                OnCreated: function($New){ 
                    $New.removeClass("table-responsive"); 
                }
            })
            .NewDebris({
                Type: "Input_Select2",
                Name: "Tribunal",
                OnCreated: function($New){
                    $InitTribunal = function(){
                        $AddFormControlClass($New);
                    }
                },
                Args: { 
                    Values: $JsonContext.Columns.Tribunal.Values,
                    Value: $Data.Tribunal,
                    Parent: $Modal.Body,
                    Title: "Tribunal",
                    Validations: { Required: { NoValidMsg: "Por favor, seleccione Tribunal" } }
                }
            })
        // .NewRow()
        //     .NewCell({ XS: 4 })
        //         .NewLabel("Quiebra")
        //     .NewCell({ XS: 8 })
        //         .NewDebris({ 
        //             Type: "Input_Select2",
        //             Name: "Quiebra",
        //             OnCreated: function($New){
        //                 $InitQuiebra = function(){
        //                     $AddFormControlClass($New);
        //                 }
        //             },
        //             Args: {
        //                 Values: $JsonContext.Columns.Quiebra.Values,
        //                 Value: $Data.Quiebra,
        //                 Title: "Quiebra",
        //                 Validations: { Required: { NoValidMsg: "Por favor, seleccione Quiebra" } },
        //                 Parent: $Modal.Body
        //             }
        //         })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Clasificación")
            .NewCell({ XS: 8 })
                .NewDebris({
                    Type: "Input_Select2",
                    Name: "Clasificacion",
                    OnCreated: function($New){
                        $InitClasificacion = function(){
                            $AddFormControlClass($New);
                        }
                    },
                    Args: {
                        Values: $JsonContext.Columns.Clasificacion.Values,
                        Value: $Data.Clasificacion,
                        Validations: { Required: { NoValidMsg: "Por favor, seleccione Clasificación" } },
                        Parent: $Modal.Body,
                    }
                })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Nombre Archivo")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Text", 
                    Name: "NombreArchivo", 
                    OnCreated: function($Options){ 
                        //$Options.Conf.Control.attr({ disabled: true });
                        $AddFormControlClass($Options);
                    },
                    Args: {
                        Value: $Data.NombreArchivo
                    }
                })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Fecha de Recepción")
            .NewCell({ XS: 8 })
                .NewDebris({ Type: "Input_Date", Name: "FechaRecepcion", OnCreated: $AddFormControlClass, Args: { Value: $Data.FechaIngreso, ParentEl: "#" + $Modal.Id } })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Estado Documento")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Select2",
                    Name: "EstadoDocumento",
                    OnCreated: function($New){
                        $InitEstadoDocumento = function(){
                            $AddFormControlClass($New);
                        }
                    },
                    Args: {
                        Values: $JsonContext.Columns.EstadoDocumento.Values,
                        Value: $Data.EstadoDocumento,
                        Validations: { Required: { NoValidMsg: "Por favor, seleccione Estado" } },
                        Parent: $Modal.Body,
                    }
                })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Observaciones")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Text", 
                    Control: $("<Textarea>").attr({ rows: 2 }), 
                    Name: "Observaciones", 
                    OnCreated: $AddFormControlClass,
                    Args: {
                        Value: $Data.Observaciones
                    }
                })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Error")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Text", 
                    Control: $("<Textarea>").attr({ rows: 2 }), 
                    Name: "Error", 
                    OnCreated: $AddFormControlClass,
                    Args: {
                        Value: $Data.ErrorMsg
                    }
                })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Fecha Error")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Date", 
                    Name: "FechaIngresoError", 
                    OnCreated: $AddFormControlClass,
                    Args: {
                        Value: $Data.FechaIngresoError
                    }
                })
    ;

    // Aqui se define el momento en el que queda activo el boton una vez mas 
    $Panel1.Conf.Empresa.Control.on("change", function() {
        if($Panel1.Object.Empresa) {
            $BtnEditarEmpresa.attr({ disabled: false });
        }
    });

    if (HasError) {
        $Panel1.Conf.Error.Control.attr({ disabled: true }).css("background-color", ErrorColor);
        $Panel1.Conf.FechaIngresoError.Control.attr({ disabled: true }).css("background-color", ErrorColor);
    } else {
        $Panel1.Conf.Error.Control.attr({ disabled: true });
        $Panel1.Conf.FechaIngresoError.Control.attr({ disabled: true });
    }


    $Panel1.Conf.File.Control.find("input[type=file]").on("change", function(){
        //if(!$Panel1.Conf.File.IsValid){
            $RemoveFileBtn.css({ display: "" });
        //}
    });

    $RemoveFileBtn.on("click", function(){
        $Panel1.Conf.File.Control.find("input[type=file]").val("");
        $Panel1.Conf.File.Control.find("text").text("Seleccionar...");
        $Panel1.Conf.File.Validate();
        $RemoveFileBtn.css({ display: "none" });
        $CellEmbed.html("").append($("<Embed></Embed>").attr({ width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id }));
    });

    // PDF
    var $Panel2 = new Debris.Misc.Bootstrap4Layout({ Container: $Cell2 });
    var $CellEmbed;
    $Panel2
        .NewRow()
        .NewCell({
            Xs: 12, 
            OnCreated: function($NewCell){
                $CellEmbed = $NewCell;
                var $Append;
                if($Data.Url){
                    $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id });
                }else{
                    $Append = $("<Label></Label>").append("No se ha ingresado un documento");
                }
                $NewCell.append($Append);
            }
        })
    ;

    var $AjxData = function(){
        return {
            data: { Rit: $Panel1.Object.Rit, Tribunal: $Panel1.Object.Tribunal }
            , type: "GET"
            , url: "Demanda/Crud"
            , success: function($Res){
                CloseWait();
                if($Res.Result == 0){
                    if($Res.Data.length){
                        $MainPanel.Conf.TblDemandante.AjaxData.Demanda = $Res.Data[0].Id;
                        $MainPanel.Conf.TblDocumentos.AjaxData.Demanda = $Res.Data[0].Id;
                        $MainPanel.Conf.TblDemandante.Search();
                        $MainPanel.Conf.TblDocumentos.Search();
                    }else{
                        $MainPanel.Conf.TblDemandante.AjaxData.Demanda = -1;
                        $MainPanel.Conf.TblDocumentos.AjaxData.Demanda = -1;
                        $MainPanel.Conf.TblDemandante.Search();
                        $MainPanel.Conf.TblDocumentos.Search();
                    }
                }else{
                    // Mostrar error
                }
            }
        };
    };

    //console.log($MainPanel);
    //console.log($Panel1);
    $Panel1.Conf.Rit.Control.on("blur", function(){
        $(".RitValue").text($Panel1.Object.Rit);
        if( !($Panel1.Object.Rit == "" || $Panel1.Object.Tribunal == "") ){
            ShowWait();
            $.ajax($AjxData());
        }
    });
    $Panel1.Conf.Tribunal.Control.on("select2:close", function(){
        $(".TribunalValue").text($Panel1.Conf.Tribunal.Control.find("option:selected").text());
        if( !($Panel1.Object.Rit == "" || $Panel1.Object.Tribunal == "") ){
            ShowWait();
            $.ajax($AjxData());
        }
    });
    
    $Panel1.Object.Id = $Data.Id;
    // $Panel1.Object.RutEmpleador = $Data.RutEmpleador;
    // $Panel1.Object.Rit = $Data.Rit;
    // $Panel1.Object.Tribunal = $Data.Tribunal;
    // $Panel1.Object.Quiebra = $Data.Quiebra;
    // $Panel1.Object.Clasificacion = $Data.Clasificacion;
    // $Panel1.Object.NombreArchivo = $Data.NombreArchivo;
    // $Panel1.Object.FechaRecepcion = $Data.FechaRecepcion;
    // $Panel1.Object.Estado = $Data.Estado;
    // $Panel1.Object.Observaciones = $Data.Observaciones;

    // [!] Deprecado en favor de OnValidated
    // var $YesStateInputText = function(){
    //     $Modal.Yes.attr({ disabled: !$Panel1.IsModified });
    // };

    // var $YesStateInputSelect = function(){
    //     $Modal.Yes.attr({ disabled: !$Panel1.IsModified });
    // };

    // var $YesStateInputFile = function(){
    //     $Modal.Yes.attr({ disabled: !$Panel1.IsModified });
    // };

    // var $YesStateInputFile = function(){
    //     $Modal.Yes.attr({ disabled: !$Panel1.IsModified });
    // };
    
    // $Panel1.Conf.NombreArchivo.Control.on("input", $YesStateInputText);
    // //$Panel1.Conf.RutEmpleador.Control.on("input", $YesStateInputText);
    // $Panel1.Conf.Rit.Control.on("input", $YesStateInputText);
    // $Panel1.Conf.Tribunal.Control.on("change", $YesStateInputSelect);
    // $Panel1.Conf.Quiebra.Control.on("change", $YesStateInputSelect);
    // $Panel1.Conf.FechaRecepcion.Control.on("input", $YesStateInputText);
    // $Panel1.Conf.EstadoDocumento.Control.on("change", $YesStateInputSelect);
    // $Panel1.Conf.Observaciones.Control.on("input", $YesStateInputText);
    // $Panel1.Conf.File.Control.find("input").on("change", $YesStateInputFile);

    $Modal.Body.closest(".modal-dialog").css({ "max-width": "90%" });
    
    $Modal.Yes.attr({ disabled: true });

    // Deprecado en favor de $Panel.Init()
    // $InitTribunal();
    // $InitQuiebra();
    // $InitClasificacion();
    // $InitEstadoDocumento();
    // $Panel1.Conf.Tribunal.Control.select2({ dropdownParent: $Modal.Body/*.closest(".modal")*/ }).closest(".table-responsive").removeClass("table-responsive") ; //.css({ width: "100%" }).closest(".table-responsive").removeClass("table-responsive");
    // $Panel1.Conf.Quiebra.Control.select2({ dropdownParent: $Modal.Body/*.closest(".modal")*/ }).closest(".table-responsive").removeClass("table-responsive") ; //.css({ width: "100%" }).closest(".table-responsive").removeClass("table-responsive");
    // $Panel1.Conf.Clasificacion.Control.select2({ dropdownParent: $Modal.Body/*.closest(".modal")*/ }).closest(".table-responsive").removeClass("table-responsive") ; //.css({ width: "100%" }).closest(".table-responsive").removeClass("table-responsive");
    // $Panel1.Conf.EstadoDocumento.Control.select2({ dropdownParent: $Modal.Body/*.closest(".modal")*/ }).closest(".table-responsive").removeClass("table-responsive") ; //.css({ width: "100%" }).closest(".table-responsive").removeClass("table-responsive");
    $Panel1.Conf.FechaRecepcion.Init();
    $Panel1.Init();
    $Panel1.Validation.Init();

    //console.log($CellEmbed);
    $Panel1.Conf.File.Control.find("input").on("change", function($Evt){
        if(!$Panel1.Conf.File.IsValid){
            $CellEmbed.html("");
            $Panel1.Conf.File.Control.find("text").text("Seleccionar...");
            $RemoveFileBtn.css({ display: "none" });
            return;
        }
        $CellEmbed.html("");
        var $Append;
        if($Panel1.Conf.File.Control.find("input").prop("files").length){
            var $Url = URL.createObjectURL($Evt.target.files[0]);
            $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: $Url });
        }else{
            $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id });
            $Panel1.Conf.File.Control.find("text").text("Seleccionar...");
            $RemoveFileBtn.css({ display: "none" });
            //$Append = $("<Label></Label>").append("No se ha ingresado un documento");
        }
        $CellEmbed.append($Append);
    });

    //$Panel1.Conf.Clasificacion.Control.on("change", $YesStateInputSelect);

    $Panel1.Conf.Clasificacion.Control.on("change", function(){
        switch($Panel1.Object.Clasificacion){
            case "7":
                $Panel1.Object.EstadoDocumento = 1;
            break;
            case "1":
                $Panel1.Object.EstadoDocumento = 2;
            break;
            case "6":
                $Panel1.Object.EstadoDocumento = 3;
            break;
            case "2", "3", "4", "5":
                $Panel1.Object.EstadoDocumento = 4;
            break;
        }
    });

    $Modal.Show();

    var $MainNuevoDemandante = new Debris.Misc.Bootstrap4Layout({ Container: $CellDemandante });
    var $Cell1NuevoDemandante;
    var $Cell2NuevoDemandante;

    $MainNuevoDemandante
        .NewRow({ 
            OnCreated: function($New){
                $New.Row.removeClass("form-group");
            } 
        })
        .NewCell({ XS: 4, OnCreated: function($NewCell){ $Cell1NuevoDemandante = $NewCell } })
        .NewCell({ XS: 8, OnCreated: function($NewCell){ $Cell2NuevoDemandante = $NewCell } })
    ;

    var $FormNuevoDemandante = new Debris.Misc.Bootstrap4Layout({ 
        Container: $Cell1NuevoDemandante,
        OnValidated: function(){
            $DemandanteAddBtn.attr({ disabled: !($FormNuevoDemandante.IsModified && $FormNuevoDemandante.Validation.IsValid) });    
        }
    });

    $FormNuevoDemandante
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewDebris({ 
            Type: "Input_Text"
            , Control: $("<Input>").attr({ Type: "hidden" })
            , Name: "Demanda"
            , Args: {
                Value: $CurrDemanda
            }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Rut:")
        .NewDebris({
        Type: "Input_Rut",
        OnCreated: function($New){
            $New.Conf.Control.addClass("form-control");
        },
        Name: "Rut",
        Args: {
            Title: "Rut",
            Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Rut</I>" },  Rut: { NoValidMsg: "Rut ingresado no válido" } }
        }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Nombre:")
        // [!] Crear NewInputText()
        .NewDebris({
            Type: "Input_Text", 
            OnCreated: function($New){
                $New.Conf.Control.addClass("form-control");
            },
            Name: "Nombre",
            Args: {
                Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Nombre</I>" } }
            }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Estado:")
        // [!] Crear NewInputText()
        .NewDebris({
            Type: "Input_Select", 
            OnCreated: function($New){
                $New.Conf.Control.addClass("form-control");
            },
            Name: "Estado",
            Args: $.extend({}, $JsonContext.DemandanteCols.Estado, { Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Estado</I>" } } })
        })
        .NewRow()
        .NewCell({ XS: 12 })
        .Append( ($DemandanteAddBtn = $("<Button>").addClass("btn btn-primary btn-sm").append( $("<Span>").addClass("fa fa-plus") )) )
        .Append( $("<Text>&nbsp;</Tex>") )
        .Append( ($DemandanteClearBtn = $("<Button>").addClass("btn btn-primary btn-sm").append( $("<Span>").addClass("fa fa-eraser") )) )
    ;

    $NuevosDemandantesInDocumento = [];
    var $IdNuevoDemandante = 0;

    $DemandanteAddBtn.on("click", function(){
        
        //console.log($Panel1.Object);
        $DemandanteAddBtn.attr({ disabled: true });

        var $AlreadyExistsModal = new Debris.Modals.OkModal({ 
            OkText: "Aceptar", 
            Text: "Ya existe un demandante con rut " + $FormNuevoDemandante.Object.Rut + " en esta demanda.",
            Title: "Validación"
        });

        var $Found = $NuevosDemandantesInDocumento.find(function($e){
            return $e.Rut == $FormNuevoDemandante.Object.Rut;
        });

        if($Found){
            $AlreadyExistsModal.Show();
            $DemandanteAddBtn.attr({ disabled: false });
            //CloseWait();
            return;
        }

        ShowWait();
        $.ajax({
            data: { Rit: $Panel1.Object.Rit, Tribunal: $Panel1.Object.Tribunal,/* Demanda: $Data.Demanda, */ Rut: $FormNuevoDemandante.Object.Rut },
            type: "GET",
            url: "/Demandante/Crud",
            success: function($Res){
                CloseWait();
                $DemandanteAddBtn.attr({ disabled: false });
                if($Res.Result == 0){
                    if($Res.Data.length){
                        $AlreadyExistsModal.Show();
                    }else{
                        var $NuevoDemandante = $.extend({}, $FormNuevoDemandante.Object, { Id: $IdNuevoDemandante++ });
                        $NuevosDemandantesInDocumento.push($NuevoDemandante);
                        $DTDemandanteInDocumento.row.add($NuevoDemandante).draw();
                        $Panel1.OnValidated();
                    }
                }
            }
        });
        
    });

    $DemandanteClearBtn.on("click", function(){
        $FormNuevoDemandante.Clear();
        $DemandanteAddBtn.attr({ disabled: true });
    });

    $DemandanteAddBtn.attr({ disabled: true });

    var $TblNuevosDemandantes = $("<Table>").addClass("table table-striped table-sm").css({ width: "100%" });

    $Cell2NuevoDemandante.append($TblNuevosDemandantes);

    $DTDemandanteInDocumento =  $TblNuevosDemandantes.DataTable({ 
        columns: [
            { title: "Rut", data: "Rut" }
            , { title: "Nombre", data: "Nombre" }
            , { 
                title: "Estado", 
                data: "Estado", 
                render: function($Data){
                    var $Found = $JsonContext.DemandanteCols.Estado.Values.find(function($e){ return $e.Value == $Data; });
                    return $Found.Text;
                }
            }
            , { data: "Id", render: function(){ return "<Button OnClick='QuitarDemandanteInDocumento(this)' Class='btn btn-danger btn-xs'><Span Class='fa fa-times'></Span></Button>"; } }
        ]
        , data: []
        , language: Debris.Misc.Lang.DataTable.Es
        , searching: false
    });

    $FormNuevoDemandante.Validation.Init();
    $CellListarDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
    $CellListarDemandante.parent().next().removeClass("form-group");
    $EliminarDemandantesBtn.closest(".row").css({ display: "none" });
    $CellDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
    $ListarDocumentosCell.addClass("collapse");

    $(".RitValue").html("<I>" + $Panel1.Object.Rit + "</I>");
    $(".TribunalValue").html("<I>" + $Panel1.Conf.Tribunal.Control.find(":selected").text() + "</I>");

    $Panel1.Conf.Rit.Control.on("blur", function(){
        $(".RitValue").html("<I>" + $Panel1.Object.Rit + "</I>");
    });

    $Panel1.Conf.Tribunal.Control.on("blur", function(){
        $(".TribunalValue").html("<I>" + $Panel1.Conf.Tribunal.Control.find(":selected").text() + "</I>");
    });

    // $CellDemandante.collapse();
    // $CellDemandante.collapse("hide");
    //console.log($CellDemandante);

    // $Panel1.Conf.Tribunal.Control.fastselect();
    // $Panel1.Conf.Quiebra.Control.fastselect();
    // $Panel1.Conf.Clasificacion.Control.fastselect();
    // $Panel1.Conf.EstadoDocumento.Control.fastselect();

}

function EditarDocumento2($Sender){
    
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();
    $CurrDemanda = $Data.Demanda;
    
    var HasError = false
    if ($Data.EstadoDemanda == 7 || $Data.EstadoDemanda == 6) {
        if ($Data.EstadoDemanda == 7) { var ErrorColor = "#ffb185"} else
        if ($Data.EstadoDemanda == 6) { var ErrorColor = "#effaa7"}
        HasError = true;
    }

    var $CommitUpdate = function(){
        $Panel1.Object.Demandantes = $NuevosDemandantesInDocumento;
        $DT.Update({ Bean: $Panel1.Object });
    };

    var $Modal = new Debris.Modals.YesNoModal({ 
        Title: "Editar Registro",
        YesText: "Guardar cambios", 
        NoText: "Descartar cambios",
        YesCallback: $CommitUpdate,
        CloseCallback: function(){
            if($Panel1.IsModified){
                var $Exit = new Debris.Modals.YesNoModal({ 
                    Title: "Confirmación",
                    Text: "¿Desea salir sin guardar los cambios?", 
                    YesText: "Sí", 
                    NoText: "No",
                    NoCallback: $Modal.Show
                });
                $Exit.Show();
            }
        }
    });
    $Modal.Body.closest(".modal-dialog").css({ "max-width": "90%" });
    
    var $MainPanel = new Debris.Misc.Bootstrap4Layout({ Container: $Modal.Body });
    
    var $Cell1;
    var $Cell2;
    var $AddFormControlClass = function($New){
        if($New.Conf.Init){
            $New.Conf.Init();
            if($New.Conf.Table){
                $New.Conf.Table.addClass("table").css({ width: "100%" });
            }
        }else{
            $New.Conf.Control.addClass("form-control");
        }
    };
    
    var $InitDemandantes;
    var $InitInnerDocumento;
    var $CellDemandante;
    var $NuevoDemandanteSpan;
    var $NuevoDemandanteSubTitle;
    var $ListarDemandanteSpan;
    var $CellListarDemandante;
    var $EliminarDemandantesBtn;
    var $ListarDocumentosCell;
    var $ListarDocumentosSpan;

    var $MainPanel = new Debris.Misc.Form({
        Descriptors: {
            TblDemandante: {
                Type: "AjaxDataTable"
                , Total: $JsonContext.DemandanteTotal
                , Columns: $JsonContext.DemandanteCols
                , ReadService: "/Demandante/Crud"
                , CreateService: "/Demandante/Crud"
                , UpdateService: "/Demandante/Crud"
                , DeleteService: "/Demandante/Crud"
                , ColumnTypes: {
                    // Inline_Checkbox: function($Options){
                    //     return "<Input Type='Checkbox' OnClick='$DemandaInlineCheckbox(this)'>";
                    // }
                }
                , NotificationPanel: $NotificacionDemandante
                , OnDraw: $BlueHeader
                , AjaxData: {
                    Demanda: $Data.Demanda
                }
                , OnControlCreated: function($DemandanteDT){
                    $InitDemandantes = function(){
                        //$AddFormControlClass($DemandanteDT);
                        $DemandanteDT.addClass("table table-striped table-sm").css({ width: "100%" });
                    };
                }
            }
        },
        Container: $Modal.Body
    });
    
    $Modal.Show();
    // $MainPanel.Init();

    // $InitDemandantes();
    // $InitInnerDocumento();
    // $DocumentoDemandaDT.Search({ Id: $Data.Id });
    
    // var $Panel1 = new Debris.Misc.Bootstrap4Layout({ 
    //     Container: $Cell1,
    //     OnValidated: function(){
    //         if($NuevosDemandantesInDocumento.length){
    //             $Modal.Yes.attr({ disabled: false });
    //         }else{
    //             $Modal.Yes.attr({ disabled: !($Panel1.IsModified && $Panel1.Validation.IsValid) });
    //             //console.log($NuevosDemandantesInDocumento);
    //         }
    //     }
    // });

    var $Panel1 = new Debris.Misc.Form({
        Descriptors: {
            File: { Type: "Input_File", Title: "Nuevo Archivo", Args: { Accept: "application/pdf", Validations: { FileType: { Types: ["pdf"] } } } },
            // ($RemoveFileBtn = $("<Button Class='btn btn-xs btn-danger'></Button>").append( 
            //     $("<Span>").attr({ Class: "fa fa-times" })
            // ).css({ display: "none" }))
            
        }
    });

    $Panel1.Init();
    var $DasLayout = new Debris.Misc.Layout.BaseLayout({ Container: $Modal.Body, Conf: $Panel1.Conf });
    $DasLayout.Paint();

    // $Panel1
    //     .NewRow()
    //     .NewCell({ XS: 4 })
    //         .NewLabel("Nuevo Archivo")
    //     .NewCell({ XS: 6 })
    //         .NewDebris({ Type: "Input_File", Name: "File", Args: { Accept: "application/pdf", Validations: { FileType: { Types: ["pdf"] } } } })
    //         .NewCell({
    //             XS: 2, OnCreated: function($New){ $New.closest(".table-responsive").removeClass("table-responsive"); }
    //         }).Append(
    //             ($RemoveFileBtn = $("<Button Class='btn btn-xs btn-danger'></Button>").append( 
    //                 $("<Span>").attr({ Class: "fa fa-times" })
    //             ).css({ display: "none" }))
    //         )
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Empresa")
    //         .NewCell({ XS: 6 })
    //             .NewDebris({ 
    //                 Type: "Input_Select2",
    //                 Name: "Empresa",
    //                 OnCreated: $AddFormControlClass,
    //                 Args: {
    //                     Value: $Data.Empresa,
    //                     Values: [{ "Text": "Seleccionar", Value: "" }].concat($JsonContext.EmpresasValues),
    //                     Title: "Empresa",
    //                     //Validations: { Required: {  } },
    //                     Parent: $Modal.Body
    //                 }
    //             })
    //             .NewCell({ XS: 1 }).Append(
    //                 $("<Div>").attr({ Class : "btn-group"}).append(
    //                     $("<Button>").attr({ Class: "btn btn-primary btn-xs" }).append($("<Span>").attr({ Class: "fa fa-plus" })).on("click", function(){
    //                         AgregarEmpresa(function($Res){
    //                             $Panel1.Conf.Empresa.Control.append($("<Option></Option>").attr({ value: $Res.Keys.Id }).append($Res.NewBean.RutEmpleador + " - " + ($Res.NewBean.Nombre || "N/A")))
    //                             $Panel1.Object.Empresa = $Res.Keys.Id;
    //                             $Panel1.OnValidated();
    //                         });
    //                     }),
    //                     $BtnEditarEmpresa = $("<Button>")
    //                     .attr({ Class: "btn btn-primary btn-xs", disabled: true })
    //                     .append($("<Span>").attr({ Class: "fa fa-pencil" })).on("click", function(){ 
    //                         EditarEmpresaPorId($Panel1.Object.Empresa, function($Res){
    //                             $Panel1.Conf.Empresa.Control.find("option[value=" + $Res.NewBean.Id + "]").text($Res.NewBean.RutEmpleador);
    //                             $Panel1.Conf.Empresa.Control.select2("destroy");
    //                             //$Panel1.Conf.Empresa.Control.trigger("change");
    //                             $Panel1.Conf.Empresa.Control = $Panel1.Conf.Empresa.Control.select2({ dropdownParent: $Modal.Body });
    //                         });
    //                     })
    //                 )         
    //             )
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("RIT")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({ Type: "Input_Text", Name: "Rit", OnCreated: $AddFormControlClass, Args: { Value: $Data.Rit, Title: "Rit", Validations: { Required: {  }, Rit: {  } } } })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Tribunal")
    //         .NewCell({ 
    //             XS: 8, 
    //             OnCreated: function($New){ 
    //                 $New.removeClass("table-responsive"); 
    //             }
    //         })
    //         .NewDebris({
    //             Type: "Input_Select2",
    //             Name: "Tribunal",
    //             OnCreated: function($New){
    //                 $InitTribunal = function(){
    //                     $AddFormControlClass($New);
    //                 }
    //             },
    //             Args: { 
    //                 Values: $JsonContext.Columns.Tribunal.Values,
    //                 Value: $Data.Tribunal,
    //                 Parent: $Modal.Body,
    //                 Title: "Tribunal",
    //                 Validations: { Required: { NoValidMsg: "Por favor, seleccione Tribunal" } }
    //             }
    //         })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Clasificación")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({
    //                 Type: "Input_Select2",
    //                 Name: "Clasificacion",
    //                 OnCreated: function($New){
    //                     $InitClasificacion = function(){
    //                         $AddFormControlClass($New);
    //                     }
    //                 },
    //                 Args: {
    //                     Values: $JsonContext.Columns.Clasificacion.Values,
    //                     Value: $Data.Clasificacion,
    //                     Validations: { Required: { NoValidMsg: "Por favor, seleccione Clasificación" } },
    //                     Parent: $Modal.Body,
    //                 }
    //             })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Nombre Archivo")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({ 
    //                 Type: "Input_Text", 
    //                 Name: "NombreArchivo", 
    //                 OnCreated: function($Options){ 
    //                     //$Options.Conf.Control.attr({ disabled: true });
    //                     $AddFormControlClass($Options);
    //                 },
    //                 Args: {
    //                     Value: $Data.NombreArchivo
    //                 }
    //             })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Fecha de Recepción")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({ Type: "Input_Date", Name: "FechaRecepcion", OnCreated: $AddFormControlClass, Args: { Value: $Data.FechaIngreso, ParentEl: "#" + $Modal.Id } })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Estado Documento")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({ 
    //                 Type: "Input_Select2",
    //                 Name: "EstadoDocumento",
    //                 OnCreated: function($New){
    //                     $InitEstadoDocumento = function(){
    //                         $AddFormControlClass($New);
    //                     }
    //                 },
    //                 Args: {
    //                     Values: $JsonContext.Columns.EstadoDocumento.Values,
    //                     Value: $Data.EstadoDocumento,
    //                     Validations: { Required: { NoValidMsg: "Por favor, seleccione Estado" } },
    //                     Parent: $Modal.Body,
    //                 }
    //             })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Observaciones")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({ 
    //                 Type: "Input_Text", 
    //                 Control: $("<Textarea>").attr({ rows: 2 }), 
    //                 Name: "Observaciones", 
    //                 OnCreated: $AddFormControlClass,
    //                 Args: {
    //                     Value: $Data.Observaciones
    //                 }
    //             })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Error")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({ 
    //                 Type: "Input_Text", 
    //                 Control: $("<Textarea>").attr({ rows: 2 }), 
    //                 Name: "Error", 
    //                 OnCreated: $AddFormControlClass,
    //                 Args: {
    //                     Value: $Data.ErrorMsg
    //                 }
    //             })
    //     .NewRow()
    //         .NewCell({ XS: 4 })
    //             .NewLabel("Fecha Error")
    //         .NewCell({ XS: 8 })
    //             .NewDebris({ 
    //                 Type: "Input_Date", 
    //                 Name: "FechaIngresoError", 
    //                 OnCreated: $AddFormControlClass,
    //                 Args: {
    //                     Value: $Data.FechaIngresoError
    //                 }
    //             })
    // ;

    // Aqui se define el momento en el que queda activo el boton una vez mas 
    $Panel1.Conf.Empresa.Control.on("change", function() {
        if($Panel1.Object.Empresa) {
            $BtnEditarEmpresa.attr({ disabled: false });
        }
    });

    if (HasError) {
        $Panel1.Conf.Error.Control.attr({ disabled: true }).css("background-color", ErrorColor);
        $Panel1.Conf.FechaIngresoError.Control.attr({ disabled: true }).css("background-color", ErrorColor);
    } else {
        $Panel1.Conf.Error.Control.attr({ disabled: true });
        $Panel1.Conf.FechaIngresoError.Control.attr({ disabled: true });
    }


    $Panel1.Conf.File.Control.find("input[type=file]").on("change", function(){
        //if(!$Panel1.Conf.File.IsValid){
            $RemoveFileBtn.css({ display: "" });
        //}
    });

    $RemoveFileBtn.on("click", function(){
        $Panel1.Conf.File.Control.find("input[type=file]").val("");
        $Panel1.Conf.File.Control.find("text").text("Seleccionar...");
        $Panel1.Conf.File.Validate();
        $RemoveFileBtn.css({ display: "none" });
        $CellEmbed.html("").append($("<Embed></Embed>").attr({ width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id }));
    });

    // PDF
    var $Panel2 = new Debris.Misc.Bootstrap4Layout({ Container: $Cell2 });
    var $CellEmbed;
    $Panel2
        .NewRow()
        .NewCell({
            Xs: 12, 
            OnCreated: function($NewCell){
                $CellEmbed = $NewCell;
                var $Append;
                if($Data.Url){
                    $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id });
                }else{
                    $Append = $("<Label></Label>").append("No se ha ingresado un documento");
                }
                $NewCell.append($Append);
            }
        })
    ;

    var $AjxData = function(){
        return {
            data: { Rit: $Panel1.Object.Rit, Tribunal: $Panel1.Object.Tribunal }
            , type: "GET"
            , url: "Demanda/Crud"
            , success: function($Res){
                CloseWait();
                if($Res.Result == 0){
                    if($Res.Data.length){
                        $MainPanel.Conf.TblDemandante.AjaxData.Demanda = $Res.Data[0].Id;
                        $MainPanel.Conf.TblDocumentos.AjaxData.Demanda = $Res.Data[0].Id;
                        $MainPanel.Conf.TblDemandante.Search();
                        $MainPanel.Conf.TblDocumentos.Search();
                    }else{
                        $MainPanel.Conf.TblDemandante.AjaxData.Demanda = -1;
                        $MainPanel.Conf.TblDocumentos.AjaxData.Demanda = -1;
                        $MainPanel.Conf.TblDemandante.Search();
                        $MainPanel.Conf.TblDocumentos.Search();
                    }
                }else{
                    // Mostrar error
                }
            }
        };
    };

    //console.log($MainPanel);
    //console.log($Panel1);
    $Panel1.Conf.Rit.Control.on("blur", function(){
        $(".RitValue").text($Panel1.Object.Rit);
        if( !($Panel1.Object.Rit == "" || $Panel1.Object.Tribunal == "") ){
            ShowWait();
            $.ajax($AjxData());
        }
    });
    $Panel1.Conf.Tribunal.Control.on("select2:close", function(){
        $(".TribunalValue").text($Panel1.Conf.Tribunal.Control.find("option:selected").text());
        if( !($Panel1.Object.Rit == "" || $Panel1.Object.Tribunal == "") ){
            ShowWait();
            $.ajax($AjxData());
        }
    });
    
    $Panel1.Object.Id = $Data.Id;
    
    $Modal.Yes.attr({ disabled: true });

    $Panel1.Conf.FechaRecepcion.Init();
    $Panel1.Init();
    $Panel1.Validation.Init();

    $Panel1.Conf.File.Control.find("input").on("change", function($Evt){
        if(!$Panel1.Conf.File.IsValid){
            $CellEmbed.html("");
            $Panel1.Conf.File.Control.find("text").text("Seleccionar...");
            $RemoveFileBtn.css({ display: "none" });
            return;
        }
        $CellEmbed.html("");
        var $Append;
        if($Panel1.Conf.File.Control.find("input").prop("files").length){
            var $Url = URL.createObjectURL($Evt.target.files[0]);
            $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: $Url });
        }else{
            $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id });
            $Panel1.Conf.File.Control.find("text").text("Seleccionar...");
            $RemoveFileBtn.css({ display: "none" });
        }
        $CellEmbed.append($Append);
    });

    $Panel1.Conf.Clasificacion.Control.on("change", function(){
        switch($Panel1.Object.Clasificacion){
            case "7":
                $Panel1.Object.EstadoDocumento = 1;
            break;
            case "1":
                $Panel1.Object.EstadoDocumento = 2;
            break;
            case "6":
                $Panel1.Object.EstadoDocumento = 3;
            break;
            case "2", "3", "4", "5":
                $Panel1.Object.EstadoDocumento = 4;
            break;
        }
    });

    $Modal.Show();

    var $MainNuevoDemandante = new Debris.Misc.Bootstrap4Layout({ Container: $CellDemandante });
    var $Cell1NuevoDemandante;
    var $Cell2NuevoDemandante;

    $MainNuevoDemandante
        .NewRow({ 
            OnCreated: function($New){
                $New.Row.removeClass("form-group");
            } 
        })
        .NewCell({ XS: 4, OnCreated: function($NewCell){ $Cell1NuevoDemandante = $NewCell } })
        .NewCell({ XS: 8, OnCreated: function($NewCell){ $Cell2NuevoDemandante = $NewCell } })
    ;

    var $FormNuevoDemandante = new Debris.Misc.Bootstrap4Layout({ 
        Container: $Cell1NuevoDemandante,
        OnValidated: function(){
            $DemandanteAddBtn.attr({ disabled: !($FormNuevoDemandante.IsModified && $FormNuevoDemandante.Validation.IsValid) });    
        }
    });

    $FormNuevoDemandante
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewDebris({ 
            Type: "Input_Text"
            , Control: $("<Input>").attr({ Type: "hidden" })
            , Name: "Demanda"
            , Args: {
                Value: $CurrDemanda
            }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Rut:")
        .NewDebris({
        Type: "Input_Rut",
        OnCreated: function($New){
            $New.Conf.Control.addClass("form-control");
        },
        Name: "Rut",
        Args: {
            Title: "Rut",
            Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Rut</I>" },  Rut: { NoValidMsg: "Rut ingresado no válido" } }
        }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Nombre:")
        .NewDebris({
            Type: "Input_Text", 
            OnCreated: function($New){
                $New.Conf.Control.addClass("form-control");
            },
            Name: "Nombre",
            Args: {
                Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Nombre</I>" } }
            }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Estado:")
        .NewDebris({
            Type: "Input_Select", 
            OnCreated: function($New){
                $New.Conf.Control.addClass("form-control");
            },
            Name: "Estado",
            Args: $.extend({}, $JsonContext.DemandanteCols.Estado, { Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Estado</I>" } } })
        })
        .NewRow()
        .NewCell({ XS: 12 })
        .Append( ($DemandanteAddBtn = $("<Button>").addClass("btn btn-primary btn-sm").append( $("<Span>").addClass("fa fa-plus") )) )
        .Append( $("<Text>&nbsp;</Tex>") )
        .Append( ($DemandanteClearBtn = $("<Button>").addClass("btn btn-primary btn-sm").append( $("<Span>").addClass("fa fa-eraser") )) )
    ;

    $NuevosDemandantesInDocumento = [];
    var $IdNuevoDemandante = 0;

    $DemandanteAddBtn.on("click", function(){
        
        $DemandanteAddBtn.attr({ disabled: true });

        var $AlreadyExistsModal = new Debris.Modals.OkModal({ 
            OkText: "Aceptar", 
            Text: "Ya existe un demandante con rut " + $FormNuevoDemandante.Object.Rut + " en esta demanda.",
            Title: "Validación"
        });

        var $Found = $NuevosDemandantesInDocumento.find(function($e){
            return $e.Rut == $FormNuevoDemandante.Object.Rut;
        });

        if($Found){
            $AlreadyExistsModal.Show();
            $DemandanteAddBtn.attr({ disabled: false });
            //CloseWait();
            return;
        }

        ShowWait();
        $.ajax({
            data: { Rit: $Panel1.Object.Rit, Tribunal: $Panel1.Object.Tribunal,/* Demanda: $Data.Demanda, */ Rut: $FormNuevoDemandante.Object.Rut },
            type: "GET",
            url: "/Demandante/Crud",
            success: function($Res){
                CloseWait();
                $DemandanteAddBtn.attr({ disabled: false });
                if($Res.Result == 0){
                    if($Res.Data.length){
                        $AlreadyExistsModal.Show();
                    }else{
                        var $NuevoDemandante = $.extend({}, $FormNuevoDemandante.Object, { Id: $IdNuevoDemandante++ });
                        $NuevosDemandantesInDocumento.push($NuevoDemandante);
                        $DTDemandanteInDocumento.row.add($NuevoDemandante).draw();
                        $Panel1.OnValidated();
                    }
                }
            }
        });
        
    });

    $DemandanteClearBtn.on("click", function(){
        $FormNuevoDemandante.Clear();
        $DemandanteAddBtn.attr({ disabled: true });
    });

    $DemandanteAddBtn.attr({ disabled: true });

    var $TblNuevosDemandantes = $("<Table>").addClass("table table-striped table-sm").css({ width: "100%" });

    $Cell2NuevoDemandante.append($TblNuevosDemandantes);

    $DTDemandanteInDocumento =  $TblNuevosDemandantes.DataTable({ 
        columns: [
            { title: "Rut", data: "Rut" }
            , { title: "Nombre", data: "Nombre" }
            , { 
                title: "Estado", 
                data: "Estado", 
                render: function($Data){
                    var $Found = $JsonContext.DemandanteCols.Estado.Values.find(function($e){ return $e.Value == $Data; });
                    return $Found.Text;
                }
            }
            , { data: "Id", render: function(){ return "<Button OnClick='QuitarDemandanteInDocumento(this)' Class='btn btn-danger btn-xs'><Span Class='fa fa-times'></Span></Button>"; } }
        ]
        , data: []
        , language: Debris.Misc.Lang.DataTable.Es
        , searching: false
    });

    $FormNuevoDemandante.Validation.Init();
    $CellListarDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
    $CellListarDemandante.parent().next().removeClass("form-group");
    $EliminarDemandantesBtn.closest(".row").css({ display: "none" });
    $CellDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
    $ListarDocumentosCell.addClass("collapse");

    $(".RitValue").html("<I>" + $Panel1.Object.Rit + "</I>");
    $(".TribunalValue").html("<I>" + $Panel1.Conf.Tribunal.Control.find(":selected").text() + "</I>");

    $Panel1.Conf.Rit.Control.on("blur", function(){
        $(".RitValue").html("<I>" + $Panel1.Object.Rit + "</I>");
    });

    $Panel1.Conf.Tribunal.Control.on("blur", function(){
        $(".TribunalValue").html("<I>" + $Panel1.Conf.Tribunal.Control.find(":selected").text() + "</I>");
    });

}

function AgregarDocumento(){

    var $Modal = new Debris.Modals.YesNoModal({ 
        Title: "Nuevo Documento",
        YesText: "Guardar cambios", 
        NoText: "Descartar cambios",
        YesCallback: function(){
            $Panel1.Object.Demandantes = $NuevosDemandantesInDocumento;
            $DT.Create({ Bean: $Panel1.Object });
        },
        CloseCallback: function(){
            if($Panel1.IsModified){
                var $Exit = new Debris.Modals.YesNoModal({ 
                    Title: "Confirmación",
                    Text: "¿Desea salir sin guardar los cambios?", 
                    YesText: "Sí", 
                    NoText: "No",
                    NoCallback: $Modal.Show
                });
                $Exit.Show();
            }
        }
    });

    var $AddFormControlClass = function($New){
        if($New.Conf.Init){
            $New.Conf.Init();
            if($New.Conf.Table){
                $New.Conf.Table.addClass("table").css({ width: "100%" });
            }
        }else{
            $New.Conf.Control.addClass("form-control");
        }
    };

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({ Container: $Modal.Body });    

    $MainPanel
        .NewRow()
            .NewCell({ XS: 12, OnCreated: function($NewCell){ $Cell1 = $NewCell; } })
            .NewCell({ XS: 8, OnCreated: function($NewCell){ $Cell2 = $NewCell; } })

    $Modal.Show();

    var $Panel1 = new Debris.Misc.Bootstrap4Layout({ 
        Container: $Cell1,
        OnValidated: function(){
            // Provisorio, esto debería ser en una especie de "OnValueChanged"
            $Modal.Yes.attr({ disabled: !($Panel1.IsModified && $Panel1.Validation.IsValid) });
            console.log(!($Panel1.IsModified && $Panel1.Validation.IsValid));
            console.log("Validation");
        }
    });
    var $Panel2 = new Debris.Misc.Bootstrap4Layout({ Container: $Cell2 });

    $Panel1
        .NewRow()
        .NewCell({ XS: 4 })
            .NewLabel("Archivo")
        .NewCell({ XS: 6 })
            .NewDebris({ 
                Type: "Input_File", 
                Name: "File", 
                Args: { 
                    Title: "Archivo", 
                    Accept: "application/pdf", 
                    Validations: { 
                        FileType: { Types: ["pdf"] }, 
                        Required: { 
                            NoValidMsg: "Por favor, seleccione archivo"
                        }
                    }
                }
            })
            .NewCell({
                XS: 2, OnCreated: function($New){ $New.closest(".table-responsive").removeClass("table-responsive"); }
            }).Append(
                ($RemoveFileBtn = $("<Button Class='btn btn-xs btn-danger'></Button>").append( 
                    $("<Span>").attr({ Class: "fa fa-times" })
                ).css({ display: "none" }))
            )
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Empresa")
            .NewCell({ XS: 5 })
                .NewDebris({ 
                    Type: "Input_Select2",
                    Name: "Empresa",
                    OnCreated: $AddFormControlClass, 
                    Args: {
                        Title: "Empresa",
                        // Validations: { Required: {  } },
                        Values: [{ "Text": "Seleccionar", Value: "" }].concat($JsonContext.EmpresasValues),
                        Parent: $Modal.Body
                    }
                })
            .NewCell({ XS: 1 }).Append(
                $("<Div>").attr({ Class : "btn-group"}).append(
                    $("<Button>").attr({ Class: "btn btn-primary btn-xs" }).append($("<Span>").attr({ Class: "fa fa-plus" })).on("click", function(){
                        AgregarEmpresa(function($Res){
                            $Panel1.Conf.Empresa.Control.append($("<Option></Option>").attr({ value: $Res.Keys.Id }).append($Res.NewBean.RutEmpleador + ' - ' + $Res.NewBean.Nombre))
                            $Panel1.Object.Empresa = $Res.Keys.Id;
                            $Panel1.OnValidated();
                        }); 
                    }),

                    $BtnEditarEmpresa = $("<Button>")
                    .attr({ Class: "btn btn-primary btn-xs", disabled: true })
                    .append($("<Span>").attr({ Class: "fa fa-pencil" })).on("click", function(){ 
                        EditarEmpresaPorId($Panel1.Object.Empresa, function($Res){
                            $Panel1.Conf.Empresa.Control.find("option[value=" + $Res.NewBean.Id + "]").text($Res.NewBean.RutEmpleador);
                            $Panel1.Conf.Empresa.Control.select2("destroy");
                            $Panel1.Conf.Empresa.Control = $Panel1.Conf.Empresa.Control.select2({ dropdownParent: $Modal.Body });
                            //$Panel1.Conf.Empresa.Control.trigger("change");
                        });
                    })
                )
            )
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("RIT")
            .NewCell({ XS: 8 })
                .NewDebris({ Type: "Input_Text", Name: "Rit", OnCreated: $AddFormControlClass, Args: { Title: "Rit", Validations: { Required: {  }, Rit: {  } } } })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Tribunal")
            .NewCell({ 
                XS: 8, 
                OnCreated: function($New){ 
                    $New.removeClass("table-responsive"); 
                }
            })
            .NewDebris({
                Type: "Input_Select2",
                Name: "Tribunal",
                OnCreated: function($New){
                    $InitTribunal = function(){
                        $AddFormControlClass($New);
                    }
                },
                Args: { 
                    Values: [{ Text: "Seleccionar...", Value: "" }].concat($JsonContext.Columns.Tribunal.Values),
                    Parent: $Modal.Body,
                    Title: "Tribunal",
                    Validations: { Required: { NoValidMsg: "Por favor, seleccione Tribunal" } }
                }
            })

        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Clasificación")
            .NewCell({ XS: 8 })
                .NewDebris({
                    Type: "Input_Select2",
                    Name: "Clasificacion",
                    OnCreated: function($New){
                        $InitClasificacion = function(){
                            $AddFormControlClass($New);
                        }
                    },
                    Args: {
                        Values: $JsonContext.Columns.Clasificacion.Values,
                        Validations: { Required: { NoValidMsg: "Por favor, seleccione Clasificación" } },
                        Parent: $Modal.Body,
                    }
                })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Nombre Archivo")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Text", 
                    Name: "NombreArchivo", 
                    OnCreated: function($Options){ 
                        //$Options.Conf.Control.attr({ disabled: true });
                        $AddFormControlClass($Options);
                    },
                    Args: {
                        Title: "Nombre de Archivo",
                        Validations: { Required: {  } }
                    }
                })
        // .NewRow()
        //     .NewCell({ XS: 4 })
        //         .NewLabel("Fecha de Recepción")
        //     .NewCell({ XS: 8 })
        //         .NewDebris({ Type: "Input_Date", Name: "FechaRecepcion", OnCreated: $AddFormControlClass, Args: { ParentEl: "#" + $Modal.Id } })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Estado")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Select2",
                    Name: "EstadoDocumento",
                    OnCreated: function($New){
                        $InitEstadoDocumento = function(){
                            $AddFormControlClass($New);
                        }
                    },
                    Args: {
                        Values: $JsonContext.Columns.EstadoDocumento.Values,
                        Validations: { Required: { NoValidMsg: "Por favor, seleccione Estado" } },
                        Parent: $Modal.Body,
                    }
                })
        .NewRow()
            .NewCell({ XS: 4 })
                .NewLabel("Observaciones")
            .NewCell({ XS: 8 })
                .NewDebris({ 
                    Type: "Input_Text", 
                    Control: $("<Textarea>").attr({ rows: 5 }), 
                    Name: "Observaciones", 
                    OnCreated: $AddFormControlClass,
                })
    ;

    $Panel1.Conf.Empresa.Control.on("change", function(){
        if($Panel1.Object.Empresa){
            $BtnEditarEmpresa.attr({ disabled: false });
        }
    });

    $Cell2.css({ display: "none" });
    $Modal.Show();
    
    $Panel1.Init();
    $Panel1.Validation.Init();

    //console.log($Panel1);

    var $Animated = false;

    $Panel1.Conf.File.Control.on("change", function($Evt){
        
        if($Evt.target.files.length == 0){
            $Panel2Cell.html("No seleccionado");
            return;
        }

        if(!$Panel1.Conf.File.IsValid){
            $Panel2Cell.html("");
            return;
        }

        $Cell1.removeClass("col-12").addClass("col-5");
        $Cell2.css({ display: "" });

        if(!$Animated){
            $Modal.Body.closest(".modal-dialog").css({ "max-width": "50%" });
            $Modal.Body.closest(".modal-dialog").animate({ "max-width": "90%" }, 100, "linear");
            $Animated = true;
        }
        
        var $Url = URL.createObjectURL($Evt.target.files[0]);
        $Panel2Cell.html("").append(
            $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: $Url })
        );

        $Panel1.Object.NombreArchivo = $Evt.target.files[0].name;
    });

    var $Panel2Cell;
    $Panel2
        .NewRow()
        .NewCell({
            Xs: 12, 
            OnCreated: function($NewCell){
                $Panel2Cell = $NewCell;
                // var $Append;
                // if($Data.Url){
                //     $Append = $("<Embed></Embed>").attr({ width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id })
                // }else{
                //     $Append = $("<Label></Label>").append("No se ha ingresado un documento")
                // }
                // $NewCell.append($Append);
            }
        })
    ;

    $MainPanel
        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append(
                $("<H3></H3>")
                .append( ($NuevoDemandanteSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Nuevos Demandantes"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellDemandante.hasClass("collapsing")) return;
                    if($NuevoDemandanteSpan.hasClass("fa-caret-right")){
                        $NuevoDemandanteSpan.removeClass("fa-caret-right");
                        $NuevoDemandanteSpan.addClass("fa-caret-down");
                        $NuevoDemandanteSubTitle.animate({ opacity: 1 }, 200);
                        $CellDemandante.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                        $NotificacionDemandante.Container.parent().css({ display: "" });
                    }else{
                        $NuevoDemandanteSpan.addClass("fa-caret-right");
                        $NuevoDemandanteSpan.removeClass("fa-caret-down");
                        $NuevoDemandanteSubTitle.animate({ opacity: 0 }, 200);
                        $CellDemandante.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                        $NotificacionDemandante.Container.parent().css({ display: "none" });
                    }
                    $CellDemandante.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append( ($NuevoDemandanteSubTitle = $("<H7>").css({ opacity: 0 })).append("Agregar los siguientes demandantes a la demanda seleccionada (Rit <Text Class='RitValue'></Text> y Tribunal <Text Class='TribunalValue'></Text>)") )
        .NewRow()
            .NewCell({ XS: 12, OnCreated: function($NewCell){
                $CellDemandante = $NewCell;
            }})

        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append(
                $("<H3></H3>")
                .append( ($ListarDemandanteSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Demandantes"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellListarDemandante.hasClass("collapsing")) return;
                    if($ListarDemandanteSpan.hasClass("fa-caret-right")){
                        $ListarDemandanteSpan.removeClass("fa-caret-right");
                        $ListarDemandanteSpan.addClass("fa-caret-down");
                        $EliminarDemandantesBtn.animate({ opacity: 1 }, 200);
                        $ListarDemandanteSubTitle.animate({ opacity: 1 }, 200);
                        $CellListarDemandante.addClass("collapse").parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                        $CellListarDemandante.parent().next().addClass("form-group");
                        $EliminarDemandantesBtn.closest(".row").css({ display: "" });
                        //$CellListarDemandante.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $ListarDemandanteSpan.addClass("fa-caret-right");
                        $ListarDemandanteSpan.removeClass("fa-caret-down");
                        $EliminarDemandantesBtn.animate({ opacity: 0 }, 200);
                        $ListarDemandanteSubTitle.animate({ opacity: 0 }, 200);
                        $CellListarDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                        $CellListarDemandante.parent().next().removeClass("form-group");
                        $EliminarDemandantesBtn.closest(".row").css({ display: "none" });
                        //$CellListarDemandante.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $CellListarDemandante.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append( ($ListarDemandanteSubTitle = $("<H7>").css({ opacity: 0 })).append("Demandantes pertenecientes actualmente a la demanda seleccionada (Rit <Text Class='RitValue'></Text> y Tribunal <Text Class='TribunalValue'></Text>)") )
        .NewRow()
            .NewCell({ XS: 7 })
            .Append( 
                ($EliminarDemandantesBtn = $("<Button></Button>"))
                    .attr({ Class: "btn btn-primary", Id: "BtnDeleteDemandante", disabled: true })
                    .append("Eliminar demandantes seleccionados")
                    .on("click", DeleteSelectedDemandantes)
            )
            .NewCell({ XS: 3 })
            //.Append( $("<Button></Button>").attr({ Class: "btn btn-primary" }).append("Agregar Demandante").click(CrearDemandante) )
        .NewRow()
            .NewCell({ 
                XS: 12, 
                OnCreated: function($NewCell){
                    $NotificacionDemandante = new Debris.Components.Bootstrap.Notifications({ Container: $NewCell, Time: 5000 });
                }
            })
        .NewRow()
            .NewCell({ Xs: 12, OnCreated: function($NewCell){ $CellListarDemandante = $NewCell; } })
            .NewDebris({
                Type: "AjaxDataTable",
                Name: "TblDemandante",
                Args: {
                    Total: $JsonContext.DemandanteTotal
                    , Columns: $JsonContext.DemandanteCols
                    , ReadService: "/Demandante/Crud"
                    , CreateService: "/Demandante/Crud"
                    , UpdateService: "/Demandante/Crud"
                    , DeleteService: "/Demandante/Crud"
                    , ColumnTypes: {
                        // Inline_Checkbox: function($Options){
                        //     return "<Input Type='Checkbox' OnClick='$DemandaInlineCheckbox(this)'>";
                        // }
                    }
                    , NotificationPanel: $NotificacionDemandante
                    , OnDraw: $BlueHeader
                    , AjaxData: {
                        Demanda: -1
                    }
                },
                OnCreated: function($New){
                    $DemandanteDT = $New.Conf;
                    $InitDemandantes = function(){
                        $AddFormControlClass($New);
                        $DemandanteDT.Table.addClass("table-striped table-sm").css({ width: "100%" });
                    };
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .Append(
                $("<Hr>")
            )
            .NewRow()
            .NewCell({ XS: 4 })
            .Append(
                $("<H3>")
                .append( ($ListarDocumentosSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append("&nbsp;Documentos demanda")
                .css({ cursor: "pointer" }).on("click", function(){
                    if($CellListarDemandante.hasClass("collapsing")) return;
                    if($ListarDocumentosSpan.hasClass("fa-caret-right")){
                        $ListarDocumentosSpan.removeClass("fa-caret-right");
                        $ListarDocumentosSpan.addClass("fa-caret-down");
                        //$EliminarDemandantesBtn.animate({ opacity: 1 }, 200);
                        //$ListarDemandanteSubTitle.animate({ opacity: 1 }, 200);
                        // $ListarDocumentosCell.addClass("collapse").parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                        // $ListarDocumentosCell.parent().next().addClass("form-group");
                        //$EliminarDemandantesBtn.closest(".row").css({ display: "" });
                        //$ListarDocumentosCell.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $ListarDocumentosSpan.addClass("fa-caret-right");
                        $ListarDocumentosSpan.removeClass("fa-caret-down");
                        //$EliminarDemandantesBtn.animate({ opacity: 0 }, 200);
                        //$ListarDemandanteSubTitle.animate({ opacity: 0 }, 200);
                        // $ListarDocumentosCell.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                        // $ListarDocumentosCell.parent().next().removeClass("form-group");
                        //$EliminarDemandantesBtn.closest(".row").css({ display: "none" });
                        //$ListarDocumentosCell.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $ListarDocumentosCell.collapse("toggle");
                })
                
            )
        .NewRow()
            .NewCell({ Xs: 12, OnCreated: function($NewCell){ $ListarDocumentosCell = $NewCell; } })
            .NewDebris({
                Type: "AjaxDataTable",
                Name: "TblDocumentos",
                Args: {
                    Total: $JsonContext.Total
                    , Columns: { 
                        NombreArchivo: { Type: "Input_Text", Data: "NombreArchivo", Title: "Nombre de Archivo" },
                        FechaRecepcion: { Type: "Input_Text", Data: "FechaRecepcion", Title: "Fecha de Recepción" },
                        Clasificacion: { 
                            Type: $JsonContext.Columns.Clasificacion.Type, 
                            Data: $JsonContext.Columns.Clasificacion.Data, 
                            Title: $JsonContext.Columns.Clasificacion.Title, 
                            Values: $JsonContext.Columns.Clasificacion.Values
                        },
                        VistaPrevia: { Type: "AccionesDocumentoDemanda", Data: "VistaPrevia" }
                    }
                    , ReadService: "/Documento/Crud"
                    , UpdateService: "/Documento/Crud"
                    , AjaxData: {
                        Demanda: -1
                    }
                    , ColumnTypes: {
                        AccionesDocumentoDemanda: function($Ops){
                            if($Ops.Row.Url){
                                //$Append = $("<Embed></Embed>").attr({ width: "100%", height: "500px", src: "/Documento/Download" + "?Id=" + $Data.Id });
                                return "<Button OnClick='VistaPreviaDocumentoDemanda(this)' Class='btn btn-primary btn-xs'><span class='fa fa-search'></span></Button>";
                            }else{
                                //$Append = $("<Label></Label>").append("No se ha ingresado un documento")
                                return "&lt;Sin documento&gt;";
                            }
                            // if($Ops.Row.Url){
                            //     return "<Button OnClick='VistaPreviaDocumentoDemanda(this)' Class='btn btn-primary btn-xs'><span class='fa fa-search'></span></Button>";
                            // }else{
                            //     return "<Sin documento>";
                            // }
                        }
                    }
                    , OnDraw: $BlueHeader
                }
                , OnCreated: function($New){
                    $DocumentoDemandaDT = $New.Conf;
                    $InitInnerDocumento = function(){
                        $AddFormControlClass($New);
                        $DocumentoDemandaDT.Table.addClass("table-striped table-sm");
                    };
                }
            })
        ;

    var $AjxData = function(){
        return {
            data: { Rit: $Panel1.Object.Rit, Tribunal: $Panel1.Object.Tribunal }
            , type: "GET"
            , url: "Demanda/Crud"
            , success: function($Res){
                CloseWait();
                if($Res.Result == 0){
                    if($Res.Data.length){
                        $MainPanel.Conf.TblDemandante.AjaxData.Demanda = $Res.Data[0].Id;
                        $MainPanel.Conf.TblDocumentos.AjaxData.Demanda = $Res.Data[0].Id;
                        $MainPanel.Conf.TblDemandante.Search();
                        $MainPanel.Conf.TblDocumentos.Search();
                    }else{
                        $MainPanel.Conf.TblDemandante.AjaxData.Demanda = -1;
                        $MainPanel.Conf.TblDocumentos.AjaxData.Demanda = -1;
                        $MainPanel.Conf.TblDemandante.Search();
                        $MainPanel.Conf.TblDocumentos.Search();
                    }
                }else{
                    // Mostrar error
                }
            }
        };
    };

    $Panel1.Conf.Rit.Control.on("blur", function(){
        $(".RitValue").text($Panel1.Object.Rit);
        if( !($Panel1.Object.Rit == "" || $Panel1.Object.Tribunal == "") ){
            ShowWait();
            $.ajax($AjxData());
        }
    });
    $Panel1.Conf.Tribunal.Control.on("select2:close", function(){
        $(".TribunalValue").text($Panel1.Conf.Tribunal.Control.find("option:selected").text());
        if( !($Panel1.Object.Rit == "" || $Panel1.Object.Tribunal == "") ){
            ShowWait();
            $.ajax($AjxData());
        }
    });

    //$MainPanel.Init();
    $InitDemandantes();
    $InitInnerDocumento();

    $NuevoDemandanteSpan.addClass("fa-caret-right");
    $NuevoDemandanteSpan.removeClass("fa-caret-down");
    $NuevoDemandanteSubTitle.animate({ opacity: 0 }, 200);
    $CellDemandante.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
    $NotificacionDemandante.Container.parent().css({ display: "none" });    

    $ListarDemandanteSpan.addClass("fa-caret-right");
    $ListarDemandanteSpan.removeClass("fa-caret-down");
    $EliminarDemandantesBtn.animate({ opacity: 0 }, 200);
    $ListarDemandanteSubTitle.animate({ opacity: 0 }, 200);
    $CellListarDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
    $CellListarDemandante.parent().next().removeClass("form-group");
    $EliminarDemandantesBtn.closest(".row").css({ display: "none" });
    
    $ListarDocumentosCell.addClass("collapse");

    // $ListarDocumentosSpan.removeClass("fa-caret-right");
    //                     $ListarDocumentosSpan.addClass("fa-caret-down");

    $Modal.Yes.attr({ disabled: true });

    var $MainNuevoDemandante = new Debris.Misc.Bootstrap4Layout({ Container: $CellDemandante });
    var $Cell1NuevoDemandante;
    var $Cell2NuevoDemandante;

    $MainNuevoDemandante
        .NewRow({ 
            OnCreated: function($New){
                $New.Row.removeClass("form-group");
            } 
        })
        .NewCell({ XS: 4, OnCreated: function($NewCell){ $Cell1NuevoDemandante = $NewCell } })
        .NewCell({ XS: 8, OnCreated: function($NewCell){ $Cell2NuevoDemandante = $NewCell } })
    ;

    var $FormNuevoDemandante = new Debris.Misc.Bootstrap4Layout({ 
        Container: $Cell1NuevoDemandante,
        OnValidated: function(){
            $DemandanteAddBtn.attr({ disabled: !($FormNuevoDemandante.IsModified && $FormNuevoDemandante.Validation.IsValid) });    
        }
    });

    $FormNuevoDemandante
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewDebris({ 
            Type: "Input_Text"
            , Control: $("<Input>").attr({ Type: "hidden" })
            , Name: "Demanda"
            , Args: {
                Value: $CurrDemanda
            }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Rut:")
        .NewDebris({
        Type: "Input_Rut",
        OnCreated: function($New){
            $New.Conf.Control.addClass("form-control");
            // $New.Conf.Control.on("blur", function(){
            //     $PanelDemandante.Validation.Run();    
            // })
        },
        Name: "Rut",
        Args: {
            Title: "Rut",
            Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Rut</I>" },  Rut: { NoValidMsg: "Rut ingresado no válido" } }
        }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Nombre:")
        // [!] Crear NewInputText()
        .NewDebris({
            Type: "Input_Text", 
            OnCreated: function($New){
                $New.Conf.Control.addClass("form-control");
            },
            Name: "Nombre",
            Args: {
                Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Nombre</I>" } }
            }
        })
        .NewRow()
        .NewCell({ Xs: 12 })
        .NewLabel("Estado:")
        // [!] Crear NewInputText()
        .NewDebris({
            Type: "Input_Select", 
            OnCreated: function($New){
                $New.Conf.Control.addClass("form-control");
            },
            Name: "Estado",
            Args: $.extend({}, $JsonContext.DemandanteCols.Estado, { Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Estado</I>" } } })
        })
        .NewRow()
        .NewCell({ XS: 12 })
        .Append( ($DemandanteAddBtn = $("<Button>").addClass("btn btn-primary btn-sm").append( $("<Span>").addClass("fa fa-plus") )) )
        .Append( $("<Text>&nbsp;</Tex>") )
        .Append( ($DemandanteClearBtn = $("<Button>").addClass("btn btn-primary btn-sm").append( $("<Span>").addClass("fa fa-eraser") )) )
    ;

    $NuevosDemandantesInDocumento = [];
    var $IdNuevoDemandante = 0;

    $DemandanteAddBtn.on("click", function(){
        
        //console.log($Panel1.Object);
        $DemandanteAddBtn.attr({ disabled: true });

        var $AlreadyExistsModal = new Debris.Modals.OkModal({ 
            OkText: "Aceptar", 
            Text: "Ya existe un demandante con rut " + $FormNuevoDemandante.Object.Rut + " en esta demanda.",
            Title: "Validación"
        });

        var $Found = $NuevosDemandantesInDocumento.find(function($e){
            return $e.Rut == $FormNuevoDemandante.Object.Rut;
        });

        if($Found){
            $AlreadyExistsModal.Show();
            $DemandanteAddBtn.attr({ disabled: false });
            //CloseWait();
            return;
        }

        ShowWait();
        $.ajax({
            data: { Rit: ($Panel1.Object.Rit == "" ? -1:$Panel1.Object.Rit), Tribunal: ($Panel1.Object.Tribunal == "" ? -1:$Panel1.Object.Tribunal),/* Demanda: $Data.Demanda, */ Rut: $FormNuevoDemandante.Object.Rut },
            type: "GET",
            url: "/Demandante/Crud",
            success: function($Res){
                CloseWait();
                $DemandanteAddBtn.attr({ disabled: false });
                if($Res.Result == 0){
                    if($Res.Data.length){
                        $AlreadyExistsModal.Show();
                    }else{
                        var $NuevoDemandante = $.extend({}, $FormNuevoDemandante.Object, { Id: $IdNuevoDemandante++ });
                        $NuevosDemandantesInDocumento.push($NuevoDemandante);
                        $DTDemandanteInDocumento.row.add($NuevoDemandante).draw();
                        $Panel1.OnValidated();
                    }
                }
            }
        });
        
    });

    $DemandanteClearBtn.on("click", function(){
        $FormNuevoDemandante.Clear();
        $DemandanteAddBtn.attr({ disabled: true });
    });

    $DemandanteAddBtn.attr({ disabled: true });

    var $TblNuevosDemandantes = $("<Table>").addClass("table table-striped table-sm").css({ width: "100%" });

    $Cell2NuevoDemandante.append($TblNuevosDemandantes);

    $DTDemandanteInDocumento =  $TblNuevosDemandantes.DataTable({ 
        columns: [
            { title: "Rut", data: "Rut" }
            , { title: "Nombre", data: "Nombre" }
            , { 
                title: "Estado", 
                data: "Estado", 
                render: function($Data){
                    var $Found = $JsonContext.DemandanteCols.Estado.Values.find(function($e){ return $e.Value == $Data; });
                    return $Found.Text;
                }
            }
            , { data: "Id", render: function(){ return "<Button OnClick='QuitarDemandanteInDocumento(this)' Class='btn btn-danger btn-xs'><Span Class='fa fa-times'></Span></Button>"; } }
        ]
        , data: []
        , language: Debris.Misc.Lang.DataTable.Es
        , searching: false
    });

    $FormNuevoDemandante.Validation.Init();

    $CellDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");

}



