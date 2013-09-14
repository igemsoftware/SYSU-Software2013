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
	def isAFileShared(self,user_id,filename,filetype):
		self.__cursor.execute('SELECT user_save.shared FROM user_save where user_id="%i" AND fileName="%s" AND fileType="%s"'%(user_id,filename,filetype))		
		if self.__cursor.fetchall()==0:
			return False
		else:
			return True
	def unsharedAFile(self,user_id,file):
		pass
	def setFileShared(self,user_id,filename,filetype):
		code=self.getExtractCode(user_id,filename,filetype)
		self.__cursor.execute('UPDATE user_save SET shared=1, extractCode="%s" WHERE user_id=%i AND fileName="%s" AND fileType="%s"' %(code,user_id,filename,filetype))
		self.__cx.commit()
	def test(self):
		self.__cursor.execute('SELECT user_save.shared FROM user_save,user_list where user_list.id=user_save.user_id')
		return self.__cursor.fetchall()
	def getExtractCode(self,user_id,filename,filetype):
		str='%i%s%s'%(user_id,filename,filetype)
		print str
		return encrypt.getPasswordSHA1(str)
	def getSharedFileList(self):		
		self.__cursor.execute('SELECT user_save.fileName,user_save.fileType,user_list.name FROM user_save,user_list where user_save.shared=1 AND user_list.id=user_save.user_id')	
		print self.__cursor.fetchall()
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
if __name__=="__main__":
	sql=SqliteDatabase()
	shared=sharedFiles(sql)	
	print shared.getSharedFileList()	
	print shared.setFileShared(0,'test','test')
	print shared.isAFileShared(0,'guotest','plasmid')