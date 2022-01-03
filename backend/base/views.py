from django.shortcuts import render
from .models import Documento
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import DocumentoSerializer

@api_view(['GET'])
def documentos(request):
    Documentos =Documento.objects.all()
    #print(Documentos)
    serializers = DocumentoSerializer(Documentos, many=True)
    return Response(serializers.data)
