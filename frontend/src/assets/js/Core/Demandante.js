var $ColumnTypes = $ColumnTypes || {};
var $SelectedDemandante = [];
var $AllSelectedDemandante = false;
var $NotificacionDemandante;
var $GlobalData;
var $PanelDemandante;
var tabla;
var $PanelDte;

function ValidarDescargaDemandantes(){
    var $ListExentos = $.grep( GetSelectedRows(), ($e, $i) => $e.EstadoDemandante == 1 );
    var $TieneExentos = $ListExentos.length > 0;
    if($TieneExentos){

        var $Msg;
        if($ListExentos.length == 1){
            $Msg = "El demandante con rut \"" + $ListExentos[0].Rut + "\" está en estado \"Exento\" y no se puede descargar"
        }else{
            $Msg = "Los siguientes demandantes están en estado \"Exento\" y no se pueden descargar:<Br><Br>" +
                $.map($ListExentos, ($e, $i) => $e.Rut).reduce( ($c, $n) => $c + "<Br>" + $n );
            ;
        }

        var $ListNoExentos = $.grep( GetSelectedRows(), ($e, $i) => $e.EstadoDemandante != 1 );
        // if($ListNoExentos.length > 0){
        //     $Msg += "<Br><Br><Button Class='btn btn-primary btn-xs'>Ignorar exentos y continuar con la descarga</Button>";
        // }

        var $MsgModal = new Debris.Modals.OkModal({
            Title: "Validación",
            OkText: "Cerrar",
            Text: $Msg
        });
        $MsgModal.Show();
        if($ListNoExentos.length > 0){
            $MsgModal.Body.append(
                $("<Br>")
            ).append(
                $("<Br>")
            ).append(
                $("<A>Ignorar exentos y continuar con la descarga</A>")
                .attr({ "HRef": "#" })
                //.attr({ Class: 'btn btn-primary btn-xs' })
                .on("click", function(){
                    $MsgModal.Hide();
                    DescargaDemandantes();
                })
            );
            // $Msg += "<Br><Br><Button Class='btn btn-primary btn-xs'>Ignorar exentos y continuar con la descarga</Button>";
        }

    }
    return !$TieneExentos;
}

// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function DescargaDemandantes(){
    ShowWait();
    $.ajax({
        data: {
            Bean: JSON.stringify( $.map($.grep(GetSelectedRows(), ($e, $i) =>
                $e.EstadoDemandante != 1
            ), ($e, $i) =>
                ({ Id: $e.Id, EmpresaId: $e.EmpresaId, Rut: $e.Rut })
            ))
        },
        type: "GET",
        url: $DescargaDemandantesUrl,
        success: function($Res, $Type, $Response){

            CloseWait();
            if($Res.Result == 0){
                var blob = b64toBlob($Res.Data.replace(/(^b')|('$)/ig, ""), "application/zip");
                var blobUrl = URL.createObjectURL(blob);

                var Link = document.createElement('a');
                document.body.appendChild(Link);
                Link.href = blobUrl;
                Link.download = "CasoDemandante.zip";
                Link.click();
            }
        }
    });
}

// Seteo de una acción de Demandante y Color coding de estado demanda
$ColumnTypes.CasoDemandanteActions = function $CasoDemandanteActions($Conf) {

    for (var i=0; i < $DT.DataTable.column(1).data().length; i ++) {

        var rowId = i
        var rowData = $DT.DataTable.row(i).data();
        var cell = $DT.DataTable.cell({ row: rowId, column : 7 }).node()

        switch (rowData.EstadoDemanda) {

            case 3: // Sentenciada
                $(cell).css("background-color", "#86a9dc");
                break;

            case 4: // Analizado automaticamente
                $(cell).css("background-color", "#ac86dc ");
                break;

            case 5: // Ejecutoriada
                $(cell).css("background-color", "#acd99a");
                break;

            case 6: // revisar manualmente
                $(cell).css("background-color", "#effaa7");
                break;

            case 7: // Con error
                $(cell).css("background-color", "#ffb185");
                break;

            case 8: // Analizado manualmente
                $(cell).css("background-color", "#7A6FA9");
                $(cell).css("color", "#fff")
                break;

            case 9: // Terminado
                $(cell).css("background-color", "#00c000");
                $(cell).css("color", "#fff")
                break;

            default:
                break;
        }

    }

    // if (rowData.EmpresaId != null && rowData.Id != null && rowData.InicioRelacionLaboral != null && rowData.FinRelacionLaboral != null && rowData.RentaMensual != 0 && rowData.RentaMensual != null && rowData.Tribunal != null
    //     && (rowData.EstadoDemanda == 8 || rowData.EstadoDemanda == 4 || rowData.EstadoDemanda == 9 )
    //     &&  rowData.EstadoDemandante != 1 && rowData.EstadoDemandante != 2 ) {
    //     htm = "<div class='btn-group'>" + "<Button OnClick='DetalleCasoDemandante(this)' Class='btn btn-primary btn-xs'> <i class='fa fa-search'></i></Button>" +
    //     "<Button OnClick='CobroCasoDemandante(this)' id='BtnCalculo' name='BtnCalculo' Class='btn btn-secondary btn-xs'> <i class='fa fa-dollar-sign'></i></Button></div>"
    // }
    // else {
    //     htm = "<div class='btn-group'>" + "<Button OnClick='DetalleCasoDemandante(this)' Class='btn btn-primary btn-xs'> <i class='fa fa-search'></i></Button>" +
    //     "<Button disabled OnClick='CobroCasoDemandante(this)' id='BtnCalculo' name='BtnCalculo' Class='btn btn-secondary btn-xs'> <i class='fa fa-dollar-sign'></i></Button></div>"
    // }
    // return htm;

    if (rowData.EstadoDemanda == 8 || rowData.EstadoDemanda == 4 || rowData.EstadoDemanda == 9 || rowData.EstadoDemanda == 11 )  {
        htm = "<div class='btn-group'>" + "<Button OnClick='DetalleCasoDemandante(this)' Class='btn btn-primary btn-xs'> <i class='fa fa-search'></i></Button>" +
                "<Button OnClick='CobroCasoDemandante(this)' id='BtnCalculo' name='BtnCalculo' Class='btn btn-secondary btn-xs'> <i class='fa fa-dollar-sign'></i></Button></div>";
        return htm;       
    } else {
        htm = "<div class='btn-group'>" + "<Button OnClick='DetalleCasoDemandante(this)' Class='btn btn-primary btn-xs'> <i class='fa fa-search'></i></Button>" +
                "<Button disabled OnClick='CobroCasoDemandante(this)' id='BtnCalculo' name='BtnCalculo' Class='btn btn-secondary btn-xs'> <i class='fa fa-dollar-sign'></i></Button></div>";
        return htm;
    }
}

