var $ColumnTypes = $ColumnTypes || {};

$ColumnTypes.PerfilesActions = function $AccionesDemanda($Conf){
    return "<Button OnClick='EditarPerfil(this)' Class='btn btn-primary btn-xs'>Editar</Button>";
};

function EditarPerfil($Sender){

    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();

    var $EM = new Debris.Modals.YesNoModal({
        YesText: "Guardar Cambios" 
        , NoText: "Descartar Cambios"
        , Title: "Editar Perfil"
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
            .NewLabel("Descripción")
            .NewDebris({ 
                Type: "Input_Text"
                , Name: "Description"
                , Args: $.extend({}, $JsonContext.CreateFields.Description, { Value: $Data.Description })
                , OnCreated: function($New){
                    $New.Conf.Control.addClass("form-control");
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Roles")
            .NewDebris({
                Type: "Input_Select2"
                , Name: "Rol"
                , Args: $.extend({}, $JsonContext.CreateFields.Rol, { Parent: $EM.Body, Value: $Data.Rol })
            })
    ;

    $EM.Yes.attr({ disabled: true });

    $Panel.Init();
    $Panel.Validation.Init();
    $Panel.Validation.Run();
    $EM.Show();

}



