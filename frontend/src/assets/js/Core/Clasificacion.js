var $ColumnTypes = $ColumnTypes || {};
$ColumnTypes.ClasificacionActions = $ClasificacionActions;
var $FraseClasificacionDT;

function $ClasificacionActions($Conf){
    return "<Button OnClick='EditarClasificacion(this)' Class='btn btn-primary btn-xs'>Abrir</Button>";
};

var $SelectedFraseClasificacion = [];
var $AllSelectedFraseClasificacion = false;

var $FraseClasificacionCol1Changed = function($Options){
    console.log($Options.ColumnData);
    $SelectedFraseClasificacion = $Options.ColumnData.CheckedColumns;
    $AllSelectedFraseClasificacion = $Options.ColumnData.HeaderIsChecked;
    if($Options.ColumnData.CheckedColumns.length || $AllSelectedFraseClasificacion){
        $("#BtnDeleteFraseClasificacion").prop({ disabled: false });
    }else{
        $("#BtnDeleteFraseClasificacion").prop({ disabled: true });
    }
};

function DeleteSelectedFraseClasificacion(){
    var $CntSelected;
    if($AllSelectedFraseClasificacion){
        $CntSelected = $FraseClasificacionDT.TotalFiltered;
    }else{
        $CntSelected = $SelectedFraseClasificacion.length;
    }
    
    var $A = Debris.Misc.Random(1, 10);
    var $B = Debris.Misc.Random(1, 10);

    var $Confirm = new Debris.Modals.YesNoModal({
        Text: "Se eliminarán " + $CntSelected + " registros<Br><Br>Resuelva la siguiente suma para continuar:<Br>"
        , Title: "Confirmación"
        , YesCallback: function(){
            if($AllSelectedFraseClasificacion){
                $FraseClasificacionDT.Delete({ IDs: "__ALL__" });
            }else{
                $FraseClasificacionDT.Delete({ 
                    IDs: $SelectedFraseClasificacion, 
                    AfterSuccess: function(){
                        $FraseClasificacionDT.Search({ Clasificacion: $FraseClasificacionId });
                    }
                });
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

if($JsonContext.FrasesClasificacionCols){
    $JsonContext.FrasesClasificacionCols.Col1.OnChange = "$FraseClasificacionCol1Changed";
}

function CrearClasificacion(){

    var $YN = new Debris.Modals.YesNoModal({ 
        YesText: "Aceptar", 
        NoText: "Cancelar", 
        Title: "Nueva Clasificación",
        YesCallback: function(){
            if($PanelTribunal.Validation.IsValid){
                $DT.Create({ Bean: $PanelTribunal.Object });
                $YN.Hide();
            }else{
                $PanelTribunal.Validation.Run();
            }
        },
        CloseOnYes: false
    });
    var $PanelTribunal = new Debris.Misc.Bootstrap4Layout({ 
        Container: $YN.Body
    });
    $PanelTribunal
        .NewRow()
            .NewCell({ Xs: 12 })
            .NewLabel("Descripción")
            .NewDebris({
                Type: "Input_Text",
                OnCreated: function($New){ 
                    $New.Conf.Control.addClass("form-control");
                },
                Name: "Description",
                Args: {
                    Validations: { Required: { NoValidMsg: "Por favor, Ingrese <I>Descripción</I>" } }
                }
            });

    $YN.Show();
}

function EditarClasificacion($Sender){
    
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();
    console.log($Data);
    $FraseClasificacionId = $Data.Id;
    var $InitFrases;

    var $CommitUpdate = function(){
        $DT.Update({ 
            Bean: $MainPanel.Object
        });
    };

    var $Modal = new Debris.Modals.YesNoModal({ 
        Title: "Frases",
        YesText: "Guardar cambios", 
        NoText: "Descartar cambios",
        YesCallback: $CommitUpdate,
        CloseCallback: function(){
            if($MainPanel.IsModified){
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

    $Modal.Show();

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({ Container: $Modal.Body });

    var $NotificacionFrasesClasificacion;

    var $AddFrase = function(){
        if($MainPanel.Validation.IsValid){
            $MainPanel.Validation.Run();
            $FraseClasificacionDT.Create({ 
                Bean: $MainPanel.Object, 
                AfterSuccess: function(){
                    $FraseClasificacionDT.Search({ Clasificacion: $Data.Id });
                    $MainPanel.Conf.Texto.Control[0].value = "";
                } 
            });
            
        }else{
            $MainPanel.Validation.Run();
        }
    };

    $MainPanel
        .NewRow()
            .NewCell({ XS: 8 })
            .NewLabel("Nueva frase")
            .NewDebris({
                Type: "Input_Text"
                , Name: "Texto"
                , OnCreated: function($New){ $New.Conf.Control.addClass("form-control form-control-sm") }
                , Args:{
                    Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Nueva frase</I>" } }
                }
            })
        //.NewRow({ OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }})
            .NewCell({ AlignEnd: 4 })
            .Append(
                $("<Button>")
                    .attr({ Class: "btn btn-success btn-sm" })
                    .append( $("<Text>").append("Añadir Frase&nbsp;&nbsp;") )
                    .append( $("<Span>").addClass("fa fa-plus") )
                    .on("click", $AddFrase)
            )
        .NewRow(/* { OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }} */)
            .NewCell({ XS: 12 })
                .Append(
                    $("<Button>")
                        .attr({ Class: "btn btn-danger btn-sm", Id: "BtnDeleteFraseClasificacion" })
                        .append("Eliminar seleccionadas&nbsp;&nbsp;")
                        .append( $("<Span>").addClass("fa fa-times") )
                        .on("click", DeleteSelectedFraseClasificacion)
                )
        .NewRow()
            .NewCell({
                XS: 12,
                OnCreated: function($NewCell){
                    $NotificacionFrasesClasificacion = new Debris.Components.Bootstrap.Notifications({ Container: $NewCell, Time: 5000 });
                }
            })

        .NewRow({ OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }})
            .NewCell({ XS: 12 })
                .Append(
                    $("<Hr>")
                )

        .NewRow()
            .NewCell({ XS: 12 })
            .NewDebris({
                Type: "AjaxDataTable",
                Args: {
                    Total: $JsonContext.FrasesClasificacionTotal
                    , Columns: $JsonContext.FrasesClasificacionCols
                    , ReadService: "/FrasesClasificacion/Crud"
                    , CreateService: "/FrasesClasificacion/Crud"
                    , UpdateService: "/FrasesClasificacion/Crud"
                    , DeleteService: "/FrasesClasificacion/Crud"
                    , NotificationPanel: $NotificacionFrasesClasificacion
                    , OnDraw: $BlueHeader
                    , FilterOnSuccess: false
                    , AjaxData: {
                        Clasificacion: $Data.Id
                    }
                },
                OnCreated: function($New){
                    $InitFrases = function(){
                        $FraseClasificacionDT = $New.Conf;
                        $New.Conf.Init();
                        $New.Conf.Table.addClass("table table-striped table-sm").css({ width: "100%" });
                    };
                }
            })
        ;

        $InitFrases();
        $MainPanel.Object.Clasificacion = $Data.Id;
        $Modal.Yes.remove();
        $Modal.No.remove();
        //$FraseClasificacionDT.Search({ Clasificacion: $Data.Id });
        $MainPanel.Validation.Init();

        console.log("$FraseClasificacionDT:");
        console.log($FraseClasificacionDT);

        console.log("$JsonContext:");
        console.log($JsonContext);

}
