var $ColumnTypes = $ColumnTypes || {};  // TODO: 'var' se usa en lugar de 'let' o 'const'
$ColumnTypes.AccionesResolucion = $AccionesResolucion;


$("#BtnAdd").attr("disabled", $JsonContext.Vigentes);

// Fecha de proceso para reajuste e intereses
$("#BtnFecha").attr({ "disabled": $JsonContext.Reajustes }).on("click", function() {
    $('.modal').remove();
    let $K = new Debris.Modals.YesNoModal({
        "Title": "Fecha de reajuste e interés",
        "Large": true,
        "YesText": "Aceptar",
        "NoText": "Cancelar",
        "YesCallback": function() {
            let fechaReajuste = $('input[id="#fecha"]').val();
            $.ajax({
                url: "/Resoluciones/Reajuste",
                type: "GET",
                data: { fechaReajuste: fechaReajuste },
                success: function (res) {
                    console.log("res", res);
                    $DT.Search($SearchPanel.Object);
                    hideModal(res.ttl, res.msg);
                }
            });
        },
        "NoCallback": function() {}
    });

    // Acá crear el input del calendario
    $K.Body.append(
        $("<div>").append(
            $("<div>").attr({ class: "form-group" }).append(
                $("<label>").text("Fecha de reajuste").append(
                    $("<input>").attr({
                        class: "form-control ",
                        type: "date",
                        id: "#fecha"
                    }).css({ "width": "460px" })
                )
            )
        )
    );

    $K.Show();

    $K.Body.closest(".modal-dialog").css({ "width": "500px" });
});

function hideModal(title, msg) {
    let $K = new Debris.Modals.OkModal({
        Title: title,
        Text: msg,
        OkText: "Aceptar"
    });
    $K.Show();
}

