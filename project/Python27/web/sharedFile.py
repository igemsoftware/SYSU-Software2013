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
class sharedFiles:
	def __init__ (self,database):
		self.db=database
		self.__cx=self.db.getCx()
		self.__cursor=self.db.getCuror()
	def getSharedFileList(self):		
		self.__cursor.execute('SELECT user_save.data,user_save.fileName,user_save.fileType,user_list.name FROM user_save,user_list where user_save.shared==1 AND user_list.id==user_save.user_id')		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
if __name__=="__main__":
	sql=SqliteDatabase()
	shared=sharedFiles(sql)
	print shared.getSharedFileList()