# coding=gbk
'''
@author Jiexin Guo

a set of methods that using json or the changing of class that related to json

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.
'''
import json
import jsonUtil
import string
from database import SqliteDatabase
class modeling:
	def __init__(self,database,AValue,BValue,ProteinAName,ProteinBName,isDepressing):
		self.db = database
		self.__ProteinAValue=AValue
		self.__ProteinBValue=BValue
		self.AExpressionValueRecord=self.__getBestExpressionValueRecord(self.__ProteinAValue)
		self.APromoter= self.__getPromoterByExpressionValueRecord(self.AExpressionValueRecord)
		self.APlasmidBackbone= self.__getPlasmidBackboneByExpressionValueRecord(self.AExpressionValueRecord)
		#print self.AExpressionValueRecord
		self.BExpressionValueRecord=self.__getBestExpressionValueRecord(self.__ProteinBValue)
		self.BPromoter= self.__getPromoterByExpressionValueRecord(self.BExpressionValueRecord)
		self.BPlasmidBackbone= self.__getPlasmidBackboneByExpressionValueRecord(self.BExpressionValueRecord)
		#print self.BExpressionValueRecord
		self.ProteinA=self.__getProteinByName(ProteinAName)
		self.ProteinB=self.__getProteinByName(ProteinBName)
		self.RBS=self.__getRBSByName('BBa_J61102')
		self.RepressorTable=self.__getRepressor()
		f = open("out.txt","w")
		for item in self.RepressorTable:
			self.depressingFunction(item,f)

	def __getBestExpressionValueRecord(self,idealValue):
		#data= self.db.getExpressionValue()
		#minDiff=abs(data[0]['ExpressionValue']-idealValue)
		#minIndex=0
		#for i in xrange(1,len(data)):
		#	if(abs(data[i]['ExpressionValue']-idealValue)<minDiff):
		#		minIndex=i
		#		minDiff=abs(data[i]['ExpressionValue']-idealValue)
		#return data[minIndex]		
		self.db._SqliteDatabase__cursor.execute('select * from expression_value order by abs(expression_value.ExpressionValue-%f) limit 0,1' %idealValue)		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]

	def __getRepressor(self):
		self.db._SqliteDatabase__cursor.execute('SELECT [repressor].* FROM [repressor]')	
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
		
	def __getPromoterByExpressionValueRecord(self,ExpressionValueRecord):
		self.db._SqliteDatabase__cursor.execute('select * from promoter where Number="%s"' %(ExpressionValueRecord['Promoter']))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]
	
	def __getPlasmidBackboneByExpressionValueRecord(self,ExpressionValueRecord):
		self.db._SqliteDatabase__cursor.execute('select * from plasmid_backbone where Number="%s"' %(ExpressionValueRecord['PlasmidBackbone']))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]
	
	def __getProteinByName(self,proteinName):
		self.db._SqliteDatabase__cursor.execute('select * from Protein where Number="%s"' %(proteinName))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]
	
	def __getRBSByName(self,rbsName):
		self.db._SqliteDatabase__cursor.execute('select * from RBS where Number="%s"' %(rbsName))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]

	def depressingFunction(self,repressor,f):
		repressor['K1']=repressor['K1']*10
		CopyNumber1=string.atof(self.APlasmidBackbone['CopyNumber'])
		CopyNumber2=string.atof(self.BPlasmidBackbone['CopyNumber'])
		LeakageRate1=string.atof(self.APromoter['LeakageRate'])
		MPPromoter1=string.atof(self.APromoter['MPPromoter'])
		#if LeakageRate1>MPPromoter1:
			#LeakageRate1=string.atof(self.APromoter['MPPromoter'])
			#MPPromoter1=string.atof(self.APromoter['LeakageRate'])		
		LeakageRate2=string.atof(self.BPromoter['LeakageRate'])
		#LeakageRate2=0.1
		MPPromoter2=string.atof(self.BPromoter['MPPromoter'])
		#if LeakageRate2>MPPromoter2:
			#LeakageRate2=string.atof(self.BPromoter['MPPromoter'])
			#MPPromoter2=string.atof(self.BPromoter['LeakageRate'])	
		c1=CopyNumber1*(MPPromoter1-LeakageRate1)
		c2=CopyNumber2*(MPPromoter2-LeakageRate2)			
		proteina0=self.RBS['MPRBS']/self.ProteinB['DegRatePro']*((c2+LeakageRate2)/self.ProteinB['DegRatemRNA'])
		#print>>f,'CopyNumber1',CopyNumber1
		#print>>f,'CopyNumber2',CopyNumber2
		#print>>f,'LeakageRate1',LeakageRate1
		#print>>f,'MPPromoter1',MPPromoter1	
		#print>>f,'c1',c1
		#print>>f,'c2',c2
		#print>>f,'k1',repressor['K1']
		#print>>f,'proteina0',proteina0		
		RepressorResult=pow(proteina0/repressor['K1'],repressor['HillCoeff1'])+1
		#print>>f,'temp',pow(proteina0/repressor['K1'],repressor['HillCoeff1'])
		#RepressorResult=1+1.5
		RepressorResult=c2/RepressorResult#+LeakageRate2		
		RepressorResult=RepressorResult/c2#+LeakageRate2)
		print>>f,'RepressorResult',RepressorResult			
		

if __name__=="__main__":
	sql=SqliteDatabase()
	m=modeling(sql,0.1,0.9,'BBa_K091109','BBa_I725011',True)	