function ObtenerPeriodoCobro(IdDemandante, idEmpleador, panel) {

    let totalDeudaNominal;

    $.ajax({
        url : '/GetPeriodosCobro',  // TODO: ¿de dónde viene está vista Django? ¿Demandante?
        type : 'GET',
        data : { Id : IdDemandante, IdEmp : idEmpleador },
        dataType : 'json',
        success : function(json) {
            console.log("Json Periodo Cobros:", json);  // TODO: remover

            var $TblCobro = $("<Table>").addClass("table table-striped table-sm DataTables_Total").css({ width: "100%" });  // TODO: 'var' se usa en lugar de 'let' o 'const'
            panel.append($TblCobro);
            $DtCobros =  $TblCobro.DataTable({
                columns: [
                    {
                        title: "Periodos Demandados",
                        mRender : function(data, type, row) {  // TODO: ¿parámetros 'type' y 'row' no utilizados?
                            return `<text id="0" onClick='EditarMonto(this)'>${data}</text>`;
                        }
                    },
                    {
                        title: "Estado",
                        mRender : function(data, type,row) {  // TODO: ¿parámetros 'type' y 'row' no utilizados?
                            return `<text id="1" onClick='EditEstadoFila(this)'>${data}</text>`;
                        }
                    },
                    {
                        title: "Renta Imponible" ,className: "text-right",
                        mRender: function(data, type, row) {
                            if (row[10] && row[11]) {
                                data = parseInt(Math.min(data, row[9]))
                            }
                            return `<text id="2" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;
    
                        }
                    },
                    {
                        title: "Pagado",
                        className: "text-right",
                        mRender: function(data, type, row) {  // TODO: ¿parámetros 'type' y 'row' no utilizados?
                            return `<text id="3" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;
                        }
                    },
                    {
                        title: "Cobrado",
                        className: "text-right",
                        mRender: function(data, type, row) {  // TODO: ¿parámetros 'type' y 'row' no utilizados?
                            return `<text id="4" onClick='EditarMonto(this, true)'>$${new Intl.NumberFormat("de-DE").format(data)}</text>`;
                        }
                    },
                    {
                        title: "Deuda",
                        className: "text-right",
                        mRender: function(data, type, row) {
                            var result;  // TODO: 'var' se usa en lugar de 'let' o 'const'
                            if (row[10] && row[11]) {
                                result = parseInt(Math.min(row[2], row[9])) - parseInt(row[3]) - parseInt(row[4]);
                            } else {
                                result = parseInt(row[2]) - parseInt(row[3]) - parseInt(row[4]);
                            }
                            row[5] = result;
                            return `<text>$${new Intl.NumberFormat("de-DE").format(result)}</text>`;
                        }
                    },
                    {
                        title: "Empleador",
                        className: "text-right",
                        mRender: function(data, type, row) {
                            // let deuda = CalculoDeuda(row[2], row[3], row[4]);  // TODO: revisar calculo de la función
                            // let result = CalculoEmpleador(deuda);  // TODO: revisar calculo de la función
                            // row[6] = result;
                            let result = row[6];
                            return `<text>$${new Intl.NumberFormat("de-DE").format(Math.round(result))}</text>`;
                        }
                    },
                    {
                        title: "Afiliado",
                        className: "text-right",
                        mRender: function(data, type, row) {
                            // let deuda = CalculoDeuda(row[2], row[3], row[4]);  // TODO: revisar calculo de la función
                            // let result = CalculoAfiliado(deuda);  // TODO: revisar calculo de la función
                            // row[7] = result;
                            let result = row[7];
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
                    }
                ],
                data: json.Data,
                language: Debris.Misc.Lang.DataTable.Es,
                searching: false,
                paging: false,
                footerCallback: function(row, data, start, end, display) {
    
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

                    totalDeudaNominal = totalVertical(8);
                }
            });
            $TblCobro.find("thead").addClass("bg-primary-500");
            $(".DataTables_Total").append(
                $("<tfoot>").append(
                    $("<tr>").append(
                        $("<td>").attr({ "colspan": 8 }).text("Total Deuda Nominal:").attr({ class: "font-weight-bold text-right" })
                    ).append(
                        $("<td>").attr({ "colspan": 1 }).text("$" + totalDeudaNominal).attr({ class: "text-right" })
                    )
                )
            );
        },
        complete : function(xhr, status) {
            CloseWait();
        }
    });
}

function ObtenerDatosAnalisis(IdDemandante, idEmpleador, panel) {
    $.ajax({
        url : 'Resoluciones/GetDemandantesView',
        type : 'GET',
        data : {
            Id : IdDemandante,
            IdEmp : idEmpleador
        },
        dataType : 'json',
        success : function(json) {
            console.log("Análisis:", json);  // TODO: remover
            $DataAnalisis = json.DemandanteView;  // TODO: variable '$DataAnalisis' declarada implícitamente

            //Rit
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Rit : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.Rit, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );
            //Estado Demanda
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Estado demanda : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.EstadoDemanda, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );
            // Tribunal
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Tribunal : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.Tribunal, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Empleador
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Empleador : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.Empleador, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // RutEmpleador
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Rut Empleador : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.RutEmpleador, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Rut
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Rut : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.Rut, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Nombre
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Nombre : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.Nombre, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Inicio Relacion Laboral
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Inicio Relacion Laboral : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.InicioRelacionLaboral, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Fin Relacion Laboral
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Fin Relacion Laboral : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.FinRelacionLaboral, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Renta Mensual
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Renta Mensual : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.RentaMensual, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Estado Demandante
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Estado Demandante : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Input>").attr({ Type: "Text", Value: $DataAnalisis.EstadoDemandante, readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Observaciones del Caso
            panel.append( 
                $("<Div>").attr({ Class: "container" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ Class: "col-md-3" }).append(
                            $("<Text>").text("Observaciones del Caso : ")
                        )
                    ).append(
                        $("<Div>").attr({ Class: "col-md-9" }).append(
                            $("<Textarea>").attr({ Type: "Text", Value: $DataAnalisis.ObservacionCaso, rows: "4", readonly: "readonly", class: "form-control"})
                        )
                    )
                )
            );

            // Convalidacion
            panel.append(
                $("<Div>").attr({ class: "container mb-4" }).append(
                    $("<Div>").attr({ class: "row mt-3" }).append(
                        $("<Div>").attr({ class: "col-md-3" }).append(
                            $("<Text>").text("Convalidación : ")
                        )
                    ).append(
                        $("<Div>").attr({ class: "col-md-9" }).append(
                            $("<Input>").attr({ type: "checkbox", checked: $DataAnalisis.Convalidacion, disabled: "disabled"})
                        )
                    )
                )
            );
        },
        complete : function(xhr, status) { }
    });
}

function $AccionesResolucion($Conf) {  // TODO: ¿parámetro '$Conf' no utilizado?
    return "<Button OnClick='EditarResolucion(this);' Class='btn btn-primary btn-xs'><Span Class='fa fa-pencil'></Span>";
}

// Función que permite editar documento `pdf` de Resolución
function editarPdfResolucion(DocumentoId) {
    let data = new FormData();
    data.append("file", $("input[id^='file']")[0].files[0])
    data.append("csrfmiddlewaretoken", "{{ csrf_token }}");  // TODO: no se está enviando

    $.ajax({
        method: "POST",
        url: "/Resoluciones/Update/Pdf" + "?DocumentoId=" + DocumentoId,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        enctype: "multipart/form-data",
        data: data,
        success: function(res) {
            console.log("success", res);
            $("#file").val(null);
        }
    });
}

function cambiarEstadoAporte(numeroResolucion, demandanteId, empresaId) {
    $.ajax({
        method: "GET",
        url: "/Resoluciones/Enviar/Aporte",
        data: {
            numeroResolucion: numeroResolucion,
            demandanteId: demandanteId,
            empresaId: empresaId,
        },
        success: function(res) {
            console.log("success", res);
            $DT.Search($SearchPanel.Object);
        }
    });
}

