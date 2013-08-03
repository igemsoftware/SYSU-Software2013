# coding=gbk
'''
@author Jiexin Guo

a set of methods that using json or the changing of class that related to json

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.
'''
import json
from database import SqliteDatabase
class modeling:
	def __init__(self,database,AValue,BValue):
		self.db = database
		self.__ProteinAValue=AValue
		self.__ProteinBValue=BValue
		closeA=self.__getBestExpressionValueRecord(self.__ProteinAValue)
		print closeA
		closeB=self.__getBestExpressionValueRecord(self.__ProteinBValue)
		print closeB

	def __getBestExpressionValueRecord(self,idealValue):
		data= self.db.getExpressionValue()
		minDiff=abs(data[0]['ExpressionValue']-idealValue)
		minIndex=0
		for i in xrange(1,len(data)):
			if(abs(data[i]['ExpressionValue']-idealValue)<minDiff):
				minIndex=i
				minDiff=abs(data[i]['ExpressionValue']-idealValue)
		return data[minIndex]

if __name__=="__main__":
	sql=SqliteDatabase()
	m=modeling(sql,0.2,0.8)		