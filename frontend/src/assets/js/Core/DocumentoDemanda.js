function VistaPreviaDocumentoDemanda($Sender){
    var $Tr = $($Sender).closest("Tr");
    var $Data = $DocumentoDemandaDT.DataTable.row($Tr).data();
    var $P = new Debris.Modals.OkModal({ OkText: "Aceptar", Title: "Vista previa" });
    $P.Body.closest(".modal-dialog").css({ "max-width": "90%" });
    $P.Body.append(
        $("<Div></Div>").attr({ class: "row" }).append(
            $("<Div></Div>").attr({ class: "col-md-12" }).append(
                $("<embed>").attr({
                    src: "/Documento/Download" + "?Id=" + $Data.Id, //$Data.Url, //"/Assets/M-470-2020 sentencia.pdf",
                    width: "100%",
                    height: "500px"
                })
            )
        )
    );
    $P.Show();
}
