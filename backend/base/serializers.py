from rest_framework import serializers
from .models import Documento, Demanda, Empresa, Tribunal

class TribunalSerializer(serializers.ModelSerializer):
    class Meta:
        model=Tribunal
        fields = '__all__'

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'

class DemandaSerializer(serializers.ModelSerializer):
    empresa = EmpresaSerializer()
    tribunal = TribunalSerializer()
    class Meta:
        model = Demanda
        #fields = '__all__'
        fields = ('empresa', 'estado', 'id', 'rit', 'tribunal')

class DocumentoSerializer(serializers.ModelSerializer):
    #demanda_rit = serializers.CharField(source='Demanda.rit')
    demanda = DemandaSerializer()
    
    class Meta:
        model = Documento
        fields = ('id','nombrearchivo','observaciones','url','fechaingreso','clasificacion','demanda')
        #related_object = 'question'


        