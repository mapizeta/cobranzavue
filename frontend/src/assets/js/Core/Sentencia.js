var $ColumnTypes = $ColumnTypes || {};
$ColumnTypes.TipoSentenciaActions = $TipoSentenciaActions;
var $FrasesSentenciaDT;

function $TipoSentenciaActions($Conf){
    return "<Button OnClick='EditarFrasesSentencia(this)' Class='btn btn-primary btn-xs'>Abrir</Button>";
};

// Permite seleccionar elementos de la columna 1 
// luego Borra las frases seleccionadas en el creador de frases 

var $SelectedFraseSentencia = [];
var $AllSelectedFraseSentencia = false;

var $FraseSentenciaCol1Changed = function ($Options) {
    
    $SelectedFraseSentencia = $Options.ColumnData.CheckedColumns;
    $AllSelectedFraseSentencia = $Options.ColumnData.HeaderIsChecker;

    if($Options.ColumnData.CheckedColumns.length || $AllSelectedFraseSentencia) {
        $("#BtnDeleteFraseSentencia").prop({ disabled: false });
    }else{
        $("#BtnDeleteFraseSentencia").prop({ disabled: true });
    }
}

function DeleteSelectedFraseSentencia() {

    var $CntSelected;
    if($AllSelectedFraseSentencia){
        $CntSelected = $FrasesSentenciaDT.TotalFiltered;
    }else{
        $CntSelected = $SelectedFraseSentencia.length;
    }
    
    var $A = Debris.Misc.Random(1, 10);
    var $B = Debris.Misc.Random(1, 10);

    var $Confirm = new Debris.Modals.YesNoModal({
        Text: "Se eliminarán " + $CntSelected + " registros<Br><Br>Resuelva la siguiente suma para continuar:<Br>"
        , Title: "Confirmación"
        , YesCallback: function(){
            if($AllSelectedFraseSentencia){
                $FrasesSentenciaDT.Delete({ IDs: "__ALL__" });
            }else{
                $FrasesSentenciaDT.Delete({ 
                    IDs: $SelectedFraseSentencia, 
                    AfterSuccess: function(){
                        $FrasesSentenciaDT.Search({ TipoSentencia: $FraseSentenciaId });
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


if($JsonContext.FrasesSentenciaCols){
    $JsonContext.FrasesSentenciaCols.Col1.OnChange = "$FraseSentenciaCol1Changed";
}

// Mostrar frases asociadas, permitir crear una nueva 
function EditarFrasesSentencia($Sender) {

    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();
    console.log($Data);
    $FraseSentenciaId = $Data.Id;
    var $InitFrases;  //= GetFrases($FraseSentenciaId);
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

    var $AddFraseSentencia = function(){
        if($MainPanel.Validation.IsValid){
            $MainPanel.Validation.Run();
            $FrasesSentenciaDT.Create({ 
                Bean: $MainPanel.Object, 
                AfterSuccess: function(){
                    $FrasesSentenciaDT.Search({ TipoSentencia: $Data.Id });
                    $MainPanel.Conf.Texto.Control[0].value = "";
                } 
            });
            
        } else {
            $MainPanel.Validation.Run();
        }
    };

    $Modal.Show();

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({ Container: $Modal.Body }); 

    var $NotificacionFrasesSentencia

    $MainPanel
        .NewRow()
            .NewCell({ xs : 8 })
            .NewLabel("Nueva Frase de Sentencia")
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
                    .on("click", $AddFraseSentencia)
            )
        .NewRow({ OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }})
            .NewCell({ XS: 6 })
            .Append(
                $("<Button>")
                    .attr({ Class: "btn btn-danger btn-sm", Id: "BtnDeleteFraseSentencia" })
                    .append("Eliminar seleccionadas&nbsp;&nbsp;")
                    .append( $("<Span>").addClass("fa fa-times") )
                    .on("click", DeleteSelectedFraseSentencia)
            )
        .NewRow()
            .NewCell({
                XS: 12,
                OnCreated: function($NewCell){
                    $NotificacionFrasesSentencia = new Debris.Components.Bootstrap.Notifications({ Container: $NewCell, Time: 5000 });
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
                    Total: $JsonContext.FrasesSentenciaTotal
                    , Columns: $JsonContext.FrasesSentenciaCols
                    , ReadService: "/FrasesSentencia/Crud"
                    , CreateService: "/FrasesSentencia/Crud"
                    , UpdateService: "/FrasesSentencia/Crud"
                    , DeleteService: "/FrasesSentencia/Crud"
                    , NotificationPanel: $NotificacionFrasesSentencia
                    , OnDraw: $BlueHeader
                    , FilterOnSuccess: false
                    , AjaxData: {
                        TipoSentencia: $Data.Id
                    }
                },
                OnCreated: function($New) {
                    $InitFrases = function() {
                        $FrasesSentenciaDT = $New.Conf;
                        $New.Conf.Init();
                        $New.Conf.Table.addClass("table table-striped table-sm").css({ width: "100%" });
                    }
                }
            })
        ;

        $InitFrases();
        $MainPanel.Object.TipoSentencia = $Data.Id;
        $Modal.Yes.remove();
        $Modal.No.remove();
        // $FrasesSentenciaDT.Search({ TipoSentencia : $Data.Id });
        $MainPanel.Validation.Init();
};

function CrearTipoSentencia(){

    var $YN = new Debris.Modals.YesNoModal({ 
        YesText: "Aceptar", 
        NoText: "Cancelar", 
        Title: "Nueva Tipo de Sentencia",
        YesCallback: function(){
            if($PanelSentencia.Validation.IsValid){
                $DT.Create({ Bean: $PanelSentencia.Object });
                $YN.Hide();
            }else{
                $PanelSentencia.Validation.Run();
            }
        },
        CloseOnYes: false
    });
    
    var $PanelSentencia = new Debris.Misc.Bootstrap4Layout({ 
        Container: $YN.Body
    });

    $PanelSentencia
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