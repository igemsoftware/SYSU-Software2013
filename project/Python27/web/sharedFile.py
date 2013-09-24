# coding: utf-8
##
# @file encrypt.py
# @brief  the wrapping of controling the shared files in the sqlite3 database for python.
# @author Jiexin Guo
# @version 1.0
# @date 2013-07-28
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
from database import SqliteDatabase
import jsonUtil
import json
import encrypt

# --------------------------------------------------------------------------
##
# @brief  the class that have wrap the method about controling the shared files
# ----------------------------------------------------------------------------
class sharedFiles:
	# --------------------------------------------------------------------------
	##
	# @brief			init of class sharedFiles
	#
	# @param self	
	# @param database 	a database of class SqliteDatabase
	# 
	# @returns   		return nothing
	#
	# --------------------------------------------------------------------------
	def __init__ (self,database):
		self.db=database
		self.__cx=self.db.getCx()
		self.__cursor=self.db.getCuror()
	# --------------------------------------------------------------------------
	##
	# @brief			get shared files by specific part_type 
	#
	# @param self	
	# @param type 		the file's type
	# 
	# @returns   		return json object of the selecting result 
	#
	# --------------------------------------------------------------------------
	def getSharedTypePart(self,type):
		self.__cursor.execute('SELECT * FROM userPart where part_type="%s"'%type)
		return json.loads(jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall()))	

	# --------------------------------------------------------------------------
	##
	# @brief			get shared file's data(locate the file by extract code)
	#
	# @param self	
	# @param code 		the file's extract code
	# 
	# @returns   		return string data of shared file 
	#
	# --------------------------------------------------------------------------
	def getSharedFileData(self,code):
		self.__cursor.execute('SELECT data FROM user_save WHERE user_save.extractCode="%s"'%(code))
		result=self.__cursor.fetchone()
		if len(result)==0:
			return 'Non such shared file'
		else: 
			return result[0]

	# --------------------------------------------------------------------------
	##
	# @brief			get file info by its extract code 
	# 
	# @param self	
	# @param code 		the file's extract code
	# 
	# @returns   		return file info
	#
	# --------------------------------------------------------------------------
	def getFileByExtractCode(self,code):
		self.__cursor.execute('SELECT [user_save].[fileType],  [user_save].[fileName],  [user_list].[name] AS user_name FROM user_save,user_list WHERE user_list.id=user_save.user_id AND user_save.[extractCode]="%s"'%(code))	
		return  json.loads(jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall()))[0]

	# --------------------------------------------------------------------------
	##
	# @brief		get if the file is shared by user_id,filename,filetype
	# 
	# @param self	
	# @param user_id 		
	# @param filename 	
	# @param filetype 	
	# 
	# @returns   	return a boolean is this file shared
	#
	# --------------------------------------------------------------------------
	def isAFileShared(self,user_id,filename,filetype):
		self.__cursor.execute('SELECT user_save.shared FROM user_save where user_id="%i" AND fileName="%s" AND fileType="%s"'%(user_id,filename,filetype))		
		if self.__cursor.fetchall()==0:
			return False
		else:
			return True

	# --------------------------------------------------------------------------
	##
	# @brief		set a file unshared
	# 
	# @param self	
	# @param user_id 		
	# @param filename 	
	# @param filetype 	
	# 
	# @returns   	return a string showing whether unshared this file success or not 
	#
	# --------------------------------------------------------------------------
	def unsharedAFile(self,user_id,filename,filetype):
		if self.isAFileShared(user_id,filename,filetype):
			self.__cursor.execute('UPDATE user_save SET shared=0, extractCode="" WHERE user_id=%i AND fileName="%s" AND fileType="%s"' %(user_id,filename,filetype))
			self.__cx.commit()
			return "unshared file success!"
		else:
			return "This file isn't shared!"

	# --------------------------------------------------------------------------
	##
	# @brief		set a file shared
	# 
	# @param self	
	# @param user_id 		
	# @param filename 	
	# @param filetype 	
	# 
	# @returns   	return the extract code of this file
	#
	# --------------------------------------------------------------------------
	def setFileShared(self,user_id,filename,filetype):
		code=self.getExtractCode(user_id,filename,filetype)
		self.__cursor.execute('UPDATE user_save SET shared=1, extractCode="%s" WHERE user_id=%i AND fileName="%s" AND fileType="%s"' %(code,user_id,filename,filetype))
		self.__cx.commit()
		return code

	# --------------------------------------------------------------------------
	##
	# @brief		get extract code of a file by its user_id,filename,filetype
	# 
	# @param self	
	# @param user_id 		
	# @param filename 	
	# @param filetype 	
	# 
	# @returns   	return the extract code (sha1 of user_id,filename,filetype)
	#
	# --------------------------------------------------------------------------
	def getExtractCode(self,user_id,filename,filetype):
		str='%i%s%s'%(user_id,filename,filetype)
		return encrypt.getPasswordSHA1(str)

	# --------------------------------------------------------------------------
	##
	# @brief		get a user's shared file list
	# 
	# @param self	
	# @param username 		
	# 
	# @returns   	return a json object
	#
	# --------------------------------------------------------------------------
	def getUserSharedFileList(self,username):
		self.__cursor.execute('SELECT user_save.fileName,user_save.fileType,user_list.name FROM user_save,user_list where user_save.shared=1 AND user_list.id=user_save.user_id AND user_list.name="%s"'%username)
		return json.loads(jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall()))	

	# --------------------------------------------------------------------------
	##
	# @brief		get shared file list of all
	# 
	# @param self		
	# 
	# @returns   	return a json object
	#
	# --------------------------------------------------------------------------	
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