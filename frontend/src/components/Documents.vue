<template>
  <div class="content">
      <table>
          <thead>
              <tr>
                  <th>Rit</th>
                  <th>Tribunal</th>
                  <th>Quiebra</th>
                  <th>Rut Empleador</th>
                  <th>Clasificación</th>
                  <th>Estado Documento</th>
                  <th>Estado Demanda</th>
                  <th>Fecha Ingreso</th>
                  
                </tr>
          </thead>
          <tbody>
            
            <tr v-for="v in result" :key=v.id>
                <td>{{v.demanda.rit}}</td>
                <td v-if="v.demanda.tribunal">{{v.demanda.tribunal.nombrecompleto}}</td>
                
                <td>No</td>

                <td v-if="v.demanda.empresa">{{v.demanda.empresa.rutempleador}}</td>
                <td>Sentencia</td>
                <td>Con Caso</td>
                <td>Analizado Manualmente</td>
                <td>{{dateTime(v.fechaingreso)}}</td>
            </tr>
          </tbody>
      </table>
      

  </div>
  
</template>
<script>
import axios from "axios";
import moment from 'moment';

export default {
     data: () => ({
    result: null
  }),
async created() {
    try {
        let response = await axios.get("http://localhost:8000/api/documentos/");
        this.result = response.data;
        console.log(response.data)
    } catch (error) {
    console.log(error);
    }

},
methods:{
    dateTime(value) {
      return moment(value).format('DD-MM-YYYY');
    },
}
};
</script>