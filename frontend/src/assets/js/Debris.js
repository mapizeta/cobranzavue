Debris = {};

Debris.Misc = {};

Debris.Misc.Function_Options = function Function_Options($Options, $Names) {
    var $TMP_Options = {};
    if (typeof ($Options) != "undefined") {
        for (var $Name in $Names) {
            var _prop = Object.keys($Options).find(function (prop) { return RegExp("^" + prop + "$", "ig").test($Names[$Name]) });
            if (typeof (_prop) != "undefined") {
                $TMP_Options[$Names[$Name]] = $Options[_prop];
            }
        }
    }
    return $TMP_Options;
};

Debris.Misc.Lang = {
    DataTable: {
        Es: {
            decimal: "",
            emptyTable: "No hay información disponible",
            info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 Registros",
            infoFiltered: "(Filtrado de _MAX_ Registros)",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "Mostrar _MENU_ Registros",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Filtrar:",
            zeroRecords: "No se han encontrado resultados",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    },
    DateRange: {
        Es: {
            applyLabel: "Aplicar",
            cancelLabel: "Cancelar",
            fromLabel: "Desde el",
            toLabel: "Hasta el",
            customRangeLabel: "Personalizado",
            daysOfWeek: ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            firstDay: 1
        }
    }
};

Debris.Misc.Array = {
    Chunk: function($Array, $Size){
        var Out = [];
        var $Size = $Size || 1;
        var _Array = Debris.Misc.Array.Clone($Array);
        while (_Array.length) {
            Out.push(_Array.splice(0, $Size));
        }
        return Out;
    }
    ,Clone: function($Array){
        return $.map($Array, function($e, $i){ return $e; });
    }
}

Debris.Misc.Object = {
    Clone: function($Obj){
        var $Out = {};
        $.each($Obj, function($i, $e){ $Out[$i] = $e; });
        return $Out;
    },
    Compare: function($Obj1, $Obj2){
        var $GetIndex = function($e, $i){ return $i; };
        var $Keys1 = $.map($Obj1, $GetIndex);
        var $Keys2 = $.map($Obj2, $GetIndex);
        if($Keys1.length != $Keys2.length){
            return false;
        }
        return $.map($Keys1, function($e, $i){ 
            return $Obj1[$e] == $Obj2[$e];
        }).reduce(function($c, $n){
            return $c && $n;
        }, true);
    },
    Map: function($Object, $Walker){
        return Object.entries($Object).map( function($e){ $Walker($e[1], $e[0]); } );
    }
};

Debris.Misc.Random = function Random(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
};

Debris.Modals = {
    OkModal: function OkModal($Options) {

        if ($Options.ShowCloseButton == undefined) {
            $Options.ShowCloseButton = true;
        }

        Debris.Modals.OkModal.__INSTANCES__.push(this);
        
        var $Options = Debris.Misc.Function_Options($Options, ["Text", "Title", "OkCallback", "OkText", "CloseCallback", "ShowCloseButton", "Large", "Background"]);
        var $OkModal = {};
        
        var $This = this;

        $This.Id = "OkModal_" + Debris.Modals.OkModal.__INSTANCES__.length;

        var $Modal = $("<Div></Div>").attr({ role: "dialog", Id: $This.Id, class: "modal fade", "data-backdrop": "static", "data-keyboard": false }).css({ overflow: "auto" })
            .append(
                $("<Div></Div>").attr({ class: "modal-dialog" + ($Options.Large ? " modal-lg":"") })
                    .append(
                        $("<Div></Div>").attr({ class: "modal-content" })
                            .append(
                                ($OkModal.Header = $("<Div></Div>").attr({ class: "modal-header" })
                                    .append(
                                        ($OkModal.Title = $("<H4></H4>").attr({ class: "modal-title" }).html($Options.Title))
                                    ).append(
                                        $("<Button>&times;</Button>")
                                            .attr({ type: "button", class: "close", "data-dismiss": "modal" })
                                            .css({ display: ($Options.ShowCloseButton ? "initial" : "none") })
                                            .bind("click", $Options.CloseCallback)
                                    ))
                            ).append(
                                ($OkModal.Body = $("<Div></Div>").attr({ class: "modal-body" }).html($Options.Text))
                            ).append(
                                ($OkModal.Footer = $("<Div></Div>").attr({ class: "modal-footer" })
                                    .append(
                                        ($OkModal.OkButton = $("<Button></Button>")
                                            .attr({ Type: "button", class: "btn btn-primary", "data-dismiss": "modal" })
                                            .text($Options.OkText)
                                            .bind("click", $Options.OkCallback)
                                        )
                                    ))
                            )
                    )
            )
            ;

        Debris.Property.Init({
            Fields: {
                OkText: { Initial: $Options.OkText, Types: [String] },
                Title: { Initial: $Options.Title, Types: [String] },
                Text: { Initial: $Options.Text, Types: [String] },
                CloseCallback: { Initial: $Options.CloseCallback, Types: [String] },
                OkCallback: { Initial: $Options.OkCallback, Types: [String] },
                Ok: { Initial: $OkModal.OkButton, Types: [jQuery] },
                Modal: { Initial: $Modal, Types: [jQuery] },
                Body: { Initial: $OkModal.Body, Types: [jQuery] },
                Header: { Initial: $OkModal.Header, Types: [jQuery] },
                Footer: { Initial: $OkModal.Footer, Types: [jQuery] }
            },
            Object: this
        });

        // Debris.Misc.DefineProperties({
        //     OnSet: {
        //         OkText: function ($IOptions) { $OkModal.OkButton.text($IOptions.Current); },
        //         Title: function ($IOptions) { $OkModal.Title.html($IOptions.Current); },
        //         Text: function ($IOptions) {
        //             $OkModal.Body.html($IOptions.Current);
        //         }
        //     }
        // });

        $This.Background = $This.Background || "Blur";

        $Modal.on("show.bs.modal", function(){
            Debris.Modals.__CNT_OPEN_MODALS__++;
            if(Debris.Modals.__CNT_OPEN_MODALS__ == 1){
                // Blur body
                $("body > :not(.modal)").css(Debris.Modals.Backgrounds[$This.Background].On);
            }else{
                // Blur previous open modal
                Debris.Modals.__OPEN_MODALS__[Debris.Modals.__OPEN_MODALS__.length-1].css(Debris.Modals.Backgrounds[$This.Background].On);
            }
            Debris.Modals.__OPEN_MODALS__.push($Modal);
        });

        $Modal.on("hide.bs.modal", function(){
            Debris.Modals.__CNT_OPEN_MODALS__--;
            if(Debris.Modals.__CNT_OPEN_MODALS__ == 0){
                $("body > :not(.modal)").css(Debris.Modals.Backgrounds[$This.Background].Off);
            }else{
                Debris.Modals.__OPEN_MODALS__.pop();
                Debris.Modals.__OPEN_MODALS__[Debris.Modals.__OPEN_MODALS__.length-1].css(Debris.Modals.Backgrounds[$This.Background].Off);
            }
        });

        this.Show = function () {
            $Modal.modal("show");
        };

        this.Hide = function () {
            $Modal.modal("hide");
        };

        $(document.body).append($Modal);

    }
    , YesNoModal: function YesNoModal($Options) {

        var $Options = Debris.Misc.Function_Options($Options, ["Text", "Title", "YesCallback", "YesText", "NoCallback", "NoText", "CloseCallback", "CloseOnYes", "CloseOnNo", "Large", "Background"]);

        var $This = this;

        var $YesNoModal = {};
        var $Large = $Options.Large;

        var $BtnAttr = { Type: "button", class: "btn btn-primary", "data-dismiss": "modal" };
        if ($Options.CloseOnYes == false) {
            delete $BtnAttr["data-dismiss"];
        }
        var $BtnNoAttr = { Type: "button", class: "btn btn-secondary", "data-dismiss": "modal" };
        if ($Options.CloseOnNo == false) {
            delete $BtnNoAttr["data-dismiss"];
        }

        Debris.Modals.YesNoModal.__INSTANCES__.push(this);

        $This.Id = "YesNoModal_" + Debris.Modals.YesNoModal.__INSTANCES__.length;

        var $Modal = $("<Div></Div>").attr({ role: "dialog", Id: $This.Id, class: "modal fade", "data-backdrop": "static", "data-keyboard": false }).css({ overflow: "auto" })
            .append(
                $("<Div></Div>").attr({ class: "modal-dialog " + ($Large ? "modal-lg" : "") })
                    .append(
                        $("<Div></Div>").attr({ class: "modal-content" })
                            .append(
                                $("<Div></Div>").attr({ class: "modal-header" })
                                    .append(
                                        ($YesNoModal.Title = $("<H3></H3>").attr({ class: "modal-title" }).html($Options.Title))
                                    ).append(
                                        $("<Button>&times;</Button>")
                                            .attr({ type: "button", class: "close", "data-dismiss": "modal" })
                                            .bind("click", $Options.CloseCallback)
                                    )
                            ).append(
                                ($YesNoModal.Body = $("<Div></Div>").attr({ class: "modal-body" }).html($Options.Text))
                            ).append(
                                $("<Div></Div>").attr({ class: "modal-footer" })
                                    .append(
                                        ($YesNoModal.YesButton = $("<Button></Button>")
                                            .attr($BtnAttr)
                                            .text($Options.YesText)
                                            .bind("click", $Options.YesCallback))
                                    )
                                    .append(
                                        ($YesNoModal.NoButton = $("<Button></Button>")
                                            .attr($BtnNoAttr)
                                            .text($Options.NoText)
                                            .bind("click", (function ($$Options, $$This) { return function () { if ($$Options.NoCallback) $$Options.NoCallback(); $$This.Hide(); }; })($Options, this)))
                                    )
                            )
                    )
            )
            ;

        var $Get = function ($jElement, $Method) {
            return function () {
                return $jElement[$Method || "text"]();
            }
        };

        var $Set = function ($jElement, $Method) {
            return function ($Val) {
                $jElement[$Method || "text"]($Val);
            };
        };

        var $Replace = function ($jElement) {
            return function ($Val) {
                if ($jElement != $Val) {
                    $jElement.replaceWith($Val);
                }
            };
        }

        Debris.Property.Init({
            Fields: {
                Text: { Initial: $Options.Text || "", Types: [String], Get: $Get($YesNoModal.Body, "html"), Set: $Set($YesNoModal.Body, "html") },
                Title: {
                    Initial: $Options.Title || "", Types: [String], Get: $Get($YesNoModal.Title), Set: $Set($YesNoModal.Title)
                },
                YesText: {
                    Initial: $Options.YesText || "Aceptar", Types: [String], Get: $Get($YesNoModal.YesButton), Set: $Set($YesNoModal.YesButton)
                },
                NoText: {
                    Initial: $Options.NoText || "Cancelar", Types: [String], Get: $Get($YesNoModal.NoButton), Set: $Set($YesNoModal.NoButton)
                },
                YesCallback: { Initial: $Options.YesCallback, Types: [Function] },
                NoCallback: { Initial: $Options.NoCallback, Types: [Function] },
                CloseCallback: { Initial: $Options.CloseCallback, Types: [Function] },
                Body: { Initial: $YesNoModal.Body, Types: [jQuery], Set: $Replace($YesNoModal.Body) },
                Yes: { Initial: $YesNoModal.YesButton, Types: [jQuery], Set: $Replace($YesNoModal.YesButton) },
                No: { Initial: $YesNoModal.NoButton, Types: [jQuery], Set: $Replace($YesNoModal.NoButton) }
            },
            Object: this
        });

        document.body.appendChild($Modal[0]);

        var $YesWait;
        this.Yes.Wait = function () {
            this.jQuery.attr({ disabled: true }).append($YesWait = $("<Span></Span>").attr({ Class: "glyphicon glyphicon-hourglass glyphicon-spin" }));
        };

        this.Yes.StopWait = function () {
            this.jQuery.attr({ disabled: false });
            $YesWait.remove();
        };

        $This.Background = $This.Background || "Blur";

        $Modal.on("show.bs.modal", function(){
            Debris.Modals.__CNT_OPEN_MODALS__++;
            if(Debris.Modals.__CNT_OPEN_MODALS__ == 1){
                // Blur body
                $("body > :not(.modal)").css(Debris.Modals.Backgrounds[$This.Background].On);
            }else{
                // Blur previous open modal
                Debris.Modals.__OPEN_MODALS__[Debris.Modals.__OPEN_MODALS__.length-1].css(Debris.Modals.Backgrounds[$This.Background].On);
            }
            Debris.Modals.__OPEN_MODALS__.push($Modal);
        });

        $Modal.on("hide.bs.modal", function(){
            Debris.Modals.__CNT_OPEN_MODALS__--;
            if(Debris.Modals.__CNT_OPEN_MODALS__ == 0){
                $("body > :not(.modal)").css(Debris.Modals.Backgrounds[$This.Background].Off);
            }else{
                Debris.Modals.__OPEN_MODALS__.pop();
                Debris.Modals.__OPEN_MODALS__[Debris.Modals.__OPEN_MODALS__.length-1].css(Debris.Modals.Backgrounds[$This.Background].Off);
            }
        });

        this.Show = function () {
            $Modal.modal("show");
        };

        this.Hide = function () {
            $Modal.modal("hide");
        };

    }
    , BeanModal: function BeanModal($Options) {

        var $$Options = Debris.Misc.Function_Options($Options, [
            "Text", "Title", "YesCallback", "NoCallback", "YesText", "NoText", "CloseCallback", "ShowCloseButton", "Fields", 
            "Layout", "Controls", "CloseOnYes", "OnDraw", "ValidationHandler", "Bean", "Validations"
        ]);
    
        var $This = this;
    
        // Debris.Property.Init({ 
        //     Fields: { 
        //         CloseOnNo: { Initial: $$Options.CloseOnNo || false, Types: [Boolean] },
        //         CloseOnYes: { Initial: $$Options.CloseOnYes || false, Types: [Boolean] },
        //         YesText: { Initial: $$Options.YesText || "Aceptar", Types: [String] },
        //         NoText: { Initial: $$Options.NoText || "Cancelar", Types: [String] },
        //         Layout: { Initial: $$Options.Layout || Debris.Layout.Bootstrap.BasicLabelAndControl, Types: [Function] }
        //     },
        //     Object: this
        // });
    
        $$Options.CloseOnNo = $$Options.CloseOnNo || false;
        $$Options.CloseOnYes = $$Options.CloseOnYes || false;
        $$Options.YesText = $$Options.YesText || "Aceptar";
        $$Options.NoText = $$Options.NoText || "Cancelar";
    
        var $Fields = $$Options.Fields || {};

        if($$Options.Validations){
            for (var $x in $Fields) {
                $Fields[$x].Validations = $$Options.Validations[$x] || $Fields[$x].Validations;
            }
        }
    
        var $Layout = $$Options.Layout || Debris.Layout.Bootstrap.LabelAndControl;
        var $AltControls = $$Options.Controls;
    
        Debris.Modals.YesNoModal.call(this, $$Options);
    
        this.Bean = {};
        this.Conf = {};
        var $Validations = {};
        Object.defineProperty(this, "Validations", { get: (function ($$Validations) { return function () { return $$Validations; }; })($Validations), enumerable: true });
    
        var $This = this;
        var $Controls = [];
    
        for (var $x in $Fields) {
            if ($Fields[$x].Append === false) {
                var $AltConf = $Fields[$x].Control;
                var $$AltValidations = $AltConf.Validations;
                Object.defineProperty($This.Bean, $x, $AltConf.Property);
                Object.defineProperty($This.Conf, $x, { get: (function ($$AltConf) { return function () { return $$AltConf; }; })($AltConf), enumerable: true });
                Object.defineProperty($Validations, $x, { get: (function ($$$AltValidations) { return function () { return $$$AltValidations; }; })($$AltValidations), enumerable: true });
                if ($Validations[$x] == undefined) {
                    console.error("No se ha establecido un protocolo de validación para el control de " + $x /* $Fields[$x].Name */);
                    continue;
                }
                continue;
            }
    
            var $ThisConf; //= $Fields[$x].Control;
    
            if(Debris.Components[$Fields[$x].Type]){
                var $Params = $Fields[$x];
                $Params.Object = $This.Bean;
                $Params.Name = $x;
                $ThisConf = new Debris.Components[$Fields[$x].Type]($Params);
                new Debris.Property({ Object: $This.Conf, Name: $x, Initial: $ThisConf, Types: [Debris.Components[$Fields[$x].Type]], Enumerable: true });
                switch($Fields[$x].Type){
                    case "Input_Select":
                    case "Input_Text":
                    case "Input_Password":
                        if($Fields[$x].Type=="Input_Password"){ $ThisConf.Control.attr({ Placeholder: "Nueva contraseña" }) }
                        $ThisConf.Control.addClass("form-control");
                    break;
                }
            }else{
                console.warn("No existe un componente de tipo " + $Fields[$x].Type);
                continue;
            }
    
            $Controls.push($("<Label></Label>").append($Fields[$x].Title));
            $Controls.push($ThisConf.Control);
    
            // Object.defineProperty($This.Conf, $x/*$Fields[$x].Name*/, { get: (function ($$ThisConf) { return function () { return $$ThisConf; }; })($ThisConf), enumerable: true });
            // if ($ThisConf.Property) {
            //     Object.defineProperty($This.Bean, $x/*$Fields[$x].Name*/, $ThisConf.Property);
            // }
    
            var $ThisValidations = $ThisConf.Validations;
            Object.defineProperty($Validations, $x/*$Fields[$x].Name*/, { get: (function ($$ThisValidations) { return function () { return $$ThisValidations; }; })($ThisValidations), enumerable: true });
            if ($Validations[$x/*$Fields[$x].Name*/] == undefined) {
                console.error("No se ha establecido un protocolo de validación para el control de " + $x/*$Fields[$x].Name*/);
                continue;
            }
        };

        for (var $x in $$Options.Bean) {
            if($Fields[$x]){
                if($Fields[$x].Type == "Enum"){
                    $This.Bean[$x] = $$Options.Bean["Selected" + $x];
                }else{
                    $This.Bean[$x] = $$Options.Bean[$x];
                }
            }else{
                $This.Bean[$x] = $$Options.Bean[$x];
            }
        }
    
        Object.defineProperty(this.Validations, "NoValidKeys", {
            get: function () {
                var $Out = {};
                for (var $x in $This.Conf) {
                    if ($This.Conf[$x].NoValidKeys != undefined) {
                        $Out[$x] = $This.Conf[$x].NoValidKeys;
                    }
                }
                return $Out;
            }, enumerable: true
        });
    
        Object.defineProperty(this.Validations, "NoValidMsgs", {
            get: function () {
                var $Out = {};
                for (var $x in $This.Conf) {
                    if ($This.Conf[$x].NoValidMsgs != undefined) {
                        $Out[$x] = $This.Conf[$x].NoValidMsgs;
                    }
                }
                return $Out;
            }, enumerable: true
        });
    
        Object.defineProperty(this.Validations, "IsValid", {
            get: (function ($This) {
                return function () {
                    var $Out = [];
                    for (var $x in $This.Conf) {
                        $Out.push($This.Conf[$x].IsValid);
                    }
                    return $Out.reduce(function ($c, $n) { return $c && $n; }, true);
                };
            })(this)
        });
    
        var $Layout = new $Layout({ Controls: $Controls, OnDraw: $$Options.OnDraw, Container: $This.Body, LabelSize: 3, ControlSize: 9 });
        $Layout.Render();
        //this.Body = $("<Div></Div>").append($Layout.Rows);
    
        Object.defineProperty(this, "ValidationHandler", {
            get: (function ($$Handler, $This) {
                return function () {
                    return $$Handler;
                };
            })(new ($$Options.ValidationHandler || Debris.Components.Validations.Handlers.WarnAfterControl)({
                Bean: this.Bean,
                Conf: this.Conf,
                Validations: this.Validations
            }), this),
            enumerable: true
        });
    },
    EnumModal: function($Options){
        var $This = this;
        Debris.Modals.OkModal.call(this, $Options);

        var $Selected = $.grep($Options.Values, function($e, $i){ return ($Options.SelectedValues.indexOf($e.Value) > -1); });
        if($Selected.length == 0){
            $Selected.push({ Name: "No hay datos seleccionados" });
        }

        this.Body.append(
            $("<Div></Div>").attr({ Class: "row" }).append(
                $("<Div></Div>").attr({ Class: "col-md-6" }).append(
                    $("<Ul></Ul>").append(
                        $.map($Selected, function($e, $i){ return $("<Li></Li>").append( $Options.Labels[$e.Value] || $e.Name ); } )
                    )
                )
            )
        );
    }
};

Debris.Modals.__CNT_OPEN_MODALS__ = 0;
Debris.Modals.__OPEN_MODALS__ = [];
Debris.Modals.OkModal.__INSTANCES__ = [];
Debris.Modals.YesNoModal.__INSTANCES__ = [];
//Debris.Modals.OkModal.__INSTANCE_INDEX__ = 0;

Debris.Modals.Backgrounds = {
    Blur: {
        On: {
            "-webkit-filter": "invert(30%) blur(10px)",
            "-moz-filter": "invert(30%) blur(10px)",
            "-o-filter": "invert(30%) blur(10px)",
            "-ms-filter": "invert(30%) blur(10px)",
            "filter": "invert(30%) blur(10px)",
            "opacity": "0.4"
        },
        Off: {
            "-webkit-filter": "",
            "-moz-filter": "",
            "-o-filter": "",
            "-ms-filter": "",
            "filter": "",
            "opacity": ""
        }
    }
};

Debris.Components = { 
    BaseComponent: function ($Options) {
        var $This = this;
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", "PropertyType", "Value", "Property", "IsModified", "OnValidated", "OnCreated"]);
        $$Options.Validations = Debris.Misc.Function_Options($$Options.Validations, Object.keys(Debris.Components.Validations));

        var DasTypes = $.grep([$$Options.PropertyType], function($e, $i){ return $e; });

        var $Enable = function ($Value) {
            $This.Control.attr({ disabled: !$Value });
        };

        var $InitialValue = $$Options.Value;
        
        Debris.Property.Init({ 
            Fields: { 
                Name: { Initial: $$Options.Name, Types: [String] },
                Object: { Initial: $$Options.Object },
                Title: { Initial: $$Options.Title, Types: [String] },
                Control: { Initial: $$Options.Control, Types: [jQuery] },
                PropertyType: { Initial: $$Options.PropertyType },
                // [!] 
                Value: { Initial: $InitialValue },
                //Value: { Initial: typeof($$Options.Value) == "undefined" ? ($$Options.Property || { get: function(){ return ""; } }).get():$$Options.Value, Types: DasTypes.length > 0 ? DasTypes: undefined },
                Property: { Initial: $$Options.Property },
                Validations: { Initial: {}, Types: [Object] },
                Enable: { Initial: $$Options.Enable || $Enable, Types: [Function] },
                Enabled: { Initial: true, Types: [Boolean], OnSet: function($Val){ console.log($Val); } },
                IsModified: { Get: $$Options.IsModified || (function($$This){
                    return function(){
                        // if(typeof($This.Value) == "undefined"){
                        //     return false;
                        // }
                        return $$This.Property.get() != $$This.Value;
                    }
                })($This), Types: [Boolean] },
                OnValidated: { Initial: $$Options.OnValidated || function(){}, Types: [Function] },
                OnCreated: { Initial: $$Options.OnCreated || function(){}, Types: [Function] }
            },
            Object: this
        });

        if(typeof($InitialValue) == "undefined" || $InitialValue === null){
            if($$Options.Control){
                $This.Value = $$Options.Property.get();
            }
        }

        Debris.Components.Validations.Bind.call(this, {
            Validations: $$Options.Validations,
            ValueAccessor: this.Property,
            Title: $$Options.Title
        });

        if($This.Object){
            if($This.Name && $This.Property){
                if($This.Name.length > 0){
                    if(!$This.Object.hasOwnProperty($This.Name)){
                        if(Debris.Property.Validation.Is({ Value: $This.Property.get, Types: [Function] }) && Debris.Property.Validation.Is({ Value: $This.Property.set, Types: [Function] })){
                            Object.defineProperty($This.Object, $This.Name, $This.Property);
                        }
                    }else{
                        console.warn("El objeto proporcionado ya posee una propiedad o campo \"" + $This.Name + "\". No se sobreescribe.");
                    }
                }
            }else{
                if(!$This.Name){
                    console.warn("No se ha especificado un nombre de propiedad, no se creará una propiedad para este objeto");
                }
            }
        }

        ($This.OnCreated || function(){})({ Control: $This.Control, Conf: this });

    }
    , Input_Text: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Property", "Object", "Title", "Control", "Virtual", /* "PropertyType", */ "Value", "Length", "OnValidated", "OnCreated"]);
        var $This = this;
        $$Options.Control = $$Options.Control || $("<Input>").attr({ Type: "text" });
        $$Options.Control.attr({ MaxLength: $$Options.Length }).val($$Options.Value);
        $$Options.Property = $$Options.Property || { 
            get: (function($$This){
                return function(){
                    return $$This.Control.val();
                }
            })($This),
            set: (function($$This){
                return function($Val){
                    $$This.Control.val($Val);
                }
            })($This),
            enumerable: true, configurable: true 
        };
        $$Options.PropertyType = String;
        Debris.Components.BaseComponent.call(this, $$Options);
    }
    , Input_Decimal: function Input_Decimal($Options) {
        Debris.Components.Input_Text.call(this, $Options);

        var $Item = this.Control;

        $Item.bind("keydown", function (evt) {

            var $AllowedKeyCodes = [35, 36, 37, 38, 39, 40, 9, 16, 8, 17, 116, 27, 123];
            var $AllowedKeys = [$Options.DecimalSeparator];

            if ($AllowedKeyCodes.indexOf(evt.keyCode) > -1) { return true; }
            if (evt.ctrlKey && evt.keyCode == 67) { return true; }
            if (evt.ctrlKey && evt.keyCode == 86) { return true; }
            if (evt.ctrlKey && evt.keyCode == 88) { return true; }

            // Para que no se pueda colocar punto al final:
            //if (evt.key == $Options.DecimalSeparator && Debris.Misc.SelectionStart({ Input: $Item[0] }) == $Item.val().length) {
            //    return false;
            //}

            //if (evt.key == "Backspace" && $Item.val().indexOf($Options.DecimalSeparator) == $Item.val().length -1) {
            //    return false;
            //}

            if ($AllowedKeys.indexOf(evt.key) > -1) {
                if ($Item.val().indexOf($Options.DecimalSeparator) > -1 || $Item.val().length == 0) {
                    return false;
                }

                return true;
            }

            if (evt.key == "-") {
                if ($Item.val().indexOf("-") > -1 || $Item.val().length > 0) {
                    return false;
                } else {
                    return true;
                }
            }

            if (($Item.val().length >= 11 /* && $Item.val().indexOf($Options.DecimalSeparator) > -1 */) /* || ($Item.val().length >= 9 && $Item.val().indexOf($Options.DecimalSeparator) == -1) */) {
                return false;
            }

            if($Item.val().indexOf(",") > -1){
                if ($Item.val().replace(/\d{1,}[,]/ig, "").length >= $Options.DecimalLength) {
                    return false;
                }
            }
            
            if ($AllowedKeyCodes.indexOf(evt.keyCode) > -1) return true;

            return /^[0-9]$/ig.test(evt.key);

        }).bind("paste", function (evt) {
            return new RegExp("^[0-9]([" + $Options.DecimalSeparator + "][0-9]+)?$", "gi").test(evt.originalEvent.clipboardData.getData('text/plain'));
        });

    }
    , Input_Checkbox: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", "Value", "Length", "Checked", "Unchecked", "Value", "OnValidated", "OnCreated"]);
        var $This = this;
        $$Options.Control = $$Options.Control || $("<Input>").attr({ Type: "checkbox" });
        var $Checked = $$Options.Checked || true;
        var $Unchecked = $$Options.Unchecked || false;
        $$Options.Property = {
            get: function(){
                return $This.Control.prop("checked") ? $Checked:$Unchecked;
            },
            set: function($Val){
                $This.Control.prop({ checked: $Val == $Checked });
            },
            enumerable: true
        };
        $$Options.PropertyType = Boolean;
        
        Debris.Components.BaseComponent.call(this, $$Options);
        $$Options.Property.set($$Options.Value);
    }
    , Input_Number: function Input_Decimal($Options) {

        Debris.Components.Input_Text.call(this, $Options);
        //var $Item = this.Control;
        $Options.PropertyType = Number;

        this.Control.bind("keydown", Debris.Components.Input_Number.KeyDown).bind("paste", Debris.Components.Input_Number.Paste);

    }
    , Input_Rut: function($Options){
        
        var $This = this;
        Debris.Components.Input_Text.call($This, $Options);

        $This.Control.rut({useThousandsSeparator : false});

        $This.Control.bind("keydown", function ($Evt) { 
            var $AllowedKeys = [35, 36, 37, 38, 39, 40, 9, 16, 8, 17, 116, 27, 123];

            if ($Evt.ctrlKey && $Evt.keyCode == 67) { return true; }
            if ($Evt.ctrlKey && $Evt.keyCode == 86) { return true; }
            if ($Evt.ctrlKey && $Evt.keyCode == 88) { return true; }

            if ($AllowedKeys.indexOf($Evt.keyCode) > -1) return true;
            if ($This.Control.prop("selectionStart") == $This.Property.get().length && /^[0-9]{1,}$/ig.test($This.Property.get())) {
                return /^[0-9kK]$/ig.test($Evt.key);
            } else {
                if ($This.Property.get().endsWith("k") && $This.Control.prop("selectionStart") == $This.Property.get().length) {
                    return false;
                }
                return /^[0-9]$/ig.test($Evt.key);
            }
        }).bind("paste", function ($Evt) {
            var $ClipboardData = $Evt.originalEvent.clipboardData.getData('text/plain');
            if ($This.Control.prop("selectionStart") == $This.Property.get().length && /^[0-9]{1,}$/ig.test($This.Property.get())) {
                return /^[0-9]{1,}[kK]{0,1}$/ig.test($ClipboardData);
            } else {
                return /^[0-9]{1,}$/ig.test($ClipboardData);
            }
        }).attr({ maxlength: 10 });

    }
    , Input_Money: function($Options) {

        var $This = this;
        var $Started = false;

        $Options.Property = {
            get: function(){
                if($Started){
                    var newVal = $This.Control.val().replace('.', '');
                    return newVal;
                }else{
                    return $This.Control.val();
                }
            },
            set: function($Val) {
                $This.Control.val($Val);
            },
            enumerable: true
        };

        Debris.Components.Input_Number.call($This, $Options);
        
        $This.Control.mask('999.999.999', { reverse: true });
        $Started = true;

    }
    , Input_Float: function($Options) {

        var $This = this;
        var $Started = false;

        $Options.Property = {
            get: function(){
                if($Started){
                    var newVal = $This.Control.val().replace(',', '.');
                    return newVal;
                }else{
                    return $This.Control.val();
                }
            },
            set: function($Val) {
                $This.Control.val($Val);
            },
            enumerable: true
        };

        Debris.Components.Input_Number.call($This, $Options);    
        $This.Control.mask('#,09', { reverse: true });
        var $Started = true;
    }
    , Input_Date: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", "Value", "Length", "ParentEl", "OnValidated", "OnCreated"]);
        var $This = this;
        $$Options.Control = $$Options.Control || $("<Input>").attr({ Type: "text" });
        
        if(!$$Options.ParentEl){
            console.warn("Si no se asigna la propiedad ParentEl, se observarán comportamientos extraños al mover el scroll\nMás información: \n\n\t- https://github.com/dangrossman/daterangepicker/issues/803\n\t- http://www.daterangepicker.com/#example2" );
        }

        // [!] Añadir property
        $$Options.Property = { 
            get: function(){
                return $This.Control.val();
            },
            set: function($Val){
                return $This.Control.val($Val);
            },
            enumerable: true
        };
        this.Init = function(){
            $$Options.Control.daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                locale: $.extend({ format: 'YYYY-MM-DD' }, Debris.Misc.Lang.DateRange.Es),
                parentEl: $$Options.ParentEl
            });
            $$Options.Property.set($$Options.Value);
        };

        $$Options.Control.attr({ readonly: true, Class: "form-control" }).css({ cursor: "pointer" });

        Debris.Components.BaseComponent.call(this, $$Options);

    }
    , Input_DateTime: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", /* "PropertyType", */ "Value", "Length", "ParentEl", "OnValidated", "OnCreated"]);
        var $This = this;
        $$Options.Control = $$Options.Control || $("<Input>").attr({ Type: "text" });
        
        if(!$$Options.ParentEl){
            console.warn("Si no se asigna la propiedad ParentEl, se observarán comportamientos extraños al mover el scroll\nMás información: \n\n\t- https://github.com/dangrossman/daterangepicker/issues/803\n\t- http://www.daterangepicker.com/#example2" );
        }

        // [!] Añadir property
        $$Options.Property = { 
            get: function(){
                return $This.Control.val();
            },
            set: function($Val){
                return $This.Control.val($Val);
            },
            enumerable: true
        };
        this.Init = function(){
            $$Options.Control.daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                locale: $.extend({ format: 'YYYY-MM-DD' }, Debris.Misc.Lang.DateRange.Es),
                parentEl: $$Options.ParentEl
            });
            $$Options.Property.set($$Options.Value);
        };

        $$Options.Control.attr({ readonly: true, Class: "form-control" }).css({ cursor: "pointer" });

        Debris.Components.BaseComponent.call(this, $$Options);

    }
    , Input_DateRange: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", /* "PropertyType", */ "Value", "StartDate", "EndDate", "OnCreated"]);
        var $This = this;
        $$Options.Control = $$Options.Control || $("<Input>").attr({ Type: "text" }).addClass("form-control");
        $$Options.Control.on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
        }).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });

        var $ThisStart;
        var $ThisEnd;

        if(!!$$Options.StartDate && !!$$Options.EndDate){
            $ThisStart = moment($$Options.StartDate, "YYYY-MM-DD");
            $ThisEnd = moment($$Options.EndDate, "YYYY-MM-DD");
        }

        $$Options.Control.daterangepicker({
            startDate: $$Options.StartDate,
            showDropdowns: true,  
            endDate: $$Options.EndDate,
            locale: $.extend({ format: 'YYYY-MM-DD' }, Debris.Misc.Lang.DateRange.Es)
        }, function($$Start, $$End){
            $ThisStart = $$Start;
            $ThisEnd = $$End;
        });

        if(!$$Options.StartDate || !$$Options.EndDate){
            $$Options.Control.val("");
        }

        $$Options.Control.attr({ ReadOnly: true }).css({ cursor: "pointer" });
        $$Options.Property = {
            get: function(){
                if($$Options.Control.val() == "" || $$Options.Control.val() == "Invalid date"){
                    return "";
                }else{
                    var $Vals = $$Options.Control.val().split(" - ");
                    return { Start: $Vals[0], End: $Vals[1] };
                }
                //return { Start: $ThisStart.format("YYYY-MM-DD"), End: $ThisEnd.format("YYYY-MM-DD") };
            },
            set: function($Val){
                $$Options.Control.val("");
                if($Val!=""){
                    console.warn("Set data no se ha implementado definitivamente para este control");
                }
            },
            enumerable: true
        }
        //$$Options.PropertyType = String;
        Debris.Components.BaseComponent.call(this, $$Options);
    }
    , Input_Password: function($Options){
        Debris.Components.Input_Text.call(this, $.extend($Options, { Control: $("<Input>").attr({ type: "password" }) }));
        // var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", /* "PropertyType", */ "Value", "Length", "OnValidated"]);
        // var $This = this;
        // $$Options.Control = $$Options.Control || $("<Input>").attr({ Type: "password" });
        // $$Options.Control.attr({ MaxLength: $$Options.Length }).val($$Options.Value);
        // $$Options.Property = { get: function(){ return $$Options.Control.val(); }, set: function($Val){ $$Options.Control.val($Val); }, enumerable: true };
        // $$Options.PropertyType = String;
        // Debris.Components.BaseComponent.call(this, $$Options);
    }
    , Input_Select: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", /* "PropertyType", */ "Value", "Values", "OnValidated", "OnCreated"]);
        Debris.Property.Init({ 
            Fields: {
                Values: { Initial: $$Options.Values, Types: [Array] }
            },
            Object: this
        })
        var $This = this;
        $$Options.Control = $$Options.Control || $("<Select></Select>");
        $$Options.Control.append(
            $.map($$Options.Values, function($$e, $$i){
                return $("<Option></Option>").attr({ Value: $$e.Value }).text($$e.Text);
            })
        ).val($$Options.Value);

        $$Options.Property = { get: function(){ 
            return $This.Control.find(":selected").val(); 
        }, set: function($Val){ 
            if( $.grep($This.Values, function($e, $i){ return $e.Value == $Val; }).length > 0 ){ 
                $This.Control.val($Val);
            }else{ 
                console.warn("El valor proporcionado no es una opción conocida por este elemento."); 
            }
        }, enumerable: true };
        //$$Options.PropertyType = Number;
        Debris.Components.BaseComponent.call(this, $$Options);
    }, Input_Select2: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", /* "PropertyType", */ "Value", "Values", "Parent", "OnValidated", "Multiple", "OnCreated"]);
        Debris.Property.Init({
            Fields: {
                Values: { Initial: $$Options.Values, Types: [Array] },
                Parent: { Initial: $$Options.Parent, Types: [jQuery] }
            },
            Object: this
        });
        if(!$$Options.Parent){
            console.warn("Si no se asigna la propiedad dropdownParent a través del parámetro Parent, se observarán comportamientos extraños dentro de un modal\nMás información: \n\n\t- https://select2.org/troubleshooting/common-problems" );
        }
        var $This = this;
        $$Options.Control = $$Options.Control || $("<Select></Select>");
        $$Options.Control.append(
            $.map($$Options.Values, function($$e, $$i){
                return $("<Option></Option>").attr({ Value: $$e.Value }).text($$e.Text);
            })
        )
            //.val($$Options.Value)
            .attr({ Multiple: $$Options.Multiple })
        ;
        if(!$$Options.Multiple){
            $$Options.Control.val($$Options.Value)
        }

        this.Init = function(){
            if($This.Parent){
                $This.Control = $This.Control.select2({ dropdownParent: $This.Parent });
            }else{
                $This.Control = $This.Control.select2();
            }
            $This.Control.val($$Options.Value).trigger("change");
            var __Base_Append__ = $This.Control.append;
            $This.Control.append = (function($$Append, $$Control){
                return function($Appended){
                    if($Appended.constructor == jQuery){
                        if($Appended[0].constructor == HTMLOptionElement){
                            $This.Values.push({ Text: $Appended.text(), Value: $Appended.val() });
                        }
                    }
                    $$Append.call($$Control, $Appended);
                };
            })(__Base_Append__, $This.Control);
        };

        $$Options.Property = { 
            get: function(){
                if($$Options.Multiple){
                    return $This.Control.val();
                }else{
                    return $This.Control.find(":selected").val();
                }
            }, 
            set: function($Val){ 
                if($Val==""){
                    $This.Control.val($Val).trigger("change");
                    return;
                }
                if( $.grep($This.Values, function($e, $i){ return $e.Value == $Val; }).length > 0 ){ 
                    $This.Control.val($Val).trigger("change");
                }else{ 
                    console.warn("El valor proporcionado no es una opción conocida por este elemento."); 
                }
            },
            enumerable: true,
            configurable: true
        };
        $$Options.PropertyType = Number;
        if($$Options.Multiple){
            $$Options.IsModified = (function($$$Options, $$This){
                return function(){
                    var $CurrValue = $$This.Control.val();
                    var $OriginalValue = $$$Options.Value || [];
                    if($CurrValue.length != $OriginalValue.length){
                        return true;
                    }
                    $.map($CurrValue, function($e, $i){
                        return $e == $OriginalValue[$i];
                    }).reduce(function($c, $n){
                        return $c && $n;
                    }, true);
                };
            })($$Options, $This);
        }
        Debris.Components.BaseComponent.call(this, $$Options);

    }
    , Input_File: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Name", "Object", "Title", "Control", "Virtual", /* "PropertyType", */ "Value", "Length", "Accept", "OnValidated", "OnCreated"]);
        var $This = this;
        Debris.Components.Input_File.__INSTANCES__[Debris.Components.Input_File.__CNT_INSTANCES__++] = this;
        $$Options.Control = $$Options.Control || $("<Label>")
            .append("<Text>Seleccionar...</Text>")
            .append( 
                $("<Input>").attr({ 
                    Type: "file"
                    , Id: "__Input_File__" + Debris.Components.Input_File.__CNT_INSTANCES__
                    , Accept: $$Options.Accept
                }).css({
                    display: "None"
                })
            ).attr({
                For: "__Input_File__" + Debris.Components.Input_File.__CNT_INSTANCES__,
                Class: "btn btn-primary btn-xs"
            })
        ;
        //$$Options.Control.attr({ MaxLength: $$Options.Length });
        $$Options.Control.find("input").on("change", function($Evt){
            //console.log($Evt);
            if($Evt.target.files.length > 0){
                var $Name = $Evt.target.files[0].name;
                $$Options
                    .Control
                    .find("text")
                    .text($Name.substr(0, 12) + ( $Name.length > 12 ? "...":"" ))
                ;
            }else{
                $$Options
                    .Control
                    .find("text")
                    .text("Seleccionar...")
            }
        });
        $$Options.Property = { 
            get: function(){
                return $$Options.Control.find("input").prop("files");
            }, set: function(){
                // [!] Readonly
            },
            enumerable: true
        };
        $$Options.IsModified = function(){
            return $This.Property.get().length > 0;
        };
        //$$Options.PropertyType = String;
        Debris.Components.BaseComponent.call(this, $$Options);
    }
    , jQuery: {
        AjaxDataTable: function($Options){
            var $$Options = Debris.Misc.Function_Options($Options, [
                "Columns", "InitialData", "Container", "CreateService", "ReadService", "UpdateService", "DeleteService", "PagesPerLoad",
                "Total", "TotalFiltered", "Token", "TokenName", "ColumnTypes", "Args", "AjaxData", "OnDraw", "NotificationPanel", "FilterOnSuccess",
                "OnCreated"
            ]);
            /* 
                [!] Crear un getter que:
                    - Obtenga un array de todas las filas que se están mostrando
                    - Cada posición del array debe permitir cambiar el valor de una celda desde el objeto obtenido en esa posición
                    - Sólo las que se están mostrando porque en rigor las que no se están mostrando no existen para el front,
                        traerlas cuando esta funcionalidad lo requiera creará problemas indeseados con el ordenamiento y los filtros
            */

            // Simplemente para que no bloquee el form
            $$Options.IsModified = function(){ return undefined; };
            Debris.Components.BaseComponent.call(this, $$Options);
            var $This = this;
            var $BaseUrl = location.href.replace(/\/$/ig, "") + "/";
            var $Table;
            var __Instance__ = ++Debris.Components.jQuery.AjaxDataTable.__INSTANCE_INDEX__;
            Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[__Instance__] = $This;

            Debris.Property.Init({
                Fields: {
                    Columns: { Initial: $$Options.Columns, Types: [Object] },
                    InitialData: { Initial: $$Options.InitialData, Types: [Array] },
                    Container: { Initial: $$Options.Container || $("<Div></Div>"), Types: [jQuery] },
                    CreateService: { Initial: $$Options.CreateService || $BaseUrl + "Create", Types: [String] },
                    ReadService: { Initial: $$Options.ReadService || $BaseUrl + "Read", Types: [String] },
                    UpdateService: { Initial: $$Options.UpdateService || $BaseUrl + "Update", Types: [String] },
                    DeleteService: { Initial: $$Options.DeleteService || $BaseUrl + "Delete", Types: [String] },
                    PagesPerLoad: { Initial: $$Options.PagesPerLoad || 10, Types: [Number] },
                    Total: { Initial: $$Options.Total, Types: [Number] },
                    TotalFiltered: { Initial: $$Options.TotalFiltered, Types: [Number] },
                    Token: { Initial: $$Options.Token, Types: [String] },
                    TokenName: { Initial: $$Options.TokenName, Types: [String] },
                    Table: { Types: [jQuery], Get: function(){ return $Table; } },
                    ColumnTypes: { Initial: $$Options.ColumnTypes, Types: [Object] },
                    Args: { Initial: $$Options.Args || {}, Types: [Object] },
                    AjaxData: { Initial: $$Options.AjaxData|| {}, Types: [Object], Enumerable: true },
                    Instance: { Get: function(){ return __Instance__; }, Types: [Number] },
                    OnDraw: { Initial: $$Options.OnDraw || function(){}, Types: [Function] },
                    NotificationPanel: { Initial: $$Options.NotificationPanel, Types: [Debris.Components.Bootstrap.Notifications] },
                    FilterOnSuccess: { Initial: $$Options.FilterOnSuccess, Types: [Boolean] }
                },
                Object: $This
            });

            $This.ColumnTypes = $This.ColumnTypes || {};

            var $MapChkClosures = function($From){
                return function($e, $i){
                    var $Out = {};
                    $Out[$e] = $From[$e];
                    return $Out;
                };
            };

            var $ReduceChkClosures = function($c, $n){
                $.extend($c, $n);
                return $c;
            };

            this.__Input_Checkbox__Stack__ = function($ChkOptions){
                var $Sender = $($ChkOptions.Sender);
                var $ColName = $ChkOptions.ColName;
                var $Tr = $Sender.closest("Tr");
                var $Data = $DT.row($Tr).data();
                if($($Sender).prop("checked")){
                    if(!__Input_Checkbox__Stack__Search__($Data, $CheckboxClosures[$ColName])){
                        $CheckboxClosures[$ColName].CheckedColumns.push( 
                            $.map($CheckboxClosures[$ColName].Definition.Stack.Keys, $MapChkClosures($Data)).reduce($ReduceChkClosures)
                        );
                    }
                }else{
                    $CheckboxClosures[$ColName].CheckedColumns = $.grep($CheckboxClosures[$ColName].CheckedColumns, function($e, $i){
                        return !Debris.Misc.Object.Compare(
                            $.map($CheckboxClosures[$ColName].Definition.Stack.Keys, $MapChkClosures($e)).reduce($ReduceChkClosures)
                            , $.map($CheckboxClosures[$ColName].Definition.Stack.Keys, $MapChkClosures($Data)).reduce($ReduceChkClosures)
                        );
                    });
                }
                //$CheckboxClosures[$ColName].HeaderIsChecked = false;
                //$DT.draw(false);
                var $Chks = $Table.find("input[type=checkbox]");
                var $AllTrue = $.map($Chks.slice(1, $Chks.length), function($e, $i){ return $($e).prop("checked"); }).reduce(function($c, $n){ return $c && $n; });
                $Table.find("input[type=checkbox]:nth(0)").prop({ checked: $AllTrue });
                
            };

            var __Input_Checkbox__Stack__Search__ = function($Row, $Closure){
                var $Found = $.grep($Closure.CheckedColumns, function($e, $i){
                    return Debris.Misc.Object.Compare(
                        $.map($Closure.Definition.Stack.Keys, $MapChkClosures($e)).reduce($ReduceChkClosures)
                        , $.map($Closure.Definition.Stack.Keys, $MapChkClosures($Row)).reduce($ReduceChkClosures)
                    );
                });
                return $Found.length;
            };

            var $CheckboxClosures = {};
            Object.defineProperty($This, "__CheckboxClosures__", { get: function(){ return $CheckboxClosures; } });
            
            this.__Inline_Input_Select__ = function($Options){
                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $OriginalValue = $Control.text();
                $Control.remove();

                var $Def = $This.Columns[$Options.Name];

                var $InputSelect;
                if($Def){
                    $InputSelect = new Debris.Components[$Def.Type]($.extend({}, $Def, { 
                        Parent: $Def.Parent || document.body
                    }));
                }else{
                    console.error("No se ha encontrado la definición de la columna " + $Options.Name);
                    return;
                }

                var $Initial = $Def.Values.find(function($e, $i){ 
                    return $e.Text == $Control.text();
                });
                if($Initial){
                    $InputSelect.Control.val( $Initial.Value );
                }
                
                var $Done = function(){
                    var $Val = $InputSelect.Control.val();
                    if($InputSelect.Control.find(":selected").text() == $OriginalValue || $Val == ""){
                        $Cancel();
                        return;
                    }
                    $Control.text($InputSelect.Control.find(":selected").text());
                    //$InputSelect.Control.remove();
                    //$Parent.append($Control);
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();
                    $Data[$Options.Name] = $Val;
                    $This.Update({
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        },
                        AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                    //$DT.row($Tr).data($Data);
                };

                var $Cancel = function(){
                    if($Def.Type == "Input_Select2"){
                        $InputSelect.Control.parent().html("");
                    }else{
                        $InputSelect.Control.remove();
                    }
                    $Parent.append($Control);
                };
                
                $Parent.append(
                    $InputSelect
                        .Control
                );

                if($Def.Type == "Input_Select"){
                    $InputSelect.Control.addClass("form-control form-control-sm")
                        .on("blur", function($Evt){
                            $Done();
                        }).on("keydown", function($Evt){
                            if($Evt.keyCode == 27){
                                $Cancel();
                            }
                        })
                }

                $InputSelect.Control.focus();

                if($InputSelect.Init){
                    $InputSelect.Init();
                }

                if($Def.Type == "Input_Select2"){
                    $InputSelect.Control.on("select2:close", function($Evt){
                        $Done();
                    }).on("keydown", function($Evt){
                        if($Evt.keyCode == 27){
                            $Cancel();
                        }
                    });
                    if($Initial){
                        $InputSelect.Control.val( $Initial.Value ).trigger("change");
                    }
                    $InputSelect.Control.select2("open");
                    // $InputSelect.Control.next().find("span.select2-selection").on("blur", function($Evt){
                    //     $Done();
                    // }).on("keydown", function($Evt){
                    //     if($Evt.keyCode == 27){
                    //         $Cancel();
                    //     }
                    // });
                }

            };

            this.__Inline_EstadosFicha__ = function($Options){
                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $OriginalValue = $Control.text();
                $Control.remove();

                var $Def = $This.Columns[$Options.Name];

                var $InputSelect;

                var $Initial = $Def.Values.find(function($e, $i){ 
                    return $e.Text == $Control.text();
                });

                switch($Initial.Value){

                    // De errores a creada
                    case 40:
                    case 41:
                    case 42:
                    case 43:
                    case 44:
                    case 50:
                    case 51:
                    case 52:
                    case 53:
                    case 54:
                        // To 10
                        var $OptsETC = [
                            { Text: $Initial.Text, Value: $Initial.Value },
                            { Text: "Creada", Value: 10 }
                        ];
                        if($Def){
                            $InputSelect = new Debris.Components["Input_Select2"]($.extend({}, $Def, {
                                Parent: $Def.Parent || document.body,
                                Values: $OptsETC
                            }));
                        }else{
                            console.error("No se ha encontrado la definición de la columna " + $Options.Name);
                            return;
                        }
                    break;         
                    case 90:
                        // To 70
                        var $OptsETC = [
                            { Text: $Initial.Text, Value: $Initial.Value },
                            { Text: "Terminada", Value: 70 }
                        ];
                        if($Def){
                            $InputSelect = new Debris.Components["Input_Select2"]($.extend({}, $Def, {
                                Parent: $Def.Parent || document.body,
                                Values: $OptsETC
                            }));
                        }else{
                            console.error("No se ha encontrado la definición de la columna " + $Options.Name);
                            return;
                        }
                    break;
                    default:
                        
                    break;
            
                }

                
                if($Initial){
                    $InputSelect.Control.val( $Initial.Value );
                }
                
                var $Done = function(){
                    var $Val = $InputSelect.Control.val();
                    if($InputSelect.Control.find(":selected").text() == $OriginalValue || $Val == ""){
                        $Cancel();
                        return;
                    }
                    $Control.text($InputSelect.Control.find(":selected").text());
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();
                    $Data[$Options.Name] = $Val;
                    $This.Update({
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        },
                        AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                };

                var $Cancel = function(){
                    if($Def.Type == "EstadosFicha"){
                        $InputSelect.Control.parent().html("");
                    }else{
                        $InputSelect.Control.remove();
                    }
                    $Parent.append($Control);
                };
                
                $Parent.append(
                    $InputSelect
                        .Control
                );

                if($Def.Type == "Input_Select"){
                    $InputSelect.Control.addClass("form-control form-control-sm")
                        .on("blur", function($Evt){
                            $Done();
                        }).on("keydown", function($Evt){
                            if($Evt.keyCode == 27){
                                $Cancel();
                            }
                        })
                }

                $InputSelect.Control.focus();

                if($InputSelect.Init){
                    $InputSelect.Init();
                }

                if($Def.Type == "EstadosFicha"){
                    $InputSelect.Control.on("select2:close", function($Evt){
                        $Done();
                    }).on("keydown", function($Evt){
                        if($Evt.keyCode == 27){
                            $Cancel();
                        }
                    });
                    if($Initial){
                        $InputSelect.Control.val( $Initial.Value ).trigger("change");
                    }
                    $InputSelect.Control.select2("open");
                }

            };

            this.__Inline_Input_Date__ = function($Options) {

                var DefaultTime = 5000;
                $This.NotificationPanel.Time = DefaultTime;
                $This.NotificationPanel.Type = "danger";

                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $OriginalValue = $Control.text();
                var conflict = false;

                $Control.remove();

                var $Def = $This.Columns[$Options.Name];
                var $InputDate;

                if($Def){
                    $InputDate = new Debris.Components[$Def.Type]($.extend({}, $Def, { 
                        Parent: $Def.Parent || document.body
                    }));
                }else{
                    console.error("No se ha encontrado la definición de la columna " + $Options.Name);
                    return;
                }
                //console.log($InputDate)
                var $Done = function(){

                    var $Val = $InputDate.Control.val();
                    var $DateVal = new Date($Val)
                    $Control.text($InputDate.Control.val());
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();

                    var $DateTerminoPeriodo = $Data.TerminoPeriodo || false
                    var $DateFValue = new Date($DateTerminoPeriodo )
 
                    if($Val == $OriginalValue || $Val == "") {
                        $Cancel();
                        return;
                    }

                    if ($DateTerminoPeriodo != false) {
                        if ($DateVal >= $DateFValue) {
                            conflict = true;
                            $Cancel();
                            return;
                        }
                    }

                    $Data[$Options.Name] = $Val;
                    $This.Update({
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        },
                        AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                };

                var $Cancel = function() {

                    $This.NotificationPanel.Text = 'La fecha de inicio de periodo no puede ser MAYOR o IGUAL a la fecha de termino de periodo';
                    $This.NotificationPanel.Time = DefaultTime;

                    if($Def.Type == "Input_Date"){
                        $InputDate.Control.parent().html("");
                    }else{
                        $InputDate.Control.remove();
                    }

                    if (conflict == false) {
                        $Parent.append($Control);
                    } else {
                        $Parent.append($Control);
                        $Control.text($OriginalValue);
                    }

                };

                function ClosePanel() {
                    $This.NotificationPanel = "";
                }
                
                $Parent.append(
                    $InputDate
                        .Control
                );

                if($Def.Type == "Input_Date"){
                    $InputDate.Control.addClass("form-control form-control-sm")
                        .on("blur", function($Evt){
                            $Done();
                        }).on("keydown", function($Evt){
                            if($Evt.keyCode == 27){
                                $Cancel();
                            }
                        })
                }

                $InputDate.Control.focus();

                if($InputDate.Init){
                    $InputDate.Init();
                }
            };

            this.__Inline_Input_Text__ = function($Options){
                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $OriginalValue = $Control.text();
                $Control.remove();

                var $Def = $This.Columns[$Options.Name];

                var $InputText = new Debris.Components[$Def.Type]($Def);
                
                if($OriginalValue != $Def.Empty){
                    $InputText.Control.val($Control.text());
                }
                
                var $NoCancel = false;
                var $IsShowingErrors = false;

                var $Done = function(){
                    if(!$InputText.IsValid){
                        if($This.NotificationPanel){
                            $NoCancel = true;
                            $This.NotificationPanel.Time = 0;
                            $This.NotificationPanel.Type = "danger";
                            $This.NotificationPanel.Text = "Por favor corrija lo siguiente:<Br><Br><Ul><Li>" + $InputText.NoValidMsgs.reduce(function($c, $n){ return $c + "</Li>" + $n + "<Li>"; }) + "</Li></Ul>Presione Escape para cancelar";
                            $InputText.Control.focus();
                            $NoCancel = false;
                            $IsShowingErrors = true;
                            return;
                        }
                    }
                    if($InputText.Control.val()==""){
                        $Cancel();
                        return;
                    }
                    if($Control.text() == $InputText.Control.val()){
                        $Cancel();
                        return;
                    }
                    $Control.text($InputText.Control.val());
                    $InputText.Control.remove();
                    $Parent.append($Control);
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();
                    $Data[$Options.Name] = $Control.text();
                    $This.Update({ 
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        }
                        , AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                    //$DT.row($Tr).data($Data);
                };
                var $Cancel = function(){
                    if(!$NoCancel){
                        $InputText.Control.remove();
                        $Parent.append($Control);
                        if($IsShowingErrors){
                            $This.NotificationPanel.Time = 1000;
                            $This.NotificationPanel.Text = $This.NotificationPanel.Text;
                        }
                    }
                };

                $Parent.append(
                    $InputText.Control.addClass("form-control form-control-sm").on("keydown", function($Evt){
                        if($Evt.keyCode == 13){
                            $Done();
                        }
                        if($Evt.keyCode == 27){
                            $Cancel();
                        }
                    }).on("blur", function($Evt){
                        $Done();
                    })
                );
                $InputText.Control.select();

            };

            // this.__Inline_Input_Rit__ = function($Options){
            //     var $Control = $($Options.Sender);
            //     var $Parent = $Control.parent();
            //     var $OriginalValue = $Control.text();
            //     $Control.remove();

            //     var $Def = $This.Columns[$Options.Name];

            //     var $InputText = new Debris.Components.Input_Rit($Def);
            //     if($OriginalValue != $Def.Empty){
            //         $InputText.Control.val($Control.text());
            //     }
                
            //     var $NoCancel = false;
            //     var $IsShowingErrors = false;

            //     var $Done = function(){
            //         if(!$InputText.IsValid){
            //             if($This.NotificationPanel){
            //                 $NoCancel = true;
            //                 $This.NotificationPanel.Time = 0;
            //                 $This.NotificationPanel.Type = "danger";
            //                 $This.NotificationPanel.Text = "Por favor corrija lo siguiente:<Br><Br><Ul><Li>" + $InputText.NoValidMsgs.reduce(function($c, $n){ return $c + "</Li>" + $n + "<Li>"; }) + "</Li></Ul>Presione Escape para cancelar";
            //                 $InputText.Control.focus();
            //                 $NoCancel = false;
            //                 $IsShowingErrors = true;
            //                 return;
            //             }
            //         }
            //         if($InputText.Control.val()==""){
            //             $Cancel();
            //             return;
            //         }
            //         if($Control.text() == $InputText.Control.val()){
            //             $Cancel();
            //             return;
            //         }
            //         $Control.text($InputText.Control.val());
            //         $InputText.Control.remove();
            //         $Parent.append($Control);
            //         var $Tr = $Parent.closest("Tr");
            //         var $Data = $DT.row($Tr).data();
            //         $Data[$Options.Name] = $Control.text();
            //         $This.Update({ 
            //             Bean: $Data,
            //             OnHttpError: function(){
            //                 var $K = new Debris.Modals.OkModal({ 
            //                     Text: "Se ha producido un error",
            //                     Title: "Error",
            //                     OkText: "Aceptar"
            //                 });
            //                 $K.Show();
            //                 $Control.text($OriginalValue);
            //                 $Cancel();
            //             }
            //             , AjaxData: {
            //                 __Fields__: JSON.stringify([$Options.Name])
            //             }
            //         });
            //         //$DT.row($Tr).data($Data);
            //     };
            //     var $Cancel = function(){
            //         if(!$NoCancel){
            //             $InputText.Control.remove();
            //             $Parent.append($Control);
            //             if($IsShowingErrors){
            //                 $This.NotificationPanel.Time = 1000;
            //                 $This.NotificationPanel.Text = $This.NotificationPanel.Text;
            //             }
            //         }
            //     };

            //     $Parent.append(
            //         $InputText.Control.addClass("form-control form-control-sm").on("keydown", function($Evt){
            //             if($Evt.keyCode == 13){
            //                 $Done();
            //             }
            //             if($Evt.keyCode == 27){
            //                 $Cancel();
            //             }
            //         }).on("blur", function($Evt){
            //             $Done();
            //         })
            //     );
            //     $InputText.Control.select();

            // };

            this.__Inline_Input_Float__ = function($Options){
                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $OriginalValue = $Control.text();
                $Control.remove();

                var $Def = $This.Columns[$Options.Name];

                var $InputText = new Debris.Components.Input_Number($Def);
                if($OriginalValue != $Def.Empty){
                    $InputText.Control.val($Control.text()).mask('#0,00', { reverse: true });
                }
                
                var $NoCancel = false; 
                var $IsShowingErrors = false;

                var $Done = function(){
                    if(!$InputText.IsValid){
                        if($This.NotificationPanel){
                            $NoCancel = true;
                            $This.NotificationPanel.Time = 0;
                            $This.NotificationPanel.Type = "danger";
                            $This.NotificationPanel.Text = "Por favor corrija lo siguiente:<Br><Br><Ul><Li>" + $InputText.NoValidMsgs.reduce(function($c, $n){ return $c + "</Li>" + $n + "<Li>"; }) + "</Li></Ul>Presione Escape para cancelar";
                            $InputText.Control.focus();
                            $NoCancel = false;
                            $IsShowingErrors = true;
                            return;
                        }
                    }
                    if($InputText.Control.val()==""){
                        $Cancel();
                        return;
                    }
                    if($Control.text() == $InputText.Control.val()){
                        $Cancel();
                        return;
                    }
                    $Control.text($InputText.Control.val().replace(",", "."));
                    $InputText.Control.remove();
                    $Parent.append($Control);
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();
                    $Data[$Options.Name] = $Control.text();
                    $This.Update({ 
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        }
                        , AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                    //$DT.row($Tr).data($Data);
                };
                var $Cancel = function(){
                    if(!$NoCancel){
                        $InputText.Control.remove();
                        $Parent.append($Control);
                        if($IsShowingErrors){
                            $This.NotificationPanel.Time = 1000;
                            $This.NotificationPanel.Text = $This.NotificationPanel.Text;
                        }
                    }
                };

                $Parent.append(
                    $InputText.Control.addClass("form-control form-control-sm").on("keydown", function($Evt){
                        if($Evt.keyCode == 13){
                            $Done();
                        }
                        if($Evt.keyCode == 27){
                            $Cancel();
                        }
                    }).on("blur", function($Evt){
                        $Done();
                    })
                );
                $InputText.Control.select();

            };

            this.__Inline_Input_Number__ = function($Options){
                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $Tr = $Parent.closest("Tr");
                var $Data = $DT.row($Tr).data();
                var $OriginalValue = $Control.text();
                $Control.remove();

                var $Def = $This.Columns[$Options.Name];

                if("nombre" in $Data){
                    $Def["Validations"] = $Def["Validations"] || {};
                    if(["cotizacion_empleador", "cotizacion_trabajador"].indexOf($Data.nombre) > -1){
                        $Def["Validations"]["LessThan"] = { Value: 100.01, NoValidMsg: "Valor porcentual no puede ser mayor a 100" };
                    }
                    if(["vencimiento_mes"].indexOf($Data.nombre) > -1){
                        $Def["Validations"]["LessThan"] = { Value: 32, NoValidMsg: "Último día del mes no puede ser mayor a 31" };
                    }
                    if(["minimo_cobrar"].indexOf($Data.nombre) > -1){
                        $Def["Validations"] = {};
                    }
                }

                var $InputText = new Debris.Components.Input_Number($Def);
                if($OriginalValue != $Def.Empty){
                    $InputText.Control.val($Control.text().replace(/[^\d]/ig, ""));
                }
                
                var $NoCancel = false;
                var $IsShowingErrors = false;

                var $Done = function(){
                    if(!$InputText.IsValid){
                        if($This.NotificationPanel){
                            $NoCancel = true;
                            $This.NotificationPanel.Time = 0;
                            $This.NotificationPanel.Type = "danger";
                            $This.NotificationPanel.Text = "Por favor corrija lo siguiente:<Br><Br><Ul><Li>" + $InputText.NoValidMsgs.reduce(function($c, $n){ return $c + "</Li>" + $n + "<Li>"; }) + "</Li></Ul>Presione Escape para cancelar";
                            $InputText.Control.focus();
                            $NoCancel = false;
                            $IsShowingErrors = true;
                            return;
                        }
                    }
                    if($InputText.Control.val()==""){
                        $Cancel();
                        return;
                    }
                    if($Control.text() == $InputText.Control.val()){
                        $Cancel();
                        return;
                    }
                    $Control.text($InputText.Control.val()); // Aqui se designa cual es valor que ira a la BD 
                    $InputText.Control.remove();
                    $Parent.append($Control);
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();
                    $Data[$Options.Name] = $Control.text();
                    $This.Update({ 
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        }
                        , AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                    //$DT.row($Tr).data($Data);
                };
                var $Cancel = function(){
                    if(!$NoCancel){
                        $InputText.Control.remove();
                        $Parent.append($Control);
                        if($IsShowingErrors){
                            $This.NotificationPanel.Time = 1000;
                            $This.NotificationPanel.Text = $This.NotificationPanel.Text;
                        }
                    }
                };

                $Parent.append(
                    $InputText.Control.addClass("form-control form-control-sm").on("keydown", function($Evt){
                        if($Evt.keyCode == 13){
                            $Done();
                        }
                        if($Evt.keyCode == 27){
                            $Cancel();
                        }
                    }).on("blur", function($Evt){
                        $Done();
                    })
                );
                $InputText.Control.select();

            };

            this.__Inline_Input_Decimal__ = function($Options){
                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $Tr = $Parent.closest("Tr");
                var $Data = $DT.row($Tr).data();
                var $OriginalValue = $Control.text();
                $Control.remove();

                var $Def = $This.Columns[$Options.Name];

                if("nombre" in $Data){
                    $Def["Validations"] = $Def["Validations"] || {};
                    if(["cotizacion_empleador", "cotizacion_trabajador"].indexOf($Data.nombre) > -1){
                        $Def["Validations"]["LessThan"] = { Value: 100.01, NoValidMsg: "Valor porcentual no puede ser mayor a 100" };
                    }
                    if(["vencimiento_mes"].indexOf($Data.nombre) > -1){
                        $Def["Validations"]["LessThan"] = { Value: 32, NoValidMsg: "Último día del mes no puede ser mayor a 31" };
                    }
                    if(["minimo_cobrar"].indexOf($Data.nombre) > -1){
                        $Def["Validations"] = {};
                    }
                }

                var $InputText = new Debris.Components.Input_Decimal($Def);
                if($OriginalValue != $Def.Empty){
                    $InputText.Control.val($Control.text().replace(/[^\d,]/ig, ""));
                }
                
                var $NoCancel = false;
                var $IsShowingErrors = false;

                var $Done = function(){
                    if(!$InputText.IsValid){
                        if($This.NotificationPanel){
                            $NoCancel = true;
                            $This.NotificationPanel.Time = 0;
                            $This.NotificationPanel.Type = "danger";
                            $This.NotificationPanel.Text = "Por favor corrija lo siguiente:<Br><Br><Ul><Li>" + $InputText.NoValidMsgs.reduce(function($c, $n){ return $c + "</Li>" + $n + "<Li>"; }) + "</Li></Ul>Presione Escape para cancelar";
                            $InputText.Control.focus();
                            $NoCancel = false;
                            $IsShowingErrors = true;
                            return;
                        }
                    }
                    if($InputText.Control.val()==""){
                        $Cancel();
                        return;
                    }
                    if($Control.text() == $InputText.Control.val()){
                        $Cancel();
                        return;
                    }
                    $Control.text($InputText.Control.val());
                    $InputText.Control.remove();
                    $Parent.append($Control);
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();
                    $Data[$Options.Name] = $Control.text();
                    $This.Update({ 
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        }
                        , AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                    //$DT.row($Tr).data($Data);
                };
                var $Cancel = function(){
                    if(!$NoCancel){
                        $InputText.Control.remove();
                        $Parent.append($Control);
                        if($IsShowingErrors){
                            $This.NotificationPanel.Time = 1000;
                            $This.NotificationPanel.Text = $This.NotificationPanel.Text;
                        }
                    }
                };

                $Parent.append(
                    $InputText.Control.addClass("form-control form-control-sm").on("keydown", function($Evt){
                        if($Evt.keyCode == 13){
                            $Done();
                        }
                        if($Evt.keyCode == 27){
                            $Cancel();
                        }
                    }).on("blur", function($Evt){
                        $Done();
                    })
                );
                $InputText.Control.select();

            };

            this.__Inline_Input_Password__ = function($Options){
                var $Control = $($Options.Sender);
                var $Parent = $Control.parent();
                var $OriginalValue = $Control.text();
                $Control.remove();

                var $Def = $This.Columns[$Options.Name];

                var $InputText = new Debris.Components.Input_Password($Def);
                if($OriginalValue != $Def.Empty){
                    $InputText.Control.val($Control.text());
                }
                
                var $Done = function(){
                    var $NewPass = $InputText.Control.val();
                    if($InputText.Control.val() == ""){
                        $Cancel();
                        return;
                    }
                    $Control.text("XXXX");
                    $InputText.Control.remove();
                    $Parent.append($Control);
                    var $Tr = $Parent.closest("Tr");
                    var $Data = $DT.row($Tr).data();
                    $Data[$Options.Name] = $NewPass;
                    $This.Update({ 
                        Bean: $Data,
                        OnHttpError: function(){
                            var $K = new Debris.Modals.OkModal({ 
                                Text: "Se ha producido un error",
                                Title: "Error",
                                OkText: "Aceptar"
                            });
                            $K.Show();
                            $Control.text($OriginalValue);
                            $Cancel();
                        }
                        , AjaxData: {
                            __Fields__: JSON.stringify([$Options.Name])
                        }
                    });
                    //$DT.row($Tr).data($Data);
                };
                var $Cancel = function(){
                    $InputText.Control.remove();
                    $Parent.append($Control);
                };

                $Parent.append(
                    $InputText.Control.addClass("form-control form-control-sm").on("keydown", function($Evt){
                        if($Evt.keyCode == 13){
                            $Done();
                        }
                        if($Evt.keyCode == 27){
                            $Cancel();
                        }
                    }).on("blur", function($Evt){
                        $Done();
                    })
                );
                $InputText.Control.select();

            };

            var $BaseColumnTypes = {
                Input_Select: function($Options){
                    if($Options.Data == -1){
                        return $Options.Definition.Unselectable || "N/A";
                    }
                    var $Found = $.grep($Options.Definition.Values || [], function($e, $i){
                        if($Options.Data == null) return false;
                        if($e.Value == null) return false;
                        if($Options.Definition.Multiple){
                            return $Options.Data.indexOf($e.Value) > -1;
                        }else{
                            return $e.Value.toString() == $Options.Data.toString();
                        }
                    });
                    if($Found.length){
                        var $Data = $Found.reduce(function($c, $n){ return $c + ($c == "" ? "":", ") + ($n.Text || $Options.Definition.Empty || "N/A"); }, ""); //$Found[0].Text || $Options.Definition.Empty || "N/A";
                        if($Options.Definition.Inline){
                            return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Select__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                        }else{
                            return $Data;
                        }
                    }else{
                        if($Options.Definition.Inline){
                            return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Select__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Options.Definition.Empty || "N/A" + "</Text>";
                        }else{
                            return $Options.Definition.Empty || "N/A";
                        }
                        
                    }
                },
                EstadosFicha: function($Options){
                    if($Options.Data == -1){
                        return $Options.Definition.Unselectable || "N/A";
                    }
                    var $Found = $.grep($Options.Definition.Values || [], function($e, $i){
                        if($Options.Data == null) return false;
                        if($e.Value == null) return false;
                        if($Options.Definition.Multiple){
                            return $Options.Data.indexOf($e.Value) > -1;
                        }else{
                            return $e.Value.toString() == $Options.Data.toString();
                        }
                    });

                    switch($Options.Data){

                        // De errores a creada
                        case 40:
                        case 41:
                        case 42:
                        case 43:
                        case 44:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                            // To 10
                            $Options.Definition.Inline = true;
                        break;
                        case 90:
                            // To 70
                            $Options.Definition.Inline = true;
                        break;
                        default:
                            $Options.Definition.Inline = false;
                        break;
                
                    }

                    if($Found.length){
                        var $Data = $Found.reduce(function($c, $n){ return $c + ($c == "" ? "":", ") + ($n.Text || $Options.Definition.Empty || "N/A"); }, ""); //$Found[0].Text || $Options.Definition.Empty || "N/A";
                        if($Options.Definition.Inline){
                            return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_EstadosFicha__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                        }else{
                            return $Data;
                        }
                    }else{
                        if($Options.Definition.Inline){
                            return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_EstadosFicha__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Options.Definition.Empty || "N/A" + "</Text>";
                        }else{
                            return $Options.Definition.Empty || "N/A";
                        }       
                    }
                }
                , Input_Text: function($Options){
                    var $Data = $Options.Data;
                    if(!$Options.Data){
                        return $Options.Definition.Unselectable || $Options.Definition.Empty || "N/A";
                    }
                    // if(!$Options.Data){
                    //     $Data = $Options.Definition.Empty || "N/A";
                    // }
                    if($Options.Definition.Inline){
                        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Text__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return $Data;
                    }
                }
                , Input_Number: function($Options){
                    //Debris.Components.Input_Number.KeyDown
                    var $Data = $Options.Data;
                    if(!$Options.Data){
                        $Data = $Options.Definition.Empty || "N/A";
                    }
                    if($Options.Definition.Inline){
                        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Number__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return $Data;
                    }
                }
                , Input_Float: function($Options){
                    //Debris.Components.Input_Number.KeyDown
                    var $Data = $Options.Data.replace(".", ",");
                    if(!$Options.Data){
                        $Data = $Options.Definition.Empty || "N/A";
                    }
                    if($Options.Definition.Inline){
                        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Float__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return $Data;
                    }
                }
                , Input_Decimal: function($Options){
                    //Debris.Components.Input_Number.KeyDown
                    var $Data = $Options.Data.replace(".", ",");
                    if(!$Options.Data){
                        $Data = $Options.Definition.Empty || "N/A";
                    }
                    if($Options.Definition.Inline){
                        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Decimal__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return $Data;
                    }
                }
                , Input_Date: function($Options) {
                    var $Data = $Options.Data
                    if(!$Options.Data){
                        $Data = $Options.Definition.Empty || " N/A ";
                    }
                    if($Options.Definition.Inline){
                        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Date__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return $Data;
                    }
                }
                , Input_DateTime: function($Options){
                    const dateTest = new Date($Options.Data); 
                    var t = dateTest.toUTCString()
                    console.log(t);
                    var form_date = dateTest.getUTCFullYear() + "-" + + (dateTest.getUTCMonth() + 1) + "-" + dateTest.getUTCDate() + " " + dateTest.getUTCHours() + ":" + dateTest.getUTCMinutes();
                    var $Data = $Options.Data

                    if(!$Options.Data){
                        $Data = $Options.Definition.Empty || " N/A ";
                    }
                    if($Options.Definition.Inline){
                        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Date__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return form_date;
                    }
                }
                , Input_Button_Number: function($Options){
                    var $Data = $Options.Data;
                    if(!$Options.Data){
                        $Data = $Options.Definition.Empty || "N/A";
                    }
                    $Data = $Data.replace(/\,$/, "");
                    var $FData = $Data.replace(/\,$/, "");
                    if($Options.Definition.Inline){
                        switch($Options.Row.nombre){
                            case "minimo_cobrar":
                                $FData = "$" + $Data;
                            break;
                            case "cotizacion_trabajador":
                            case "cotizacion_empleador":
                                $FData = $Data + "%";
                            break;
                        }
                        return "<Button Class='btn btn-primary btn-xs' Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Decimal__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $FData + "&nbsp;<Span Class='fa fa-pencil'></Span></Button>";
                        //return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Number__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return $Data;
                    }
                }
                , Input_Password: function($Options){
                    var $Data = $Options.Data;
                    if(!$Options.Data){
                        $Data = $Options.Definition.Empty || "N/A";
                    }
                    if($Options.Definition.Inline){
                        return "<Text Style='cursor: pointer;' OnClick='Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Inline_Input_Password__({ Sender: this, Event: event, Name: \"" + $Options.Definition.Data + "\" })'>" + $Data + "</Text>";
                    }else{
                        return $Data;
                    }
                }
                // [!] Consider "stack" as a third mode...
                , Input_Checkbox: function($ChkOptions){
                    if($ChkOptions.Definition.Inline){
                        $CheckboxClosures[$ChkOptions.Definition.Data] = $CheckboxClosures[$ChkOptions.Definition.Data] || { CheckedColumns: [], Definition: $ChkOptions.Definition, HeaderIsChecked: false };
                        if($ChkOptions.Definition.Stack){
                            if(false/*$CheckboxClosures[$ChkOptions.Definition.Data].HeaderIsChecked*/){
                                return "<Input Type=\"Checkbox\"" + ($ChkOptions.Definition.OnChange ? " OnChange='" + $ChkOptions.Definition.OnChange + "({ Sender: this, ColumnData: Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__CheckboxClosures__[\"" + $ChkOptions.Definition.Data + "\"] })' ": "") + " OnClick=\"Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Input_Checkbox__Stack__({ Sender: this, ColName: '" + $ChkOptions.Definition.Data + "' })\" Checked=true>";
                            }else{
                                if(__Input_Checkbox__Stack__Search__($ChkOptions.Row, $CheckboxClosures[$ChkOptions.Definition.Data])){
                                    return "<Input Type=\"Checkbox\"" + ($ChkOptions.Definition.OnChange ? " OnChange='" + $ChkOptions.Definition.OnChange + "({ Sender: this, ColumnData: Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__CheckboxClosures__[\"" + $ChkOptions.Definition.Data + "\"] })' ": "") + " OnClick=\"Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Input_Checkbox__Stack__({ Sender: this, ColName: '" + $ChkOptions.Definition.Data + "' })\" Checked=true>";
                                }else{
                                    return "<Input Type=\"Checkbox\"" + ($ChkOptions.Definition.OnChange ? " OnChange='" + $ChkOptions.Definition.OnChange + "({ Sender: this, ColumnData: Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__CheckboxClosures__[\"" + $ChkOptions.Definition.Data + "\"] })' ": "") + " OnClick=\"Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Input_Checkbox__Stack__({ Sender: this, ColName: '" + $ChkOptions.Definition.Data + "' })\">";
                                }
                            }
                        }else{
                            if($ChkOptions.Data){
                                return "<Input Type=\"Checkbox\"" + ($ChkOptions.Definition.OnChange ? " OnChange='" + $ChkOptions.Definition.OnChange + "({ Sender: this, ColumnData: Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__CheckboxClosures__[\"" + $ChkOptions.Definition.Data + "\"] })' ": "") + " Checked=true>";
                            }else{
                                return "<Input Type=\"Checkbox\"" + ($ChkOptions.Definition.OnChange ? " OnChange='" + $ChkOptions.Definition.OnChange + "({ Sender: this, ColumnData: Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__CheckboxClosures__[\"" + $ChkOptions.Definition.Data + "\"] })'": "") + ">";
                            }
                        }
                    }else{
                        if($ChkOptions.Data){
                            return $ChkOptions.Definition.Checked || "True";
                        }else{
                            return $ChkOptions.Definition.Unchecked || "False";
                        }
                    }
                }
            };

            //$BaseColumnTypes.EstadosFicha = $BaseColumnTypes.Input_Select;
            $BaseColumnTypes.Input_Select2 = $BaseColumnTypes.Input_Select;
            $BaseColumnTypes.Input_Rut = $BaseColumnTypes.Input_Text;
            $BaseColumnTypes.Input_DateRange = $BaseColumnTypes.Input_Text;

            $.extend($BaseColumnTypes, $This.ColumnTypes);
            $This.ColumnTypes = $BaseColumnTypes;

            var $Pages;
            var $PageIndex = 1;
            var $FirstInit = true;
            var $DT;
            Object.defineProperty($This, "DataTable", { 
                get: function(){ return $DT; },
                enumerable: true
            });
            
            this.__Input_Checkbox_Header__ = function($Sender, $ColName){
                //console.log($ColName);
                var $HeaderChecked = $($Sender).prop("checked")
                $CheckboxClosures[$ColName].HeaderIsChecked = $HeaderChecked;
                console.log($CheckboxClosures);
                if(!$HeaderChecked){
                    $CheckboxClosures[$ColName].CheckedColumns = [];
                }
                var $Chks;
                if($HeaderChecked){
                    $Chks = $Table.find("input[type=checkbox]:not(:checked)");
                }else{
                    $Chks = $Table.find("input[type=checkbox]:checked");
                }
                $.each($Chks/*.slice(1, $Chks.length)*/, function($i, $e){
                    console.log($($e).is(":checked"));
                    // $($e).prop("checked", $HeaderChecked);
                    // $($e).trigger("change");
                    $($e).click();
                });
                
                window[$CheckboxClosures[$ColName].Definition.OnChange]({ Sender: $Sender, ColumnData: $CheckboxClosures[$ColName] });
                //$DT.draw(false);
            };

            var $Columns = $.map($This.Columns, function($e, $i){
                // [!] Maybe change "Data" for "$i"
                var $Closure = {};
                var $Title = $e.Title;
                var $Orderable = typeof($e.Order) == "undefined" ? true:$e.Order;
                if($e.Visible === false){
                    return;
                }
                if($e.Type=="Input_Checkbox"){
                    if($e.Header===true){
                        $This.GetCheckedKeys = function($ColName){
                            return $CheckboxClosures[$ColName].CheckedColumns;
                        };
                        $Orderable = false;
                        if( $.map($CheckboxClosures, function($e, $i){ return $e; }).length > 0 ){
                            // [!] Not needed, unless some race condition redraws the header
                        }else{
                            $Title = "<Input Type='Checkbox' OnClick=\"Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[" + $This.Instance + "].__Input_Checkbox_Header__(this, '" + $e.Data + "')\">";
                        }
                    }
                }
                return {
                    title: $Title,
                    data: $e.Data,
                    name: $e.Data,
                    orderable: $Orderable,
                    //visible: typeof($e.Visible) == "undefined" ? true:$e.Visible,
                    render: (function($Def){
                        return function($Data, $Type, $Row){
                            if($This.ColumnTypes[$Def.Type]){
                                return $This.ColumnTypes[$Def.Type]({ Data: $Data, Definition: $Def, Row: $Row, Closure: $Closure });
                            }else{
                                console.warn("No se ha definido un renderer de columna para " + $Def.Type);
                                return "N/A";
                            }
                        }
                    })($e)
                };
            });
            var $LastOrder;
            var $PageLength;
            var $LastStart;

            var $SearchBean;
            var $CustomSearch;
            
            this.Search = function($Bean){
                $SearchBean = $Bean;
                $CustomSearch = true;
                //console.log($SearchBean)
                //$.each($Bean, function($i, $e){
                //    $DT.column($i + ":name").search($e);
                //});
                $DT.draw();
            }

            this.ClearSearch = function(){
                var $ColumnNames = $.map($This.Columns, function($e){ return $e.Data });
                $.each($ColumnNames, function($i, $e){
                    $DT.column($e + ":name").search("");
                });
                $DT.draw();
            }

            this.Init = function($InitOptions){
                var $$InitOptions = Debris.Misc.Function_Options($InitOptions, ["SearchBean"]);
                $Table = $("<Table></Table>");
                $This.Control = $Table;
                //($This.OnControlCreated || function(){})($This.Control);
                $This.Container.empty().append($Table);
                var $Args = {
                    columns: $Columns,
                    serverSide: true,
                    ajax: function($$Data, $$Callback, $$Settings){
                        
                        var $SearchBeanToSend = {};
                        if($CustomSearch){
                            $SearchBeanToSend = $SearchBean;
                            //$CustomSearch = false;
                        }else{
                            $.each($$Data.columns, function($i, $e){ $SearchBeanToSend[$e.name] = $e.search.value; });
                        }
                        
                        var $OrderBean = {};
                        $.each($$Data.order, function($i, $e){ $OrderBean[ $$Data.columns[$e.column].name ] = $e.dir; });

                        var $AjaxData = {
                            Page: Math.ceil(($$Data.start + 1)/$$Data.length)
                            , SearchBean: JSON.stringify($SearchBeanToSend)
                            , OrderBean: JSON.stringify($OrderBean)
                            , Length: $$Data.length  
                        };

                        $.ajax({
                            data: [$AjaxData, $This.AjaxData].reduce(function($c, $n){
                                return $.extend({}, $c, $n);
                            }),
			                //data: $.extend($AjaxData, $This.AjaxData),
                            //data: $.extend($AjaxData, $This.AjaxData),
                            type: "GET",
                            contentType: false,
                            //contentType: "application/json",
                            url: $This.ReadService,
                            success: function($Res){
                                if($Res.Result == 0){
                                    $This.TotalFiltered = $Res.TotalFiltered;
                                    $$Callback({
                                        currentPage: $$Data.page,
                                        data: $Res.Data,
                                        recordsFiltered: $Res.TotalFiltered,
                                        recordsTotal: $This.Total
                                    });
                                }
                                if($Res.Result == 99){
                                    $SessionExpiredModal = typeof($SessionExpiredModal) == "undefined" ? false:true;
                                    if(!$SessionExpiredModal){
                                        $SessionExpiredModal = true;
                                        var $K = new Debris.Modals.OkModal({ 
                                            Text: "Su sesión ha expirado, por favor vuelva a iniciar sesión"
                                            , OkText: "Aceptar"
                                            , Title: "Sesión terminada"
                                        });
                                        $$Callback({ currentPage: $$Data.Page, recordsFiltered: 0, recordsTotal: 0, data: [] });
                                        $K.Show();
                                    }
                                }

                            }
                        });
                    },
                    language: Debris.Misc.Lang.DataTable.Es,
                    searching: false
                };
                if($Columns.length > 1){
                    $.extend($Args, { order: [[1, "asc"]] });
                }
                $.extend($Args, $This.Args);
                $DT = $Table.DataTable($Args);
                $Table
                    .on("draw.dt", $This.OnDraw)
                    .on("page.dt", function(){
                        if($CheckboxClosures["Col1"]){
                            $CheckboxClosures["Col1"].CheckedColumns = [];
                            $CheckboxClosures["Col1"].HeaderIsChecked = false;
                            $Table.find("input[type=checkbox]:nth(0)").prop({ checked: false });
                            $Selected = [];
                            var $OnChange = eval($CheckboxClosures["Col1"].Definition.OnChange);
                            if($OnChange){
                                //$DemandaCol1Changed({ Sender: this,  })
                                $OnChange({ ColumnData: Debris.Components.jQuery.AjaxDataTable.__INSTANCES__[1].__CheckboxClosures__["Col1"] });
                            }
                        }
                    })
                ;
            };

            var $PendingUpdates = []; // [!] Implementar

            this.Update = function($UpdateOptions){

                var $$UpdateOptions = Debris.Misc.Function_Options($UpdateOptions, ["Bean", "Remote", "OnSuccess", "OnHttpError", "WhenResult", "AfterResult", "AjaxData"]);
                var $NotificationPanelSuccess;
                if($This.NotificationPanel){
                    $NotificationPanelSuccess = function(){
                        $This.NotificationPanel.Time = 0;
                        $This.NotificationPanel.Type = "primary";
                        $This.NotificationPanel.Text = "Se ha realizado esta modificación correctamente"
                            + ($This.FilterOnSuccess == undefined || $This.FilterOnSuccess ? "<Br><Br><Button Class='btn btn-primary btn-xs' OnClick='$DT.Search($.extend({}, " + JSON.stringify({ Id: $UpdateOptions.Bean.Id, id: $UpdateOptions.Bean.id }) + " ))'>Filtrar este registro en tabla</Button>":"")
                        ;
                    };
                };
                var $Success = $$UpdateOptions.OnSuccess || $NotificationPanelSuccess || function(){
                    var $K = new Debris.Modals.OkModal({ 
                        Text: "Se ha modificado correctamente este registro",
                        Title: "Correcto",
                        OkText: "Aceptar"
                    });
                    $K.Show();
                };
                var $HttpError = $$UpdateOptions.OnHttpError || function(){
                    var $K = new Debris.Modals.OkModal({ 
                        Text: "Se ha producido un error",
                        Title: "Error",
                        OkText: "Aceptar"
                    });
                    $K.Show();
                };
                var $NotificationPanelWhen1;
                if($This.NotificationPanel){
                    $NotificationPanelWhen1 = function($Res){
                        $This.NotificationPanel.Time = 0;
                        $This.NotificationPanel.Type = "danger";
                        $This.NotificationPanel.Text = $Res.Msg;
                    };
                }
                var $WhenResult = $.extend({}, {
                    1: $NotificationPanelWhen1 || function($Res){
                        var $K = new Debris.Modals.OkModal({ 
                            Text: $Res.Msg,
                            Title: "Error",
                            OkText: "Aceptar"
                        });
                        $K.Show();
                    }, 
                    // 2: Error desconocido
                    // 3: Se Requiere confirmación
                    3: function($Res, $AjxData){ //Response, AjxData
                        var $Confirm = new Debris.Modals.YesNoModal({ 
                            YesText: "Continuar", 
                            NoText: "Cancelar", 
                            Title: "Advertencia",
                            YesCallback: function(){
                                $AjxData.data.append("ConfirmValue", $Confirm.Body.find("input:checked").val());
                                $.ajax($AjxData);
                            }
                        });
                        console.log($Confirm);
                        var $EnableYes = function(){
                            $Confirm.Yes.attr({ disabled: false });
                        };
                        $Confirm.Body
                        .append(
                            $("<Div>").attr({ Class: "row form-group" }).append(
                                $("<Div>").attr({ Class: "col-md-12" }).append(
                                    $Res.Msg
                                )
                            )
                        )
                        .append(
                            // $("<Div>").attr({ Class: "row" })
                            //     .append({ Class: "col-md-12" })
                            //     .append(
                                    $.map($Res.Values, function($e, $i){
                                        return $("<Div>").attr({ Class: "row" }).append(
                                            $("<Div>").attr({ Class: "col-md-1" }).append(
                                                $("<Input>").attr({ Type: "radio", Name: "Value", Value: $i }).on("click", $EnableYes)
                                            )
                                        ).append(
                                            $("<Div>").attr({ Class: "col-md-11" }).append(
                                                $("<Text>").append($e)
                                            )
                                        );
                                    })
                                //)
                        );
                        $Confirm.Show();
                        $Confirm.Yes.attr({ disabled: true });
                        // console.log($Res);
                        // console.log($AjxData);
                    },
                    99: function($Res){
                        // [!] Session expired
                    }
                }, $$UpdateOptions.WhenResult);

                var $AfterResult = $.extend({}, {
                    1: function(){ $This.Search($SearchBean); },
                    2: function(){  },
                    3: function(){
                        $This.Search($SearchBean);
                    }
                }, $$UpdateOptions.AfterResult);

                var $FD = new FormData();
                var $Bean = {};
                var $Files = {};
                $.each($$UpdateOptions.Bean, function($i, $e){
                    if(!(typeof($e) == "undefined" || $e == null)){
                        if($e.constructor!=FileList){
                            $Bean[$i] = $e;
                        }else{
                            //$Files[$i] = $e;
                            $FD.append($i, $e[0]);
                        }
                    }
                });

                $FD.append("Bean", JSON.stringify($Bean));
                $FD.append("Files", $Files);

                $.each($$UpdateOptions.AjaxData || {}, function($i, $e){
                    $FD.append($i, $e);
                });
                
                if($$UpdateOptions.Remote !== false){
                    var $AjxData;
                    $AjxData = {
                        data: $FD //{ Bean: JSON.stringify($$UpdateOptions.Bean) }
                        , type: "PUT"
                        , url: $This.UpdateService
                        , success: function($Res){
                            if($Res.Result == 0){
                                $DT.draw();
                                $Success();
                                return;
                            }
                            $WhenResult[$Res.Result]($Res, $AjxData);
                            $AfterResult[$Res.Result]($Res, $AjxData);
                        }
                        , error: function($Res){
                            $HttpError($Res, $AjxData);
                        }
                        , processData: false
                        , contentType: false
                        //, contentType: "application/json"
                        , cache: false
                    };
                    $.ajax($AjxData);
                }else{
                    console.warn("Update local pendiente"); // Probablemente tenga sentido sólo cuando no sea un ajax table
                }

            };

            var $PendingCreations = []; // [!] Implementar
            
            this.Create = function($CreateOptions){
                var $$CreateOptions = Debris.Misc.Function_Options($CreateOptions, ["Bean", "Remote", "OnSuccess", "WhenResult", "OnHttpError", "AfterSuccess", "AjaxData"]);

                var $NotificationPanelSuccess;
                if($This.NotificationPanel){
                    $NotificationPanelSuccess = function($Res){
                        console.log($Res);
                        $This.NotificationPanel.Time = 0;
                        $This.NotificationPanel.Type = "primary";
                        $This.NotificationPanel.Text = "Se ha añadido correctamente este registro"
                            + ($This.FilterOnSuccess == undefined || $This.FilterOnSuccess ? "<Br><Br><Button Class='btn btn-primary btn-xs' OnClick='$DT.Search($.extend({}, " + JSON.stringify($Res.Response.Keys) + " ))'>Filtrar este registro en tabla</Button>":"")
                        ;
                    };
                };
                // if($This.NotificationPanel){
                //     $NotificationPanelSuccess = function(){
                //         $This.NotificationPanel.Type = "primary";
                //         $This.NotificationPanel.Text = "Se ha añadido correctamente este registro";
                //     };
                // };

                var $Success = $$CreateOptions.OnSuccess || $NotificationPanelSuccess || function(){
                    var $K = new Debris.Modals.OkModal({ 
                        Text: "Se ha creado correctamente este registro",
                        Title: "Correcto",
                        OkText: "Aceptar"
                    });
                    $K.Show();
                };
                var $AfterSuccess = $$CreateOptions.AfterSuccess || function(){};
                var $HttpError = $$CreateOptions.OnHttpError || function(){
                    var $K = new Debris.Modals.OkModal({ 
                        Text: "Se ha producido un error",
                        Title: "Error",
                        OkText: "Aceptar"
                    });
                    $K.Show();
                };
                
                var $NotificationPanelWhen1;
                if($This.NotificationPanel){
                    $NotificationPanelWhen1 = function($Res){
                        $This.NotificationPanel.Time = 0;
                        $This.NotificationPanel.Type = "danger";
                        $This.NotificationPanel.Text = $Res.Msg;
                    };
                }
                var $WhenResult = $.extend({}, {
                    1: $NotificationPanelWhen1 || function($Res){
                        var $K = new Debris.Modals.OkModal({ 
                            Text: $Res.Msg,
                            Title: "Error",
                            OkText: "Aceptar"
                        });
                        $K.Show();
                    },
                    99: function($Res){
                        // [!] Session expired
                    }
                }, $$CreateOptions.WhenResult);

                var $FD = new FormData();
                var $Bean = {};
                var $Files = {};
                $.each($$CreateOptions.Bean, function($i, $e){
                    if($e.constructor!=FileList){
                        $Bean[$i] = $e;
                    }else{
                        //$Files[$i] = $e;
                        $FD.append($i, $e[0]);
                    }
                });
                
                $FD.append("Bean", JSON.stringify($Bean));
                $FD.append("Files", $Files);

                $.each($$CreateOptions.AjaxData || {}, function($i, $e){
                    $FD.append($i, $e);
                });

                if($$CreateOptions.Remote !== false){
                    ShowWait();
                    $.ajax({
                        data: $FD //{ Bean: JSON.stringify($$CreateOptions.Bean) }
                        , type: "POST"
                        , url: $This.CreateService
                        , success: function($Res){
                            CloseWait();
                            if($Res.Result == 0){
                                $This.Total++;
                                $DT.draw();
                                $Success({ Response: $Res });
                                $AfterSuccess();
                                return;
                            }
                            $WhenResult[$Res.Result]($Res);
                        },
                        error: function($Res){
                            CloseWait();
                            $HttpError($Res);
                        }
                        , processData: false
                        , contentType: false
                        //, contentType: "application/json"
                        , cache: false
                    });
                }else{
                    console.warn("Crear local pendiente"); // Probablemente tenga sentido sólo cuando no sea un ajax table
                }

            };

            this.Delete = function($DeleteOptions){
                $$DeleteOptions = Debris.Misc.Function_Options($DeleteOptions, ["IDs", "Remote", "OnSuccess", "OnHttpError", "AfterSuccess"]);
                
                var $NotificationPanelSuccess;
                if($This.NotificationPanel){
                    $NotificationPanelSuccess = function(){
                        $This.NotificationPanel.Text = "Se han eliminado correctamente los registros seleccionados";
                    };
                };
                var $Success = $$DeleteOptions.OnSuccess || $NotificationPanelSuccess || function(){
                    var $Done = new Debris.Modals.OkModal({ 
                        // [!] Distinguir si es plural:
                        Text: "Se han eliminado correctamente los registros seleccionados",
                        Title: "Eliminación completa",
                        OkText: "Aceptar"
                    });
                    $Done.Show();
                };
                var $AfterSuccess = $$DeleteOptions.AfterSuccess || function(){};
                var $HttpError = $$DeleteOptions.OnHttpError || function(){
                    var $K = new Debris.Modals.OkModal({ 
                        Text: "Se ha producido un error",
                        Title: "Error",
                        OkText: "Aceptar"
                    });
                    $K.Show();
                };
                var $WhenResult = $.extend({}, {
                    1: function($Res){
                        var $K = new Debris.Modals.OkModal({ 
                            Text: $Res.Msg,
                            Title: "Error",
                            OkText: "Aceptar"
                        });
                        $K.Show();
                    },
                    99: function($Res){
                        // [!] Session expired
                    }
                }, $$DeleteOptions.WhenResult);

                if($$DeleteOptions.Remote !== false){
                    $.ajax({
                        data: { IDs: JSON.stringify($$DeleteOptions.IDs) },
                        type: "DELETE",
                        url: $This.DeleteService,
                        //contentType: false,
                        //contentType: "application/json",
                        success: function($Res){
                            if($Res.Result == 0){
                                $DT.draw();
                                $Success($Res);
                                $AfterSuccess();
                                return;
                            }else{
                                $WhenResult[$Res.Result]($Res);
                            }
                        },
                        error: function($Res){
                            $HttpError($Res);
                        }
                    });
                }else{
                    console.warn("Eliminar local pendiente"); // Probablemente tenga sentido sólo cuando no sea un ajax table
                }
            };

        }
    }
};

Debris.Components.Input_Number.KeyDown = function (evt) {

    var $Item = $(evt.target);
    var $AllowedKeyCodes = [35, 36, 37, 38, 39, 40, 9, 16, 8, 17, 116, 27, 123];
    //var $AllowedKeys = [$Options.DecimalSeparator];

    if ($AllowedKeyCodes.indexOf(evt.keyCode) > -1) { return true; }
    if (evt.ctrlKey && evt.keyCode == 67) { return true; }
    if (evt.ctrlKey && evt.keyCode == 86) { return true; }
    if (evt.ctrlKey && evt.keyCode == 88) { return true; }

    // if ($AllowedKeys.indexOf(evt.key) > -1) {
    //     if ($Item.val().indexOf($Options.DecimalSeparator) > -1 || $Item.val().length == 0) {
    //         return false;
    //     }
    //     return true;
    // }

    if (($Item.val().length >= 13 /* && $Item.val().indexOf($Options.DecimalSeparator) > -1 */) /* || ($Item.val().length >= 9 && $Item.val().indexOf($Options.DecimalSeparator) == -1) */) {
        return false;
    }

    if ($AllowedKeyCodes.indexOf(evt.keyCode) > -1) return true;

    return /^[0-9]$/ig.test(evt.key);

};

Debris.Components.Input_Number.Paste = function (evt) {
    var $Data = evt.originalEvent.clipboardData.getData('text/plain');
    return new RegExp("^[0-9]([0-9]+)?$", "gi").test($Data);
};

Debris.Components.Input_File.__CNT_INSTANCES__ = 0;
Debris.Components.Input_File.__INSTANCES__ = [];

Debris.Components.jQuery.AjaxDataTable.__INSTANCE_INDEX__ = 0;
Debris.Components.jQuery.AjaxDataTable.__INSTANCES__ = {};

// Debris.Components.jQuery.AjaxDataTable.__Input_Checkbox__Stack__ = function($Sender, $Keys, $InstanceIndex){

// };

Debris.Validation = {
    IsChileanRut: function ($StrValue) {

        var $ClrValue = $StrValue.replace(/(^[^0-9kK]+0+)|([^0-9kK]+)/g, '').toUpperCase();

        if (typeof $ClrValue !== 'string') {
            return false;
        }
        if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test($ClrValue)) {
            return false;
        }

        var t = parseInt($ClrValue.slice(0, -1), 10);
        var m = 0;
        var s = 1;

        while (t > 0) {
            s = (s + (t % 10) * (9 - m++ % 6)) % 11;
            t = Math.floor(t / 10);
        }

        var v = s > 0 ? '' + (s - 1) : 'K';
        return v === $ClrValue.slice(-1);

    }
};

Debris.Components.Validations = {
    Base_Validation: function ($Options) {

        var $This = this;
        var $Except = ["Bind"];
        var $AdditionalParams = ["NoValidMsg", "Source"];
        $Options = Debris.Misc.Function_Options($Options, ["ValueAccessor"].concat($.map(Debris.Components.Validations, function ($e, $i) {
            if ($Except.indexOf($i) > -1) {
                return undefined;
            }
            return $i;
        })).concat($AdditionalParams));

        $This.ValueAccessor = $Options.ValueAccessor;
        if($Options.NoValidMsg.constructor == String){
            this.NoValidMsg = $Options.NoValidMsg;
        }

        if($Options.NoValidMsg.constructor == Function){
            //this.NoValidMsg = $Options.NoValidMsg;
            Object.defineProperty(this, "NoValidMsg", {
                get: function(){
                    return $Options.NoValidMsg($.extend({}, $This, { Value: $This.ValueAccessor.get() }));
                }
            });
        }

        this.Source = $Options.Source;

        //Object.defineProperty(this, "NoValidMsg", Debris.Properties.String({ Initial: $Options.NoValidMsg || "" }));
        //Object.defineProperty($This, "NoValidKeys", {
        //    get: function () {
        //        var $Out = [];
        //        for (var $x in $This.Validations) {
        //            if (!$This.Validations[$x].IsValid) {
        //                $Out.push($x);
        //            }
        //        }
        //        return $Out;
        //        //return $.map($This.Validations, function ($$e, $$i) {
        //        //    if (!$$e.IsValid) {
        //        //        return $$i;
        //        //    }
        //        //});
        //    }, enumerable: true
        //});
        //Object.defineProperty($This, "NoValidMsgs", {
        //    get: function () {
        //        var $Out = [];
        //        for(var $x in $This.Validations){
        //            if (!$This.Validations[$x].IsValid) {
        //                $Out.push($This.Validations[$x].NoValidMessage);
        //            }
        //        }
        //        //return $.map($This.Validations, function ($$e, $$i) {
        //        //    if (!$$e.IsValid) {
        //        //        return $$e.NoValidMessage;
        //        //    }
        //        //});
        //    }, enumerable: true
        //});

    },
    FileType: function FileTypeValidation($Options){

        $Options.Types = $Options.Types || [];
        $Options.NoValidMsg = $Options.NoValidMsg || ("Tipos de archivo permitidos: " + $Options.Types.reduce(function($C, $N){ return $C + ($C ? ", ": "") + $N }, ""));
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        Object.defineProperty(this, "IsValid", {
            get: (function ($This, $$Options) {
                return function () {
                    var $Value = $$Options.ValueAccessor.get();
                    if($Value.length > 0){
                        return $.map($Value, function($e, $i){ 
                            return $.map($Options.Types, function($$e, $$i){ return $e.name.toLowerCase().endsWith($$e); }).reduce(function($c, $n){ return $c || $n; });
                        }).reduce(function($c, $n){ return $c && $n; });
                    }
                    return true;
                }
            })(this, $Options)
        });

    },
    Rut: function RutValidation($Options){

        $Options.NoValidMsg = $Options.NoValidMsg || (($Options.Title || "Rut ingresado") + " no válido");
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        Object.defineProperty(this, "IsValid", {
            get: (function ($This, $$Options) {
                return function () {
                    var $$Value = $$Options.ValueAccessor.get();
                    if($$Value=="") return true;
                    return Debris.Validation.IsChileanRut($$Value, false, false);
                }
            })(this, $Options)
        });

    },
    DateGreaterThanRef: function($Options){
        // Depende de MomentJS
        $Options.NoValidMsg = $Options.NoValidMsg || $Options.Title + " debe ser mayor que " + $Options.Ref.Title;
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        Object.defineProperty(this, "IsValid", {
            get: (function ($This, $$Options) {
                return function () {
                    var $$Value = $$Options.ValueAccessor.get();
                    if($$Value=="") return true;
                    return $$Value > $$Options.Ref.Property.get();
                }
            })(this, $Options)
        });

    },
    LessThan: function($Options){
        $Options.NoValidMsg = $Options.NoValidMsg || $Options.Title + " debe ser inferior a " + $Options.Value;
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        Object.defineProperty(this, "IsValid", {
            get: (function ($This, $$Options) {
                return function () {
                    var $$Value = $$Options.ValueAccessor.get();
                    if($$Value=="") return true;
                    if($$Value.indexOf(",") >= -1){
                        return parseFloat($$Value.replace(",", ".")) < parseFloat($$Options.Value);
                    }
                    if($$Value=="") return true;
                    return $$Value < $$Options.Value;
                }
            })(this, $Options)
        });

    },
    MinLength: function($Options){
        $Options.NoValidMsg = $Options.NoValidMsg || (($Options.Title || "El valor ingresado") + " debe tener como mínimo " + $Options.Length + " caracteres");
        
        //$$Options = Debris.Misc.Function_Options($Options, ["Length"]);

        //var $This = this;

        // Debris.Property.Init({ 
        //     Fields: {
        //         Length: { Initial: $$Options.Length, Type: [Number] },
        //     },
        //     Object: $This
        // });

        if($Options.Length < 0){
            $Options.Length = 0;
            console.warn("Debe ingresar un entero mayor que cero");
        }
        
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        Object.defineProperty(this, "IsValid", {
            get: (function ($This, $$Options) {
                return function () {
                    var $$Value = $$Options.ValueAccessor.get();
                    if($$Value=="") return true;
                    return $$Value.length >= $$Options.Length;
                }
            })(this, $Options)
        });
    }
    , CheckWith: function CheckWithValidation($Options){

        $Options.NoValidMsg = $Options.NoValidMsg || " Los campos no coinciden";
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        var $With = $Options.With;

        Object.defineProperty(this, "IsValid", {
            get: (function ($This, $$Options) {
                return function () {
                    var $$Value = $$Options.ValueAccessor.get();
                    if($$Value=="") return true;
                    return $With.Property.get() == $$Value;
                }
            })(this, $Options)
        });

    }
    , Mail: function MailValidation($Options) {

        $Options.NoValidMsg = $Options.NoValidMsg || ($Options.Title + " ingresado no válido");
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        var _Regex = {};

        Object.defineProperty(this, "Regex", { get: function () { return _Regex; } });
        _Regex.Name = "^(([^<>()\\[\\]\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\"]+)*)|(\".+\"))";
        //Object.defineProperty(_Regex, "Name", Debris.Properties.String({ Initial: "^(([^<>()\\[\\]\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\"]+)*)|(\".+\"))" }));
        _Regex.Domain = "((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";
        //Object.defineProperty(_Regex, "Domain", Debris.Properties.String({ Initial: "((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$" }));

        Object.defineProperty(this, "IsValid", {
            get: (function ($This, $$Options) {
                return function () {
                    return new RegExp($This.Regex.Name + "@" + $This.Regex.Domain).test($$Options.ValueAccessor.get());
                }
            })(this, $Options)
        });

    },
    Required: function RequiredValidation($Options) {

        $Options.NoValidMsg = $Options.NoValidMsg || ("Por favor, ingrese " + $Options.Title);
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        //var $Except = ["Bind"];
        //var $AdditionalParams = ["NoValidMessage"];
        //$Options = Debris.Misc.Function_Options($Options, ["ValueAccessor"].concat($.map(Debris.Components.Validations, function ($e, $i) {
        //    if ($Except.indexOf($i) > -1) {
        //        return undefined;
        //    }
        //    return $i;
        //})).concat( $AdditionalParams ));
        Object.defineProperty(this, "IsValid", {
            get: (function ($$Options) {
                return function () {
                    var $DasValue = $$Options.ValueAccessor.get() || "";
                    if($DasValue.constructor == FileList){
                        return !!$DasValue.length;
                    }
                    return $DasValue != "";
                };
            })($Options)
        });
        //Object.defineProperty(this, "NoValidMessage", Debris.Properties.String({ Initial: $Options.NoValidMessage || "No se ha ingresado el valor requerido" }));
    },
    NotExists: function($Options){
        //$Options.NoValidMsg = $Options.NoValidMsg || ("Por favor, ingrese " + $Options.Title);
        Debris.Components.Validations.Base_Validation.call(this, $Options);
        var $This = this;
        $This.Values = [];
        $This.Reevaluate = function(){
            console.warn("No se ha implementado Reevaluate en validación NotExists");
        };
        $This.Name = $Options.Name;
        Object.defineProperty($This, "Pending", {
            get: function(){
                return $.map($This.Values, function($e, $i){ return !!!$e.Ready; }).reduce(function($c, $n){ return $c || $n; });
            },
            enumerable: true
        });

        Object.defineProperty(this, "IsValid", {
            get: (function ($$Options) {
                return function () {
                    var $DasValue = $$Options.ValueAccessor.get() || "";
                    // Covered by Required:
                    if($DasValue == "") return true;
                    if($This.Source.constructor == String){
                        //$This.Reevaluate();
                        var $Found = $.grep($This.Values, function($e, $i){ 
                            return $e.Value == $DasValue /* && $e.Ready */; 
                        });
                        if($Found.length){
                            if(!$Found[0].Ready) return false;
                            return !$Found[0].Exists;
                        }else{
                            var $CurrVal = { Value: $DasValue, Ready: false };
                            $This.Values.push($CurrVal);
                            var $Search = {};
                            $Search[$This.Name] = $DasValue;
                            $.ajax({
                                data: { Search: JSON.stringify($Search) },
                                type: "GET",
                                url: $This.Source,
                                success: (function($$CurrVal){
                                    return function($Res){
                                        if($Res.Result == 0){
                                            $$CurrVal.Ready = true;
                                            $$CurrVal.Exists = $Res.Exists;
                                            $This.Reevaluate();
                                        }
                                    };
                                })($CurrVal)
                            });
                            return false;
                        }
                    }else{
                        console.warn("Unsupported source type");
                    }
                    return false;
                };
            })($Options)
        });
    },
    Username: function UsernameValidation($Options){
        
        $Options.NoValidMsg = $Options.NoValidMsg || ($Options.Title + " sólo puede contener letras y números. Puede haber punto (.) o guión bajo (_) pero sólo uno a la vez, y no al principio ni al final. No puede empezar con un número.");
        Debris.Components.Validations.Base_Validation.call(this, $Options);

        Object.defineProperty(this, "IsValid", {
            get: (function ($$Options) {
                return function () {
                    var $Value = $$Options.ValueAccessor.get();
                    if($Value == "") return true;
                    // Si empieza o termina con guión bajo
                    if(/(^[._])|([._])$/ig.test($Value)) return false;
                    // Si tiene más de un punto o guión bajo pegados
                    if(/[._]{2,}/ig.test($Value)) return false;
                    // Si tiene algo que no sea letra, punto o guión bajo
                    return /^[A-Z0-9._]+$/ig.test($Value)
                };
            })($Options)
        });

    },
    Bind: function ($Options) {

        $Options = Debris.Misc.Function_Options($Options, ["Validations", "ValueAccessor", "Title"]);

        var $Validations = $Options.Validations || {};
        var $This = this;

        //if (!Debris.Properties.Validation.IsObject($Instance, true)) {
        //    console.error("No se ha proporcionado una instancia a la que asignar validaciones.");
        //    return;
        //}

        $This.Validations = {};

        $.each($Validations, (function ($$This) {
            return function ($i, $e) {
                if (Debris.Components.Validations[$i]) {
                    $e.ValueAccessor = $Options.ValueAccessor;
                    $e.Title = $Options.Title;
                    $$This.Validations[$i] = new Debris.Components.Validations[$i]($e);
                    $$This.Validations[$i].Name = $$This.Name;
                    //console.log($$This);
                } else {
                    console.error("No existe la validación de tipo " + $i);
                }
            };
        })($This));

        Object.defineProperty($This, "IsValid", {
            get: (function ($$This) {
                return function () {
                    var $Out = [];
                    for (var $x in $$This.Validations) {
                        $Out.push($$This.Validations[$x].IsValid);
                    }
                    return $Out.reduce(function ($$c, $$n) { return $$c && $$n; }, true);
                    //return $.map($This.Validations, function ($$e, $$i) {
                    //    return $$e.IsValid;
                    //}).reduce(function ($$c, $$n) { return $$c && $$n; }, true);
                };
            })($This), enumerable: true
        });

        Object.defineProperty($This.Validations, "IsValid", {
            get: (function ($$This) {
                return function () {
                    return $This.IsValid;
                };
            })($This)
        });

        Object.defineProperty($This, "NoValidKeys", {
            get: (function ($$This) {
                return function () {
                    var $Out = [];
                    for (var $x in $$This.Validations) {
                        if (!$$This.Validations[$x].IsValid) {
                            $Out.push($x);
                        }
                    }
                    return $Out;
                    //return $.map($This.Validations, function ($$e, $$i) {
                    //    if (!$$e.IsValid) {
                    //        return $$i;
                    //    }
                    //});
                }
            })($This), enumerable: true
        });

        Object.defineProperty($This, "NoValidMsgs", {
            get: (function ($$This) {
                return function () {
                    var $Out = [];
                    for (var $x in $$This.Validations) {
                        if (!$This.Validations[$x].IsValid) {
                            $Out.push($$This.Validations[$x].NoValidMsg);
                        }
                    }
                    return $Out;
                    //return $.map($This.Validations, function ($$e, $$i) {
                    //    if(!$$e.IsValid){
                    //        return $$e.NoValidMessage;
                    //    }
                    //});
                }
            })($This), enumerable: true
        });

        //Object.defineProperty($Instance, "Validations", { get: function () { return $Validations; } });

    }
};

Debris.Validation.Handlers = {
    Base_Handler: function Base_Handler($Options) {
        var $$Options = Debris.Misc.Function_Options($Options, ["Validations", "Conf", "Bean"]);
        // if (!this.hasOwnProperty("Validations")) {
        //     Object.defineProperty(this, "Validations", { get: (function ($Validations) { return function () { return $Validations; }; })($$Options.Validations), enumerable: true });
        // }
        var $This = this;
        if (!this.hasOwnProperty("Conf")) {
            Object.defineProperty(this, "Conf", { get: (function ($Conf) { return function () { return $Conf; }; })($$Options.Conf), enumerable: true });
        }
        if (!this.hasOwnProperty("Bean")) {
            Object.defineProperty(this, "Bean", { get: (function ($Bean) { return function () { return $Bean; }; })($$Options.Bean), enumerable: true });
        }
        if (!this.hasOwnProperty("IsValid")) {
            Object.defineProperty(this, "IsValid", { 
                get: function(){
                    return $.map($This.Conf, function($e, $i){ return $e.IsValid; }).reduce(function($c, $n){ return $c && $n; });
                },
                enumerable: true
            });
        }
        if (!this.hasOwnProperty("NoValidFields")) {
            Object.defineProperty(this, "NoValidFields", { 
                get: function(){
                    return $.map($This.Conf, function($e, $i){ if(!$e.IsValid) return $i; });
                },
                enumerable: true
            });
        }
        if (!this.hasOwnProperty("Validations")) {
            $.each($This.Validations, function($e, $i){
                $e.Reevaluate = (function($$This){
                    return function(){
                        $$This.Run();
                    };
                })($This);
            });
        }
    },
    WarnAfterControl: function WarnAfterControl($Options) {

        Debris.Validation.Handlers.Base_Handler.call(this, $Options);

        var $Started = {};
        var $This = this;
        $This.Fields = {};

        var $Add = function ($i, $e) {
            $e.Control.parent().append($("<Span></Span>").css({ color: "red" }));
            
            var $StdValidate = function ($$i) {
                return function () {
                    $This.Conf[$$i].Control.next().text("");
                    $This.Conf[$$i].OnValidated({ Conf: $This.Conf[$$i], IsValid: $This.Conf[$$i].IsValid });
                    if (!$Started[$$i]) { return; }
                    if (!$This.Conf[$$i].IsValid) {
                        var $MsgCtrl = $This.Conf[$$i].Control.next();
                        var $Ul = $("<Ul></Ul>");
                        $.each($This.Conf[$$i].NoValidMsgs/*$ErrTxt*/, function ($i, $e) {
                            $Ul.append($("<Li></Li>").append($e));
                        });
                        $MsgCtrl.append($Ul);
                    }
                    //$This.Conf[$$i].OnValidated({ Conf: $This.Conf[$$i], IsValid: $This.Conf[$$i].IsValid });
                }
            };

            var $StdRun = function($$e, $$i){
                return function(){
                    $Started[$$i] = true;
                    $$e.Validate();
                }
            };

            var $StdCallRun = function($$Conf){
                return function(){
                    $$Conf.Run();
                }
            };

            switch($e.constructor){
                case Debris.Components.Input_Select2:
                    $e.Validate = (function ($$i) {
                        return function () {
                            //console.log($This.Conf[$$i].Control);
                            if (!$Started[$$i]) { return; }
                            $This.Conf[$$i].Control.next().next().text("");
                            if (!$This.Conf[$$i].IsValid) {
                                var $MsgCtrl = $This.Conf[$$i].Control.next().next();
                                var $Ul = $("<Ul></Ul>");
                                $.each($This.Conf[$$i].NoValidMsgs/*$ErrTxt*/, function ($i, $e) {
                                    $Ul.append($("<Li></Li>").append($e));
                                });
                                $MsgCtrl.append($Ul);
                            }
                            $This.Conf[$$i].OnValidated({ Conf: $This.Conf[$$i], IsValid: $This.Conf[$$i].IsValid });
                        }
                    })($i);
                    $e.Control.on("change", (function($$Conf){
                        return function(){
                            ($$Conf.Validate || function(){})();
                        };
                    })($e)).next().find("span.select2-selection").on("blur", ($StdCallRun)($e));
                    $e.Run = $StdRun($e, $i);
                break;
                case Debris.Components.Input_Select:
                    $e.Validate = ($StdValidate)($i);
                    $e.Control.on("change", (function($$Conf){
                        return function(){
                            ($$Conf.Validate || function(){})();
                        };
                    })($e)).on("blur", ($StdCallRun)($e));
                    $e.Run = $StdRun($e, $i);
                break;
                case Debris.Components.Input_Checkbox:
                    $e.Validate = ($StdValidate)($i);
                    $e.Control.on("change", (function($$Conf){
                        return function(){
                            ($$Conf.Validate || function(){})();
                        };
                    })($e)).on("blur", ($StdCallRun)($e));
                    $e.Run = $StdRun($e, $i);
                break;
                case Debris.Components.Input_Decimal:
                case Debris.Components.Input_Money:
                case Debris.Components.Input_Float:
                case Debris.Components.Input_Rit:
                case Debris.Components.Input_Number:
                case Debris.Components.Input_Date:
                    $e.Control.on("change", (function($$Conf){
                        return function(){
                            ($$Conf.Validate || function(){})();
                        };
                    })($e)).on("blur", ($StdCallRun)($e));
                case Debris.Components.Input_DateTime:
                case Debris.Components.Input_Password:
                case Debris.Components.Input_Rut:
                case Debris.Components.Input_Text:
                    $e.Validate = ($StdValidate)($i);
                    $e.Control.on("input", (function($$Conf){
                        return function(){
                            ($$Conf.Validate || function(){})();
                        };
                    })($e)).on("blur", ($StdCallRun)($e));
                    $e.Run = $StdRun($e, $i);
                break;
                case Debris.Components.Input_File:
                //case HTMLLabelElement:
                    //if($e.Control.find("input[type=file]").length > 0){
                        $e.Validate = ($StdValidate)($i);
                        $e.Control.on("change", (function($$Conf){
                            return function(){
                                $$Conf.Run();
                                ($$Conf.Validate || function(){})();
                            };
                        })($e));
                        $e.Run = $StdRun($e, $i);
                    //}
                break;
                default:
                    console.warn("No se ha considerado " + $e.constructor.name + " en la validación WarnAfterControl" );
                break;
            }

            $.each($e.Validations, function($$i, $$e){
                $$e.Reevaluate = (function($$This, $$$i){
                    return function(){
                        $$This.Fields[$$$i].Run();
                    };
                })($This, $i);
            });

            $This.Fields[$i] = {
                Run: (function($$e){
                    return function(){
                        $$e.Validate();
                    };
                })($e)
            };

        };

        var $MetaStarted = false;

        var $Start = function ($$Options) {

            $$$Options = Debris.Misc.Function_Options($$Options, ["Except"]);
            $$$Options.Except = $$$Options.Except || [];
            
            $.each($This.Conf, function ($i, $e) {
                if($$$Options.Except.indexOf($i) == -1){
                    $Started[$i] = true;
                    // $.each($e.Validations, function($$i, $$e){
                    //     $$e.Reevaluate = (function($$This){
                    //         return function(){
                    //             $$This.Run();
                    //         };
                    //     })($This);
                    // });
                }else{
                    return;
                }
                if($e.Validate){
                    $e.Validate();
                }
            });
            
        };

        this.Init = function(){
            if(!$MetaStarted){
                $.each(this.Conf, $Add);
                //console.log(this.Conf);
            }
            $MetaStarted = true;
        };

        Object.defineProperty(this, "Run", {
            // For this, run for all, make individual runs, each run decides when to start validating
            get: function () {
                return $Start;
            }
        });

    },
    WarnInModal: function ($Options) {

        Debris.Validation.Handlers.Base_Handler.call(this, $Options);
        //var $Started = false;
        var $This = this;

        var $Start = function () {
            var $Modal = new Debris.Modals.OkModal({ OkText: "Aceptar", Title: "Validación" });
            var $Ul = $("<Ul></Ul>");
            $.each(this.Conf, function ($i, $e) {
                //if (!$Started) { return; }
                if (!$This.Conf[$i].IsValid) {
                    $.each($This.Conf[$i].NoValidMsgs/*$ErrTxt*/, function ($$i, $$e) {
                        $Ul.append($("<Li></Li>").append($$e));
                    });
                }
            });
            $Modal.Body.append($Ul);
            $Modal.Show();
            //console.log($Options);
        };

        Object.defineProperty(this, "IsValid", {
            get: function(){
                return $.map($This.Conf, function($e, $i){ return $e.IsValid; }).reduce(function($c, $n){ return $c && $n; }, true);
            }
        });

        Object.defineProperty(this, "Run", {
            get: function () {
                return $Start;
            }
        });

    }
};

Debris.Property = function ($Options) {

    var $This = this;
    var $$Options = Debris.Misc.Function_Options($Options, ["Initial", "OnSet", "WriteOnly", "ReadOnly", /* "Default", */ /* "Validation,"*/ "Types", "Value", "Enumerable", "Object", "Configurable", "Name", "Get", "Set"]);

    var _ReadOnly = $$Options.ReadOnly || false;
    Object.defineProperty(this, "ReadOnly", { get: function () { return _ReadOnly; }, set: function ($Val) { _ReadOnly = $Val; } });
    var _WriteOnly = $$Options.WriteOnly || false;
    Object.defineProperty(this, "WriteOnly", { get: function () { return _WriteOnly; }, set: function ($Val) { _WriteOnly = $Val; } });
    var _OnSet = $$Options.OnSet || false;
    Object.defineProperty(this, "OnSet", { get: function () { return _OnSet; }, set: function ($Val) { _OnSet = $Val; } });

    var $Val;
    var $Get = $$Options.Get || function () {
        return $Val;
    };

    if (!Debris.Property.Validation.Is({ Value: $$Options.Types, Types: [Array] })) {
        $$Options.Types = [];
    }

    //Object.defineProperty(this, "Value", { get: $Get, set: function ($Val) { _Value = $Val; } });

    var $Is = Debris.Property.Validation.Is;

    var $First = true;
    var $Set = function ($$Val) {
        if ($Is({ Value: $$Options.Set, Types: [Function] })) {
            $Val = $$Val;
            $$Options.Set($$Val);
            if ($Is({ Value: $This.OnSet, Types: [Function] })) {
                $This.OnSet({ Previous: $Prev, Current: $Val });
            }
            return;
        }
        if ($First) {
            //var $IsOfTypes = $$Options.Types.map(function ($e, $i) { return $Is({ Value: $$Val, Type: $e }); }).reduce(function ($c, $n) { return $c || $n; }, false);
            var $IsOfTypes = $Is({ Value: $$Val, Types: $$Options.Types }) || $$Options.Types.length == 0;
            /* , Or: function ($Val) { return $Val != undefined; } */
            //if (!($$Options.Types.map(function ($e, $i) { return $Is({ Value: $$Val, Type: $e }); }).reduce(function ($c, $n) { return $c || $n; }, false)) || $Val != undefined) {
            if ((!$IsOfTypes) || ($Val != undefined)) {
                $First = false;
                return;
            }
        }
        //if ($$Options.Types.map(function ($e, $i) { return $Is({ Value: $$Val, Type: $e, UndefinedTypes: true }); }).reduce(function ($c, $n) { return $c || $n; }, false)) {
        //if ($Is({ Value: $$Val, Type: $$Options.Type, UndefinedType: true })) {
        if ($Is({ Value: $$Val, Types: $$Options.Types, UndefinedTypes: true }) || $$Options.Types.length == 0) {
            var $Prev = $Val;
            $Val = $$Val;
            if ($First) {
                $First = false;
                return;
            }
            if ($Is({ Value: $This.OnSet, Types: [Function] })) {
                $This.OnSet({ Previous: $Prev, Current: $Val });
            }
        } else {
            console.warn("El valor asignado no es del tipo declarado");
        }
    };

    var $Property = {};
    //var $And = function ($Val) { return $Val; };
    if (Debris.Property.Validation.Is({ Value: $This.ReadOnly, Types: [Boolean]/* , And: $And */ }) && $This.ReadOnly) {
        $Property.get = $Get;
        $Property.enumerable = $$Options.Enumerable || true;
    } else if (Debris.Property.Validation.Is({ Value: $$Options.WriteOnly, Types: [Boolean]/* , And: $And */ }) && $$Options.WriteOnly) {
        $Property.set = $Set;
        $Property.enumerable = $$Options.Enumerable || true;
    }

    if (Debris.Property.Validation.Is({ Value: $This.ReadOnly, Types: [Boolean]/* , And: $And */ }) && $This.ReadOnly) {
        $Property.get = $Get;
        $Property.configurable = $$Options.Configurable || true;
    } else if (Debris.Property.Validation.Is({ Value: $$Options.WriteOnly, Types: [Boolean]/* , And: $And */ }) && $$Options.WriteOnly) {
        $Property.set = $Set;
        $Property.configurable = $$Options.Configurable || true;
    }

    if (!(Debris.Property.Validation.Is({ Value: $This.ReadOnly, Types: [Boolean]/* , And: $And */ }) && $This.ReadOnly)) {
        $Set($$Options.Initial);
    }

    $Property.set = $Set;
    $Property.get = $Get;
    $Property.enumerable = $$Options.Enumerable==true; //[!] Revisar
    //$Property.enumerable = $$Options.Enumerable || true;

    Object.defineProperty(this, "Property", { get: function () { return $Property; }, enumerable: true });

    if ($$Options.Object && (typeof $$Options.Name == "string")) {
        Object.defineProperty($$Options.Object, $$Options.Name, $Property);
    }

};

Debris.Property.Init = function ($Options) {

    var $$Options = Debris.Misc.Function_Options($Options, ["Fields", "Object"]);

    var $Object;
    if (Debris.Property.Validation.Is({ Value: $$Options.Object, Types: [Object] })) {
        $Object = $$Options.Object;
    } else {
        // Si no viene Object se asume que se usa Apply o Call:
        $Object = this;
    }

    if (!Debris.Property.Validation.Is({ Value: $$Options.Fields, Types: [Object] })) {
        console.error("El descriptor de propiedades debe ser un objeto");
        return;
    }

    $.each($$Options.Fields, function ($i, $e) {
        new Debris.Property({ Name: $i, Initial: $e.Initial, Object: $Object, Types: $e.Types, Get: $e.Get, Set: $e.Set });
    });

    //if (!Debris.Property.Validation.Is({ Value: this, Type: Object })){

    //}
    //if( !Debris.Misc.IsSelf.call(this) ){
    //    return;
    //}

    //if (!this instanceof Debris.Property.Init) {
    //    console.warn();
    //}

};

Debris.Property.Validation = {
    Is: function ($Options) {
        var $$Options = Debris.Misc.Function_Options($Options, ["Value", "Types", "UndefinedTypes"/*, "And", "Or"*/]);
        if (typeof ($$Options.Types) == typeof (undefined)) {
            if (typeof ($$Options.UndefinedTypes) == typeof (undefined)) {
                return typeof ($$Options.Value) == typeof (undefined);
            } else {
                return $$Options.UndefinedTypes == true;
            }
        }

        //if (typeof ($$Options.Value) == typeof (undefined)) {
        //    if (typeof ($$Options.UndefinedType) != typeof (undefined)) {
        //        return $$Options.UndefinedType;
        //    }
        //}
        if (typeof ($$Options.Value) == typeof (undefined)) {
            return false;
        }

        if ($$Options.Types === false) {
            return true;
        }

        var $Types;
        if ($$Options.Types instanceof Array) {
            $Types = $$Options.Types;
        } else {
            $Types = [];
        }

        //var $Is = $$Options.Value instanceof $$Options.Types || typeof ($$Options.Value) == $$Options.Type.name.toLowerCase();
        var $Is = $$Options.Types.map(function ($e, $i) {
            return $$Options.Value instanceof $e || typeof ($$Options.Value) == $e.name.toLowerCase();
        }).reduce(function ($c, $n) { return $c || $n }, false);
        return $Is;
        //if(!$Is){
        //    return false;
        //}
        //var $And = true;
        //if(typeof($$Options.And) == typeof(Function)){
        //    $And = $$Options.And($$Options.Value);
        //    if (typeof ($And) != "boolean") {
        //        console.warn("La función de comparación AND debe retornar un valor boolean, por lo que se reemplaza por false");
        //        $And = false;
        //    }
        //}
        //var $Or = false;
        //if (typeof ($$Options.Or) == typeof (Function)) {
        //    $Or = $$Options.Or($$Options.Value);
        //    if (typeof ($Or) != typeof (Boolean)) {
        //        console.warn("La función de comparación OR debe retornar un valor boolean, por lo que se reemplaza por false");
        //        $Or = false;
        //    }
        //}
        //return ($Is || $Or) && $And;

    },
    IsNumeric: function ($Options) {

    },
    IsDecimal: function ($Options) {

    }
};

Debris.Misc.Bootstrap4Layout = function($Options){
    var $$Options = Debris.Misc.Function_Options($Options, ["Object", "Conf", "Container", "OnCreatedRow", "OnCreatedDebris", "ValidationHandler", "OnValidated"]);
    var $This = this;
    Debris.Property.Init({
        Fields: {
            Container: { Initial: $$Options.Container || $("<Div></Div>").attr({ Class: "container-fluid" }), Types: [jQuery] },
            Object: { Initial: $$Options.Object || {}, Types: [Object] },
            Conf: { Initial: $$Options.Conf || {}, Types: [Object] },
            OnCreatedRow: { Initial: $$Options.OnCreatedRow || function(){}, Types: [Function] },
            OnCreatedDebris: { Initial: $$Options.OnCreatedDebris || function(){}, Types: [Function] },
            ValidationHandler: { Initial: $$Options.ValidationHandler || Debris.Validation.Handlers.WarnAfterControl, Types: [Function] },
            IsModified: {
                Get: function(){  
                    return $.map($This.Conf, function($e, $i){
                        return $e.IsModified;
                    }).reduce(function($c, $n){ return $c || $n; });
                },
                Types: [Boolean]
            },
            OnValidated: { Initial: $$Options.OnValidated, Types: [Function] }
        },
        Object: $This
    });
    var $ValidationHandler = new $This.ValidationHandler({ Bean: $This.Object, Conf: $This.Conf });

    Object.defineProperty($This, "Validation", { get: function(){ return $ValidationHandler; }, enumerable: true });

    var $NewCell;

    var $NewDebris = function($Cell){
        return function($Opts){
            var $$Opts = Debris.Misc.Function_Options($Opts, ["Type", "Control", "Object", "Conf", "Name", "OnCreated", "Args"]);
            var $ComponentType;
            if(Debris.Components[$$Opts.Type]){
                $ComponentType = Debris.Components[$$Opts.Type];
            }else if(Debris.Components.jQuery[$$Opts.Type]){
                $ComponentType = Debris.Components.jQuery[$$Opts.Type];
            }else if(Debris.Components.Bootstrap[$$Opts.Type]){
                $ComponentType = Debris.Components.Bootstrap[$$Opts.Type];
            }else if($$Opts.Type.toLowerCase().startsWith("jquery.") && Debris.Components.jQuery[$$Opts.Type.replace(/^jquery\./ig, "")]){
                $ComponentType = Debris.Components.jQuery[$$Opts.Type.replace(/^jquery\./ig, "")];
            }else if($$Opts.Type.toLowerCase().startsWith("bootstrap.") && Debris.Components.Bootstrap[$$Opts.Type.replace(/^bootstrap\./ig, "")]){
                $ComponentType = Debris.Components.Bootstrap[$$Opts.Type.replace(/^bootstrap\./ig, "")];
            }
            var $$Args = $.extend({
                Control: $$Opts.Control,
                Object: $$Opts.Object || $This.Object,
                Name: $$Opts.Name,
                Container: $Cell,
                OnValidated: $This.OnValidated
            }, $$Opts.Args);
            if(!$ComponentType){
                console.warn("No se ha definido un componente de tipo \"" + $$Opts.Type + "\"");
                return $This;
            }
            var $$Conf = new $ComponentType($$Args);
            ($$Opts.Conf || $This.Conf)[$$Opts.Name] = $$Conf;
            ($$Opts.OnCreated || $This.OnCreatedDebris)({ Conf: $$Conf, Cell: $Cell, Args: $.extend($$Args, $$Opts), Object: $This.Object });
            $Cell.append($$Conf.Control);
            return $.extend($This, { NewCell: $NewCell($Cell.parent() /* [!] Debería ser una referencia a la Row, no un Parent() */) });
        };
    };
    var $NewLabel = function($Cell){
        return function($Text, $IsHtml){
            var $NeueLabel = $("<Label></Label>");
            if(!$IsHtml){
                $NeueLabel.text($Text);  
                $NeueLabel.html($Text);
            }
            $Cell.append($NeueLabel);
            return this;
        };
    };
    $NewCell = function __NewCell__($Row){ 
        return function($Options){ 
            //$$XS, $$SM, $$MD, $$LG
            var $$Options = Debris.Misc.Function_Options($Options, ["XS", "SM", "MD", "LG", "OnCreated", "AlignEnd"]);
            var $$NewCell = $("<Div></Div>");
            if(typeof($$Options.XS)!="undefined"){
                $$NewCell.attr({ Class: "col-" + $$Options.XS });
            }
            if(typeof($$Options.SM)!="undefined"){
                $$NewCell.attr({ Class: "col-sm-" + $$Options.SM });
            }
            if(typeof($$Options.MD)!="undefined"){
                $$NewCell.attr({ Class: "col-md-" + $$Options.MD });
            }
            if(typeof($$Options.LG)!="undefined"){
                $$NewCell.attr({ Class: "col-lg-" + $$Options.LG });
            }
            if(typeof($$Options.AlignEnd)!="undefined") {
                $$NewCell.attr({ Class: "align-self-end col-lg-" + $$Options.AlignEnd });
            }      
            if( typeof($$Options.XS)=="undefined" && typeof($$Options.AlignEnd)=="undefined" && typeof($$Options.SM)=="undefined" && typeof($$Options.MD)=="undefined" && typeof($$Options.LG)=="undefined" ){
                $$NewCell.attr({ Class: "col-1" });
            }
            //$$NewCell.addClass("table-responsive");
            $Row.append($$NewCell);
            var $Out;
            $Out = { 
                Cell: $$NewCell, 
                NewDebris: $NewDebris($$NewCell),
                NewLabel: $NewLabel($$NewCell), 
                NewRow: $This.NewRow,
                NewCell: $NewCell($Row),
                Append: function($jElement){ $$NewCell.append($jElement); return $Out }
            };
            ($$Options.OnCreated || function(){})( $$NewCell );
            return $Out;
        };
    };
    this.NewRow = function($Opts){
        var $$Opts = Debris.Misc.Function_Options($Opts, ["OnCreated"]);
        var $NewRow = $("<Div></Div>").attr({ Class: "row form-group" });
        var $Out = { Row: $NewRow, NewCell: $NewCell($NewRow), NewRow: $This.NewRow };
        ($$Opts.OnCreated || $This.OnCreatedRow)($Out);
        $This.Container.append($NewRow);
        return $Out;
    };
    this.Clear = function(){
        $.each($This.Object, function($i, $e){
            $This.Object[$i] = "";
        });
    };
    this.Init = function(){
        $.each($This.Conf, function($i, $e){
            if($This.Conf[$i].Init){
                $This.Conf[$i].Init();
            }
        });
    };
};

Debris.Misc.Form = function($Options){
    
    //var $$Options = Debris.Misc.Function_Options($Options, ["Object", "Conf", "Container", "OnCreatedRow", "OnCreatedDebris", "ValidationHandler", "OnValidated"]);
    var $$Options = Debris.Misc.Function_Options($Options, ["Container", "Descriptors", /* "Layout", */ "OnCreated"]);
    var $This = this;
    
    Debris.Property.Init({
        Fields: {
            Container: { Initial: $$Options.Container || $("<Div></Div>").attr({ Class: "container-fluid" }), Types: [jQuery] },
            Descriptors: { Initial: $$Options.Descriptors, Types: [Object] },
            Layout: { Initial: $$Options.Layout || new Debris.Misc.Layout.BaseLayout(), Types: [Object] },
            OnCreated: { Initial: $$Options.OnCreated, Types: [Function, Object] }
        },
        Object: $This
    });

    var $Bean;
    var $Conf;

    this.Init = function(){
        $Bean = {};
        $Conf = {};
        $.each($This.Descriptors, function($i, $e){

            var $ComponentType;
            if(!$e.Type){
                console.log("No se ha especificado un tipo para la propiedad \"" + $e.Type + "\"");
                return;
            }
            if(Debris.Components[$e.Type]){
                $ComponentType = Debris.Components[$e.Type];
            }else if(Debris.Components.jQuery[$e.Type]){
                $ComponentType = Debris.Components.jQuery[$e.Type];
            }else if(Debris.Components.Bootstrap[$e.Type]){
                $ComponentType = Debris.Components.Bootstrap[$e.Type];
            }else if($e.Type.toLowerCase().startsWith("jquery.") && Debris.Components.jQuery[$e.Type.replace(/^jquery\./ig, "")]){
                $ComponentType = Debris.Components.jQuery[$e.Type.replace(/^jquery\./ig, "")];
            }else if($e.Type.toLowerCase().startsWith("bootstrap.") && Debris.Components.Bootstrap[$e.Type.replace(/^bootstrap\./ig, "")]){
                $ComponentType = Debris.Components.Bootstrap[$e.Type.replace(/^bootstrap\./ig, "")];
            }

            if(!$ComponentType){
                console.warn("No se ha definido un componente de tipo \"" + $e.Type + "\"");
                return;
            }
            
            var $OnControlCreated = $e.OnControlCreated;
            
            if(!$e.Init){
                if($This.OnCreated instanceof Object){
                    if($This.OnCreated[$e.Type] instanceof Function){
                        $OnControlCreated = ($OnControlCreated ? (function($$Fn1, $$Fn2){ 
                            return function($Control){ 
                                $$Fn1($Control);
                                $$Fn2($Control);
                            };
                        })($OnControlCreated, $This.OnCreated[$e.Type]):$This.OnCreated[$e.Type]);
                        //$This.OnCreated[$e.Type]($Conf[$i]);
                    }else if($This.OnCreated[$i] instanceof Function){
                        $OnControlCreated = ($OnControlCreated ? (function($$Fn1, $$Fn2){ 
                            return function($Control){ 
                                $$Fn1($Control);
                                $$Fn2($Control);
                            };
                        })($OnControlCreated, $This.OnCreated[$i]):$This.OnCreated[$i]);
                        //$This.OnCreated[$i]($Conf[$i]);
                    }
                }
                if($This.OnCreated instanceof Function){
                    $OnControlCreated = ($OnControlCreated ? (function($$Fn1, $$Fn2){ 
                        return function($Control){ 
                            $$Fn1($Control);
                            $$Fn2($Control);
                        };
                    })($OnControlCreated, $This.OnCreated):$This.OnCreated);
                    //$This.OnCreated($Conf[$i]);
                }
            }

            $Conf[$i] = new $ComponentType($.extend({}, $e, {
                Object: ($e.MakeProperty===false ? undefined:$Bean),
                Name: $i,
                OnCreated: $OnControlCreated
            }));

            // if(!$e.Init){
            //     if($This.OnCreated instanceof Object){
            //         if($This.OnCreated[$e.Type] instanceof Function){
            //             $This.OnCreated[$e.Type]($Conf[$i]);
            //         }else if($This.OnCreated[$i] instanceof Function){
            //             $This.OnCreated[$i]($Conf[$i]);
            //         }
            //     }
            //     if($This.OnCreated instanceof Function){
            //         $This.OnCreated($Conf[$i]);
            //     }
            // }
            
        });

        // $This.Layout.Container = $This.Container;
        // $This.Layout.Conf = $Conf;
        // $.each($Conf, function($i, $e){
        //     if($e.Init) $e.Init();
        // });
        // $This.Layout.Paint();
        
    };

    // [!] Pasar a Debris.Property sólo si ésta permite sólo getters
    Object.defineProperty($This, "Bean", {
        get: function(){
            return $Bean;
        },
        enumerable: true
    });

    // [!] Pasar a Debris.Property sólo si ésta permite sólo getters
    Object.defineProperty($This, "Conf", {
        get: function(){
            return $Conf;
        },
        enumerable: true
    });

    this.Clear = function(){
        $.each($This.Bean, function($i, $e){
            $This.Bean[$i] = "";
        });
    };

};

Debris.Misc.Layout = {
    BaseLayout2: function BaseLayout($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Container", "Conf", "Paint", "OnCreated"]);
        var $This = this;
        Debris.Property.Init({
            Fields: {
                Container: { Initial: $$Options.Container, Types: [jQuery] },
                Conf: { Initial: $$Options.Conf, Types: [Object] },
                //, Paint: { Initial: $$Options.Paint, Types: [Function] }
            },
            Object: $This
        });

        this.NewRow = function NewRow($Options){
            
            var $NewRow = $("<Div></Div>").attr({ Class: "row form-group" });
            console.log($This);
            var $Out = {
                NewRow: $This.NewRow,
                NewCell: (function($$NewRow){
                    return function($$UserOpts){
                        return __NewCell__({ Row: $$NewRow }, $$UserOpts);
                    };
                })($NewRow),
                // NewLabel: (function($$NewRow){
                //     return function($$Text, $$IsHtml){
                //         return __NewLabel__({ Row: $$NewRow }, $$Text, $$IsHtml);
                //     };
                // })($NewRow),
                // //NewLabel: __NewLabel__,
                // Append: (function($$NewRow){
                //     return function($$Element){
                //         return __Append__({ Row: $$NewRow }, $$Element);
                //     };
                // })($NewRow)
                //Append: __Append__
            };

            $This.Container.append($NewRow);
            return $Out;

        };

        var __NewCell__ = function($$Conf, $Options){
            
            var $$Options = Debris.Misc.Function_Options($Options, ["XS", "SM", "MD", "LG", "OnCreated", "AlignEnd"]);
            var $NewCell = $("<Div></Div>");
            if(typeof($$Options.XS)!="undefined"){
                $NewCell.attr({ Class: "col-" + $$Options.XS + " col-xs-" + $$Options.XS });
            }
            if(typeof($$Options.SM)!="undefined"){
                $NewCell.attr({ Class: "col-sm-" + $$Options.SM });
            }
            if(typeof($$Options.MD)!="undefined"){
                $NewCell.attr({ Class: "col-md-" + $$Options.MD });
            }
            if(typeof($$Options.LG)!="undefined"){
                $NewCell.attr({ Class: "col-lg-" + $$Options.LG });
            }
            if(typeof($$Options.AlignEnd)!="undefined") {
                $NewCell.attr({ Class: "align-self-end col-lg-" + $$Options.AlignEnd });
            }      
            if( typeof($$Options.XS)=="undefined" && typeof($$Options.AlignEnd)=="undefined" && typeof($$Options.SM)=="undefined" && typeof($$Options.MD)=="undefined" && typeof($$Options.LG)=="undefined" ){
                $NewCell.attr({ Class: "col-12 col-xs-12" });
            }

            $$Conf.Row.append($NewCell);
            
            console.log($This);
            var $Out = {
                NewRow: $This.NewRow,
                NewCell: (function($$NewRow, $$NewCell){
                    return function($$UserOpts){
                        return __NewCell__({ Row: $$NewRow, Cell: $$NewCell }, $$UserOpts);
                    };
                })($$Conf.Row, $NewCell),
                //NewLabel: __NewLabel__,
                NewLabel: (function($$NewRow, $$NewCell){
                    return function($$Text, $$IsHtml){
                        return __NewLabel__({ Row: $$NewRow, Cell: $$NewCell }, $$Text, $$IsHtml);
                    };
                })($$Conf.Row, $NewCell),
                Append: (function($$NewRow, $$NewCell){
                    return function($$Element){
                        return __Append__({ Row: $$NewRow, Cell: $$NewCell }, $$Element);
                    };
                })($$Conf.Row, $NewCell)
            };
            return $Out;
        };

        var __NewLabel__ = function NewLabel($$Options, $Text, $IsHtml){
            
            var $NeueLabel = $("<Label></Label>");

            if($IsHtml){
                $NeueLabel.html($Text);
            }else{
                $NeueLabel.append($Text);
            }

            console.log($This);
            var $Out = {
                NewRow: $This.NewRow,
                //NewCell: __NewCell__,
                NewCell: (function($$NewRow, $$NewCell){
                    return function($$UserOpts){
                        return __NewCell__({ Row: $$NewRow, Cell: $$NewCell }, $$UserOpts);
                    };
                })($$Options.Row, $$Options.Cell),
                //NewLabel: __NewLabel__,
                NewLabel: (function($$NewRow, $$NewCell){
                    return function($$Text, $$IsHtml){
                        return __NewLabel__({ Row: $$NewRow, Cell: $$NewCell }, $$Text, $$IsHtml);
                    };
                })($$Options.Row, $$Options.Cell),
                //Append: __Append__
                Append: (function($$NewRow, $$NewCell){
                    return function($$Element){
                        return __Append__({ Row: $$NewRow, Cell: $$NewCell }, $$Element);
                    };
                })($$Options.Row, $$Options.Cell)
            };
            return $Out;
        };

        var __Append__ = function Append($Options, $Element){
            $Options.Cell.append($Element);
            console.log($This);
            var $Out = {
                NewRow: $This.NewRow,
                NewCell: (function($$Row){
                    return function($$UserOpts){
                        return __NewCell__({ Row: $$Row }, $$UserOpts);
                    };
                })($Options.Row),
                //NewLabel: __NewLabel__,
                NewLabel: (function($$NewRow, $$NewCell){
                    return function($$Text, $$IsHtml){
                        return __NewLabel__({ Row: $$NewRow, Cell: $$NewCell }, $$Text, $$IsHtml);
                    };
                })($$Options.Row, $$Options.Cell),
                Append: (function($$NewRow, $$NewCell){
                    return function($$Element){
                        return __Append__({ Row: $$NewRow, Cell: $$NewCell }, $$Element);
                    };
                })($$Options.Row, $$Options.Cell)
                //Append: __Append__
            };
            return $Out;
        };

        var $Paint = $$Options.Paint || function($Controls, $Titles){
            var $$PaintThis = this;
            $.each($Controls, function($i, $e){
                $$PaintThis
                    .NewRow()
                        .NewCell()
                        .NewLabel($Titles[$i])
                        .Append($e)
                ;
            });
        };
        Object.defineProperty($This, "Paint", {
            get: function(){
                var $Controls = {};
                var $Titles = {};
                $.each($This.Conf, function($i, $e){
                    $Controls[$i] = $e.Control;
                    $Titles[$i] = $e.Title || $i;
                });
                return function(){
                    $Paint.call($This, $Controls, $Titles);
                };
            },
            enumerable: true
        });

    },
    BaseLayout: function BaseLayout($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Container", "Conf", "Paint", "OnCreated"]);
        var $This = this;
        Debris.Property.Init({
            Fields: {
                Container: { Initial: $$Options.Container, Types: [jQuery] },
                Conf: { Initial: $$Options.Conf, Types: [Object] },
                //, Paint: { Initial: $$Options.Paint, Types: [Function] }
            },
            Object: $This
        });
        var $NewLabel = function($Args){
            return function($Text, $IsHtml){
                var $NeueLabel = $("<Label></Label>");
                if(!$IsHtml){
                    $NeueLabel.text($Text);  
                    $NeueLabel.html($Text);
                }
                $Args.Cell.append($NeueLabel);
                var $Out = {
                    Append: function($jElement){ $Args.Cell.append($jElement); return $Out; },
                    NewCell: this.NewCell($Args.Row),
                    NewRow: $This.NewRow
                };
                return $Out;
            };
        };

        // $NewCell = function __NewCell__($Row){ 
        this.NewCell = function($Row){
            //return function($Options){
                //$$XS, $$SM, $$MD, $$LG
                var $$Options = Debris.Misc.Function_Options($Options, ["XS", "SM", "MD", "LG", "OnCreated", "AlignEnd"]);
                var $$NewCell = $("<Div></Div>");
                if(typeof($$Options.XS)!="undefined"){
                    $$NewCell.attr({ Class: "col-" + $$Options.XS + " col-xs-" + $$Options.XS });
                }
                if(typeof($$Options.SM)!="undefined"){
                    $$NewCell.attr({ Class: "col-sm-" + $$Options.SM });
                }
                if(typeof($$Options.MD)!="undefined"){
                    $$NewCell.attr({ Class: "col-md-" + $$Options.MD });
                }
                if(typeof($$Options.LG)!="undefined"){
                    $$NewCell.attr({ Class: "col-lg-" + $$Options.LG });
                }
                if(typeof($$Options.AlignEnd)!="undefined") {
                    $$NewCell.attr({ Class: "align-self-end col-lg-" + $$Options.AlignEnd });
                }      
                if( typeof($$Options.XS)=="undefined" && typeof($$Options.AlignEnd)=="undefined" && typeof($$Options.SM)=="undefined" && typeof($$Options.MD)=="undefined" && typeof($$Options.LG)=="undefined" ){
                    $$NewCell.attr({ Class: "col-12 col-xs-12" });
                }
                //$$NewCell.addClass("table-responsive");
                $Row.append($$NewCell);
                var $Out;
                $Out = {
                    Cell: $$NewCell,
                    //NewDebris: $NewDebris($$NewCell),
                    Row: $Row,
                    NewLabel: $NewLabel({ Cell: $$NewCell, Row: $Row }),
                    NewRow: $This.NewRow,
                    //NewCell: this.NewCell($Row),
                    NewCell: (function($$This){
                        return function(){ $$This.NewCell(); };
                    })($This),
                    Append: function($jElement){ $$NewCell.append($jElement); return $Out; }
                };
                ($$Options.OnCreated || function(){})( $$NewCell );
                return $Out;
            //};
        };

        // $NewCell = function __NewCell__($Row){ 
        //     return function($Options){
        //         //$$XS, $$SM, $$MD, $$LG
        //         var $$Options = Debris.Misc.Function_Options($Options, ["XS", "SM", "MD", "LG", "OnCreated", "AlignEnd"]);
        //         var $$NewCell = $("<Div></Div>");
        //         if(typeof($$Options.XS)!="undefined"){
        //             $$NewCell.attr({ Class: "col-" + $$Options.XS + " col-xs-" + $$Options.XS });
        //         }
        //         if(typeof($$Options.SM)!="undefined"){
        //             $$NewCell.attr({ Class: "col-sm-" + $$Options.SM });
        //         }
        //         if(typeof($$Options.MD)!="undefined"){
        //             $$NewCell.attr({ Class: "col-md-" + $$Options.MD });
        //         }
        //         if(typeof($$Options.LG)!="undefined"){
        //             $$NewCell.attr({ Class: "col-lg-" + $$Options.LG });
        //         }
        //         if(typeof($$Options.AlignEnd)!="undefined") {
        //             $$NewCell.attr({ Class: "align-self-end col-lg-" + $$Options.AlignEnd });
        //         }      
        //         if( typeof($$Options.XS)=="undefined" && typeof($$Options.AlignEnd)=="undefined" && typeof($$Options.SM)=="undefined" && typeof($$Options.MD)=="undefined" && typeof($$Options.LG)=="undefined" ){
        //             $$NewCell.attr({ Class: "col-12 col-xs-12" });
        //         }
        //         //$$NewCell.addClass("table-responsive");
        //         $Row.append($$NewCell);
        //         var $Out;
        //         $Out = { 
        //             Cell: $$NewCell, 
        //             //NewDebris: $NewDebris($$NewCell),
        //             Row: $Row,
        //             NewLabel: $NewLabel({ Cell: $$NewCell, Row: $Row }),
        //             NewRow: $This.NewRow,
        //             NewCell: $NewCell($Row),
        //             Append: function($jElement){ $$NewCell.append($jElement); return $Out; }
        //         };
        //         ($$Options.OnCreated || function(){})( $$NewCell );
        //         return $Out;
        //     };
        // };
        
        this.NewRow = function($Opts){
            var $$Opts = Debris.Misc.Function_Options($Opts, ["OnCreated"]);
            var $NewRow = $("<Div></Div>").attr({ Class: "row form-group" });
            //var $Out = { Row: $NewRow, NewCell: $NewCell($NewRow), NewRow: $This.NewRow };
            var $Out = {
                Row: $NewRow, 
                NewCell: (function($$$NewRow){ 
                    return function(){
                        this.NewCell($$$NewRow);
                    };
                })($NewRow),
                NewRow: (function($$This){ 
                    return function($$$Opts){ $$This.NewRow($$$Opts); }; 
                })($This)
            };
            ($$Opts.OnCreated || $This.OnCreatedRow || function(){})($Out);
            $This.Container.append($NewRow);
            return $Out;
        };
        var $Paint = $$Options.Paint || function($Controls, $Titles){
            var $$This = this;
            $.each($Controls, function($i, $e){
                $$This
                    .NewRow()
                        .NewCell()
                        .NewLabel($Titles[$i])
                        .Append($e)
                ;
            });
        };
        Object.defineProperty($This, "Paint", {
            get: function(){
                var $Controls = {};
                var $Titles = {};
                $.each($This.Conf, function($i, $e){
                    $Controls[$i] = $e.Control;
                    $Titles[$i] = $e.Title || $i;
                });
                return function(){
                    $Paint.call($This, $Controls, $Titles);
                };
            },
            enumerable: true
        });
        
    },
    Pattern: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Container", "Conf", "Pattern", "OnCreated"]);
        var $Pattern;
        var $This = this;
        if($$Options.Pattern instanceof Array){
            $Pattern = $$Options.Pattern;
            $$Options.Paint = function($Controls, $Titles){
                // $.each($Pattern, function($i, $e){
                var $ArrControls = Object.values(this.Conf);
                var $Next = $ArrControls.shift();
                var $Last = $This;
                var $x = 0;
                var $y = 0;
                
                while($Next){
                    
                    // if(!$Pattern[$y][$x]){
                    //     $x++;
                    //     if(!$Pattern[$y]){
                    //         $y=0;
                    //     }
                    // }

                    // Agregar
                    if($x==0){
                        $Last = $Last
                            .NewRow()
                            .NewCell($Pattern[$y][$x])
                            .NewLabel($Next.Title)
                            .Append($Next.Control)
                        ;
                    }else{
                        $Last = $Last
                            .NewCell($Pattern[$y][$x])
                            .NewLabel($Next.Title)
                            .Append($Next.Control)
                        ;
                    }
                    
                    $x++;

                    if(!$Pattern[$y][$x]){
                        $x = 0;
                        $y++;
                        if(!$Pattern[$y]){
                            $y = 0;
                        }
                    }

                    $Next = $ArrControls.shift();

                }

                // });
            };
        }

        Debris.Misc.Layout.BaseLayout2.call(this, $$Options);

    }
};



Debris.Components.Bootstrap = {
    Tabs: function BootstrapTabs($Options) {

        var $$Options = Debris.Misc.Function_Options($Options, ["Titles", "Container"]);
        var $This = this;
    
        Debris.Property.Init({
            Fields: { 
                Titles: { Initial: $$Options.Titles, Types: [Array] },
                Container: { Initial: $$Options.Container, Types: [jQuery] },
                Tabs: { Initial: [], Types: [Array] },
                Panels: { Initial: [], Types: [Array] }
            },
            Object: this
        });
        
        Object.defineProperty(this, "Show", {
            get: function () {
                return function ($Index) {
                    if ($This.Tabs[$Index]) {
                        $This.Tabs[$Index].tab("show");
                        $.each($This.Panels, function ($i, $e) {
                            $($e).removeClass("in active");
                        });
                        $This.Panels[$Index].addClass("in active");
                    }
                };
            }
        });
    
        var $Ul;
        var $Add = function($Title){
            var $A;
            var $Li;
            $Ul.append(
                ($Li = $("<Li></Li>").attr({ Class: "nav-item" })).append(
                    ($A = $("<A></A>").attr({ Class: "nav-link" })).append($Title)
                )
            );
            var $NewPanel = $("<Div></Div>").attr({ Class: "tab-pane" });
            $This.Panels.push($NewPanel);
            $TabContent.append($NewPanel);
            $A.on("click", function(){
                $Ul.find("Li").removeClass("active");
                $TabContent.find("div").removeClass("in").removeClass("active");
                $NewPanel.addClass("in active");
                $Li.addClass("active");
            }).css({ cursor: "pointer" });
        };
    
        var $Insert = function($Index, $Title){
            var $A;
            var $Li;
            ($Li = $("<Li></Li>").attr({ Class: "nav-item" })).append(
                ($A = $("<A></A>").attr({ Class: "nav-link" })).append($Title)
            ).insertAfter($Ul.find("li:nth(" + $Index + ")"));
            var $NewPanel = $("<Div></Div>").attr({ Class: "tab-pane" });
            $This.Panels = Debris.Misc.Array.Insert($This.Panels, $Index + 1, $NewPanel);
            $This.Tabs = Debris.Misc.Array.Insert($This.Tabs, $Index + 1, $A);
            $NewPanel.insertAfter($TabContent.find(".tab-pane:nth(" + $Index + ")"));
            $A.on("click", function(){
                $Ul.find("Li").removeClass("active");
                $TabContent.find("div").removeClass("in").removeClass("active");
                $NewPanel.addClass("in active");
                $Li.addClass("active");
            }).css({ cursor: "pointer" });
        };
    
        var $TabContent;
    
        Object.defineProperty(this, "Render", {
            get: function Render() {
                return function () {
                    $This.Tabs = [];
                    if ($This.Container) {
                        $This.Container.append(
                            ($Ul = $("<Ul></Ul>")).attr({ Class: "nav nav-tabs" }).append(
                                $This.Titles.map(function ($e, $i) {
                                    var $NewTab = $("<A></A>").attr({ Class: "nav-link" });
                                    $This.Tabs.push($NewTab);
                                    return $("<Li></Li>").attr({ Class: "nav-item" }).append(
                                        $NewTab.append($e)
                                        //.click((function ($$i) {
                                            //return function () {
                                                //$This.Show($$i);
                                            //};
                                        //})($i))
                                    ).css({ cursor: "pointer" });
                                })
                            )
                        ).append(
                            ($TabContent = $("<Div></Div>")).attr({ Class: "tab-content" }).append(
                                $This.Titles.map(function ($e, $i) {
                                    var $NewPanel = $("<Div></Div>").attr({ Class: "tab-pane" });
                                    $This.Panels.push($NewPanel);
                                    return $NewPanel;
                                })
                            )
                        );
                    }
                    for(var $x=0;$x<$This.Titles.length;$x++){
                        $This.Tabs[$x].on("click", (function($Tab, $Panel){
                            return function(){
                                $Ul.find("A").removeClass("active");
                                $TabContent.find("div").removeClass("in").removeClass("active");
                                $Panel.addClass("in active");
                                $Tab.addClass("active");
                            };
                        })($This.Tabs[$x], $This.Panels[$x]));
                    }
                    if ($This.Tabs.length > 0) {
                        $This.Show(0);
                    }
                    $This.Add = $Add;
                    $This.Insert = $Insert;
                };
            }
        });
    
    }
    , Notifications: function($Options){
        var $$Options = Debris.Misc.Function_Options($Options, ["Container", "Time"]);
        var $This = this;
        var $TextControl = $("<Text>")/* .css({ "white-space": "pre" }) */;
        var $AlertControl = $("<Div>")
            .attr({ Class: "alert alert-primary alert-dismissible fade show", Role: "alert", TabIndex: -1 })
            .append(
                $TextControl
            ).append(
                $("<Button>").attr({ 
                    Type: "button", Class: "close", "data-hide": "alert", "aria-label": "Close"
                }).append(
                    $("<Span>").attr({ "aria-hidden": "true" }).append("&times;")
                ).click(function(){
                    $AlertControl.hide();
                })
            );

        Debris.Property.Init({ 
            Fields: {
                Container: { Initial: $$Options.Container || $("<Div></Div>"), Types: [jQuery] },
                Time: { Initial: $$Options.Time, Types: [Number] },
                Text: { 
                    Initial: "", 
                    Get: function(){
                        return $TextControl.text();
                    },
                    Set: function($Value){
                        $TextControl.html($Value);
                        $AlertControl.show();
                        if($This.Time){
                            $AlertControl.fadeOut($This.Time);
                        }
                        $AlertControl.focus();
                    },
                    Types: [String]
                },
                Type: { 
                    Set: function($Value){
                        $AlertControl.attr({ Class: "alert alert-" + $Value + " alert-dismissible fade show" })
                    },
                    Types: [String] 
                }
            },
            Object: $This
        });

        $This.Container.append($AlertControl);
        $AlertControl.hide();

    }

};
