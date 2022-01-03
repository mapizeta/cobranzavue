<template>
  <div id="app">
    {{ rut }}
    <input type="text" v-model="rut" @input="validateRut" maxlength="12" />
    <button v-on:click="valido = validaRut(rut)">Validar</button>
    <h1 v-if="valido">Válido</h1>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      rut: "",
      valido:false,
    };
  },
  methods: {
    clean(val) {
      return val.replace(/[^[0-9kK]/g, "");
    },
    validateRut(val) {
      const rut = val.target.value;
      if (rut.length < 2) return rut;
      return (this.rut =
        this.clean(rut)
          .slice(0, -1)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +
        "-" +
        this.clean(rut).slice(-1));
    },
      validaRut(val) {
        console.log(val.replace(/\./g,''))
		    val = val.replace(/\./g,'')
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( val ))
			    return false;
		    var tmp 	= val.split('-');
		    var digv	= tmp[1]; 
		    var rut 	= tmp[0];
		    
        if ( digv == 'K' ) digv = 'k' ;
		      return (this.dv(rut) == digv );
	},
	dv : function(T){
		var M=0,S=1;
		for(;T;T=Math.floor(T/10))
			S=(S+T%10*(9-M++%6))%11;
		return S?S-1:'k';
	}
    
  },
};
</script>