//// MODAL DE VALIDACION DE RESOLUCIONES /////////////
function EditarResolucion($Sender, IdDemandante) {  // TODO: ¿parámetro 'IdDemandante' no utilizado?

    var $Tr = $($Sender).closest("Tr");  // TODO: 'var' se usa en lugar de 'let' o 'const'
    var $Data = $DT.DataTable.row($Tr).data();  // TODO: 'var' se usa en lugar de 'let' o 'const'

    // Botones del modal: Aprobar / Rechazar
    let $K = new Debris.Modals.YesNoModal({
        "Title": "Análisis de Resolución: " + $Data.Numero,
        "Large": true,
        "YesText": "Aprobar",
        "NoText": "Rechazar",
        "YesCallback": function() {
            $.ajax({
                url: "/Resoluciones/Cambiar/Estado",
                type: "GET",
                data: {
                    cambiarEstado: "aprobar",
                    numeroResolucion: $Data.Numero
                },
                success: function (res) {
                    console.log("res", res);
                    $DT.Search($SearchPanel.Object);
                }
            });
        },
        "NoCallback": function() {
            $.ajax({
                url: "/Resoluciones/Cambiar/Estado",
                type: "GET",
                data: {
                    cambiarEstado: "rechazar",
                    numeroResolucion: $Data.Numero
                },
                success: function (res) {
                    console.log("res", res);
                    $DT.Search($SearchPanel.Object);
                }
            });
        }
    });

    // Modal
    $K.Body.closest(".modal-dialog").css({ "max-width": "90%" });

    $K.Show();

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({  // TODO: 'var' se usa en lugar de 'let' o 'const'
        Container: $K.Body,
        OnValidated: function(){
            $Modal.Yes.attr({ disabled: !($MainPanel.IsModified && $MainPanel.Validation.IsValid)});
        }
    });

    var $Panel1;  // TODO: 'var' se usa en lugar de 'let' o 'const'
    var $Panel2;  // TODO: 'var' se usa en lugar de 'let' o 'const'

    //-> CREAR LOS DOS PANELES PARA DIVIDIR LA PANTALLA
    $MainPanel
        .NewRow()
            .NewCell({ XS: 6, OnCreated: $X => $Panel1 = $X })
            .Append(
                // Panel PDF Resolucion
            )
            .NewCell({ XS: 6, OnCreated: $X => $Panel2 = $X })
            .Append(
                // Panel Tabs
            );

    // Panel PDF Resolución: Formulario para modificar documento PDF de Resolución
    $Panel1.append(
        $("<div>").attr({ class: "container" }).append(
            $("<div>").attr({ class: "row mt-3 mb-3" }).append(
                $("<div>").attr({ class: "col-md-8" }).append(
                    $("<input>").attr({
                        class: "float-left",
                        type: "file",
                        id: "file",
                    })
                )
            ).append(
                $("<div>").attr({ class: "col-md-4" }).append(
                    $("<button>").attr({
                        class: "btn-xs btn-primary float-right",
                        type: "submit",
                        onclick: `editarPdfResolucion(${$Data.Documento_id})`,
                    }).text("Reemplazar")
                )
            )
        )
    );

    // Panel PDF Resolución: Documento PDF de Resolución embebido
    $Panel1.append(
        $("<embed>").attr({
            type: "application/pdf",
            width: "100%",
            height: "600px",
            src: "/Documento/Download" + "?Id=" + $Data.Documento_id
        })
    );

    //-> TABS PARA EL PANEL DEL LADO IZQUIERDO
    var $Tabs = new Debris.Components.Bootstrap.Tabs({  // TODO: 'var' se usa en lugar de 'let' o 'const'
        Container: $Panel2,
        Titles: ["Analisis", "Hoja de Calculo", "Caso / Demanda"]
    });
    $Tabs.Render();

    // Tab con los datos obtenidos del analisis de sentencias
    // $Tabs.Panels[0].append( $("<Text>").text("Datos obtenidos del analisis de la sentencia") );
    $Tabs.Panels[0].attr({style:"overflow: scroll; max-height: 600px;"});
    ObtenerDatosAnalisis($Data.Demandante_id, $Data.Empresa_id, $Tabs.Panels[0]);

    // Tab con la hoja de calculo
    // $Tabs.Panels[1].append( $("<Text>").text("hoja de calculo") );
    $Tabs.Panels[1].addClass("table-responsive");
    $Tabs.Panels[1].attr({style:"overflow: scroll; max-height: 600px;"});
    ShowWait("");
    ObtenerPeriodoCobro($Data.Demandante_id, $Data.Empresa_id, $Tabs.Panels[1]);

    // Tab con el PDF de la demanda
    // $Tabs.Panels[2].append( $("<Text>").text("PDF demanda") );
    $Tabs.Tabs[2].on("click", function(){   });
    $Tabs.Panels[2].append(
        $("<Embed></Embed>").attr({
            type: "application/pdf",
            width: "100%",
            height: "600px",
            src: "/Documento/Download" + "?Id=" + $Data.DemandaDocumento_id
        })
    );

    let conAporte = $Data.EstadoResolucion !== "Aporte";

    $Panel2.append(
        $("<button>").attr({
            id: "#BtnAporte",
            hidden: conAporte,
            class: "btn btn-warning float-right mt-2",
            onclick: `cambiarEstadoAporte(${$Data.Numero}, ${$Data.Demandante_id}, ${$Data.Empresa_id})`,
        }).text("Enviar a aporte").append(
            $("<span>").attr({
                class: "ml-2 fal fa-plus"
            })
        )
    );
}
