# coding: utf-8
"""
@author Jiexin Guo

This is the wrapping of controling the shared files in the sqlite3 database for python.

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.

To use, simply 'import sharedFile' and control the files!

"""
from database import SqliteDatabase
import jsonUtil
import json
import encrypt
class sharedFiles:
	def __init__ (self,database):
		self.db=database
		self.__cx=self.db.getCx()
		self.__cursor=self.db.getCuror()
	def getSharedTypePart(self,type):
		self.__cursor.execute('SELECT * FROM userPart where part_type="%s"'%type)
		return json.loads(jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall()))	
	def getSharedFileData(self,code):
		self.__cursor.execute('SELECT data FROM user_save WHERE user_save.extractCode="%s"'%(code))
		result=self.__cursor.fetchone()
		if len(result)==0:
			return 'Non such shared file'
		else: 
			return result[0]
	def getFileByExtractCode(self,code):
		self.__cursor.execute('SELECT [user_save].[fileType],  [user_save].[fileName],  [user_list].[name] AS user_name FROM user_save,user_list WHERE user_list.id=user_save.user_id AND user_save.[extractCode]="%s"'%(code))	
		return  json.loads(jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall()))[0]
	def isAFileShared(self,user_id,filename,filetype):
		self.__cursor.execute('SELECT user_save.shared FROM user_save where user_id="%i" AND fileName="%s" AND fileType="%s"'%(user_id,filename,filetype))		
		if self.__cursor.fetchall()==0:
			return False
		else:
			return True
	def unsharedAFile(self,user_id,filename,filetype):
		if self.isAFileShared(user_id,filename,filetype):
			self.__cursor.execute('UPDATE user_save SET shared=0, extractCode="" WHERE user_id=%i AND fileName="%s" AND fileType="%s"' %(user_id,filename,filetype))
			self.__cx.commit()
			return "unshared file success!"
		else:
			return "This file isn't shared!"
	def setFileShared(self,user_id,filename,filetype):
		code=self.getExtractCode(user_id,filename,filetype)
		self.__cursor.execute('UPDATE user_save SET shared=1, extractCode="%s" WHERE user_id=%i AND fileName="%s" AND fileType="%s"' %(code,user_id,filename,filetype))
		self.__cx.commit()
	def test(self):
		self.__cursor.execute('SELECT user_save.shared FROM user_save,user_list where user_list.id=user_save.user_id')
		return self.__cursor.fetchall()
	def getExtractCode(self,user_id,filename,filetype):
		str='%i%s%s'%(user_id,filename,filetype)
		return encrypt.getPasswordSHA1(str)
	def getUserSharedFileList(self,username):
		self.__cursor.execute('SELECT user_save.fileName,user_save.fileType,user_list.name FROM user_save,user_list where user_save.shared=1 AND user_list.id=user_save.user_id AND user_list.name="%s"'%username)
		return json.loads(jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall()))		
	def getSharedFileList(self):		
		self.__cursor.execute('SELECT user_save.fileName,user_save.fileType,user_list.name FROM user_save,user_list where user_save.shared=1 AND user_list.id=user_save.user_id')	
		return json.loads(jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall()))
if __name__=="__main__":
	sql=SqliteDatabase()
	shared=sharedFiles(sql)	
	#print shared.getSharedTypePart('Coding')
	print shared.getUserSharedFileList('Bobby')
	#print shared.getSharedFileList()	
	#print shared.isAFileShared(0,'test','test')
	#print shared.setFileShared(1,'test1','rnw')
	#print shared.getFileByExtractCode('3a679784c6b6ad2b82990323272d40a1d604ba65')
	#print shared.getSharedFileData('3a679784c6b6ad2b82990323272d40a1d604ba65')
	#print shared.unsharedAFile(0,'test','test')