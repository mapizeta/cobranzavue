
$ColumnTypes.CasoDemandanteActions = function $CasoDemandanteActions($Conf) {
    return (
        "<Div Class='btn-group'>" +
        "   <Button OnClick='DetalleCasoDemandante(this)' Class='btn btn-primary btn-xs'>" +
        "       <i class='fa fa-search'></i>" +
        "   </Button>" +
        "   <Button OnClick='CobroCasoDemandante(this)' id='BtnCalculo' name='BtnCalculo' Class='btn btn-secondary btn-xs'> " +
        "       <i class='fa fa-dollar-sign'></i>" +
        "   </Button>" +
        "</Div>"
    );
}

function CobroCasoDemandante($Sender){

    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();

    $.ajax({
        data: {
            "FichaId": $Data.Ficha
        },
        type: "GET",
        url: "/DetalleCasoDemandante",
        success: function($Res){
            if($Res.Result == 0){
                $WireFrame = DrawWireFrameFicha($Res);
                SetWireFrameFichaValues($WireFrame, $.extend({}, $Res, { "Historial": $Data.Historial }));
                $WireFrame.Modal.Yes.css({ "display": "none" });
                $WireFrame.Modal.No.css({ "display": "none" });
            }
        }
    });

}

function DetalleCasoDemandante($Sender) {

    // Añade form-control si es form y table si es table
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

    // Seteo de TR y Global data que sera usado en la ventana de detalle
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data(); // @todo: este $Data deberían venir desde el analisis de sentencias
    $GlobalData = $Data;

    console.log("$Data", $Data);

    // Define el color del mensaje de error
    var HasError = false
    if ($Data.EstadoDemanda == 7 || $Data.EstadoDemanda == 6) {
        if ($Data.EstadoDemanda == 7) { var ErrorColor = "#ffb185"} else
        if ($Data.EstadoDemanda == 6) { var ErrorColor = "#effaa7"}
        HasError = true;
    }

    // Crea el model en donde estará contenida la form
    var $Modal = new Debris.Modals.YesNoModal({
        Title: "Detalle Registro",
        YesText: "Guardar cambios",
        NoText: "Descartar cambios",
        YesCallback: function(){
            if($MainPanel.Validation.IsValid){
                var $BeanToSend = $.extend({}, $MainPanel.Object, $PanelDte.Object);
                var $FinalBean = $.extend({}, $Data, $BeanToSend);

                console.log("BeanToSend", $BeanToSend)
                console.log("FinalBean", $FinalBean)

                $DT.Update({ Bean: $FinalBean });
                $Modal.Hide();
            }else{
                $MainPanel.Validation.Run();
            }
        },
        Large: true,
        CloseCallback: function(){
            if($MainPanel.IsModified) {
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

    // Creamos panel y le asignamos el modal como cuerpo
    var $MainPanel = new Debris.Misc.Bootstrap4Layout({
        Container: $Modal.Body,
        OnValidated: function(){
            $Modal.Yes.attr({ disabled: !($MainPanel.IsModified && $MainPanel.Validation.IsValid)});
        }
    });

    $CurrPanelDemandante = $MainPanel;
    var $InicioRelacionLaboral;
    var $CellPdf;
    var $CellDte;

    // Panel superior donde estan los datos basicos de la demanda
    $MainPanel
        .NewRow()
            .NewCell({ XS: 12 })
        .NewRow()
            .NewCell({ XS: 12 })
            .Append($("<H3>").append("Datos Caso"))
        .NewRow()
            .NewCell({ XS: 2 })
            .NewLabel("Rit")
            .NewDebris({ Type: "Input_Text", Name: "Rit", Args: { Value: $Data.Rit }, OnCreated: $AddFormControlClass })

            .NewCell({ XS: 3 })
            .NewLabel("Tribunal")
            .NewDebris({ Type: "Input_Select", Name: "Tribunal", Args: { Value: $Data.Tribunal, Values: $JsonContext.Columns.Tribunal.Values }, OnCreated: $AddFormControlClass })

            .NewCell({ XS: 3 })
            .NewLabel("Estado Demanda")
            .NewDebris({ Type: "Input_Select", Name: "EstadoDemanda", Args: { Value: $Data.EstadoDemanda, Values: $JsonContext.Columns.EstadoDemanda.Values }, OnCreated: $AddFormControlClass })

            .NewCell({ XS: 3})
            .NewLabel("Rut Empleador")
            .NewDebris({ Type: "Input_Text", Name: "RutEmpleador", Args: { Value: $Data.RutEmpleador }, OnCreated: $AddFormControlClass })

        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append($("<H3>").append("Datos Demandante")) // Datos Dte y Pdf
        .NewRow()
            .NewCell({ XS: 6, OnCreated: function($NewCell){ $CellDte = $NewCell; } })
            .NewCell({ XS: 6, OnCreated: function($NewCell){ $CellPdf = $NewCell; } })

        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )

        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<H3>").append("Documentos Demanda") )

        .NewRow()
            .NewCell({ Xs: 12 })
            .NewDebris({
                Type: "AjaxDataTable",
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
                        //Except: $Data.Id,
                        Demanda: $Data.DemandaId
                    }
                    , ColumnTypes: {
                        AccionesDocumentoDemanda: function($Ops){
                            if($Ops.Row.Url){
                                return "<Button OnClick='VistaPreviaDocumentoDemanda(this)' Class='btn btn-primary btn-xs'><span class='fa fa-search'></span></Button>";
                            }else{
                                return "<Sin documento>";
                            }
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

    ; // Fin del formato de $MainPanel

    console.log($Data.Clasificacion);

    $PanelDemandante = $MainPanel;
    $MainPanel.Init();
    $MainPanel.Validation.Init();
    $MainPanel.Validation.Run();

    $InitInnerDocumento();

    $MainPanel.Object.DemandanteId = $Data.DemandanteId;
    $MainPanel.Conf.Rit.Control.attr({ disabled: true }).addClass("disabled");
    $MainPanel.Conf.Tribunal.Control.attr({ disabled: true }).addClass("disabled");
    $MainPanel.Conf.EstadoDemanda.Control.attr({ disabled: true }).addClass("disabled");
    $MainPanel.Conf.RutEmpleador.Control.attr({ disabled: true }).addClass("disabled");
    $MainPanel.Object.Id = $Data.Id;

    console.log("$MainPanel", $MainPanel);

    // Renderizado
    $Modal.Show();

    // Panel que muestra el documento pdf
    var $PanelPdf = new Debris.Misc.Bootstrap4Layout({ Container: $CellPdf });
    console.log($CellPdf);
    var $CellEmbed;
    $PanelPdf
        .NewRow()
        .NewCell({
            Xs: 12,
            OnCreated: function($NewCell){
                $CellEmbed = $NewCell;
                var $Append;
                if($Data.Url){
                    $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: "CasoDemandante/Download" + "?Id=" + $Data.Documento_id });
                }else{
                    $Append = $("<Label></Label>").append("No se ha ingresado un documento");
                }
                $NewCell.append($Append);
            }
        })
    ;

    // Panel Principal que muestra los datos del demandante (Analisis de sentencias)
    // aqui habia un var $PanelDte, estoy probando algo distinto
    $PanelDte = new Debris.Misc.Bootstrap4Layout({
        Container: $CellDte,
        OnValidated: function(){
            $Modal.Yes.attr({ disabled: !($PanelDte.IsModified && $PanelDte.Validation.IsValid)});
        }
    });

    var $CellEmbedDte;
    var $InputWidth = 6;
    $PanelDte
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Rut")
            .NewDebris({
                Type: "Input_Rut",
                Name: "Rut", Args: { Value: $Data.Rut, Validations: { Rut: {  }, Title: "Rut" } },
                OnCreated: $AddFormControlClass
            })
            .NewCell({ XS: $InputWidth })
            .NewLabel("Inicio relación laboral")
            .NewDebris({
                Type: "Input_Date",
                Name: "InicioRelacionLaboral",
                OnCreated: function($New){
                    $InicioRelacionLaboral = $New.Conf;
                    $AddFormControlClass($New);
                },
                Args: {
                    Title: "Inicio relación laboral",
                    ParentEl: "#" + $Modal.Id,
                    Value: $Data.InicioRelacionLaboral
                }
            }) // ParentEl permite asignar un input como parent al elemento Debris
            // .NewCell({ XS: 6, OnCreated: function($NewCell){ $CellPdf = $NewCell; } })

        .NewRow() // ! REVISAR AQUI PARA EL ERROR DE PARENTEL
            .NewCell({ XS: $InputWidth })
            .NewLabel("Fin relación laboral")
            .NewDebris({
                Type: "Input_Date",
                OnCreated: $AddFormControlClass,
                Name: "FinRelacionLaboral",
                Args: {
                    Title: "Fin relación laboral",
                    ParentEl: "#" + $Modal.Id, Value: $Data.FinRelacionLaboral,
                    Validations: { DateGreaterThanRef: { Ref: $InicioRelacionLaboral } },
                    Value: $Data.FinRelacionLaboral
                }
            })
            .NewCell({ XS: $InputWidth })
            .NewLabel("Renta mensual")
            .NewDebris({Type: "Input_Money", Name: "RentaMensual", OnCreated: $AddFormControlClass, Args: { Title: "Renta Mensual", Value: $Data.RentaMensual } } )
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Semana Corrida")
            .NewDebris({Type: "Input_Money", Name: "SemanaCorrida", OnCreated: $AddFormControlClass, Args: { Title: "Renta Mensual", Value: $Data.SemanaCorrida } } )
            .NewCell({ XS: $InputWidth })
            .NewLabel("Horas extra")
            .NewDebris({Type: "Input_Money", Name: "HorasExtra", OnCreated: $AddFormControlClass, Args: { Title: "Renta Mensual", Value: $Data.HorasExtra } } )
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Estado Demandante")
            .NewDebris({
                Type: "Input_Select",
                Name: "EstadoDemandante_id",
                OnCreated: $AddFormControlClass,
                Args: { Value: $Data.EstadoDemandante, Values: [{ Text: "Seleccionar...", Value: "" }].concat($JsonContext.Columns.EstadoDemandante.Values), Validations: { Required: {} } }
            })

            .NewCell({ XS: $InputWidth })
            .NewLabel("Fecha Vigencia Pension")
            .NewDebris({
                Type: "Input_Date",
                OnCreated: $AddFormControlClass,
                Name: "FechaVigenciaPension",
                Args: {
                    Title: "Fecha Vigencia Pension",
                    ParentEl: "#" + $Modal.Id, Value: $Data.FechaVigenciaPension,
                    Value: $Data.FechaVigenciaPension
                }
            })
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Pensionado/a")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "Pensionado", /* OnCreated: $AddFormControlClass, */ Args: { Value: $Data.Pensionado } } )

            .NewCell({ XS: $InputWidth })
            .NewLabel("Empleada casa particular")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "EmpleadoCasaParticular",/* OnCreated: $AddFormControlClass, */ Args: { Value: $Data.EmpleadoCasaParticular } } )
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Convalidación")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "Convalidacion", Header: true, Inline: true, Args: { Value: $Data.Convalidacion } /* , OnCreated: $AddFormControlClass */ })

            .NewCell({ XS: $InputWidth })
            .NewLabel("Diferencia")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "Diferencia", /* OnCreated: $AddFormControlClass, */ Args: { Value: $Data.Diferencia } } )



        .NewRow() // Aqui va la observacion
            .NewCell({ XS: 4 })
                .NewLabel("Observaciones del caso")
            .NewCell({ XS: 8 })
                .NewDebris({
                    Type: "Input_Text",
                    Control: $("<Textarea>").attr({ rows: 2 }),
                    Name: "ObservacionCaso",
                    OnCreated: $AddFormControlClass,
                    Args: { Value: $Data.ObservacionCaso, Validations: { Title: "ObservacionCaso" } }
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

        // .NewRow()
        //     .NewCell({ XS: 3 })
        //     .Append($("<button class='btn btn-primary' onClick='LimpiarDataAnalisis()'>Limpiar Analisis</button>"))
    ;

    $PanelDte.Init();
    $PanelDte.Validation.Init();
    $PanelDte.Validation.Run();
    console.log("$PanelDte", $PanelDte);

    if (HasError) {
        $PanelDte.Conf.Error.Control.attr({ disabled: true }).css("background-color", ErrorColor);
        $PanelDte.Conf.FechaIngresoError.Control.attr({ disabled: true }).css("background-color", ErrorColor);
    } else {
        $PanelDte.Conf.Error.Control.attr({ disabled: true });
        $PanelDte.Conf.FechaIngresoError.Control.attr({ disabled: true });
    }

    // $PanelDte.Conf.FechaVigenciaPension.Control.attr({ disabled: true });
};

// function DetalleCasoDemandante($Sender){

//     var $Tr = $($Sender).closest("Tr");
//     var $Data = $DT.DataTable.row($Tr).data();

//     $WireFrame = DrawWireFrameDemandante($Data);
//     SetWireFrameDemandanteValues($WireFrame, $Data);

// }

function SetWireFrameFichaValues($WireFrame, $Defaults){

    // Panel Demanda
    $WireFrame.MainPanel.Conf.Rit.Value = $Defaults.Demanda.Rit;
    $WireFrame.MainPanel.Object.Rit = $Defaults.Demanda.Rit;
    // $WireFrame.MainPanel.Conf.Tribunal.Value = $Defaults.Demanda.Tribunal;
    // $WireFrame.MainPanel.Object.Tribunal = $Defaults.Demanda.Tribunal;
    $WireFrame.MainPanel.Conf.ObservacionCaso.Value = $Defaults.Demanda.ObservacionCaso;
    $WireFrame.MainPanel.Object.ObservacionCaso = $Defaults.Demanda.ObservacionCaso;
    $WireFrame.MainPanel.Conf.FechaVigenciaPension.Value = $Defaults.Demandante.FechaVigenciaPension || "N/A";
    $WireFrame.MainPanel.Object.FechaVigenciaPension = $Defaults.Demandante.FechaVigenciaPension || "N/A";
    $WireFrame.MainPanel.Object.MensajesIntegracion += ($WireFrame.MainPanel.Object.MensajesIntegracion ? "\n":"") + $.map($Defaults.DetalleFicha, function($e, $i){
        if(!$e.MontoUF){
            return "Falta valor de la UF para el mes de " + moment($e.Periodos, "YYYYMM").format("MMMM \\d\\e\\l YYYY");
        }
    }).reduce(($C, $N) => $C + ($C ? "\n":"") + $N, "");

    $WireFrame.MainPanel.Object.MensajesIntegracion += ($WireFrame.MainPanel.Object.MensajesIntegracion ? "\n":"") + $.map($.map($Defaults.DetalleFicha, function($e, $i){
        if(!$e.TopeUF){
            var $Year = moment($e[0], "YYYYMM").format("YYYY");
            return { [$Year]: "Falta tope en UF para el año " + $Year };
        }
    })
    .reduce( ($C, $N) => $C = { ...$C, ...$N }, {} ), ($e) => $e)
    .reduce( ($C, $N) => $C + ($C ? "\n":"") + $N, "" );

    if(moment($Defaults.Demandante.FechaVigenciaPension, "YYYY-MM-DD").isBefore(moment($Defaults.Demandante.InicioRelacionLaboral, "YYYY-MM-DD"))){
        $WireFrame.MainPanel.Object.MensajesIntegracion += ($WireFrame.MainPanel.Object.MensajesIntegracion ? "\n":"") + "Fecha de vigencia de pensión antes de inicio de relación laboral";
    }

    if($Defaults.Demandante.EmpleadoCasaParticular){
        if(moment($Defaults.Demandante.FinRelacionLaboral, "YYYY-MM-DD") < moment("2020-10-01", "YYYY-MM-DD")){
            $WireFrame.MainPanel.Object.MensajesIntegracion += ($WireFrame.MainPanel.Object.MensajesIntegracion ? "\n":"") + "Trabajador/a Casa Particular con término de relación laboral anterior a fecha legal 2020-10-01";
        }
    }
    $WireFrame.MainPanel.Conf.MensajesIntegracion.Value = $WireFrame.MainPanel.Object.MensajesIntegracion;

    $WireFrame.MainPanel.Conf.Diferencia.Value = $Defaults.Demandante.Diferencia;
    $WireFrame.MainPanel.Object.Diferencia = $Defaults.Demandante.Diferencia;
    $WireFrame.MainPanel.Conf.Convalidacion.Value = $Defaults.Demandante.Convalidacion;
    $WireFrame.MainPanel.Object.Convalidacion = $Defaults.Demandante.Convalidacion;
    $WireFrame.MainPanel.Conf.Pensionado.Value = $Defaults.Demandante.Pensionado;
    $WireFrame.MainPanel.Object.Pensionado = $Defaults.Demandante.Pensionado;
    $WireFrame.MainPanel.Conf.EmpleadoCasaParticular.Value = $Defaults.Demandante.EmpleadoCasaParticular;
    $WireFrame.MainPanel.Object.EmpleadoCasaParticular = $Defaults.Demandante.EmpleadoCasaParticular;

    // Panel trabajador
    $WireFrame.PanelDatosDemandante.Conf.Nombre.Value = $Defaults.Demandante.Nombre;
    $WireFrame.PanelDatosDemandante.Object.Nombre = $Defaults.Demandante.Nombre;
    $WireFrame.PanelDatosDemandante.Conf.Rut.Value = $Defaults.Demandante.Rut;
    $WireFrame.PanelDatosDemandante.Object.Rut = $Defaults.Demandante.Rut;
    $WireFrame.PanelDatosDemandante.Conf.RentaMensual.Value = $Defaults.Demandante.RentaMensual;
    $WireFrame.PanelDatosDemandante.Object.RentaMensual = $Defaults.Demandante.RentaMensual;
    $WireFrame.PanelDatosDemandante.Conf.InicioRelacionLaboral.Value = $Defaults.Demandante.InicioRelacionLaboral;
    $WireFrame.PanelDatosDemandante.Object.InicioRelacionLaboral = $Defaults.Demandante.InicioRelacionLaboral;
    $WireFrame.PanelDatosDemandante.Conf.FinRelacionLaboral.Value = $Defaults.Demandante.FinRelacionLaboral;
    $WireFrame.PanelDatosDemandante.Object.FinRelacionLaboral = $Defaults.Demandante.FinRelacionLaboral;

    // Panel empleador
    $WireFrame.PanelDatosEmpleador.Conf.RutEmpleador.Value = $Defaults.Empresa.RutEmpleador;
    $WireFrame.PanelDatosEmpleador.Object.RutEmpleador = $Defaults.Empresa.RutEmpleador;
    $WireFrame.PanelDatosEmpleador.Conf.Nombre.Value = $Defaults.Empresa.NombreRepresentante;
    $WireFrame.PanelDatosEmpleador.Object.Nombre = $Defaults.Empresa.NombreRepresentante;
    $WireFrame.PanelDatosEmpleador.Conf.RazonSocial.Value = $Defaults.Empresa.RazonSocial;
    $WireFrame.PanelDatosEmpleador.Object.RazonSocial = $Defaults.Empresa.RazonSocial;
    $WireFrame.PanelDatosEmpleador.Conf.NombreComuna.Value = $Defaults.ComunaEmpresa.Nombre;
    $WireFrame.PanelDatosEmpleador.Object.NombreComuna = $Defaults.ComunaEmpresa.Nombre;

    console.log($Defaults);

    $WireFrame.DTHistorial.rows.add($Defaults.Historial).draw();
    $WireFrame.DTCobro.rows.add($Defaults.DetalleFicha).draw();


}

function SetWireFrameDemandanteValues($WireFrame, $Values){

    // Main panel
    $WireFrame.MainPanel.Conf.Rit.Value = $Values.Rit;
    $WireFrame.MainPanel.Object.Rit = $Values.Rit;
    // $WireFrame.MainPanel.Conf.Tribunal.Value = $Values.Tribunal;
    // $WireFrame.MainPanel.Object.Tribunal = $Values.Tribunal;
    $WireFrame.MainPanel.Conf.NombreTribunal.Value = $Values.Tribunal;
    $WireFrame.MainPanel.Object.NombreTribunal = $Values.Tribunal;
    $WireFrame.MainPanel.Conf.EstadoDemanda.Value = $Values.EstadoDemanda;
    $WireFrame.MainPanel.Object.EstadoDemanda = $Values.EstadoDemanda;
    $WireFrame.MainPanel.Conf.RutEmpleador.Value = $Values.RutEmpleador;
    $WireFrame.MainPanel.Object.RutEmpleador = $Values.RutEmpleador;

    // Panel Demandante
    $WireFrame.PanelDemandante.Conf.Rut.Value = $Values.Rut;
    $WireFrame.PanelDemandante.Object.Rut = $Values.Rut;
    $WireFrame.PanelDemandante.Conf.InicioRelacionLaboral.Value = $Values.InicioRelacionLaboral;
    $WireFrame.PanelDemandante.Object.InicioRelacionLaboral = $Values.InicioRelacionLaboral;
    $WireFrame.PanelDemandante.Conf.FinRelacionLaboral.Value = $Values.FinRelacionLaboral;
    $WireFrame.PanelDemandante.Object.FinRelacionLaboral = $Values.FinRelacionLaboral;
    $WireFrame.PanelDemandante.Conf.RentaMensual.Value = $Values.RentaMensual;
    $WireFrame.PanelDemandante.Object.RentaMensual = $Values.RentaMensual;
    $WireFrame.PanelDemandante.Conf.SemanaCorrida.Value = $Values.SemanaCorrida;
    $WireFrame.PanelDemandante.Object.SemanaCorrida = $Values.SemanaCorrida;
    $WireFrame.PanelDemandante.Conf.HorasExtra.Value = $Values.HorasExtra;
    $WireFrame.PanelDemandante.Object.HorasExtra = $Values.HorasExtra;
    $WireFrame.PanelDemandante.Conf.EstadoDemandante_id.Value = $Values.EstadoDemandante;
    $WireFrame.PanelDemandante.Object.EstadoDemandante_id = $Values.EstadoDemandante;
    $WireFrame.PanelDemandante.Conf.FechaVigenciaPension.Value = $Values.FechaVigenciaPension;
    $WireFrame.PanelDemandante.Object.FechaVigenciaPension = $Values.FechaVigenciaPension;
    $WireFrame.PanelDemandante.Conf.Pensionado.Value = $Values.Pensionado;
    $WireFrame.PanelDemandante.Object.Pensionado = $Values.Pensionado;
    $WireFrame.PanelDemandante.Conf.EmpleadoCasaParticular.Value = $Values.EmpleadoCasaParticular;
    $WireFrame.PanelDemandante.Object.EmpleadoCasaParticular = $Values.EmpleadoCasaParticular;
    $WireFrame.PanelDemandante.Conf.Convalidacion.Value = $Values.Convalidacion;
    $WireFrame.PanelDemandante.Object.Convalidacion = $Values.Convalidacion;
    $WireFrame.PanelDemandante.Conf.Diferencia.Value = $Values.Diferencia;
    $WireFrame.PanelDemandante.Object.Diferencia = $Values.Diferencia;
    $WireFrame.PanelDemandante.Conf.ObservacionCaso.Value = $Values.ObservacionCaso;
    $WireFrame.PanelDemandante.Object.ObservacionCaso = $Values.ObservacionCaso;
    $WireFrame.PanelDemandante.Conf.Error.Value = $Values.ErrorMsg;
    $WireFrame.PanelDemandante.Object.Error = $Values.ErrorMsg;
    $WireFrame.PanelDemandante.Conf.FechaIngresoError.Value = $Values.FechaIngresoError;
    $WireFrame.PanelDemandante.Object.FechaIngresoError = $Values.FechaIngresoError;

    // $WireFrame.MainPanel.Init();
    // $WireFrame.MainPanel.Validation.Init();
    // $WireFrame.MainPanel.Validation.Run();

}

function DrawWireFrameFicha($Data){

    // Comportamiento de botones "Recrear ficha" y "Recalcular Ficha"
    let disabledButtonRecrearFicha = estadoBtnRecrearFicha($Data.Ficha.Estado);
    let disabledButtonRecalcularFicha = estadoBtnRecalcularFicha($Data.Ficha.Estado);

    var $WireFrame = {};

    var $Modal = new Debris.Modals.YesNoModal({
        Title: "Ficha demanda laboral con sentencia ejecutoriada",
        YesText: "Guardar cambios",
        NoText: "Descartar cambios",
        YesCallback: function(){
            dataTabla = tabla.rows().data();
            // console.log($Modal);
            // console.log("MainPanel", $MainPanel.Conf.Empresas.Value);

            $.ajax({
                url : '/SaveHojaCalculo',
                type : 'POST',
                dataType: "json",
                data : {
                    'Datos':JSON.stringify(Array.from(dataTabla)),
                    'DemandanteId' :$Data.Id,
                    'CasoData' : JSON.stringify($Data),
                    'EEJJ': $MainPanel.Object.Empresas,
                    csrfmiddlewaretoken : Token
                },
                success : function($Res) {
                    var $MsgModal = new Debris.Modals.OkModal({
                        Title: "Resultado",
                        Text: $Res.Msg,
                        OkText: "Aceptar"
                    });
                    if($Res.Result == 0){
                        $MsgModal.Body.html("Se ha guardado correctamente esta ficha");
                    }
                    $MsgModal.Show();
                    console.log($MsgModal);
                },
                error : function(xhr, status) {
                    console.log('Disculpe, existió un problema');
                },
                complete : function(xhr, status) {
                    console.log('Petición realizada');
                    $DT.Search($SearchPanel.Object);
                }
            });
        },
        Large: true,
        // TODO / BUG : Aqui esta preguntando si deseo guardar cambios a pesar de que no he cambiado nada,
        // siempre se activa este prop
        CloseCallback: function(){
            if($MainPanel.IsModified) {
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

    $WireFrame.Modal = $Modal;
    $Modal.Body.closest(".modal-dialog").css({ "max-width": "90%" });
    $Modal.Show();

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({
        Container: $Modal.Body,
        OnValidated: function(){
            $Modal.Yes.attr({ disabled: !($MainPanel.IsModified && $MainPanel.Validation.IsValid)});
        }
    });

    $WireFrame.MainPanel = $MainPanel;

    $MainPanel
        .NewRow()
            .NewCell({ xs: 2})
            .NewLabel("Rit")
            .NewDebris({
                Type: "Input_Text",
                Name: "Rit",
                // Args: { Value: $Data.Rit },
                OnCreated: $AddFormControlClass
            })
            .NewCell({ xs: 3 })
            .NewLabel("Tribunal")
            .NewDebris({
                Type: "Input_Text",
                Name: "NombreTribunal",
                Args: { Value: $Data.Tribunal.NombreCompleto },
                OnCreated: $AddFormControlClass
            })
            .NewCell({ xs: 3 })
            .NewLabel("Empresa de cobranza")
            .NewDebris({
                Type: "Input_Select",
                Name: "EmpresaCobranza",
                Args: {
                    Value: $Data.EmpresaCobranza.Id,
                    Values: $.map($Data.EmpresasCobranza, function($e, $i){
                        return { Text: $e.Nombre, Value: $e.Id };
                    })
                },
                OnCreated: $AddFormControlClass
            })

        .NewRow()
            .NewCell({ xs: 5 })
            .NewLabel("Observaciones del caso")
            .NewDebris({
                Type: "Input_Text",
                Control: $("<Textarea>").attr({ rows: 2 }),
                Name: "ObservacionCaso",
                // Args: { Value: $Data.ObservacionCaso },
                OnCreated: $AddFormControlClass
            })

            .NewCell({ xs: 1 })
            .NewLabel("Diferencia")
            .Append("<Br>")
            .NewDebris({
                Type: "Input_Checkbox",
                Name: "Diferencia",
                // Args: { Value : $Data.Diferencia }
            })

            .NewCell({ xs: 1 })
            .NewLabel("Convalidacion")
            .Append("<Br>")
            .NewDebris({
                Type: "Input_Checkbox",
                Name: "Convalidacion",
                // Args: { Value : $Data.Convalidacion }
            })

            .NewCell({ xs: 1 })
            .NewLabel("Pensionado")
            .Append("<Br>")
            .NewDebris({
                Type: "Input_Checkbox",
                Name: "Pensionado",
                // Args: { Value : $Data.Pensionado }
            })

            .NewCell({ xs: 2 })
            .NewLabel("Emplead@ casa particular")
            .Append("<Br>")
            .NewDebris({
                Type: "Input_Checkbox",
                Name: "EmpleadoCasaParticular",
                // Args: { Value : $Data.EmpleadoCasaParticular }
            })

        .NewRow()
            .NewCell({ xs: 2})
            .NewLabel("Fecha Vig. Pension")
            .NewDebris({
                Type: "Input_Text",
                Name: "FechaVigenciaPension",
                // Args: { Value: $Data.FechaVigenciaPension },
                OnCreated: $AddFormControlClass
            })

            .NewCell({ Xs: 3 })
            .NewLabel("Mensajes de integración")
            .NewDebris({
                Type: "Input_Text",
                Control: $("<Textarea>").attr({ rows: 5 }),
                Name: "MensajesIntegracion",
                Args: { Value: [...($Data.MensajesIntegracion || [])].reduce( ($C, $N) => $C + ($C == "" ? "":"\n\n") + $N, "" ) },
                OnCreated: $AddFormControlClass
            })
            .NewCell({ xs: 2})
            .NewLabel("Inicio Relacion Laboral")
            .NewDebris({
                Type: "Input_Text",
                Name: "InicioRelacionLaboral",
                Args: { Value: $Data.Demandante.InicioRelacionLaboral },
                OnCreated: $AddFormControlClass
            })
            .NewCell({ xs: 2})
            .NewLabel("Fin Relacion Laboral")
            .NewDebris({
                Type: "Input_Text",
                Name: "FinRelacionLaboral",
                Args: { Value: $Data.Demandante.FinRelacionLaboral },
                OnCreated: $AddFormControlClass
            })

        .NewRow()
            .NewCell({ xs: 12 })
            .Append(
                $("<Button>")
                    .attr({
                        Class: "btn btn-primary mr-4",
                        Id: "BtnDeleteFicha",
                        disabled: disabledButtonRecrearFicha,
                    })
                    .append("Recrear ficha")
                    .append($("<Span>").addClass("fas fa-undo-alt ml-2"))
                    .on("click", function () {
                        confirmDeleteFicha($Data.Ficha.Id, $Data.Demandante.Id, $Data.Demanda.Id, $Modal);
                    })
            )
            .Append(
                $("<Button>")
                    .attr({
                        Class: "btn btn-primary",
                        Id: "BtnReprocessFicha",
                        disabled: disabledButtonRecalcularFicha,
                    })
                    .append("Recalcular ficha")
                    .append($("<Span>").addClass("fa fa-sync-alt ml-2"))
                    .on("click", function () {
                        confirmReprocessFicha($Data.Ficha.Id, $Modal)
                    })
                )

        .NewRow()
            .NewCell({ xs: 12 })
            .Append($("<br>"))

        .NewRow()
            .NewCell({xs: 12})
            .Append(
                $("<h4></h4>")
                .append(($DatosHistorialSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Historial Ficha"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellHistorial.hasClass("collapsing")) return;
                    if($DatosHistorialSpan.hasClass("fa-caret-right")){
                        $DatosHistorialSpan.removeClass("fa-caret-right");
                        $DatosHistorialSpan.addClass("fa-caret-down");
                        $CellHistorial.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $DatosHistorialSpan.addClass("fa-caret-right");
                        $DatosHistorialSpan.removeClass("fa-caret-down");
                        $CellHistorial.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $CellHistorial.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12, OnCreated: function($NewCell){
                $CellHistorial = $NewCell;
            }})
        .NewRow()
            .NewCell({ xs: 12})
            .Append($("<br>"))
        .NewRow()
            .NewCell({xs: 12})
            .Append(
                $("<h4></h4>")
                .append(($DatosDemandanteSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Datos trabajador"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellDemandante.hasClass("collapsing")) return;
                    if($DatosDemandanteSpan.hasClass("fa-caret-right")){
                        $DatosDemandanteSpan.removeClass("fa-caret-right");
                        $DatosDemandanteSpan.addClass("fa-caret-down");
                        $CellDemandante.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $DatosDemandanteSpan.addClass("fa-caret-right");
                        $DatosDemandanteSpan.removeClass("fa-caret-down");
                        $CellDemandante.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $CellDemandante.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12, OnCreated: function($NewCell){
                $CellDemandante = $NewCell;
            }})
        .NewRow()
            .NewCell({ xs: 12})
            .Append($("<br>"))

        .NewRow()
            .NewCell({xs: 12})
            .Append(
                $("<h4></h4>")
                .append(($DatosEmpleadorSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Datos Empleador"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellEmpleador.hasClass("collapsing")) return;
                    if($DatosEmpleadorSpan.hasClass("fa-caret-right")){
                        $DatosEmpleadorSpan.removeClass("fa-caret-right");
                        $DatosEmpleadorSpan.addClass("fa-caret-down");
                        $CellEmpleador.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $DatosEmpleadorSpan.addClass("fa-caret-right");
                        $DatosEmpleadorSpan.removeClass("fa-caret-down");
                        $CellEmpleador.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $CellEmpleador.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12, OnCreated: function($NewCell){
                $CellEmpleador = $NewCell;
            }})
        .NewRow()
            .NewCell({ xs: 12})
            .Append($("<br>"))
        .NewRow()
        //     .NewCell({ xs: 12 })
        //     .Append($("<h3></h3>"))
        //     .Append($TableCobro)
        .NewRow()
            .NewCell({ Xs: 12})
            .Append(
                $("<h4></h4>")
                .append(($DatosFichaSpan = $("<Span>")).addClass("fa fa-caret-right") )
                .append(
                    "&nbsp;Ficha"
                ).css({ cursor: "pointer" }).on("click", function(){
                    if($CellFicha.hasClass("collapsing")) return;
                    if($DatosFichaSpan.hasClass("fa-caret-right")){
                        $DatosFichaSpan.removeClass("fa-caret-right");
                        $DatosFichaSpan.addClass("fa-caret-down");
                        $CellFicha.parent().addClass("form-group").prev().addClass("form-group").prev().addClass("form-group");
                    }else{
                        $DatosFichaSpan.addClass("fa-caret-right");
                        $DatosFichaSpan.removeClass("fa-caret-down");
                        $CellFicha.parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
                    }
                    $CellFicha.collapse("toggle");
                })
            )
        .NewRow()
            .NewCell({ XS: 12, OnCreated: function($NewCell){
                $CellFicha = $NewCell;
            }})
        ;

        // $MainPanel.Init();
        // $MainPanel.Validation.Init();
        // $MainPanel.Validation.Run();

        var $PanelDatosDemandante = new Debris.Misc.Bootstrap4Layout({ Container: $CellDemandante});
        $WireFrame.PanelDatosDemandante = $PanelDatosDemandante;

        $PanelDatosDemandante
            .NewRow()
                .NewCell({ xs: 3})
                .NewLabel("Nombre del trabajador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Nombre",
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 2})
                .NewLabel("Rut trabajador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Rut",
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ Xs: 2})
                .NewLabel("Renta Mensual")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "RentaMensual",
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ Xs: 2})
                .NewLabel("Inicio Relación Laboral")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "InicioRelacionLaboral",
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ Xs: 2})
                .NewLabel("Fin Relación Laboral")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "FinRelacionLaboral",
                    OnCreated: $AddFormControlClass
                })
        ;

        var $PanelDatosEmpleador = new Debris.Misc.Bootstrap4Layout({ Container: $CellEmpleador});
        $WireFrame.PanelDatosEmpleador = $PanelDatosEmpleador;

        $PanelDatosEmpleador
            .NewRow()
                .NewCell({ xs: 2})
                .NewLabel("Rut empleador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "RutEmpleador",
                    // Args: { Value: $Data.RutEmpleador },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 3})
                .NewLabel("Nombre empleador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Nombre",
                    Args: {
                        // Value: EmpresaData.Nombre
                    },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 3})
                .NewLabel("Razón social empleador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "RazonSocial",
                    Args: {
                        // Value: EmpresaData.RazonSocial
                    },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 2})
                .NewLabel("Comuna")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "NombreComuna",
                    Args: {
                        // Value: EmpresaData.NombreComuna
                    },
                    OnCreated: $AddFormControlClass
                })
        ;

        $MainPanel.Init();
        $MainPanel.Validation.Init();

        $PanelDatosDemandante.Init();
        $PanelDatosDemandante.Validation.Init();

        $PanelDatosEmpleador.Init();
        $PanelDatosEmpleador.Validation.Init();

        $CellDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
        $CellDemandante.parent().next().removeClass("form-group");

        $CellEmpleador.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
        $CellEmpleador.parent().next().removeClass("form-group");

        $CellHistorial.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
        $CellHistorial.parent().next().removeClass("form-group");

        $CellFicha.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
        $CellFicha.parent().next().removeClass("form-group");

        var $TableHistorial = $("<Table>").css({ width: "100%" }).addClass("table table-hover table-striped table-condensed table-sm");
        $CellHistorial.append($TableHistorial);
        $TableHistorial.on("draw.dt", $BlueHeader);
        $WireFrame.TableHistorial = $TableHistorial;

        var $TableCobro = $("<Table>").addClass("table table-striped table-sm").css({ width: "100%" });
        $TableCobro.append(
            "<TFoot>" +
            "   <Td>" +
            // "       <Button id='addRow' class='btn btn-primary'>Agregar nueva fila</Button> " +
            "   </Td>" +
            "   <Td></Td>" +
            "   <Td></Td>" +
            "   <Td></Td>" +
            "   <Td></Td>" +
            "   <Td></Td>" +
            "   <Td></Td>" +
            "   <Td></Td>" +
            "   <Td></Td>" +
            "</TFoot>"
        );
        $CellFicha.append($TableCobro);
        $TableCobro.on("draw.dt", $BlueHeader);
        $WireFrame.DTCobro = $TableCobro.DataTable({
            lengthMenu: [10, 25, 50, 100, 500, 1000],
            pageLength: 1000,
            columns: [
                {
                    title: "Periodos Demandados",
                    data: "Periodos",
                    mRender : function(data) {
                        return `<text id="0" onClick='EditarMonto(this)'>${data}</text>`;
                    }
                },
                {
                    title: "Estado",
                    data: "Estado",
                    mRender : function(data, type,row){
                        return `<text id="1" onClick='EditEstadoFila(this)'>${data}</text>`;
                    }
                },
                {
                    title: "Renta Imponible" ,className: "text-right",
                    data: "Renta",
                    mRender: function(data, type, row) {
                        if(row[10] && row[11]){
                            data = parseInt(Math.min(data, row[9]))
                        }
                        return `<text id="2" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;

                    }
                },
                {
                    title: "Pagado",
                    data: "PeriodoPagado",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        return `<text id="3" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;
                    }
                },
                {
                    title: "Cobrado",
                    data: "PeriodoCobrado",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        return `<text id="4" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;
                    }
                },
                {
                    title: "Deuda",
                    data: "PeriodoDeuda",
                    className: "text-right",
                    mRender: function(data, type, row) {

                        return "$" + new Intl.NumberFormat("de-DE").format(data);

                        var result;

                        var $RentaOTope;
                        // Si tiene Monto UF y monto tope en UF, chequear si usar eso o la renta
                        if(row[10] && row[11]){
                            $RentaOTope = Math.min(row[2], row[9]);
                        }else{
                            // Sino, la renta
                            $RentaOTope = row[2];
                        }

                        // Si tiene cobrado o pagado, entonces la deuda es cero
                        if(row[3] || row[4]){
                            result = 0;
                        }else{
                            // Sino, deuda es igual a Renta.
                            result = row[2];
                        }

                        // if(row[10] && row[11]){
                        //     result = parseInt(Math.min(row[2], row[9])) - parseInt(row[3]) - parseInt(row[4]);
                        // }else{
                        //     result = parseInt(row[2]) - parseInt(row[3]) - parseInt(row[4]);
                        // }
                        row[5] = result;
                        return `<text>$${new Intl.NumberFormat("de-DE").format(result)}</text>`;
                    }
                },
                {
                    title: "Empleador",
                    data: "AporteEmpleador",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        return "$" + new Intl.NumberFormat("de-DE").format(data);
                        let deuda = CalculoDeuda(row[2], row[3], row[4]);
                        let result = CalculoEmpleador(deuda);
                        // if(result < 0){
                        //     result = 0;
                        // }
                        row[6] = result;
                        return `<text>$${new Intl.NumberFormat("de-DE").format(Math.round(result))}</text>`;
                    }
                },
                {
                    title: "Afiliado",
                    data: "AporteAfiliado",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        return "$" + new Intl.NumberFormat("de-DE").format(data);
                        let deuda = CalculoDeuda(row[2], row[3], row[4]);
                        let result = CalculoAfiliado(deuda);
                        row[7] = result;
                        return `<text>$${new Intl.NumberFormat("de-DE").format(Math.round(result))}</text>`;
                    }
                },
                {
                    title: "Deuda nominal",
                    data: "DeudaNominal",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        return "$" + new Intl.NumberFormat("de-DE").format(data);
                        let deuda = CalculoDeuda(row[2], row[3], row[4]);
                        let empleador = CalculoEmpleador(deuda);
                        let afiliado = CalculoAfiliado(deuda);
                        let result = CalculoNominal(empleador, afiliado);
                        row[8] = result;
                        return `<text>$${new Intl.NumberFormat("de-DE").format(Math.round(result))}</text>`;
                    }
                }
                // ,{
                //     render: function(){
                //         return "";
                //         // return "<Button OnClick='DemandanteRemove(this)' Class='btn btn-xs btn-danger'><Span Class='fa fa-times'></Span></Button>";
                //     }
                // }
            ],
            data: [],
            language: Debris.Misc.Lang.DataTable.Es,
            searching: true,
            paging: true,
            footerCallback: function (row, data, start, end, display) {

                // Setea y calcula los totales de las columnas seleccionadas
                var api = this.api();

                function totalVertical(i) {
                    return new Intl.NumberFormat("de-DE").format(
                        api
                        .column(i)
                        .data()
                        .reduce( function (a, b) {
                            return (a + b);
                        }, 0)
                    )
                };

                // Update footer
                $( api.column( 5 ).footer() ).html('<b>Total: </b>$'+ totalVertical(5));
                $( api.column( 6 ).footer() ).html('<b>Total: </b>$'+ totalVertical(6));
                $( api.column( 7 ).footer() ).html('<b>Total: </b>$'+ totalVertical(7));
                $( api.column( 8 ).footer() ).html('<b>Total: </b>$'+ ( totalVertical(8) < 0 ? 0: totalVertical(8) ));

            }
        });

        $TableCobro.removeClass('no-footer');

        $WireFrame.DTHistorial = $TableHistorial.DataTable({
            columns: [
                {
                    title: "Estado",
                    data: "Estado_id",
                    render: function($Data){

                        switch($Data){
                            case 10:
                                return "Creada";
                            case 20:
                                return "Pendiente de Sincronizacion";
                            case 21:
                                return "Pendiente de Sincronizacion Demandante";
                            case 22:
                                return "Pendiente de Sincronizacion Empresa";
                            case 23:
                                return "Pendiente de Sincronizacion Pago";
                            case 24:
                                return "Pendiente de Sincronizacion Deuda";
                            case 30:
                                return "Sincronizada";
                            case 31:
                                return "Demandante Sincronizado";
                            case 32:
                                return "Empresa Sincronizada";
                            case 33:
                                return "Pago Sincronizado";
                            case 34:
                                return "Deuda Sincronizado";
                            case 40:
                                return "Error de Sincronizacion Afc";
                            case 41:
                                return "Error de Afc al Sincronizar Demandante";
                            case 42:
                                return "Error de Afc al Sincronizar Empresa";
                            case 43:
                                return "Error de Afc al Sincronizar Pago";
                            case 44:
                                return "Error de Afc al Sincronizar Deuda";
                            case 50:
                                return "Error de Sincronización St";
                            case 51:
                                return "Error de St al Sincronizar Demandante";
                            case 52:
                                return "Error de St al Sincronizar Empresa";
                            case 53:
                                return "Error de St al Sincronizar Pago";
                            case 54:
                                return "Error de St al Sincronizar Deuda";
                            case 60:
                                return "Descargado";
                            case 70:
                                return "Terminada";
                            case 80:
                                return "Error de reglas";
                            case 90:
                                return "Revisión manual";

                        }

                        return $Data;
                    }
                },
                {
                    title: "Fecha",
                    data: "Fecha",
                    render: function($Data, $Type, $Row){
                        return $Data;
                    }
                },
                {
                    title: "Usuario",
                    data: "Usuario",
                    render: function($Data, $Type, $Row){
                        return $Data || "Sistema";
                    }
                }
            ],
            // data: $Data.Historial,
            language: Debris.Misc.Lang.DataTable.Es
        });

        $MainPanel.Conf.Rit.Control.attr({ disabled: true }).addClass("disabled");
        // $MainPanel.Conf.Tribunal.Control.attr({ disabled: true }).addClass("disabled");
        $MainPanel.Conf.NombreTribunal.Control.attr({ disabled: true }).addClass("disabled");
        $MainPanel.Conf.ObservacionCaso.Control.attr({ disabled: true }).addClass("disabled");
        $MainPanel.Conf.FechaVigenciaPension.Control.attr({ disabled: true }).addClass("disabled");

        $MainPanel.Conf.EmpleadoCasaParticular.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.Diferencia.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.Pensionado.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.InicioRelacionLaboral.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.FinRelacionLaboral.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.Convalidacion.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.EmpleadoCasaParticular.Control.attr({ disabled : true }).addClass("disabled");

        // Inputs Dte
        $PanelDatosDemandante.Conf.Nombre.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosDemandante.Conf.Rut.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosDemandante.Conf.RentaMensual.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosDemandante.Conf.InicioRelacionLaboral.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosDemandante.Conf.FinRelacionLaboral.Control.attr({ disabled: true }).addClass("disabled");

        // Imputs panel empleador
        $PanelDatosEmpleador.Conf.RutEmpleador.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosEmpleador.Conf.RazonSocial.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosEmpleador.Conf.Nombre.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosEmpleador.Conf.NombreComuna.Control.attr({ disabled: true }).addClass("disabled");

        $MainPanel.Conf.MensajesIntegracion.Control.attr({ disabled: true }).addClass("disabled");

        return $WireFrame;

}

function DrawWireFrameDemandante(){

    var $WireFrame = {};

    var $Modal = new Debris.Modals.YesNoModal({
        Title: "Detalle Registro",
        YesText: "Guardar cambios",
        NoText: "Descartar cambios",
        YesCallback: function(){
            if($MainPanel.Validation.IsValid){
                var $BeanToSend = $.extend({}, $MainPanel.Object, $PanelDemandante.Object);
                var $FinalBean = $.extend({}, $Data, $BeanToSend);

                console.log("BeanToSend", $BeanToSend)
                console.log("FinalBean", $FinalBean)

                $DT.Update({ Bean: $FinalBean });
                $Modal.Hide();
            }else{
                $MainPanel.Validation.Run();
            }
        },
        Large: true,
        CloseCallback: function(){
            if($MainPanel.IsModified) {
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
    $WireFrame.Modal = $Modal;
    $Modal.Show();

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({
        Container: $Modal.Body,
        OnValidated: function(){
            $Modal.Yes.attr({ disabled: !($MainPanel.IsModified && $MainPanel.Validation.IsValid)});
        }
    });
    $WireFrame.MainPanel = $MainPanel;

    $MainPanel
        .NewRow()
            .NewCell({ XS: 12 })
        .NewRow()
            .NewCell({ XS: 12 })
            .Append($("<H3>").append("Datos Caso"))
        .NewRow()
            .NewCell({ XS: 2 })
            .NewLabel("Rit")
            .NewDebris({ Type: "Input_Text", Name: "Rit", /* Args: { Value: $Data.Rit }, */ OnCreated: $AddFormControlClass })

            .NewCell({ XS: 3 })
            .NewLabel("Tribunal")
            .NewDebris({
                Type: "Input_Select",
                Name: "Tribunal",
                Args: {
                    // Value: $Data.Tribunal,
                    Values: $JsonContext.Columns.Tribunal.Values
                },
                OnCreated: $AddFormControlClass })

            .NewCell({ XS: 3 })
            .NewLabel("Estado Demanda")
            .NewDebris({
                Type: "Input_Select",
                Name: "EstadoDemanda",
                Args: {
                    // Value: $Data.EstadoDemanda,
                    Values: $JsonContext.Columns.EstadoDemanda.Values
                },
                OnCreated: $AddFormControlClass
            })

            .NewCell({ XS: 3})
            .NewLabel("Rut Empleador")
            .NewDebris({ Type: "Input_Text", Name: "RutEmpleador", /* Args: { Value: $Data.RutEmpleador }, */ OnCreated: $AddFormControlClass })

        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )
        .NewRow()
            .NewCell({ XS: 12 })
            .Append($("<H3>").append("Datos Demandante")) // Datos Dte y Pdf
        .NewRow()
            .NewCell({ XS: 6, OnCreated: function($NewCell){ $CellDte = $NewCell; } })
            .NewCell({ XS: 6, OnCreated: function($NewCell){ $CellPdf = $NewCell; } })

        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<Hr>") )

        .NewRow()
            .NewCell({ XS: 12 })
            .Append( $("<H3>").append("Documentos Demanda") )

        .NewRow()
            .NewCell({ Xs: 12 })
            .NewDebris({
                Type: "AjaxDataTable",
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
                        //Demanda: $Data.DemandaId
                    }
                    , ColumnTypes: {
                        AccionesDocumentoDemanda: function($Ops){
                            if($Ops.Row.Url){
                                return "<Button OnClick='VistaPreviaDocumentoDemanda(this)' Class='btn btn-primary btn-xs'><span class='fa fa-search'></span></Button>";
                            }else{
                                return "<Sin documento>";
                            }
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

    $MainPanel.Conf.Rit.Control.attr({ disabled: true }).addClass("disabled");
    $MainPanel.Conf.Tribunal.Control.attr({ disabled: true }).addClass("disabled");
    $MainPanel.Conf.EstadoDemanda.Control.attr({ disabled: true }).addClass("disabled");
    $MainPanel.Conf.RutEmpleador.Control.attr({ disabled: true }).addClass("disabled");

    var $PanelPdf = new Debris.Misc.Bootstrap4Layout({ Container: $CellPdf });
    console.log($CellPdf);
    var $CellEmbed;
    $PanelPdf
        .NewRow()
        .NewCell({
            Xs: 12,
            OnCreated: function($NewCell){
                $CellEmbed = $NewCell;
                var $Append;
                // if($Data.Url){
                //     $Append = $("<Embed></Embed>").attr({ type: "application/pdf", width: "100%", height: "500px", src: "CasoDemandante/Download" + "?Id=" + $Data.Documento_id });
                // }else{
                //     $Append = $("<Label></Label>").append("No se ha ingresado un documento");
                // }
                $NewCell.append($Append);
            }
        })
    ;

    $PanelDemandante = new Debris.Misc.Bootstrap4Layout({
        Container: $CellDte,
        OnValidated: function(){
            $Modal.Yes.attr({ disabled: !($PanelDemandante.IsModified && $PanelDemandante.Validation.IsValid)});
        }
    });
    $WireFrame.PanelDemandante = $PanelDemandante;

    var $CellEmbedDte;
    var $InputWidth = 6;

    $PanelDemandante
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Rut")
            .NewDebris({
                Type: "Input_Rut",
                Name: "Rut", Args: { /* Value: $Data.Rut, */ Validations: { Rut: {  }, Title: "Rut" } },
                OnCreated: $AddFormControlClass
            })
            .NewCell({ XS: $InputWidth })
            .NewLabel("Inicio relación laboral")
            .NewDebris({
                Type: "Input_Date",
                Name: "InicioRelacionLaboral",
                OnCreated: function($New){
                    $InicioRelacionLaboral = $New.Conf;
                    $AddFormControlClass($New);
                },
                Args: {
                    Title: "Inicio relación laboral",
                    ParentEl: "#" + $Modal.Id,
                    //Value: $Data.InicioRelacionLaboral
                }
            }) // ParentEl permite asignar un input como parent al elemento Debris
            // .NewCell({ XS: 6, OnCreated: function($NewCell){ $CellPdf = $NewCell; } })

        .NewRow() // ! REVISAR AQUI PARA EL ERROR DE PARENTEL
            .NewCell({ XS: $InputWidth })
            .NewLabel("Fin relación laboral")
            .NewDebris({
                Type: "Input_Date",
                OnCreated: $AddFormControlClass,
                Name: "FinRelacionLaboral",
                Args: {
                    Title: "Fin relación laboral",
                    ParentEl: "#" + $Modal.Id,
                    Validations: { DateGreaterThanRef: { Ref: $InicioRelacionLaboral } },
                    // Value: $Data.FinRelacionLaboral
                }
            })
            .NewCell({ XS: $InputWidth })
            .NewLabel("Renta mensual")
            .NewDebris({Type: "Input_Money", Name: "RentaMensual", OnCreated: $AddFormControlClass, Args: { Title: "Renta Mensual" /* , Value: $Data.RentaMensual */ } } )
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Semana Corrida")
            .NewDebris({Type: "Input_Money", Name: "SemanaCorrida", OnCreated: $AddFormControlClass, Args: { Title: "Renta Mensual" /* , Value: $Data.SemanaCorrida */ } } )
            .NewCell({ XS: $InputWidth })
            .NewLabel("Horas extra")
            .NewDebris({Type: "Input_Money", Name: "HorasExtra", OnCreated: $AddFormControlClass, Args: { Title: "Renta Mensual" /* , Value: $Data.HorasExtra */ } } )
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Estado Demandante")
            .NewDebris({
                Type: "Input_Select",
                Name: "EstadoDemandante_id",
                OnCreated: $AddFormControlClass,
                Args: { /* Value: $Data.EstadoDemandante, */ Values: [{ Text: "Seleccionar...", Value: "" }].concat($JsonContext.Columns.EstadoDemandante.Values), Validations: { Required: {} } }
            })

            .NewCell({ XS: $InputWidth })
            .NewLabel("Fecha Vigencia Pension")
            .NewDebris({
                Type: "Input_Date",
                OnCreated: $AddFormControlClass,
                Name: "FechaVigenciaPension",
                Args: {
                    Title: "Fecha Vigencia Pension",
                    ParentEl: "#" + $Modal.Id,
                    // Value: $Data.FechaVigenciaPension
                }
            })
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Pensionado/a")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "Pensionado", /* OnCreated: $AddFormControlClass, */ /* Args: { Value: $Data.Pensionado } */ } )

            .NewCell({ XS: $InputWidth })
            .NewLabel("Empleada casa particular")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "EmpleadoCasaParticular",/* OnCreated: $AddFormControlClass, */ /* Args: { Value: $Data.EmpleadoCasaParticular } */ } )
        .NewRow()
            .NewCell({ XS: $InputWidth })
            .NewLabel("Convalidación")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "Convalidacion", Header: true, Inline: true /* , Args: { Value: $Data.Convalidacion } */ /* , OnCreated: $AddFormControlClass */ })

            .NewCell({ XS: $InputWidth })
            .NewLabel("Diferencia")
            .Append("<Br>")
            .NewDebris({Type: "Input_Checkbox", Name: "Diferencia", /* OnCreated: $AddFormControlClass, */ /* Args: { Value: $Data.Diferencia } */ } )



        .NewRow() // Aqui va la observacion
            .NewCell({ XS: 4 })
                .NewLabel("Observaciones del caso")
            .NewCell({ XS: 8 })
                .NewDebris({
                    Type: "Input_Text",
                    Control: $("<Textarea>").attr({ rows: 2 }),
                    Name: "ObservacionCaso",
                    OnCreated: $AddFormControlClass,
                    Args: { /* Value: $Data.ObservacionCaso, */ Validations: { Title: "ObservacionCaso" } }
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
                        // Value: $Data.ErrorMsg
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
                        //Value: $Data.FechaIngresoError
                    }
                })
        // .NewRow()
        //     .NewCell({ XS: 3 })
        //     .Append($("<button class='btn btn-primary' onClick='LimpiarDataAnalisis()'>Limpiar Analisis</button>"))
    ;

    return $WireFrame;

}

// Chose random value from array
function ChooseRandom(array) {
    if (array.length > 0) {
        const random = Math.floor(Math.random() * array.length)
        var struct = array[random];
        console.log("Elementos elegidos al azar:", struct);
        return struct.Value;
    } else {
        return -1;
    }
}

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

var $BlueHeader = function($Evt){
    $($Evt.target).find("thead").addClass("bg-primary-500");
};

// Calcula la deuda , renta - pagado - cobrado
function CalculoDeuda($renta, $pagado, $cobrado) {
    let result = $renta - $pagado - $cobrado;

    return Math.round(result);
}

// Calcula la deuda del empleador
function CalculoEmpleador($deuda) {
    let result = $deuda * $JsonContext.CotizacionEmpleador;
    return Math.round(result);
}

// Calculo del afiliado
function CalculoAfiliado($deuda) {
    let result = $deuda * $JsonContext.CotizacionTrabajador;
    return Math.round(result);
}

// Calculo nominal empleador + afiliado
function CalculoNominal($empl, $afil) {
    let result = $empl + $afil;
    return Math.round(result);
}

/*

    Pendientes:

        O ¿Está bien que la empresa de cobranza se seleccione al azar en el navegador?
        X Columnas deuda, empleador, afiliado, deuda nominal ¿mostrar directo o calcular?
        X ¿Agregar filas?
        X ¿Eliminar filas?
        X ¿Editar filas?
        X ¿Paginación?

*/

function confirmDeleteFicha(idFicha, idDemandante, idDemanda, modal) {
    let $K = new Debris.Modals.YesNoModal({
        Title: "Recrear ficha",
        Text: "¿Está seguro de eliminar la ficha y volver a crearla con los datos ingresados en la demanda? Esto considera volver a integrar información.",
        YesText: "Aceptar",
        NoText: "Cancelar",
        YesCallback: function () {
            ShowWait();
            $.ajax({
                url: "/Eliminar/Ficha",
                type: "GET",
                data: {
                    idFicha: idFicha,
                    idDemandante: idDemandante,
                    idDemanda: idDemanda,
                    csrfmiddlewaretoken: Token
                },
                success: function ($Res) {
                    console.log("$Res:", $Res);
                    if ($Res.Result == 0) {
                        CloseWait();
                        let $Msg = new Debris.Modals.OkModal({
                            Title : "Éxito",
                            Text: $Res.Msg,
                            OkText: "Aceptar",
                            OkCallback: function () {
                                modal.Hide();
                            }
                        });
                        $Msg.Show();
                    }
                },
                error: function (xhr, status) {
                },
                complete: function (xhr, status) {
                    $DT.Search($SearchPanel.Object);
                }
            });
        },
        CloseCallback: function () {
        }
    });
    $K.Show();
}

function confirmReprocessFicha(idFicha, modal) {
    let $K = new Debris.Modals.YesNoModal({
        Title: "Recalcular ficha",
        Text: "¿Está seguro de volver a realizar los cálculos y volver a aplicar reglas a esta ficha? Esto no considera volver a integrar información.",
        YesText: "Aceptar",
        NoText: "Cancelar",
        YesCallback: function () {
            ShowWait();
            $.ajax({
                url: "/Reprocesar/Ficha",
                type: "GET",
                data: {
                    idFicha: idFicha,
                    csrfmiddlewaretoken: Token
                },
                success: function ($Res) {
                    console.log("$Res:", $Res);
                    if ($Res.Result == 0) {
                        CloseWait();
                        let $Msg = new Debris.Modals.OkModal({
                            Title : "Éxito",
                            Text: $Res.Msg,
                            OkText: "Aceptar",
                            OkCallback: function () {
                                modal.Hide();
                            }
                        });
                        $Msg.Show();
                    }
                },
                error: function (xhr, status) {
                },
                complete: function (xhr, status) {
                    $DT.Search($SearchPanel.Object);
                }
            });
        },
        NoCallback: function () {
        },
        CloseCallback: function () {
        },
    });
    $K.Show();
}

/**
 * Summary.
 * Estado botón 'Recrear ficha'
 *
 * Description.
 * Función que retorna una valor de tipo boolean, que permite controlar el
 * atributo 'disabled' del botón 'Recrear ficha'. Recibe como parámetro el
 * 'estado de la ficha' de tipo number.
 *
 * En una variable de tipo array se definen los 'estados de la ficha':
 *  - 10 Creada
 *  - 70 Terminada
 *  - 90 Revisión manual
 *  - 1000 Finalizada sin deuda
 *
 * @param {Number} estadoFicha
 * @return {Boolean}
 */
function estadoBtnRecrearFicha (estadoFicha) {
    const estadosRecrearFicha = [10, 70, 90, 1000];
    let value = true;
    for (let estado of estadosRecrearFicha) {
        if (estadoFicha === estado) {
            value = false;
            break;
        }
    }
    return value;
}
/**
 * Summary.
 * Estado botón 'Recalcular ficha'
 *
 * Description.
 * Función que retorna una valor de tipo boolean, que permite controlar el
 * atributo 'disabled' del botón 'Recalcular ficha'. Recibe como parámetro el
 * 'estado de la ficha' de tipo number.
 *
 * En una variable de tipo array se definen los 'estados de la ficha':
 *  - 70 Terminada
 *  - 90 Revisión manual
 *  - 1000 Finalizada sin deuda
 *
 * @param {Number} estadoFicha
 * @return {Boolean}
 */
function estadoBtnRecalcularFicha (estadoFicha) {
    const estadosRecalcularFicha = [70, 90, 1000];
    let value = true;
    for (let estado of estadosRecalcularFicha) {
        if (estadoFicha === estado) {
            value = false;
            break;
        }
    }
    return value;
}