var $ColumnTypes = $ColumnTypes || {};
$ColumnTypes.TipoEjecutoriaActions = $TipoEjecutoriaActions;
var $FraseEjecutoriaDT;

function $TipoEjecutoriaActions($Conf){
    return "<Button OnClick='EditarFraseEjecutoria(this)' Class='btn btn-primary btn-xs'>Abrir</Button>";
};

// Permite seleccionar elementos de la columna 1 
// luego Borra las frases seleccionadas en el creador de frases 

var $SelectedFraseEjecutoria = [];
var $AllSelectedFraseEjecutoria = false;

var $FraseEjecutoriaCol1Changed = function ($Options) {
    
    $SelectedFraseEjecutoria = $Options.ColumnData.CheckedColumns;
    $AllSelectedFraseEjecutoria = $Options.ColumnData.HeaderIsChecker;

    if($Options.ColumnData.CheckedColumns.length || $AllSelectedFraseEjecutoria) {
        $("#BtnDeleteFraseEjecutoria").prop({ disabled: false });
    }else{
        $("#BtnDeleteFraseEjecutoria").prop({ disabled: true });
    }
}

function DeleteSelectedFraseEjecutoria() {

    var $CntSelected;
    if($AllSelectedFraseEjecutoria){
        $CntSelected = $FraseEjecutoriaDT.TotalFiltered;
    }else{
        $CntSelected = $SelectedFraseEjecutoria.length;
    }
    
    var $A = Debris.Misc.Random(1, 10);
    var $B = Debris.Misc.Random(1, 10);

    var $Confirm = new Debris.Modals.YesNoModal({
        Text: "Se eliminarán " + $CntSelected + " registros<Br><Br>Resuelva la siguiente suma para continuar:<Br>"
        , Title: "Confirmación"
        , YesCallback: function(){
            if($AllSelectedFraseEjecutoria){
                $FraseEjecutoriaDT.Delete({ IDs: "__ALL__" });
            }else{
                $FraseEjecutoriaDT.Delete({ 
                    IDs: $SelectedFraseEjecutoria, 
                    AfterSuccess: function(){
                        $FraseEjecutoriaDT.Search({ TipoEjecutoria: $FraseEjecutoriaId });
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
}


if($JsonContext.FrasesEjecutoriaCols){
    $JsonContext.FrasesEjecutoriaCols.Col1.OnChange = "$FraseEjecutoriaCol1Changed";
}

// Mostrar frases asociadas, permitir crear una nueva 
function EditarFraseEjecutoria($Sender) {

    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();
    $FraseEjecutoriaId = $Data.Id;
    var $InitFrases;  //= GetFrases($FraseEjecutoriaId);
    //console.log($InitFrases); // tal vez use esto 

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

    var $AddFraseEjecutoria = function(){
        if($MainPanel.Validation.IsValid){
            $MainPanel.Validation.Run();
            $FraseEjecutoriaDT.Create({ 
                Bean: $MainPanel.Object, 
                AfterSuccess: function(){
                    $FraseEjecutoriaDT.Search({ TipoEjecutoria: $Data.Id });
                    $MainPanel.Conf.Texto.Control[0].value = "";
                } 
            });
            
        } else {
            $MainPanel.Validation.Run();
        }
    };

    $Modal.Show();

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({ Container: $Modal.Body }); 

    var $NotificacionFrasesEjecutoria

    $MainPanel
        .NewRow()
            .NewCell({ xs : 8 })
            .NewLabel("Nueva Frase de Ejecutoria")
            .NewDebris({
                Type: "Input_Text"
                , Name: "Texto"
                , OnCreated: function($New){ $New.Conf.Control.addClass("form-control form-control-sm") }
                , Args:{
                    Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Nueva frase</I>" } }
                }
            })            
            .NewCell({ AlignEnd: 4 })
            .Append(
                $("<Button>")
                    .attr({ Class: "btn btn-success btn-sm" })
                    .append( $("<Text>").append("Añadir Frase&nbsp;&nbsp;") )
                    .append( $("<Span>").addClass("fa fa-plus") )
                    .on("click", $AddFraseEjecutoria)
            )
        .NewRow({ OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }})
            .NewCell({ XS: 6 })
            .Append(
                $("<Button>")
                    .attr({ Class: "btn btn-danger btn-sm", Id: "BtnDeleteFraseEjecutoria" })
                    .append("Eliminar seleccionadas&nbsp;&nbsp;")
                    .append( $("<Span>").addClass("fa fa-times") )
                    .on("click", DeleteSelectedFraseEjecutoria)
            )
        .NewRow()
            .NewCell({
                XS: 12,
                OnCreated: function($NewCell){
                    $NotificacionFrasesEjecutoria = new Debris.Components.Bootstrap.Notifications({ Container: $NewCell, Time: 5000 });
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
                    Total: $JsonContext.FrasesEjecutoriaTotal
                    , Columns: $JsonContext.FrasesEjecutoriaCols
                    , ReadService: "/FrasesEjecutoria/Crud"
                    , CreateService: "/FrasesEjecutoria/Crud"
                    , UpdateService: "/FrasesEjecutoria/Crud"
                    , DeleteService: "/FrasesEjecutoria/Crud"
                    , NotificationPanel: $NotificacionFrasesEjecutoria
                    , OnDraw: $BlueHeader
                    , FilterOnSuccess: false
                    , AjaxData: {
                        TipoEjecutoria: $Data.Id
                    }
                },
                OnCreated: function($New) {
                    $InitFrases = function() {
                        $FraseEjecutoriaDT = $New.Conf;
                        $New.Conf.Init();
                        $New.Conf.Table.addClass("table table-striped table-sm").css({ width: "100%" });
                    }
                }
            })
        ;

        $InitFrases();
        $MainPanel.Object.TipoEjecutoria = $Data.Id;
        $Modal.Yes.remove();
        $Modal.No.remove();
        // $FraseEjecutoriaDT.Search({ TipoEjecutoria : $Data.Id });
        $MainPanel.Validation.Init();
};

function CrearTipoEjecutoria(){

    var $YN = new Debris.Modals.YesNoModal({ 
        YesText: "Aceptar", 
        NoText: "Cancelar", 
        Title: "Nueva Tipo de Ejecutoria",
        YesCallback: function(){
            if($PanelEjecutoria.Validation.IsValid){
                $DT.Create({ Bean: $PanelEjecutoria.Object });
                $YN.Hide();
            }else{
                $PanelEjecutoria.Validation.Run();
            }
        },
        CloseOnYes: false
    });
    
    var $PanelEjecutoria = new Debris.Misc.Bootstrap4Layout({ 
        Container: $YN.Body
    });

    $PanelEjecutoria
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