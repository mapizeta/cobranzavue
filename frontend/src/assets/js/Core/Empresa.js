
function AgregarEmpresa($Callback){
    
    var $Empresa = ModalEmpresa({ 
        Title: "Nueva Empresa",
        YesCallback: function(){
            ShowWait();
            $.ajax({
                data: { Token: Token, Bean: JSON.stringify($Empresa.Panel.Object) },
                type: "POST",
                url: $JsonContext.EmpresaCreate,
                success: function($Res){
                    if( $Res.Result == 0 ){
                        $Callback($Res);
                        CloseWait();
                    } else {
                        CloseWait();
                        var $Msg = new Debris.Modals.OkModal({
                            Title : "Error",
                            Text: $Res.Msg,
                            OkText: "Aceptar"
                        });
                        $Msg.Show();
                    }
                }
            });
        },
        YesText: "Guardar",
        NoText: "Descartar"
    });
    $Empresa.Modal.Yes.attr({ disabled: true });
    $Empresa.Panel.Init();
    $Empresa.Panel.Validation.Init();

}

function ModalEmpresa($ModalOptions){

    var $Modal = new Debris.Modals.YesNoModal($ModalOptions);

    var $Panel = new Debris.Misc.Bootstrap4Layout({
        Container: $Modal.Body,
        OnValidated: function(){
            // Provisorio, esto debería ser en una especie de "OnValueChanged"
            $Modal.Yes.attr({ disabled: !($Panel.IsModified && $Panel.Validation.IsValid) });
        }
    });

    var $AddFormControl = function($New){
        $New.Conf.Control.addClass("form-control");
    };

    
    var $ValuesToAdd = $JsonContext.EmpresaCols.Comuna.Values
    var $FinalValues = [{ Value: "", Text: "Seleccionar"}]
    
    for (i = 0; i < $ValuesToAdd.length; i ++) {
        $FinalValues.push($ValuesToAdd[i])
    }

    $Panel
        .NewRow()
            .NewCell({ XS: 12 })    
            .NewLabel("Nombre")
            .NewDebris({
                Type: "Input_Text", Name: "Nombre", OnCreated: $AddFormControl, 
                Args: {
                    Title: "<I>Nombre</I>"
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Rut Empleador")   
            .NewDebris({
                Type: "Input_Rut", Name: "RutEmpleador", OnCreated: $AddFormControl,
                Args: {
                    Validations: { Rut: {  }, Required: {  } }, 
                    Title: "<I>Rut</I>"
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Comuna")
            .NewDebris({
                Type: "Input_Select2", Name: "Comuna", OnCreated: $AddFormControl, 
                Args: {
                    Title: "<I>Comuna</I>", 
                    Values: $FinalValues,
                    Parent: $Modal.Body
                },
                Value: ""
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Quiebra")
            .Append( $("<Br>") )
            .NewDebris({
                Type: "Input_Select", Name: "Quiebra", OnCreated: $AddFormControl,
                Args: {
                    Values: [
                        { Text: "Seleccionar...", Value: "" },
                        { Text: "Sí", Value: 1 },
                        { Text: "No", Value: 0 }
                    ],
                },
                Value: ""
            })
        .NewRow()
            .NewCell({ XS: 12 })    
            .NewLabel("Razon Social")
            .NewDebris({
                Type: "Input_Text", Name: "RazonSocial", OnCreated: $AddFormControl, 
                Args: {
                    Title: "<I>RazonSocial</I>"
                }
            })
    ;
    $Modal.Show();
    return { Panel: $Panel, Modal: $Modal };

}

function EditarEmpresaPorId($Id, $Callback){
    ShowWait();
    $.ajax({
        data: { Empresa: $Id }
        , type: "GET"
        , url: "/Empresa/Crud"
        , success: function($Res){
            CloseWait();
            if($Res.Result == 0) {

                var $Empresa = ModalEmpresa({
                    Title: "Editar Empresa", 
                    YesCallback: function(){
                        ShowWait();
                        $.ajax({
                            data: { Bean: JSON.stringify($Empresa.Panel.Object) }
                            , type: "PUT"
                            , url: "/Empresa/Crud"
                            , success: function($Res){
                                if($Res.Result == 0) {
                                    CloseWait();
                                    $Callback($Res);
                                } else {
                                    CloseWait();
                                    var $Msg = new Debris.Modals.OkModal({
                                        Title : "Error",
                                        Text: $Res.Msg,
                                        OkText: "Aceptar"
                                    });
                                    $Msg.Show();
                                }
                            }
                        });
                    }
                });

                $Empresa.Panel.Object.Id = $Id;
                $Empresa.Panel.Object.Nombre = $Res.Data[0].Nombre;
                $Empresa.Panel.Object.Quiebra = $Res.Data[0].Quiebra;
                $Empresa.Panel.Object.RutEmpleador = $Res.Data[0].RutEmpleador;
                $Empresa.Panel.Object.Comuna = $Res.Data[0].Comuna;
                $Empresa.Panel.Init();
                $Empresa.Panel.Validation.Init();
                $Empresa.Panel.Validation.Run();
                
            }
        }
    });

}
