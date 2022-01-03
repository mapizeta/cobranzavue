var $ColumnTypes = $ColumnTypes || {};

$ColumnTypes.UsuariosActions = function $AccionesDemanda($Conf){
    return "<Button OnClick='EditarUsuario(this)' Class='btn btn-primary btn-xs'>Editar</Button>";
};

$ColumnTypes.ChangePassword = function $ChangePassword($Conf){
    return "<Button OnClick='ModalNewPass(this)' Class='btn btn-primary btn-xs'><Span Class='fa fa-key'></Span></Button>";
}

function EditarUsuario($Sender){

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

    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();

    var $EUM = new Debris.Modals.YesNoModal({
        YesText: "Guardar Cambios", 
        NoText: "Descartar Cambios", 
        Title: "Editar Usuario", 
        YesCallback: function(){
            if($Panel.Validation.IsValid){
                $DT.Create({ Bean: $Panel.Object });
                $YN.Hide();
            }else{
                $Panel.Validation.Run();
            }
        },
        CloseCallback: function(){
            if($Panel.Validation.IsModified){
                var $YN = new Debris.Modals.YesNoModal({ 
                    YesText: "Sí",
                    NoText: "No",
                    Title: "Confirmación",
                    Text: "¿Desea salir sin guardar los cambios?",
                    NoCallback: function(){
                        $EUM.Show();
                        $YN.Hide();
                    }
                });
                
                $YN.Show();
            }
        }
    });

    var $Panel = new Debris.Misc.Bootstrap4Layout({ 
        Container: $EUM.Body, 
        OnValidated: function(){
            // Provisorio, esto debería ser en una especie de "OnValueChanged"
            $EUM.Yes.attr({ disabled: !($Panel.IsModified && $Panel.Validation.IsValid) });
        }
    });

    console.log($Panel);

    $Panel
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Nombre de Usuario")
            .NewDebris({ Type: "Input_Text", Name: "username", OnCreated: $AddFormControlClass, Args: { Value: $Data.username, Title: "Nombre de Usuario", Validations: { Required: {  } } } })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Nombre")
            .NewDebris({ Type: "Input_Text", Name: "first_name", OnCreated: $AddFormControlClass, Args: { Value: $Data.first_name, Title: "Nombre", Validations: { Required: {  } } } })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Apellidos")
            .NewDebris({ Type: "Input_Text", Name: "last_name", OnCreated: $AddFormControlClass, Args: { Value: $Data.last_name, Title: "Apellidos", Validations: { Required: {  } } } })
        
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Cambiar Password")
            .NewDebris({ 
                Type: "Input_Password", 
                Name: "password",
                OnCreated: function($New){
                    $UsuarioPassField = $New.Conf;
                    $AddFormControlClass($New);
                },
                Args: { Value: $Data.last_name,
                Title: "Cambiar Password"
            }
        })

        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Confirmar Password")
            .NewDebris({ Type: "Input_Password",
                Name: "confirm_password",
                OnCreated: $AddFormControlClass,
                Args: { Value: $Data.last_name,
                    Title: "Cambiar Password",
                    Validations: { 
                        CheckWith: { With: $UsuarioPassField/*, NoValidMsg: "Las contraseñas no coinciden"*/ }
                    }
                }
            }
        )
        
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Mail")
            .NewDebris({ Type: "Input_Text", Name: "email", OnCreated: $AddFormControlClass, Args: { Value: $Data.email, Title: "Mail", Validations: { Required: {  } } } })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Fono")
            .NewDebris({ Type: "Input_Text", Name: "fono", OnCreated: $AddFormControlClass, Args: { Value: $Data.fono, Title: "Fono" } })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Perfil")
            .NewDebris({
                Type: "Input_Select2",
                Name: "profile_code",
                OnCreated: $AddFormControlClass,
                Args: {
                    Value: $Data.profile_code,
                    Values: [{ Text: "Seleccionar..", Value: "" }].concat($JsonContext.Columns.profile_code.Values),
                    Title: "Perfil",
                    Validations: {
                        Required: { NoValidMsg: "Por favor, seleccione Perfil" }
                    },
                    Parent: $EUM.Body
                }
            })
    ;

    $EUM.Yes.attr({ disabled: true });

    console.log($Panel);

    $Panel.Init();

    $Panel.Validation.Init();
    $Panel.Validation.Run({ Except: ["confirm_password"] });

    $EUM.Show();

}

function ModalNewPass($Sender){
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DT.DataTable.row($Tr).data();

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

    var $EUM = new Debris.Modals.YesNoModal({
        YesText: "Aceptar", 
        NoText: "Cancelar", 
        Title: "Establecer nueva contraseña",
        YesCallback: function(){
            if($Panel.Validation.IsValid){
                $.ajax({
                    data: { Bean: JSON.stringify($Panel.Object), __Fields__: JSON.stringify(["password"]) },
                    type: "PUT",
                    url: "/Usuarios/Crud",
                    success: function($Res){
                        if($Res.Result==0){
                            var $K = new Debris.Modals.OkModal({
                                Text: "Se ha cambiado correctamente esta contraseña",
                                OkText: "Aceptar",
                                Title: "Confirmación"
                            });
                            $K.Show();
                        }else{
                            var $K = new Debris.Modals.OkModal({
                                Text: $Res.Msg,
                                OkText: "Aceptar",
                                CloseCallback: function(){ $EUM.Show(); },
                                OkCallback: function(){ $EUM.Show(); },
                                Title: "Validación"
                            });
                            $K.Body.css({ "whiteSpace": "pre" });
                            $K.Show();
                        }
                    }
                });
                $EUM.Hide();
            }else{
                $Panel.Validation.Run();
            }
        }
    });

    var $Panel = new Debris.Misc.Bootstrap4Layout({ 
        Container: $EUM.Body,
        OnValidated: function(){
            // Provisorio, esto debería ser en una especie de "OnValueChanged"
            $EUM.Yes.attr({ disabled: !($Panel.IsModified && $Panel.Validation.IsValid) });
        }
    });

    $Panel
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Nueva contraseña")
            .NewDebris({ 
                Type: "Input_Password", 
                Name: "password",
                OnCreated: function($New){
                    $UsuarioPassField = $New.Conf;
                    $AddFormControlClass($New);
                },
                Args: { 
                    //Value: $Data.last_name,
                    Title: "Nueva Contraseña",
                    Validations: { 
                        Required: {  }
                    }
                }
            })
        .NewRow()
            .NewCell({ XS: 12 })
            .NewLabel("Confirmar nueva contraseña")
            .NewDebris({ Type: "Input_Password",
                Name: "confirm_password",
                OnCreated: $AddFormControlClass,
                Args: { 
                    //Value: $Data.last_name,
                    Title: "Cambiar Password",
                    Validations: { 
                        CheckWith: { With: $UsuarioPassField/*, NoValidMsg: "Las contraseñas no coinciden"*/ },
                        Required: { NoValidMsg: "Por favor, confirme contraseña" }
                    }
                }
            }
        )
    ;

    $Panel.Init();
    $Panel.Validation.Init();

    $EUM.Yes.attr({ disabled: true });

    $EUM.Show();

    $Panel.Object.id = $Data.id;

    console.log($Panel);
    console.log($Data);

}
