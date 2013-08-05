# coding=gbk
'''
@author Jiexin Guo

a set of methods that using json or the changing of class that related to json

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.
'''
import json
import jsonUtil
from database import SqliteDatabase
class modeling:
	def __init__(self,database,AValue,BValue,ProteinAName,ProteinBName):
		self.db = database
		self.__ProteinAValue=AValue
		self.__ProteinBValue=BValue
		self.AExpressionValueRecord=self.__getBestExpressionValueRecord(self.__ProteinAValue)
		self.APromoter= self.__getPromoterByExpressionValueRecord(self.AExpressionValueRecord)
		self.APlasmidBackbone= self.__getPlasmidBackboneByExpressionValueRecord(self.AExpressionValueRecord)
		self.BExpressionValueRecord=self.__getBestExpressionValueRecord(self.__ProteinBValue)
		self.BPromoter= self.__getPromoterByExpressionValueRecord(self.BExpressionValueRecord)
		self.BPlasmidBackbone= self.__getPlasmidBackboneByExpressionValueRecord(self.BExpressionValueRecord)
		self.ProteinA=self.__getProteinByName(ProteinAName)
		self.ProteinB=self.__getProteinByName(ProteinBName)
		self.RBS=self.__getRBSByName('BBa_J61111')
		print self.ProteinA,self.ProteinB,self.RBS

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

if __name__=="__main__":
	sql=SqliteDatabase()
	m=modeling(sql,0.2,0.8,'BBa_C0060','BBa_I725014')	