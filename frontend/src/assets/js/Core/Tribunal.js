
function CrearTribunal(){
    var $YN = new Debris.Modals.YesNoModal({ 
        YesText: "Aceptar", 
        NoText: "Cancelar", 
        Title: "Nuevo Tribunal",
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
            .NewLabel("Nombre Completo:")
            .NewDebris({
                Type: "Input_Text",
                OnCreated: function($New){ 
                    $New.Conf.Control.addClass("form-control");
                },
                Name: "NombreCompleto",
                Args: {
                    Validations: { Required: { NoValidMsg: "Por favor, Ingrese <I>Nombre Completo</I>" } }
                }
            })
        .NewRow()
            .NewCell({ Xs: 12 })
            .NewLabel("Nombre Abreviado:")
            .NewDebris({
                Type: "Input_Text",
                OnCreated: function($New){ 
                    $New.Conf.Control.addClass("form-control");
                },
                Name: "NombreAbreviado",
                Args: {
                    Validations: { Required: { NoValidMsg: "Por favor, Ingrese <I>Nombre Abreviado</I>" } }
                }
            })
        .NewRow()
            .NewCell({ Xs: 12 })
            .NewLabel("Código:")
            .NewDebris({
                Type: "Input_Number",
                OnCreated: function($New){ 
                    $New.Conf.Control.addClass("form-control");
                },
                Name: "Codigo",
                Args: {
                    Validations: { 
                        Required: { 
                            NoValidMsg: "Por favor, <I>Ingrese Código</I>" 
                        }, 
                        NotExists: {
                            Source: "/Tribunal/Exists",
                            NoValidMsg: function($Opts){
                                if($Opts.Pending){
                                    return "<Span Class='fa fa-hourglass fa-spin' Style='color: black'></Span>";
                                }else{
                                    return "Ya existe un tribunal con código " + $Opts.Value;
                                }
                                
                            }
                        }
                    }
                }
            })
    ;

    $YN.Show();

    $PanelTribunal.Init();
    $PanelTribunal.Validation.Init();

}
