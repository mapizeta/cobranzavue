var $ColumnTypes = $ColumnTypes || {};

$ColumnTypes.ConfTitle = function ConfTitleColumn($Conf){
    switch($Conf.Data){
        case "minimo_cobrar":
            return "Mínimo a cobrar";
        case "cotizacion_empleador":
            return "Cotización Empleador";
        case "cotizacion_trabajador":
            return "Cotización Trabajador";
        case "vencimiento_mes":
            return "Día en que vence el mes";
    }
    //return "<Button OnClick='EditarUsuario(this)' Class='btn btn-primary btn-xs'>Editar</Button>";
};

$ColumnTypes.ConfValue = function ConfValueColumn($Conf){
    switch($Conf.Row.nombre){
        case "minimo_cobrar":
            if($Conf.Row["Editing"]){
                return "<Input Class='form-control form-control-sm' OnKeydown='return NumberKeyDown(this, event)' Type=Text Value='" + $Conf.Data + "' OnBlur='Cancel(this)'>";
            }else{
                return "<Button Class='btn-xs btn-primary' OnClick='NumberCol(this)'>$" + $Conf.Data + "&nbsp;<Span Class='fal fa-pencil'></Span></Button>";
            }
        case "cotizacion_empleador":
            if($Conf.Row["Editing"]){
                return "<Input Class='form-control form-control-sm' OnKeydown='return NumberKeyDown(this, event)' Type=Text Value='" + $Conf.Data + "' OnBlur='Cancel(this)'>";
            }else{
                return "<Button Class='btn-xs btn-primary' OnClick='NumberCol(this)'>" + $Conf.Data + "%&nbsp;<Span Class='fal fa-pencil'></Span></Button>";
            }
        case "cotizacion_trabajador":
            if($Conf.Row["Editing"]){
                return "<Input Class='form-control form-control-sm' OnKeydown='return NumberKeyDown(this, event)' Type=Text Value='" + $Conf.Data + "' OnBlur='Cancel(this)'>";
            }else{
                return "<Button Class='btn-xs btn-primary' OnClick='NumberCol(this)'>" + $Conf.Data + "%&nbsp;<Span Class='fal fa-pencil'></Span></Button>";
            }
        case "vencimiento_mes":
            if($Conf.Row["Editing"]){
                return "<Input Class='form-control form-control-sm' OnKeydown='return NumberKeyDown(this, event)' Type=Text Value='" + $Conf.Data + "' OnBlur='Cancel(this)'>";
            }else{
                return "<Button Class='btn-xs btn-primary' OnClick='NumberCol(this)'>" + $Conf.Data + "&nbsp;<Span Class='fal fa-pencil'></Span></Button>";
            }
    }
};

function NumberConfirm($Sender, $Evt){
        
    var $DT = $($Sender).closest("table").DataTable();
    var $Data = $DT.row($($Sender).closest("tr")).data();
    $Data.Editing = false;
    $Data.valor = $($Sender).val();

    $DT.Update({ Bean: $Data });

    // $.ajax({
    //     data: { Id: $Data.id, Value: $Data.valor, csrfmiddlewaretoken: "{{ csrf_token }}" },
    //     type: "POST",
    //     url: "{% url 'Configuracion:UpdateConf' %}",
    //     success: function($Res){
    //         $($Sender).blur();
    //     }
    // });

    //$($Sender).blur();
    //$DT.row($($Sender).closest("tr")).data($Data).draw(false);

}

function NumberCol($Sender){
    
    var $Sender = $($Sender);
    var $Table = $($Sender).closest("table");
    var $Data = $DT.DataTable.row($($Sender).closest("tr")).data();

    

    // var $Table = $($Sender).closest("table");
    // //var $DT = $Table.DataTable();
    // var $Data = $DT.DataTable.row($($Sender).closest("tr")).data();
    // $Data.Editing = true;
    // $DT.DataTable.row($($Sender).closest("tr")).data($Data).draw(false);
    // $Table.find("input").focus().select();
    
}

function Cancel($Sender){

    if($($Sender).closest("table").length == 0) return;
    //var $DT = $($Sender).closest("table").DataTable();
    var $Data = $DT.DataTable.row($($Sender).closest("tr")).data();
    $Data.Editing = false;
    $DT.row($($Sender).closest("tr")).data($Data).draw(false);

}

function NumberKeyDown($Sender, $Evt) {
        
    var $AllowedKeys = [37, 38, 39, 40, 9, 16, 8, 17, 116, 27, 123];

    if ($Evt.ctrlKey && $Evt.keyCode == 67) { return true; }
    if ($Evt.ctrlKey && $Evt.keyCode == 86) { return true; }
    if ($Evt.ctrlKey && $Evt.keyCode == 88) { return true; }

    if($Evt.keyCode == 13){
        NumberConfirm($Sender, $Evt);
        return false;
    }
    
    if ($AllowedKeys.indexOf($Evt.keyCode) > -1) return true;

    return /^[0-9]$/ig.test($Evt.key);

}