/*

$ColumnTypes.EstadosFicha = function $EstadosFicha($Conf){

    console.log($Conf);

    var $Tr = $Sender.closest("Tr");
    
    var $MakeOpts = function($e, $i){
        return $("<Option></Option>").text($e.Text).attr({ Value: $e.Value });
    };

    var $CurrText = $JsonContext.Columns.EstadosFicha.Values.find( $X => $X.Value == $Conf.Data ).Text;

    var $OptsETC = [
        { Text: $CurrText, Value: $Conf.Data }
    ];
    var $ErrorToCreated = $("<Select></Select>").append(
        $.map([...$OptsETC, { Text: "Creada", Value: 10 }], $MakeOpts)
    )[0].outerHTML;
    var $RevisionToFinished = "De revisión manual a terminada";
    var $NonEditable = "No editable";

    switch($Conf.Data){

        // De errores a creada
        case 40:
        case 41:
        case 42:
        case 43:
        case 44:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
            // To 10
            return $ErrorToCreated;
        case 90:
            // To 70
            return $RevisionToFinished;
        default:
            return $NonEditable;

    }

};

*/

// $ColumnTypes.EstadosFicha = function($Options){
//     if($Options.Data == -1){
//         return $Options.Definition.Unselectable || "N/A";
//     }
//     var $Found = $.grep($Options.Definition.Values || [], function($e, $i){
//         if($Options.Data == null) return false;
//         if($e.Value == null) return false;
//         if($Options.Definition.Multiple){
//             return $Options.Data.indexOf($e.Value) > -1;
//         }else{
//             return $e.Value.toString() == $Options.Data.toString();
//         }
//     });
//     $Options.Definition.Inline = true;
//     if($Found.length){
//         var $Data = $Found.reduce(function($c, $n){ return $c + ($c == "" ? "":", ") + ($n.Text || $Options.Definition.Empty || "N/A"); }, ""); //$Found[0].Text || $Options.Definition.Empty || "N/A";
//         if($Options.Definition.Inline){
//             // 
//             // $This.Instance
//             return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + 1 + "].__Inline_Input_Select__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
//         }else{
//             return $Data;
//         }
//     }else{
//         if($Options.Definition.Inline){
//             // 
//             // $This.Instance
//             return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + 1 + "].__Inline_Input_Select__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Options.Definition.Empty || "N/A" + "</Text>";
//         }else{
//             return $Options.Definition.Empty || "N/A";
//         }
//     }
// };

// Genera las row de calculo segun Id del demandante
function GetPeriodosCobro($CollectedData) {

    console.log("$GlobalData", $GlobalData);
    $.ajax({
        url : '/GetPeriodosCobro',
        type : 'GET',
        data : { Id : $GlobalData.Id, IdEmp : $GlobalData.EmpresaId },
        dataType : 'json',
        success : function(json) {
            console.log("Json Periodo Cobros:", json);
            if (json.Result == 0) {
                var $Msg = new Debris.Modals.OkModal({
                    Title: "Error",
                    OkText: "Continuar",
                    Text: json.Msg,
                    OkCallBack: function() {
                        //nothing
                    }
                });
                $Msg.Show();
            } else {
                $CollectedData.Periodo = json.Data;
                $CollectedData.WhenReady($CollectedData);
            }
        },
        complete : function(xhr, status) {
            CloseWait();
        }
    });
}

