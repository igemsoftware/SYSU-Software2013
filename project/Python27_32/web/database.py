"""
@author Jiexin Guo

This is the wrapping of sqlite3 for python.

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.

To use, simply 'import database' and connect the database of sqlite3!

"""

import sqlite3
import urllib2
import jsonUtil
import json
import os, sys

class SqliteDatabase:
	URL=''
	def isDatabaseExist(self,database):
		if os.path.exists(database):  
			return True
		else:
			return False
	
	def __init__ (self,URL="igem.db"):
		self.URL=URL
		if not self.isDatabaseExist(self.URL):
			return
		self.__cx = sqlite3.connect(self.URL)
		self.__cursor = self.__cx.cursor()	
		
	"""
		return a json that after doing the selection of all the table(of the tableName)
		@author: Jiexin Guo
		@param self:
		@type self:
		@param tableName:
		@type tableName:
		@return:a json format from the selection result
		@rtype:json's list like:
		[{u'type': u'pre', u'desp': u'as you know', u'id': 123, u'name': u'test1'},
				{u'type': u'pre', u'desp': u'test', u'id': 124, u'name': u'test2'}]
	"""
	def selectAllOfTable(self,tableName='part_list'):
		excuteString='select * from '+str(tableName)
		self.__cursor.execute(excuteString)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
	
	def getUserPasswordById(self,name):
		excuteString='select * from user_list where name = "%s"' %name		
		self.__cursor.execute(excuteString)		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if len(decodejson)==0:
			return None
		else:
			return decodejson[0]['password_MD5']
	
	def isUserNameAndPasswordCorrect(self,name,password):
		if self.getUserPasswordById(name) is None:
			return 'No such user!'
		if password==self.getUserPasswordById(name):
			return 'Password correct!'
		else:
			return 'Password not correct!'
	
	"the demo of selecting all data of part_list to the encoded json format"
	def demo1(self):
		#print self.selectAllOfTable()
		print self.isUserNameAndPasswordCorrect(name='Bobby',password='1234')
	
	"add a column to a table"
	def addColumnToTable(self,tableName,field, type, default=''):
		if len(default)==0:
			sql_cmd = '''alter table %s add column %s %s;''' % (tableName,field, type)			
		else:				
			sql_cmd = '''alter table %s add column %s %s default %s;''' % (tableName,field, type,default)
		#print sql_cmd
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()		
	
	def printAllTableNames(self):
		result=self.__cursor.execute("select name from sqlite_master where type='table' order by name;")
		temp=''
		for row in result.fetchall():
			temp=temp+row[0]+','
		print temp
	
	"""
		test if there is the same record in the table
		@author: Jiexin Guo		
		@param self:
		@type self:
		@param tableName:
		@type tableName:string
		@param recs:
		@type recs:json format
		@return:True means that the record exists in the table
		@rtype:boolean
	"""		
	def isRecordExist(self,tableName,recs=''):		
		recs=self.selectAllOfTable(tableName)[0]	
		whereCommand=jsonUtil.changeADictToStringThatCanUseBySql(recs)
		sql_cmd="select * from %s where %s ;"%(tableName,whereCommand)
		print sql_cmd		
		self.__cursor.execute(sql_cmd)
		res = self.__cursor.fetchall()
		if len(res) > 0:
			return True
		else:
			return False
			
	def __del__(self):
		self.__cursor.close()
		self.__cx.close()
		
if __name__=="__main__":
	sql=SqliteDatabase()
	#sql.addColumnToTable('part_relation','testw','integer',' 0')
	sql.demo1()
	#print sql.isRecordExist('part_list')
	#sql.selectAllOfTable('part_relation')
	#sql.printAllTableNames()