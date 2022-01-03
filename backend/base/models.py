# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Afp(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.IntegerField(unique=True)
    created = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Afp'


class Calificador(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    tipo = models.IntegerField(db_column='Tipo')  # Field name made lowercase.
    frase = models.CharField(db_column='Frase', max_length=100)  # Field name made lowercase.
    subtipo = models.CharField(db_column='Subtipo', max_length=30)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Calificador'


class Cargareajuste(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    periodo = models.CharField(db_column='Periodo', max_length=6, blank=True, null=True)  # Field name made lowercase.
    fechacalculo = models.DateTimeField(db_column='FechaCalculo')  # Field name made lowercase.
    reajuste = models.DecimalField(db_column='Reajuste', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    intereses = models.DecimalField(db_column='Intereses', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    recargos = models.DecimalField(db_column='Recargos', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    fechacarga = models.DateTimeField(db_column='FechaCarga')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CargaReajuste'


class Cargareajustehistorial(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    periodo = models.CharField(db_column='Periodo', max_length=6, blank=True, null=True)  # Field name made lowercase.
    fechacalculo = models.DateTimeField(db_column='FechaCalculo')  # Field name made lowercase.
    reajuste = models.DecimalField(db_column='Reajuste', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    intereses = models.DecimalField(db_column='Intereses', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    recargos = models.DecimalField(db_column='Recargos', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    fechacarga = models.DateTimeField(db_column='FechaCarga')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CargaReajusteHistorial'


class Clasificacion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Clasificacion'


class Clasificaciondocumentodemanda(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=50)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ClasificacionDocumentoDemanda'


class Comuna(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    nombre = models.CharField(db_column='Nombre', max_length=50, blank=True, null=True)  # Field name made lowercase.
    codigo = models.CharField(db_column='Codigo', max_length=50)  # Field name made lowercase.
    region = models.ForeignKey('Region', models.DO_NOTHING, db_column='Region_id', blank=True, null=True)  # Field name made lowercase.
    deletedat = models.DateTimeField(db_column='DeletedAt', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Comuna'


class Delimitador(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    tipo = models.IntegerField(db_column='Tipo')  # Field name made lowercase.
    frase = models.CharField(db_column='Frase', max_length=100, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Delimitador'


class Demanda(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    rit = models.CharField(db_column='Rit', max_length=50, blank=True, null=True)  # Field name made lowercase.
    fecharecepcion = models.DateTimeField(db_column='FechaRecepcion')  # Field name made lowercase.
    isinanalisis = models.BooleanField(db_column='IsInAnalisis')  # Field name made lowercase.
    empresa = models.ForeignKey('Empresa', models.DO_NOTHING, db_column='Empresa_id', blank=True, null=True)  # Field name made lowercase.
    estado = models.ForeignKey('Estadodemanda', models.DO_NOTHING, db_column='Estado_id', blank=True, null=True)  # Field name made lowercase.
    tribunal = models.ForeignKey('Tribunal', models.DO_NOTHING, db_column='Tribunal_id', blank=True, null=True)  # Field name made lowercase.
    observacioncaso = models.TextField(db_column='ObservacionCaso', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Demanda'


class Demandante(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    rut = models.CharField(db_column='Rut', max_length=20)  # Field name made lowercase.
    nombre = models.CharField(db_column='Nombre', max_length=255)  # Field name made lowercase.
    iniciorelacionlaboral = models.DateField(db_column='InicioRelacionLaboral', blank=True, null=True)  # Field name made lowercase.
    finrelacionlaboral = models.DateField(db_column='FinRelacionLaboral', blank=True, null=True)  # Field name made lowercase.
    rentamensual = models.IntegerField(db_column='RentaMensual', blank=True, null=True)  # Field name made lowercase.
    convalidacion = models.BooleanField(db_column='Convalidacion', blank=True, null=True)  # Field name made lowercase.
    diferencia = models.BooleanField(db_column='Diferencia', blank=True, null=True)  # Field name made lowercase.
    pensionado = models.BooleanField(db_column='Pensionado', blank=True, null=True)  # Field name made lowercase.
    empleadocasaparticular = models.BooleanField(db_column='EmpleadoCasaParticular', blank=True, null=True)  # Field name made lowercase.
    horasextra = models.IntegerField(db_column='HorasExtra', blank=True, null=True)  # Field name made lowercase.
    semanacorrida = models.IntegerField(db_column='SemanaCorrida', blank=True, null=True)  # Field name made lowercase.
    demanda = models.ForeignKey(Demanda, models.DO_NOTHING, db_column='Demanda_id', blank=True, null=True)  # Field name made lowercase.
    estado = models.ForeignKey('Estadodemandante', models.DO_NOTHING, db_column='Estado_id')  # Field name made lowercase.
    apellidomaternoafc = models.CharField(db_column='ApellidoMaternoAfc', max_length=255, blank=True, null=True)  # Field name made lowercase.
    apellidopaternoafc = models.CharField(db_column='ApellidoPaternoAfc', max_length=255, blank=True, null=True)  # Field name made lowercase.
    convalidacionpagada = models.BooleanField(db_column='ConvalidacionPagada', blank=True, null=True)  # Field name made lowercase.
    fechavigenciapension = models.DateField(db_column='FechaVigenciaPension', blank=True, null=True)  # Field name made lowercase.
    nombreafc = models.CharField(db_column='NombreAfc', max_length=255, blank=True, null=True)  # Field name made lowercase.
    updated = models.DateTimeField(db_column='Updated', blank=True, null=True)  # Field name made lowercase.
    ficha = models.ForeignKey('Ficha', models.DO_NOTHING, db_column='Ficha_id', blank=True, null=True)  # Field name made lowercase.
    afp = models.IntegerField(db_column='Afp', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Demandante'


class Detalleresolucion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    serie = models.CharField(db_column='Serie', max_length=10)  # Field name made lowercase.
    periodopago = models.CharField(db_column='PeriodoPago', max_length=6)  # Field name made lowercase.
    rentaimponible = models.DecimalField(db_column='RentaImponible', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    montoadeudado = models.DecimalField(db_column='MontoAdeudado', max_digits=10, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    demandante = models.ForeignKey(Demandante, models.DO_NOTHING, db_column='Demandante_id', blank=True, null=True)  # Field name made lowercase.
    estadodetalleresolucion = models.ForeignKey('Estadodetalleresolucion', models.DO_NOTHING, db_column='EstadoDetalleResolucion_id', blank=True, null=True)  # Field name made lowercase.
    resolucion = models.ForeignKey('Resolucion', models.DO_NOTHING, db_column='Resolucion_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'DetalleResolucion'


class Documento(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    nombrearchivo = models.CharField(db_column='NombreArchivo', max_length=1024)  # Field name made lowercase.
    observaciones = models.CharField(db_column='Observaciones', max_length=1024)  # Field name made lowercase.
    url = models.CharField(db_column='Url', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    clasificacion = models.ForeignKey(Clasificacion, models.DO_NOTHING, db_column='Clasificacion_id', blank=True, null=True)  # Field name made lowercase.
    demanda = models.ForeignKey(Demanda, on_delete=models.CASCADE, db_column="Demanda_id", blank=True, null=True)  # Field name made lowercase.
    estadodocumento = models.ForeignKey('Estadodocumento', models.DO_NOTHING, db_column='EstadoDocumento_id', blank=True, null=True)  # Field name made lowercase.
    fechaingreso = models.DateTimeField(db_column='FechaIngreso')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Documento'


class Documentodemanda(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    nombre = models.CharField(db_column='Nombre', max_length=255)  # Field name made lowercase.
    fecha = models.DateField(db_column='Fecha', blank=True, null=True)  # Field name made lowercase.
    url = models.CharField(db_column='Url', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    clasificacion = models.ForeignKey(Clasificaciondocumentodemanda, models.DO_NOTHING, db_column='Clasificacion_id', blank=True, null=True)  # Field name made lowercase.
    demanda = models.ForeignKey(Demanda, models.DO_NOTHING, db_column='Demanda_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'DocumentoDemanda'


class Empresa(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    nombre = models.CharField(db_column='Nombre', max_length=100, blank=True, null=True)  # Field name made lowercase.
    rutempleador = models.CharField(db_column='RutEmpleador', max_length=50)  # Field name made lowercase.
    quiebra = models.BooleanField(db_column='Quiebra', blank=True, null=True)  # Field name made lowercase.
    fecharecepcion = models.DateTimeField(db_column='FechaRecepcion')  # Field name made lowercase.
    comuna = models.ForeignKey(Comuna, models.DO_NOTHING, db_column='Comuna_id', blank=True, null=True)  # Field name made lowercase.
    razonsocial = models.CharField(db_column='RazonSocial', max_length=100, blank=True, null=True)  # Field name made lowercase.
    nombrerepresentante = models.CharField(db_column='NombreRepresentante', max_length=100, blank=True, null=True)  # Field name made lowercase.
    rutrepresentante = models.CharField(db_column='RutRepresentante', max_length=50, blank=True, null=True)  # Field name made lowercase.
    ultimasincronizacion = models.DateTimeField(db_column='UltimaSincronizacion', blank=True, null=True)  # Field name made lowercase.
    empresacobranza = models.ForeignKey('Empresacobranza', models.DO_NOTHING, db_column='EmpresaCobranza_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Empresa'


class Empresacobranza(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    nombre = models.CharField(db_column='Nombre', max_length=100, blank=True, null=True)  # Field name made lowercase.
    rut = models.CharField(db_column='Rut', max_length=20, blank=True, null=True)  # Field name made lowercase.
    codage = models.CharField(db_column='CodAge', max_length=30, blank=True, null=True)  # Field name made lowercase.
    agencia = models.CharField(db_column='Agencia', max_length=100, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EmpresaCobranza'


class EmpresacobranzaComuna(models.Model):
    empresacobranza = models.ForeignKey(Empresacobranza, models.DO_NOTHING)
    comuna = models.ForeignKey(Comuna, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'EmpresaCobranza_Comuna'
        unique_together = (('empresacobranza', 'comuna'),)


class Entrada(models.Model):
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'Entrada'


class Errorrpa(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    errormsg = models.CharField(db_column='ErrorMsg', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    fechaingreso = models.DateTimeField(db_column='FechaIngreso')  # Field name made lowercase.
    demanda = models.ForeignKey(Demanda, models.DO_NOTHING, db_column='Demanda_id', blank=True, null=True)  # Field name made lowercase.
    documento = models.ForeignKey(Documento, models.DO_NOTHING, db_column='Documento_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ErrorRpa'


class Estadodemanda(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EstadoDemanda'


class Estadodemandante(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EstadoDemandante'


class Estadodetalleresolucion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    descripcion = models.CharField(db_column='Descripcion', max_length=20, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EstadoDetalleResolucion'


class Estadodeuda(models.Model):
    cod = models.IntegerField(unique=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'EstadoDeuda'


class Estadodocumento(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EstadoDocumento'


class Estadoresolucion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    descripcion = models.CharField(db_column='Descripcion', max_length=20, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EstadoResolucion'


class Estadosficha(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EstadosFicha'


class Ficha(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    estado_id = models.IntegerField(db_column='Estado_id', blank=True, null=True)  # Field name made lowercase.
    demandante_id = models.IntegerField(db_column='Demandante_id', blank=True, null=True)  # Field name made lowercase.
    empresa_id = models.IntegerField(db_column='Empresa_id', blank=True, null=True)  # Field name made lowercase.
    createddate = models.DateField(db_column='CreatedDate', blank=True, null=True)  # Field name made lowercase.
    updateddate = models.DateField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    downloadedat = models.DateTimeField(db_column='DownloadedAt', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Ficha'


class Frasesclasificacion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    texto = models.CharField(db_column='Texto', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    clasificacion = models.ForeignKey(Clasificacion, models.DO_NOTHING, db_column='Clasificacion_id', blank=True, null=True)  # Field name made lowercase.
    peso = models.IntegerField(db_column='Peso')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'FrasesClasificacion'


class Frasesejecutoria(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    texto = models.CharField(db_column='Texto', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    tipoejecutoria = models.ForeignKey('Tipoejecutoria', models.DO_NOTHING, db_column='TipoEjecutoria_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'FrasesEjecutoria'


class Frasessentencia(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    texto = models.CharField(db_column='Texto', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    tiposentencia = models.ForeignKey('Tiposentencia', models.DO_NOTHING, db_column='TipoSentencia_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'FrasesSentencia'


class Historialestadosficha(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    fecha = models.DateTimeField(db_column='Fecha')  # Field name made lowercase.
    estado = models.ForeignKey(Estadosficha, models.DO_NOTHING, db_column='Estado_id', blank=True, null=True)  # Field name made lowercase.
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='Usuario_id', blank=True, null=True)  # Field name made lowercase.
    ficha = models.ForeignKey(Ficha, models.DO_NOTHING, db_column='Ficha_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'HistorialEstadosFicha'


class Mensajesintegracion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    ficha = models.ForeignKey(Ficha, models.DO_NOTHING, db_column='Ficha_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'MensajesIntegracion'


class Mensajesintegraciondemanda(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    demanda = models.ForeignKey(Demanda, models.DO_NOTHING, db_column='Demanda_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'MensajesIntegracionDemanda'


class Montotoperenta(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    monto = models.DecimalField(db_column='Monto', max_digits=6, decimal_places=2)  # Field name made lowercase.
    periodo = models.IntegerField(db_column='Periodo', unique=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'MontoTopeRenta'


class Montouf(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    monto = models.DecimalField(db_column='Monto', max_digits=8, decimal_places=2)  # Field name made lowercase.
    anio = models.CharField(db_column='Anio', max_length=4)  # Field name made lowercase.
    mes = models.IntegerField(db_column='Mes')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'MontoUF'


class Origendeuda(models.Model):
    cod = models.IntegerField(unique=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'OrigenDeuda'


class Pendinganalisis(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    demandante = models.ForeignKey(Demandante, models.DO_NOTHING, db_column='Demandante_id')  # Field name made lowercase.
    documento = models.ForeignKey(Documento, models.DO_NOTHING, db_column='Documento_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'PendingAnalisis'


class Perfil(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Perfil'


class PerfilRol(models.Model):
    perfil = models.ForeignKey(Perfil, models.DO_NOTHING)
    rol = models.ForeignKey('Rol', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'Perfil_Rol'
        unique_together = (('perfil', 'rol'),)


class Periodocobro(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    periodos = models.CharField(db_column='Periodos', max_length=6)  # Field name made lowercase.
    estado = models.CharField(db_column='Estado', max_length=60, blank=True, null=True)  # Field name made lowercase.
    renta = models.IntegerField(db_column='Renta')  # Field name made lowercase.
    periodopagado = models.IntegerField(db_column='PeriodoPagado')  # Field name made lowercase.
    periodocobrado = models.IntegerField(db_column='PeriodoCobrado')  # Field name made lowercase.
    periododeuda = models.IntegerField(db_column='PeriodoDeuda')  # Field name made lowercase.
    aporteempleador = models.IntegerField(db_column='AporteEmpleador')  # Field name made lowercase.
    aporteafiliado = models.IntegerField(db_column='AporteAfiliado')  # Field name made lowercase.
    deudanominal = models.IntegerField(db_column='DeudaNominal')  # Field name made lowercase.
    updateddate = models.DateTimeField(db_column='UpdatedDate', blank=True, null=True)  # Field name made lowercase.
    estadodeuda = models.IntegerField(db_column='EstadoDeuda', blank=True, null=True)  # Field name made lowercase.
    origendeuda = models.IntegerField(db_column='OrigenDeuda', blank=True, null=True)  # Field name made lowercase.
    ficha = models.ForeignKey(Ficha, models.DO_NOTHING, db_column='Ficha_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'PeriodoCobro'


class Periodocobroanalisis(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    fechaejecucion = models.DateTimeField(db_column='FechaEjecucion', blank=True, null=True)  # Field name made lowercase.
    fichaid = models.IntegerField(db_column='FichaId', blank=True, null=True)  # Field name made lowercase.
    estadofichaid = models.IntegerField(db_column='EstadoFichaId', blank=True, null=True)  # Field name made lowercase.
    periodocobroid = models.IntegerField(db_column='PeriodoCobroId', blank=True, null=True)  # Field name made lowercase.
    periodos = models.CharField(db_column='Periodos', max_length=100, blank=True, null=True)  # Field name made lowercase.
    rentatope = models.IntegerField(db_column='RentaTope', blank=True, null=True)  # Field name made lowercase.
    montojuez = models.IntegerField(db_column='MontoJuez', blank=True, null=True)  # Field name made lowercase.
    existediferencia = models.IntegerField(db_column='ExisteDiferencia', blank=True, null=True)  # Field name made lowercase.
    rentaimponible = models.IntegerField(db_column='RentaImponible', blank=True, null=True)  # Field name made lowercase.
    estadodeuda = models.IntegerField(db_column='EstadoDeuda', blank=True, null=True)  # Field name made lowercase.
    origendeuda = models.IntegerField(db_column='OrigenDeuda', blank=True, null=True)  # Field name made lowercase.
    convalidacion = models.IntegerField(db_column='Convalidacion', blank=True, null=True)  # Field name made lowercase.
    periodocobrado = models.IntegerField(db_column='PeriodoCobrado', blank=True, null=True)  # Field name made lowercase.
    periodopagado = models.IntegerField(db_column='PeriodoPagado', blank=True, null=True)  # Field name made lowercase.
    deuda = models.IntegerField(db_column='Deuda', blank=True, null=True)  # Field name made lowercase.
    aporteempleador = models.IntegerField(db_column='AporteEmpleador', blank=True, null=True)  # Field name made lowercase.
    aportetrabajador = models.IntegerField(db_column='AporteTrabajador', blank=True, null=True)  # Field name made lowercase.
    deudanominal = models.IntegerField(db_column='DeudaNominal', blank=True, null=True)  # Field name made lowercase.
    empleadaparticular = models.IntegerField(db_column='EmpleadaParticular', blank=True, null=True)  # Field name made lowercase.
    fecharelacioncasaparticular = models.DateField(db_column='FechaRelacionCasaParticular', blank=True, null=True)  # Field name made lowercase.
    fechainiciorelacionlaboral = models.DateField(db_column='FechaInicioRelacionLaboral', blank=True, null=True)  # Field name made lowercase.
    fechaterminorelacionlaboral = models.DateField(db_column='FechaTerminoRelacionLaboral', blank=True, null=True)  # Field name made lowercase.
    fechavigenciapension = models.DateField(db_column='FechaVigenciaPension', blank=True, null=True)  # Field name made lowercase.
    montotope = models.DecimalField(db_column='MontoTope', max_digits=65535, decimal_places=65535, blank=True, null=True)  # Field name made lowercase.
    valoruf = models.DecimalField(db_column='ValorUF', max_digits=65535, decimal_places=65535, blank=True, null=True)  # Field name made lowercase.
    quiebra = models.IntegerField(db_column='Quiebra', blank=True, null=True)  # Field name made lowercase.
    origen12 = models.IntegerField(db_column='Origen12', blank=True, null=True)  # Field name made lowercase.
    origenespecial = models.IntegerField(db_column='OrigenEspecial', blank=True, null=True)  # Field name made lowercase.
    origen8 = models.IntegerField(db_column='Origen8', blank=True, null=True)  # Field name made lowercase.
    casaparticular = models.IntegerField(db_column='CasaParticular', blank=True, null=True)  # Field name made lowercase.
    pensionado = models.IntegerField(db_column='Pensionado', blank=True, null=True)  # Field name made lowercase.
    ufotope = models.IntegerField(db_column='UFoTOPE', blank=True, null=True)  # Field name made lowercase.
    mensaje = models.CharField(db_column='Mensaje', max_length=100, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'PeriodoCobroAnalisis'


class Region(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    nombre = models.CharField(db_column='Nombre', max_length=50, blank=True, null=True)  # Field name made lowercase.
    codigo = models.CharField(db_column='Codigo', max_length=50)  # Field name made lowercase.
    deletedat = models.DateTimeField(db_column='DeletedAt', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Region'


class Resolucion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    numero = models.IntegerField(db_column='Numero')  # Field name made lowercase.
    fecharesolucion = models.DateTimeField(db_column='FechaResolucion')  # Field name made lowercase.
    fecharegistro = models.DateTimeField(db_column='FechaRegistro')  # Field name made lowercase.
    documento = models.ForeignKey(Documento, models.DO_NOTHING, db_column='Documento_id', blank=True, null=True)  # Field name made lowercase.
    empresa = models.ForeignKey(Empresa, models.DO_NOTHING, db_column='Empresa_id', blank=True, null=True)  # Field name made lowercase.
    estadoresolucion = models.ForeignKey(Estadoresolucion, models.DO_NOTHING, db_column='EstadoResolucion_id', blank=True, null=True)  # Field name made lowercase.
    solicitudresolucion = models.ForeignKey('Solicitudresolucion', models.DO_NOTHING, db_column='SolicitudResolucion_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Resolucion'


class Rol(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=100)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Rol'


class Solicitudresolucion(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    fechasolicitud = models.DateTimeField(db_column='FechaSolicitud')  # Field name made lowercase.
    fecharegistro = models.DateTimeField(db_column='FechaRegistro')  # Field name made lowercase.
    estadosolicitud = models.IntegerField(db_column='EstadoSolicitud')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SolicitudResolucion'


class Tipoejecutoria(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'TipoEjecutoria'


class Tiposentencia(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=1024, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'TipoSentencia'


class Tribunal(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    nombrecompleto = models.CharField(db_column='NombreCompleto', max_length=1024, blank=True, null=True)  # Field name made lowercase.
    nombreabreviado = models.CharField(db_column='NombreAbreviado', max_length=50, blank=True, null=True)  # Field name made lowercase.
    codigo = models.SmallIntegerField(db_column='Codigo', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Tribunal'


class Usuario(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    email = models.CharField(unique=True, max_length=254)
    fono = models.CharField(max_length=17, blank=True, null=True)
    profile_code = models.ForeignKey(Perfil, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Usuario'


class UsuarioGroups(models.Model):
    usuario = models.ForeignKey(Usuario, models.DO_NOTHING)
    group = models.ForeignKey('AuthGroup', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'Usuario_groups'
        unique_together = (('usuario', 'group'),)


class UsuarioUserPermissions(models.Model):
    usuario = models.ForeignKey(Usuario, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'Usuario_user_permissions'
        unique_together = (('usuario', 'permission'),)


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class Configuracion(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255)
    valor = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'configuracion'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(Usuario, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