// ? TODO: Reemplazar los nombres y funciones necesarias, esta funcion sera
// ? cambiada para que actualice las rows generadas
function calculoById(id) {

    return new Promise(resolve => {

        $.ajax({
            url : '/Calculo',
            type : 'GET',
            data : { demandanteId : id },
            dataType : 'json',
            success : function(json) {
                resolve(json.Data);

            },
            error : function(xhr, status) {
                    console.log('Disculpe, existió un problema');
            },

            complete : function(xhr, status) {
                console.log('Petición realizada');
            }
        });
    });
}


// Obtiene toda la data de la empresa en cuestion (aqui esta incluida la comuna)
function GetEmpresaData( $IdEmpresa, $CollectedData ) {
    $.ajax({
        url: '/GetEmpresaData',
        type: 'GET',
        data: { IdEmpresa: $IdEmpresa },
        dataType: 'json',
        success: function(json) {
            console.log("json.Data GetEmpresaData:", json.Data);
            $CollectedData.Empresa = json.Data;
            GetEmpresasDeCobranza($CollectedData);
        },
        error: function(xhr, status) {
            console.log('Error:' + status)
        },

    });
}

// Obtiene las empresas de cobranza desde la DB
function GetEmpresasDeCobranza( $CollectedData ) {
    console.log("CollectedData", $CollectedData)
    $.ajax({
        url: '/GetEmpresaCobranza',
        type: 'GET',
        data: {
            IdComuna: $CollectedData.Empresa.Comuna
        },
        dataType: 'json',
        success: function(json) {
            $CollectedData.EmpresaCobranza = json.Data;
            GetPeriodosCobro($CollectedData);
        },
        error: function(xhr, status) {
            console.log('Error:' + status)
        },
        complete: function(xhr, status) {
            CloseWait();
        }
    });
}

// Chose random value from array
function ChooseRandom(array) {
    if (array.length > 0) {
        const random = Math.floor(Math.random() * array.length)
        var struct = array[random];
        console.log("Elementos elegidos al azar:", struct);
        return struct.Value;
    } else {
        return -1
    }
}

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

// Levanta un modal para confirmar accion
// Limpia todos los campos de analisis de sentencias y guarda en la DB el resultado (para poder seguir editando)
function LimpiarDataAnalisis() {

    console.log('$PanelDte', $PanelDte);

    var $Confirm = new Debris.Modals.YesNoModal({
        Title: "Limpiar Analisis",
        Text: "Seguro que desea limpiar el analisis?",
        YesText: "Si",
        NoText: "No",
        YesCallback: function(){

            ShowWait();
            $PanelDte.Conf.FinRelacionLaboral.Control[0].value = null;
            $PanelDte.Conf.InicioRelacionLaboral.Control[0].value = null;
            $PanelDte.Conf.FechaVigenciaPension.Control[0].value = null;

            $PanelDte.Conf.RentaMensual.Control.val("");
            $PanelDte.Conf.SemanaCorrida.Control.val("");
            $PanelDte.Conf.HorasExtra.Control.val("");
            $PanelDte.Conf.Diferencia.Control.prop('checked',false);
            $PanelDte.Conf.Pensionado.Control.prop('checked',false);
            $PanelDte.Conf.EmpleadoCasaParticular.Control.prop('checked',false);
            $PanelDte.Conf.Convalidacion.Control.prop('checked',false);

            $.ajax({
                url: '/LimpiarAnalisis',
                type: 'GET',
                data: { IdDemandante : $GlobalData.Id, csrfmiddlewaretoken : Token},
                dataType: 'json',
                success: function(json) {
                    console.log(json.Msg);
                    var $Msg = new Debris.Modals.OkModal({
                        Title : "Analisis eliminado con éxito",
                        Text: json.Msg,
                        OkText: "Continuar"
                    });
                    $Msg.Show();
                    $PanelDte.OnValidated()
                },
                error: function(xhr, status) {
                    console.log('Error:' + status)
                },
                complete: function(xhr, status) {
                    CloseWait();
                    $DT.Search($SearchPanel.Object);
                }
            });

        },
    });
    $Confirm.Show()

}

// * Detalles de la view caso demandante
// * Muestra resultados analisis de sentencias, datos demandante y estado de la demanda
// * Incluye opcion para editar resultados del analisis de sentencias
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

var $DtCobros;

function DemandanteRemove($Sender){
    var $Tr = $($Sender).closest("Tr");
    $DtCobros.row($Tr).remove().draw();
}

var $MainPanel;

