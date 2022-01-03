var $ColumnTypes = $ColumnTypes || {};
$ColumnTypes.RegionActions = $RegionActions;
var $ComunaDT;

function $RegionActions($Conf){
    return "<Button OnClick='EditarRegion(this)' Class='btn btn-primary btn-xs'>Abrir</Button>";
};

var $SelectedComuna = [];
var $AllSelectedComuna = false;

var $ComunaCol1Changed = function($Options){
    console.log($Options.ColumnData);
    $SelectedComuna = $Options.ColumnData.CheckedColumns;
    $AllSelectedComuna = $Options.ColumnData.HeaderIsChecked;
    if($Options.ColumnData.CheckedColumns.length || $AllSelectedComuna){
        $("#BtnDeleteComuna").prop({ disabled: false });
    }else{
        $("#BtnDeleteComuna").prop({ disabled: true });
    }
};

function DeleteSelectedComuna(){
    var $CntSelected;
    if($AllSelectedComuna){
        $CntSelected = $ComunaDT.TotalFiltered;
    }else{
        $CntSelected = $SelectedComuna.length;
    }
    
    var $A = Debris.Misc.Random(1, 10);
    var $B = Debris.Misc.Random(1, 10);

    var $Confirm = new Debris.Modals.YesNoModal({
        Text: "Se eliminarán " + $CntSelected + " registros<Br><Br>Resuelva la siguiente suma para continuar:<Br>"
        , Title: "Confirmación"
        , YesCallback: function(){
            if($AllSelectedComuna){
                $ComunaDT.Delete({ IDs: "__ALL__" });
            }else{
                $ComunaDT.Delete({ 
                    IDs: $SelectedComuna, 
                    AfterSuccess: function(){
                        $ComunaDT.Search({ Region: $ComunaId });
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

if($JsonContext.ComunasCols){
    $JsonContext.ComunasCols.Col1.OnChange = "$ComunaCol1Changed";
}

function CrearRegion(){
    var $YN = new Debris.Modals.YesNoModal({ 
        YesText: "Aceptar", 
        NoText: "Cancelar", 
        Title: "Nueva Región",
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

function EditarRegion($Sender){
    
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();
    $ComunaId = $Data.Id;
    var $InitComunas;

    var $CommitUpdate = function(){
        $DT.Update({ 
            Bean: $MainPanel.Object
        });
    };

    var $Modal = new Debris.Modals.YesNoModal({ 
        Title: "Comunas de " + $Data.Nombre,
        YesText: "Guardar cambios", 
        NoText: "Descartar cambios",
        YesCallback: $CommitUpdate,
        CloseCallback: function(){
            if($MainPanel.Object.Codigo!="" || $MainPanel.Object.Nombre!=""){
                var $Exit = new Debris.Modals.YesNoModal({ 
                    Title: "Confirmación", 
                    Text: "¿Desea salir sin guardar los cambios?", 
                    YesText: "Sí", 
                    NoText: "No",
                    NoCallback: $Modal.Show
                });
                $Exit.Show();
            }
            // if($MainPanel.IsModified){
            //     var $Exit = new Debris.Modals.YesNoModal({ 
            //         Title: "Confirmación", 
            //         Text: "¿Desea salir sin guardar los cambios?", 
            //         YesText: "Sí", 
            //         NoText: "No",
            //         NoCallback: $Modal.Show
            //     });
            //     $Exit.Show();
            // }
        }
    });

    $Modal.Show();

    var $MainPanel = new Debris.Misc.Bootstrap4Layout({ Container: $Modal.Body });

    var $NotificacionComuna;

    var $AddComuna = function(){
        console.log($MainPanel);
        if($MainPanel.Validation.IsValid){
            $MainPanel.Validation.Run();
            $ComunaDT.Create({ 
                Bean: $MainPanel.Object
                , AfterSuccess: function(){
                    $ComunaDT.Search({ Region: $Data.Id });
                    $MainPanel.Object.Codigo = "";
                    $MainPanel.Object.Nombre = "";
                }
                , WhenResult: {
                    1: function($Res){
                        $ComunaDT.NotificationPanel.Type = "danger";
                        $ComunaDT.NotificationPanel.Time = 0;
                        $ComunaDT.NotificationPanel.Text = $Res.Msg;
                    }
                }
            });
            
        }else{
            $MainPanel.Validation.Run();
        }
        //console.log($MainPanel.Object);
    };

    $MainPanel
        // .NewRow()
        //     .NewCell({ XS: 12 })
        //     .NewLabel("Descripción")
        //     .NewDebris({
        //         Type: "Input_Text", Name: "Description", OnCreated: function($New){ $New.Conf.Control.addClass("form-control form-control-sm") }
        //     })
        // .NewRow()
        //     .NewCell({ XS: 12 })
        //         .Append(
        //             $("<Hr>")
        //         )
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Código")
            .NewDebris({
                Type: "Input_Text"
                , Name: "Codigo"
                , OnCreated: function($New){ $New.Conf.Control.addClass("form-control form-control-sm") }
                , Args:{
                    Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Código</I>" } }
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Nombre")
            .NewDebris({
                Type: "Input_Text"
                , Name: "Nombre"
                , OnCreated: function($New){ $New.Conf.Control.addClass("form-control form-control-sm") }
                , Args:{
                    Validations: { Required: { NoValidMsg: "Por favor, ingrese <I>Nombre</I>" } }
                }
            })
        .NewRow({ OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }})
            .NewCell({ XS: 12 })
            .Append(
                $("<Button>")
                    .attr({ Class: "btn btn-primary btn-sm", Id: "BtnDeleteComuna" })
                    .append("Eliminar seleccionadas&nbsp;&nbsp;")
                    .append( $("<Span>").addClass("fa fa-times") )
                    .on("click", DeleteSelectedComuna)
            )
            .Append(
                $("<Text></Text>").append("&nbsp;")
            )
            .Append(
                $("<Button>")
                    .attr({ Class: "btn btn-success btn-sm" })
                    .append( $("<Text>").append("Añadir Comuna&nbsp;&nbsp;") )
                    .append( $("<Span>").addClass("fa fa-plus") )
                    .on("click", $AddComuna)
            )
        .NewRow({ OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }})
            .NewCell({ XS: 12 })
                .Append(
                    $("<Hr>")
                )
        // .NewRow(/* { OnCreated: function($New){ console.log($New.Row.removeClass("form-group")); }} */)
        //     .NewCell({ XS: 12 })
        //         .Append(
        //             $("<Button>")
        //                 .attr({ Class: "btn btn-primary btn-sm", Id: "BtnDeleteComuna" })
        //                 .append("Eliminar seleccionadas&nbsp;&nbsp;")
        //                 .append( $("<Span>").addClass("fa fa-times") )
        //                 .on("click", DeleteSelectedComuna)
        //         )
        .NewRow()
            .NewCell({
                XS: 12,
                OnCreated: function($NewCell){
                    $NotificacionComuna = new Debris.Components.Bootstrap.Notifications({ Container: $NewCell, Time: 5000 });
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewDebris({
                Type: "AjaxDataTable",
                Name: "ListComunas",
                Args: {
                    Total: $JsonContext.ComunasTotal
                    , Columns: $JsonContext.ComunasCols
                    , ReadService: "/Comuna/Crud"
                    , CreateService: "/Comuna/Crud"
                    , UpdateService: "/Comuna/Crud"
                    , DeleteService: "/Comuna/Crud"
                    , NotificationPanel: $NotificacionComuna
                    , OnDraw: $BlueHeader
                    , FilterOnSuccess: false
                    , AjaxData: { 
                        SearchBean: JSON.stringify({
                            Region: $Data.Id
                        })
                    }
                },
                OnCreated: function($New){
                    $InitComunas = function(){
                        $ComunaDT = $New.Conf;
                        $New.Conf.Init();
                        $New.Conf.Table.addClass("table table-striped table-sm").css({ width: "100%" });
                        $ComunaDT.Search({ Region: $Data.Id });
                    };
                }
            })
        ;

        $InitComunas();

        $MainPanel.Object.Region = $Data.Id;

        $Modal.Yes.remove();
        $Modal.No.remove();

        $MainPanel.Validation.Init();

        $MainPanel.Conf.ListComunas.Control.closest(".row").next().children().first().removeClass("col-md-5")

}
