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
	def __init__(self,database,AValue,BValue):
		self.db = database
		self.__ProteinAValue=AValue
		self.__ProteinBValue=BValue
		self.__A=self.__getBestExpressionValueRecord(self.__ProteinAValue)
		self.__APromoter= self.__getPromoterByExpressionValueRecord(self.__A)
		self.__APlasmidBackbone= self.__getPlasmidBackboneByExpressionValueRecord(self.__A)
		self.__B=self.__getBestExpressionValueRecord(self.__ProteinBValue)
		self.__BPromoter= self.__getPromoterByExpressionValueRecord(self.__B)
		self.__BPlasmidBackbone= self.__getPlasmidBackboneByExpressionValueRecord(self.__B)
		print self.__BPromoter

	def __getBestExpressionValueRecord(self,idealValue):
		data= self.db.getExpressionValue()
		minDiff=abs(data[0]['ExpressionValue']-idealValue)
		minIndex=0
		for i in xrange(1,len(data)):
			if(abs(data[i]['ExpressionValue']-idealValue)<minDiff):
				minIndex=i
				minDiff=abs(data[i]['ExpressionValue']-idealValue)
		return data[minIndex]
	
	def __getPromoterByExpressionValueRecord(self,ExpressionValueRecord):
		self.db._SqliteDatabase__cursor.execute('select * from promoter where Number="%s"' %(ExpressionValueRecord['Promoter']))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
	
	def __getPlasmidBackboneByExpressionValueRecord(self,ExpressionValueRecord):
		self.db._SqliteDatabase__cursor.execute('select * from plasmid_backbone where Number="%s"' %(ExpressionValueRecord['PlasmidBackbone']))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.db._SqliteDatabase__cursor.description,self.db._SqliteDatabase__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
	
	def 

if __name__=="__main__":
	sql=SqliteDatabase()
	m=modeling(sql,0.2,0.8)		