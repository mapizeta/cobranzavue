var $ColumnTypes = $ColumnTypes || {};

console.log($JsonContext)

// Todo lo que este aquí adentro corre solo en el mantenedorTopeRenta 
if ($JsonContext.Url.Create == '/MontoTopeRenta/Crud') {
    
    console.log($JsonContext.Url.Create)
    console.log($JsonContext.Columns.InicioPeriodo)

    function CreateMontoRenta($Sender) {

        // var $Tr = $($Sender).closest("Tr");
        // var $Data = $DT.DataTable.row(0).data();
        // console.log($Data)        
        // console.log($Sender)

        var $YN = new Debris.Modals.YesNoModal({ 
            YesText: "Aceptar", 
            NoText: "Cancelar", 
            Title: "Nuevo Monto Renta",
            YesCallback: function(){
                if($PanelMonto.Validation.IsValid){
                    $DT.Create({ Bean: $PanelMonto.Object });
                    $YN.Hide();
                }else{
                    $PanelMonto.Validation.Run();
                }
            },
            CloseOnYes: false
        });
    
        var $PanelMonto = new Debris.Misc.Bootstrap4Layout({ 
            Container: $YN.Body
        });

        $PanelMonto
            .NewRow()
                .NewCell({ Xs: 6})
                .NewLabel("Monto en UF:")
                .NewDebris({
                    Type: "Input_Float",
                    OnCreated: function($New){ 
                        $New.Conf.Control.addClass("form-control");
                    },
                    Name: "Monto",
                    Args: {
                        Validations: { Required: { NoValidMsg: "Por favor, Ingrese <I>Monto en UF</I>" } }
                    }
                })
                .NewCell({ Xs: 6})
                .NewLabel("Fecha Inicio:")
                .NewDebris({
                    Type: "Input_Date",
                    OnCreated: function($New){ 
                        $New.Conf.Control.addClass("form-control");
                    },
                    Name: "InicioPeriodo",
                    Args: {
                        Validations: { Required: { NoValidMsg: "Por favor, Ingrese <I>Inicio de periodo</I>" } },
                        ParentEl: "#" + $YN.Id, 
                    }
                })

        $YN.Show();
        $PanelMonto.Init();
        $PanelMonto.Validation.Init();

    }

    // { DateGreaterThanRef: { Ref: $InicioRelacionLaboral } }
    
}


