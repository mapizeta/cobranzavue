var $ColumnTypes = $ColumnTypes || {};
$ColumnTypes.EmpresaCobranzaActions = $EmpresaCobranzaActions;
var $ComunaDT;

function $EmpresaCobranzaActions($Conf){
    return "<Button OnClick='EditarEmpresaCobranza(this)' Class='btn btn-primary btn-xs'><Span Class='fa fa-pencil'></Span></Button>";
};

if($JsonContext.Url.Create == "/EmpresaCobranza/Crud"){
    $JsonContext.CreateFields.Rut.Validations = $.extend($JsonContext.CreateFields.Rut.Validations, {
        Required: {  },
        NotExists: {
            Source: "/EmpresaCobranza/Exists",
            NoValidMsg: function($Opts){
                if($Opts.Pending){
                    return "<Span Class='fa fa-hourglass fa-spin' Style='color: black'></Span>";
                }else{
                    return "Ya existe una empresa con rut " + $Opts.Value;
                }
            }
        }
    });
    
    // $JsonContext.Columns.Rut.Args = {
    //     Validations: {
    //         Required: {  }
    //     }
    // };
}



function EditarEmpresaCobranza($Sender){
    
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();

    var $EM = new Debris.Modals.YesNoModal({
        YesText: "Guardar Cambios" 
        , NoText: "Descartar Cambios"
        , Title: "Editar Empresa Cobranza"
        , YesCallback: function(){
            if($Panel.Validation.IsValid){
                $Panel.Object.Id = $Data.Id;
                $DT.Update({ Bean: $Panel.Object });
                $EM.Hide();
            }else{
                $Panel.Validation.Run();
            }
        }
    });

    var $AddFormControl = function($New){
        $New.Conf.Control.addClass("form-control");
    };

    var $Panel = new Debris.Misc.Bootstrap4Layout({ 
        Container: $EM.Body
        , OnValidated: function(){
            // Provisorio, esto debería ser en una especie de "OnValueChanged"
            $EM.Yes.attr({ disabled: !($Panel.IsModified && $Panel.Validation.IsValid) });
        }
    });

    $Panel
        .NewRow()
            .NewCell({ XS: 12 })
                .NewLabel("Nombre")
                .NewDebris({ 
                    Type: "Input_Text",
                    OnCreated: $AddFormControl,
                    Name: "Nombre",
                    Args: {
                        Value: $Data.Nombre
                    }
                })
        .NewRow()
            .NewCell({ XS: 12 })
                .NewLabel("Rut")
                .NewDebris({ 
                    Type: "Input_Rut",
                    OnCreated: $AddFormControl,
                    Name: "Rut",
                    Args: {
                        Value: $Data.Rut
                        , Validations: { Rut: {  } }
                    }
                })
        .NewRow()
            .NewCell({ XS: 12 })
                .NewLabel("Comuna")
                .NewDebris({ 
                    Type: "Input_Select2",
                    OnCreated: $AddFormControl,
                    Name: "Comuna",
                    Args: {
                        Value: $Data.Comuna,
                        Parent: $EM.Body,
                        Multiple: true,
                        Values: $JsonContext.CreateFields.Comuna.Values,
                    }
                })
        .NewRow()
            .NewCell({ XS: 12 })
                .NewLabel("CodAge")
                .NewDebris({ 
                    Type: "Input_Text",
                    OnCreated: $AddFormControl,
                    Name: "CodAge",
                    Args: {
                        Value: $Data.CodAge
                    }
                })
        .NewRow()
            .NewCell({ XS: 12 })
                .NewLabel("Agencia")
                .NewDebris({ 
                    Type: "Input_Text",
                    OnCreated: $AddFormControl,
                    Name: "Agencia",
                    Args: {
                        Value: $Data.Agencia
                    }
                })
    ;

    $EM.Yes.attr({ disabled: true });

    $Panel.Init();
    $Panel.Validation.Init();
    $Panel.Validation.Run();

    console.log($Panel);

    $EM.Show();

}