// * Interfaz y paneles de cobro, tabla que recibe historial
// * Revisar origen de la data y evitar sobrecargar con datos como tribunales e info, solo traer la necesaria
function CobroCasoDemandante($Sender) {

    // Setup
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();
    $GlobalData = $Data;

    var $WhenReady = function($DataReady){
        console.log("$JsonContext", $JsonContext);
        console.log("$Data", $Data);

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

        var $Modal = new Debris.Modals.YesNoModal({
            Title: "Ficha demanda laboral con sentencia ejecutoriada",
            YesText: "Guardar cambios",
            NoText: "Descartar cambios",
            YesCallback: function(){
                dataTabla = tabla.rows().data();
                console.log($Modal);
                console.log("MainPanel", $MainPanel.Conf.Empresas.Value);

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

        $Modal.Body.closest(".modal-dialog").css({ "max-width": "90%" });

        // Creamos panel y le asignamos el modal padre
        $MainPanel = new Debris.Misc.Bootstrap4Layout({
            Container: $Modal.Body,
            OnValidated: function(){
                $Modal.Yes.attr({ disabled: !($MainPanel.IsModified && $MainPanel.Validation.IsValid)});
            }
        });

        // Second part table for calculationsS
        //var $DtCobros;
        var $TblCobro = $("<Table>").addClass("table table-striped table-sm").css({ width: "100%" });
        var $CellDemandante;

        // Data que se usara en el panel, logre reducirlo a solo 2 calls
        let EmpresaData = $DataReady.Empresa; //await GetEmpresaData($Data.EmpresaId).then((response) => response )
        let EmpresaCobranzaData = $DataReady.EmpresaCobranza; //await GetEmpresasDeCobranza(EmpresaData.Comuna).then((response) => response)
        //console.log("EmpresaData", EmpresaData)

        // Creo los elementos que iran en el select, para que la funcion getEmpresaCobranza sea general
        let SelectElements = []
        let count = EmpresaCobranzaData.length;

        for (i = 0; i < count; i ++) {
            SelectElements.push({
                Text: EmpresaCobranzaData[i].Nombre + " | " + EmpresaCobranzaData[i].Rut,
                Value: EmpresaCobranzaData[i].Id
            })
        }
        // console.log("SelectElements", SelectElements)
        console.log("$DataReady", $DataReady);

        if (EmpresaData.EmpresaCobranza != null) {
            var SelectValue = EmpresaData.EmpresaCobranza
            //console.log("EEJJ Selected from DB")
        } else {
            var SelectValue = ChooseRandom(SelectElements)
            //console.log("EEJJ Selected randomly")
        }

        // Panel superior Rit - Tribunal - Empresa Cobranza - EEJJ
        $MainPanel
            .NewRow()
                .NewCell({ xs: 2})
                .NewLabel("Rit")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Rit",
                    Args: { Value: $Data.Rit },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 3 })
                .NewLabel("Tribunal")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Tribunal",
                    Args: { Value: $Data.NombreTribunal },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 3 })
                .NewLabel("Empresa de cobranza")
                .NewDebris({
                    Type: "Input_Select",
                    Name: "Empresas",
                    Args: {
                        Value: SelectValue,
                        Values: SelectElements
                    },
                    OnCreated: $AddFormControlClass
                })
                // .NewCell({ xs: 2})
                // .NewLabel("Rut EEJJ")
                // .NewDebris({
                //     Type: "Input_Text",
                //     Name: "RutEEJJ",
                //     // Args: {
                //     //     Value: EmpresaCobranzaData.RutEmpleador
                //     // },
                //     OnCreated: $AddFormControlClass
                // })

            .NewRow()
                .NewCell({ xs: 5 })
                .NewLabel("Observaciones del caso")
                .NewDebris({
                    Type: "Input_Text",
                    Control: $("<Textarea>").attr({ rows: 2 }),
                    Name: "ObservacionCaso",
                    Args: { Value: $Data.ObservacionCaso },
                    OnCreated: $AddFormControlClass
                })

                .NewCell({ xs: 1 })
                .NewLabel("Diferencia")
                .Append("<Br>")
                .NewDebris({
                    Type: "Input_Checkbox",
                    Name: "Diferencia",
                    Args: { Value : $Data.Diferencia }
                })

                .NewCell({ xs: 1 })
                .NewLabel("Convalidacion")
                .Append("<Br>")
                .NewDebris({
                    Type: "Input_Checkbox",
                    Name: "Convalidacion",
                    Args: { Value : $Data.Convalidacion }
                })

                .NewCell({ xs: 1 })
                .NewLabel("Pensionado")
                .Append("<Br>")
                .NewDebris({
                    Type: "Input_Checkbox",
                    Name: "Pensionado",
                    Args: { Value : $Data.Pensionado }
                })

                .NewCell({ xs: 2 })
                .NewLabel("Emplead@ casa particular")
                .Append("<Br>")
                .NewDebris({
                    Type: "Input_Checkbox",
                    Name: "EmpleadoCasaParticular",
                    Args: { Value : $Data.EmpleadoCasaParticular }
                })
          
            .NewRow()
                .NewCell({ xs: 2})
                .NewLabel("Fecha Vig. Pension")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "FechaVigenciaPension",
                    Args: { Value: $Data.FechaVigenciaPension },
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
                    // $CellHistorial.text("[Historial]");
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
            // .NewRow()
            //     .NewCell({ xs: 3 })
            //     .Append($("<button class='btn btn-primary' onClick='SwitchRow(this)'>Esconder filas vacías</button>"))
            .NewRow()
                .NewCell({ xs: 12 })
                .Append($("<h3></h3>"))
                .Append($TblCobro)
        ;

        var $PanelDatosDemandante = new Debris.Misc.Bootstrap4Layout({ Container: $CellDemandante});

        $PanelDatosDemandante
            .NewRow()
                .NewCell({ xs: 3})
                .NewLabel("Nombre del trabajador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Nombre",
                    Args: { Value: $Data.Nombre },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 2})
                .NewLabel("Rut trabajador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Rut",
                    Args: { Value: $Data.Rut },
                    OnCreated: $AddFormControlClass
                })
        ;

        var $PanelDatosEmpleador = new Debris.Misc.Bootstrap4Layout({ Container: $CellEmpleador});

        $PanelDatosEmpleador
            .NewRow()
                .NewCell({ xs: 2})
                .NewLabel("Rut empleador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "RutEmpleador",
                    Args: { Value: $Data.RutEmpleador },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 3})
                .NewLabel("Nombre empleador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "Nombre",
                    Args: { Value: EmpresaData.Nombre },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 3})
                .NewLabel("Razón social empleador")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "RazonSocial",
                    Args: { Value: EmpresaData.RazonSocial },
                    OnCreated: $AddFormControlClass
                })
                .NewCell({ xs: 2})
                .NewLabel("Comuna")
                .NewDebris({
                    Type: "Input_Text",
                    Name: "NombreComuna",
                    Args: { Value: EmpresaData.NombreComuna },
                    OnCreated: $AddFormControlClass
                })


        // Renderizado
        $MainPanel.Init();
        $MainPanel.Validation.Init();

        $PanelDatosDemandante.Init();
        $PanelDatosDemandante.Validation.Init();

        $PanelDatosEmpleador.Init()
        $PanelDatosEmpleador.Validation.Init()

        $Modal.Show();

        $CellDemandante.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
        $CellDemandante.parent().next().removeClass("form-group");

        $CellEmpleador.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
        $CellEmpleador.parent().next().removeClass("form-group");

        $CellHistorial.addClass("collapse").parent().removeClass("form-group").prev().removeClass("form-group").prev().removeClass("form-group");
        $CellHistorial.parent().next().removeClass("form-group");

        console.log($Data);

        var $TableHistorial = $("<Table>").css({ width: "100%" }).addClass("table table-hover table-striped table-condensed table-sm");
        $CellHistorial.append($TableHistorial);

        var $BlueHeader = function($Evt){
            $($Evt.target).find("thead").addClass("bg-primary-500");
        };

        $TableHistorial.on("draw.dt", $BlueHeader);

        $TableHistorial.DataTable({
            columns: [
                {
                    title: "Estado",
                    data: "Estado_id",
                    render: function($Data, $Type, $Row){
                        
                        switch($Data){
                            case 10:
                                return "Creada";
                            break;
                            case 20:
                                return "Pendiente de Sincronizacion";
                            break;
                            case 21:
                                return "Pendiente de Sincronizacion Demandante";
                            break;
                            case 22:
                                return "Pendiente de Sincronizacion Empresa";
                            break;
                            case 23:
                                return "Pendiente de Sincronizacion Pago";
                            break;
                            case 24:
                                return "Pendiente de Sincronizacion Deuda";
                            break;
                            case 30:
                                return "Sincronizada";
                            break;
                            case 31:
                                return "Demandante Sincronizado";
                            break;
                            case 32:
                                return "Empresa Sincronizada";
                            break;
                            case 33:
                                return "Pago Sincronizado";
                            break;
                            case 34:
                                return "Deuda Sincronizado";
                            break;
                            case 40:
                                return "Error de Sincronizacion Afc";
                            break;
                            case 41:
                                return "Error de Afc al Sincronizar Demandante";
                            break;
                            case 42:
                                return "Error de Afc al Sincronizar Empresa";
                            break;
                            case 43:
                                return "Error de Afc al Sincronizar Pago";
                            break;
                            case 44:
                                return "Error de Afc al Sincronizar Deuda";
                            break;
                            case 50:
                                return "Error de Sincronización St";
                            break;
                            case 51:
                                return "Error de St al Sincronizar Demandante";
                            break;
                            case 52:
                                return "Error de St al Sincronizar Empresa";
                            break;
                            case 53:
                                return "Error de St al Sincronizar Pago";
                            break;
                            case 54:
                                return "Error de St al Sincronizar Deuda";
                            break;
                            case 60:
                                return "Descargado";
                            break;
                            case 70:
                                return "Terminada";
                            break;
                            case 80:
                                return "Error de reglas";
                            break;
                            case 90:
                                return "Revisión manual";
                            break;

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
            data: $Data.Historial,
            language: Debris.Misc.Lang.DataTable.Es
        });

        // Inputs main panel
        $MainPanel.Conf.Rit.Control.attr({ disabled: true }).addClass("disabled");
        $MainPanel.Conf.Tribunal.Control.attr({ disabled: true }).addClass("disabled");
        $MainPanel.Conf.ObservacionCaso.Control.attr({ disabled: true }).addClass("disabled");
        $MainPanel.Conf.FechaVigenciaPension.Control.attr({ disabled: true }).addClass("disabled");

        $MainPanel.Conf.EmpleadoCasaParticular.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.Diferencia.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.Pensionado.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.Convalidacion.Control.attr({ disabled : true }).addClass("disabled");
        $MainPanel.Conf.EmpleadoCasaParticular.Control.attr({ disabled : true }).addClass("disabled");

        // Inputs Dte
        $PanelDatosDemandante.Conf.Nombre.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosDemandante.Conf.Rut.Control.attr({ disabled: true }).addClass("disabled");

        // Imputs panel empleador
        $PanelDatosEmpleador.Conf.RutEmpleador.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosEmpleador.Conf.RazonSocial.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosEmpleador.Conf.Nombre.Control.attr({ disabled: true }).addClass("disabled");
        $PanelDatosEmpleador.Conf.NombreComuna.Control.attr({ disabled: true }).addClass("disabled");
        $MainPanel.Conf.MensajesIntegracion.Control.attr({ disabled: true }).addClass("disabled");

        // New row button
        $TblCobro.append('<tfoot><td> <button id="addRow" class="btn btn-primary" >Agregar nueva fila</button> </td><td></td><td></td><td></td><td></td> <td></td> <td></td> <td></td> <td></td> </tfoot>')

        $Modal.Body.find('#addRow').on( 'click', function () {
            $DtCobros.row.add([
                0,
                `Sin definir`,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ]).draw( false );
        });

        // $MainPanel.Object.MensajesIntegracion += ($MainPanel.Object.MensajesIntegracion ? "\n":"") + $.map($CollectedData.Periodo, function($e, $i){
        //     if(!$e[9]){
        //         return "Falta tope de renta en la base de datos para el periodo " + $e[0];
        //     }
        // }).reduce(($C, $N) => $C + ($C ? "\n":"") + $N, "");

        $MainPanel.Object.MensajesIntegracion += ($MainPanel.Object.MensajesIntegracion ? "\n":"") + $.map($CollectedData.Periodo, function($e, $i){
            if(!$e[10]){
                return "Falta valor de la UF para el mes de " + moment($e[0], "YYYYMM").format("MMMM \\d\\e\\l YYYY");
            }
        }).reduce(($C, $N) => $C + ($C ? "\n":"") + $N, "");

        $MainPanel.Object.MensajesIntegracion += ($MainPanel.Object.MensajesIntegracion ? "\n":"") + $.map($.map($CollectedData.Periodo, function($e, $i){
            if(!$e[10]){
                var $Year = moment($e[0], "YYYYMM").format("YYYY");
                return { [$Year]: "Falta tope en UF para el año " + $Year };
            }
        })
        .reduce( ($C, $N) => $C = { ...$C, ...$N }, {} ), ($e) => $e)
        .reduce( ($C, $N) => $C + ($C ? "\n":"") + $N, "" );
        //.reduce(($C, $N) => $C + ($C ? "\n":"") + $N, "");

        if(moment($Data.FechaVigenciaPension, "YYYY-MM-DD").isBefore(moment($Data.InicioRelacionLaboral, "YYYY-MM-DD"))){
            $MainPanel.Object.MensajesIntegracion += ($MainPanel.Object.MensajesIntegracion ? "\n":"") + "Fecha de vigencia de pensión antes de inicio de relación laboral";
        }

        if($Data.EmpleadoCasaParticular){
            if(moment($Data.FinRelacionLaboral, "YYYY-MM-DD") < moment("2020-10-01", "YYYY-MM-DD")){
                $MainPanel.Object.MensajesIntegracion += ($MainPanel.Object.MensajesIntegracion ? "\n":"") + "Trabajador/a Casa Particular con término de relación laboral anterior a fecha legal 2020-10-01";
            }
        }

        // Tabla cobros
        $DtCobros =  $TblCobro.DataTable({
            columns: [
                {
                    title: "Periodos Demandados",
                    mRender : function(data, type, row) {
                        return `<text id="0" onClick='EditarMonto(this)'>${data}</text>`;
                    }
                },
                {
                    title: "Estado",
                    mRender : function(data, type,row){
                        return `<text id="1" onClick='EditEstadoFila(this)'>${data}</text>`;
                    }
                },
                {
                    title: "Renta Imponible" ,className: "text-right",
                    mRender: function(data, type, row) {
                        if(row[10] && row[11]){
                            data = parseInt(Math.min(data, row[9]))
                        }
                        return `<text id="2" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;

                    }
                },
                {
                    title: "Pagado",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        return `<text id="3" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;
                    }
                },
                {
                    title: "Cobrado",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        return `<text id="4" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;
                    }
                },
                {
                    title: "Deuda",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        var result 
                        
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
                    className: "text-right",
                    mRender: function(data, type, row) {
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
                    className: "text-right",
                    mRender: function(data, type, row) {
                        let deuda = CalculoDeuda(row[2], row[3], row[4]);
                        let result = CalculoAfiliado(deuda);
                        row[7] = result;
                        return `<text>$${new Intl.NumberFormat("de-DE").format(Math.round(result))}</text>`;
                    }
                },
                {
                    title: "Deuda nominal",
                    className: "text-right",
                    mRender: function(data, type, row) {
                        let deuda = CalculoDeuda(row[2], row[3], row[4]);
                        let empleador = CalculoEmpleador(deuda);
                        let afiliado = CalculoAfiliado(deuda);
                        let result = CalculoNominal(empleador, afiliado);
                        row[8] = result;
                        return `<text>$${new Intl.NumberFormat("de-DE").format(Math.round(result))}</text>`;
                    }
                },
                {
                    render: function(){
                        return "<Button OnClick='DemandanteRemove(this)' Class='btn btn-xs btn-danger'><Span Class='fa fa-times'></Span></Button>";
                    }
                }
            ],
            data: $CollectedData.Periodo,
            language: Debris.Misc.Lang.DataTable.Es,
            searching: false,
            paging: false,
            footerCallback: function (row, data, start, end, display) {

                // Setea y calcula los totales de las columnas seleccionadas
                var api = this.api(), data;

                function totalVertical(i) {
                    return new Intl.NumberFormat("de-DE").format(
                    api
                    .column(i)
                    .data()
                    .reduce( function (a, b) {
                        return (a + b);
                    }, 0)
                    )
                }

                // Update footer
                $( api.column( 5 ).footer() ).html('<b>Total: </b>$'+ totalVertical(5));
                $( api.column( 6 ).footer() ).html('<b>Total: </b>$'+ totalVertical(6));
                $( api.column( 7 ).footer() ).html('<b>Total: </b>$'+ totalVertical(7));
                $( api.column( 8 ).footer() ).html('<b>Total: </b>$'+ ( totalVertical(8) < 0 ? 0: totalVertical(8) ));

                console.log()
            }
        });

        $TblCobro.removeClass('no-footer');
        $TblCobro.find('thead').addClass('bg-primary-500');
        tabla = $DtCobros;
    }; // WhenReady end

    ShowWait();

    var $CollectedData = { WhenReady: $WhenReady };
    GetEmpresaData($Data.EmpresaId, $CollectedData);

};

// Funcion que permite editar inline un elemento de la tabla
function EditarMonto(params, IsNumeric) {
    let objJ = $(params);

    let id = objJ.attr('id');
    let valor = objJ.text().replace("$", "").replace(".", "");

    let inputt = $(`<input id="textEdit" class="form-control form-control-sm" type="numb" value="${valor}" placeholder="${valor}">`)
    console.log("id : ", id , " valor: ", valor )

    let __this__ = objJ.parents('td');
    $(params).replaceWith(inputt);
    inputt.select();

    if(IsNumeric){
        inputt.bind("keydown", Debris.Components.Input_Number.KeyDown).bind("paste", Debris.Components.Input_Number.Paste);
    }

    let update = tabla.row(__this__).data();
    console.log("__ANTES")
    console.log(tabla.row(__this__).data())

    $('#textEdit').on('keydown', function(e){
        var nuevoValor = $('#textEdit').val();

        if (e.keyCode == 13) {
            console.log("soy el valor nuevo :", nuevoValor)
            update[id] = parseInt(nuevoValor);

            $("#textEdit").replaceWith(nuevoValor);
            update = totales_laterales(update);
            tabla.row(__this__).data(update).draw()
            console.log("__DESPUES");
            console.log(tabla.row(__this__).data())


        }
        if (e.keyCode == 27) {
            update[id] =parseInt(valor);
            $("#textEdit").replaceWith(valor);
            tabla.row(__this__).data(update)
            console.log("__DESPUES");
            console.log(tabla.row(__this__).data())
        }
    });

    $("#textEdit").on('blur',function(){
        $("#textEdit").replaceWith(valor, id);
        tabla.row(__this__).data(update)
        console.log("__DESPUES");
        console.log(tabla.row(__this__).data())
    });
}

// Edita el cuadro de estado (descripcion)
function EditEstadoFila(params) {
    let objJ = $(params);

    let id = objJ.attr('id');
    let valor = objJ.text().replace("$", "").replace(".", "");

    let inputt = $(`<input id="estEdit" class="form-control form-control-sm" type="text" value="${valor}" placeholder="${valor}">`)
    console.log("id : ", id , " valor: ", valor )

    let __this__ = objJ.parents('td');
    $(params).replaceWith(inputt);

    let update = tabla.row(__this__).data();
    console.log("__ANTES__", tabla.row(__this__).data())

    $('#estEdit').on('keydown', function(e){

        var nuevoValor = $('#estEdit').val();

        if (e.keyCode == 13) {
            console.log("soy el valor nuevo :", nuevoValor)
            $("#estEdit").replaceWith(nuevoValor);
            update[id] = nuevoValor
            tabla.row(__this__).data(update).draw()
            console.log("__DESPUES__", tabla.row(__this__).data());
        }

        if (e.keyCode == 27) {
            console.log("soy el valor nuevo :", nuevoValor)
            $("#estEdit").replaceWith(valor);
            tabla.row(__this__).data(update)
            console.log("__DESPUES__", tabla.row(__this__).data());
        }

    });

    $("#estEdit").on('blur',function(){
        $("#estEdit").replaceWith(valor);
        tabla.row(__this__).data(update)
        console.log("__DESPUES__");
        console.log(tabla.row(__this__).data())
    });

}

// Calcula las deudas y totales % laterales
function totales_laterales(arr) {

    renta = arr[2];
    pagado = arr[3];
    cobrado = arr[4];

    deuda = renta - pagado - cobrado;
    empleador = deuda * ($JsonContext.CotizacionEmpleador);
    afiliado = deuda * ($JsonContext.CotizacionTrabajador);
    nominal = empleador + afiliado;

    arr[5] = deuda; //setteando la deuda en <TXT>
    arr[6] = empleador; //setteando la empleador en <TXT>
    arr[7] = afiliado; //setteando la afiliado en <TXT>
    arr[8] = nominal; //setteando la nominal en <TXT>

    return arr

}

// Selector de demandas para eliminarlas
var $DemandanteCol1Changed = function($Options) {
    console.log($Options.ColumnData);
    $SelectedDemandante = $Options.ColumnData.CheckedColumns;
    $AllSelectedDemandante = $Options.ColumnData.HeaderIsChecked;

    if($Options.ColumnData.CheckedColumns.length || $AllSelectedDemandante){
        $("[id=BtnDeleteDemandante]").prop({ disabled: false });
    }else{

        $("[id=BtnDeleteDemandante]").prop({ disabled: true });
    }
};

// Borrar a los demandantes seleccionados dentro del modal
function DeleteSelectedDemandantes(){
    var $CntSelected;
    if($AllSelectedDemandante){
        $CntSelected = $DemandanteDT.TotalFiltered;
    }else{
        $CntSelected = $SelectedDemandante.length;
    }

    var $A = Debris.Misc.Random(1, 10);
    var $B = Debris.Misc.Random(1, 10);

    var $Confirm = new Debris.Modals.YesNoModal({
        Text: "Se eliminarán " + $CntSelected + " registros<Br><Br>Resuelva la siguiente suma para continuar:<Br>"
        , Title: "Confirmación"
        , YesCallback: function(){
            if($AllSelectedDemandante){
                $DemandanteDT.Delete({ IDs: "__ALL__" });
            }else{
                $DemandanteDT.Delete({ IDs: $SelectedDemandante });
            }
            $("#BtnDelete").attr({ disabled: true });
        }
    });

    $Confirm.Body.closest(".modal").find("Button:nth(1)").prop({ disabled: true });

    // [!] Que sea Input_Number
    $Confirm.Body.append(
        $("<Br>")
    ).append(
        $("<Div></Div>").attr({ Class: "row form-group" }).append(
            $("<Div></Div>").attr({ Class: "col-md-2" }).append(
                $("<Text>").append($A + " + " + $B)
            )
        ).append(
            $("<Div></Div>").attr({ Class: "col-md-3" }).append(
                $("<Input>").attr({ Class: "form-control form-control-sm", Type: "Text" }).on("input", function($Evt){
                    $Confirm.Body.closest(".modal").find("Button:nth(1)").prop({ disabled: $Evt.target.value != ($A + $B) });
                })
            )
        )
    );

    $Confirm.Show();

};

if($JsonContext.DemandanteCols){
    $JsonContext.DemandanteCols.Col1.OnChange = "$DemandanteCol1Changed";
}

if($JsonContext.DemandanteCols){
    $JsonContext.DemandanteCols.Estado.Values = [{ Value: "", Text: "Seleccionar..." }].concat($JsonContext.DemandanteCols.Estado.Values);
}

// ? TODO: Eliminar o revisar si esta funcion se esta usando, al parecer no
// Creación de un nuevo demandante dentro del modal
function CrearDemandante(){

    var $YN = new Debris.Modals.YesNoModal({
        YesText: "Aceptar",
        NoText: "Cancelar",
        Title: "Nuevo Demandante",
        YesCallback: function(){
            if($PanelDemandante.Validation.IsValid){
                $DemandanteDT.Create({ Bean: $PanelDemandante.Object });
                $YN.Hide();
            }else{
                $PanelDemandante.Validation.Run();
            }
        },
        CloseOnYes: false
    });

    var $PanelDemandante = new Debris.Misc.Bootstrap4Layout({
        Container: $YN.Body
    });

    $PanelDemandante
        .NewRow({ OnCreated: function($New){
            $New.Row.removeClass("form-group");
        } })
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
                    Validations: { Required: {  },  Rut: { NoValidMsg: "Rut ingresado no válido" } }
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
    ;

    $PanelDemandante.Validation.Init();
    console.log($PanelDemandante);

    $YN.Show();

}
