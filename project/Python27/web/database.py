# coding: utf-8
# 
# @file database.py
# @brief This is the wrapping of sqlite3 for python.
# @author Jianhong Li,Jiexin Guo
# @version 1.0
# @date 2013-07-31
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
#
import sqlite3
import urllib2
import jsonUtil
import json
import os, sys
import logging
import logging.handlers

# --------------------------------------------------------------------------
##
# @brief  the class that contain all the database control method
# ----------------------------------------------------------------------------
class SqliteDatabase:
	URL=''
	userId=-1
	logger=None
	encrypt=None
	indexSave=None

	# --------------------------------------------------------------------------
  ##
  # @brief     to get the database class's connection
  #
  # @returns   return the connection
  #
  # --------------------------------------------------------------------------
	def getCx(self):
		return self.__cx

	# --------------------------------------------------------------------------
  ##
  # @brief     to get the database class's cursor
  #
  # @returns   return the connection
  #
  # --------------------------------------------------------------------------
	def getCuror(self):
		return self.__cursor
	def addAPromoter(self,name,number,MPPromoter,LeakageRate,K1,Type,Repressor,Source,Activator,PoPS):
		sql_cmd='INSERT INTO promoter (Name,Number,MPPromoter,LeakageRate,K1,Type,Source,PoPS) VALUES ("%s","%s",%f,%f,%f,"%s","%s",%f)'%(name,number,MPPromoter,LeakageRate,K1,Type,Source,PoPS)		
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()		
		return 'add promoter success!'
	def addAUserPart(self,part_id,part_name,part_short_name,part_short_desc,part_type,part_nickname,part_author,sequence,Number,parts):
		sql_cmd="INSERT INTO userPart (part_id,part_name,part_short_name,part_short_desc,part_type,part_nickname,part_author,sequence,uploadUser,Number,parts) VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')"%(part_id,part_name,part_short_name,part_short_desc,part_type,part_nickname,part_author,sequence,self.getUserNameById(self.userId),Number,parts)
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()	
		return 'add user part success!'
	def addAplasmidBackbone(self,name,number,CopyNumber):
		sql_cmd='INSERT INTO plasmid_backbone (Name,Number,CopyNumber) VALUES ("%s","%s",%d)'%(name,number,CopyNumber)
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()	
		return 'add plasmidBackbone success!'
	def addARBS(self,name,number,MPRBS,RIPS):
		sql_cmd='INSERT INTO RBS (Name,Number,MPRBS,RIPS) VALUES ("%s","%s",%f,%f)'%(name,number,MPRBS,RIPS)
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()
		return 'add RBS success!'
	def addARepressor(self,name,number,HillCoeff1,K1,K2):
		sql_cmd='INSERT INTO repressor (Name,Number,HillCoeff1,K1) VALUES ("%s","%s",%d,%f,)'%(name,number,HillCoeff1,K1)
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()	
		return 'add Repressor success!'
	def addATerminator(self,name,number,Efficiency):
		sql_cmd='INSERT INTO terminator (Name,Number,Efficiency) VALUES ("%s","%s",%f)'%(name,number,Efficiency)
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()	
		return 'add terminator success!'
	def addAnInducer(self,name,number,HillCoeff2,K2):
		sql_cmd='INSERT INTO Inducer (Name,Number,HillCoeff2,K2) VALUES ("%s","%s",%d,%f)'%(name,number,HillCoeff2,K2)
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()	
		return 'add Inducer success!'
	def updateUserLoginRememberTime(self):
		if self.userId==-1:
			self.logger.error('not login but want to remember the user login time')
			return 'updateUserLoginRememberTime failed'
		sql_cmd='UPDATE user_list SET rememberTime=datetime("now") WHERE id=%d'%(self.userId)
		self.__cursor.execute(sql_cmd)
		self.logger.debug('updateUserLoginRememberTime: %s'%sql_cmd)
		self.__cx.commit()		
		return 'updateUserPassword succeed'
	def isDatabaseExist(self,database):
		if os.path.exists(database):  
			return True
		else:
			return False
		
	def _logFileInit(self):
		self.logger = logging.getLogger()
		self.logger.setLevel(logging.DEBUG)
		rh=logging.FileHandler("database.log") 
		fm=logging.Formatter("%(asctime)s  %(levelname)s - %(message)s","%Y-%m-%d %H:%M:%S")
		rh.setFormatter(fm)
		self.logger.addHandler(rh)		
		
	def __init__ (self,URL="igem.db"):
		self.URL=URL
		self._logFileInit()
		if not self.isDatabaseExist(self.URL):
			self.logger.error('database file not exist: %s'%self.URL)
			return
		else:
			self.logger.debug('database file exist: %s'%self.URL)
		self.__cx = sqlite3.connect(self.URL)
		self.logger.debug('connect to database: %s'%self.URL)
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
		self.logger.debug('selectAllOfTable: %s'%excuteString)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
	
	def getUserAnswer(self,userName):
		self.__cursor.execute('select user_list.answer from user_list where name="%s"'%(userName))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if len(decodejson)==0:
			return 'no such a user'
		else:
			return decodejson[0]['answer']

	def getUserQuestion(self,userName):
		self.__cursor.execute('select user_list.question from user_list where name="%s"'%(userName))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)			
		return decodejson[0]['question']

	def getMaxUserId(self,tableName='user_list'):
		self.__cursor.execute('select * from %s where id=(select max(id) from %s)'%(tableName,tableName))		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)	
		self.logger.debug('get max user id=%d'%decodejson[0]['id'])	
		return decodejson[0]['id']
	
	"You can only update the logined user"
	def updateUserPassword(self,password):
		if self.userId==-1:
			self.logger.error('not login but want to change the user password')
			return 'updateUserPassword failed'
		sql_cmd='UPDATE user_list SET password_SHA1="%s" WHERE id=%d'%(password,self.userId)
		self.__cursor.execute(sql_cmd)
		self.logger.debug('update user password: %s'%sql_cmd)
		self.__cx.commit()
		return 'updateUserPassword succeed'

	def resetUserPassword(self,userName,password):
		sql_cmd='UPDATE user_list SET password_SHA1="%s" WHERE name="%s"'%(password,userName)
		self.__cursor.execute(sql_cmd)
		self.logger.debug('reset user password: %s'%sql_cmd)
		self.__cx.commit()
		return 'reset User Password succeed'

	def getUserFileNameList(self):
		if self.userId==-1:
			self.logger.error('not login but want to get the user fileList')
			return 'getUserFileNameList failed'
		sql_cmd='select fileName,fileType from user_save WHERE user_id=%d'%(self.userId)
		self.__cursor.execute(sql_cmd)
		self.logger.debug('select fileName from user_save: %s'%sql_cmd)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson	

	def getUserFile(self,filename, fileType):
		if self.userId==-1:
			self.logger.error('not login but want to get the user file')
			return 'getUserFile failed'
		# sql_cmd='select data from user_save WHERE user_id=%d AND fileType="%s" AND fileName="%s"'%(self.userId, fileType,filename)
		sql_cmd='select data from user_save WHERE user_id=%d AND fileName="%s"'%(self.userId, filename)
		print sql_cmd
		self.__cursor.execute(sql_cmd)
		self.logger.debug('select fileName from user_save: %s'%sql_cmd)
		result=self.__cursor.fetchall()
		if(len(result)!=0):
			return result[0][0]
		else:
			return 'getUserFile No result!'

	def updateUserData(self,data,fileName,fileType):
		if self.userId==-1:
			self.logger.error('not login but want to save the user data')
			return 'updateUserData failed'
		#sql_cmd='UPDATE user_save SET data="%s" WHERE user_id=%d AND fileName="%s" AND fileType="%s"'%(data,self.userId,fileName,fileType)
		sql_cmd='REPLACE INTO user_save (data,user_id,fileName,fileType) VALUES ("%s",%d,"%s","%s")'%(data,self.userId,fileName,fileType)
		print sql_cmd
		self.__cursor.execute(sql_cmd)
		self.logger.debug('update user: %s'%self.getUserNameById(self.userId))
		self.__cx.commit()
		return 'updateUserData succeed'

	def insertUserData(self,data,fileName,fileType):
		if self.userId==-1:
			self.logger.error('not login but want to save the user data')
			return 'updateUserData failed'
		sql_cmd='INSERT INTO user_save (user_id,data,fileName,fileType,extractCode,shared) VALUES (%d,"%s","%s","%s",NULL,0)'%(self.userId,data,fileName,fileType)
		print sql_cmd
		self.__cursor.execute(sql_cmd)
		self.logger.debug('update user: %s'%self.getUserNameById(self.userId))
		print self.__cx.commit()
		return 'updateUserData succeed'

	def deleteUserPart(self,part_id,uploaduser):
		if self.userId==-1:
			self.logger.error('not login but want to delete the user data')
			return 'deleteUserData failed'
		sql_cmd='DELETE FROM userPart WHERE part_id = "%s" AND uploadUser = "%s"'%(part_id,uploaduser)
		print sql_cmd
		self.__cursor.execute(sql_cmd)
		print self.__cx.commit()
		return 'delete User part succeed'

	def deleteUserData(self,fileName):
		if self.userId==-1:
			self.logger.error('not login but want to delete the user data')
			return 'deleteUserData failed'
		sql_cmd='DELETE FROM user_save WHERE user_id = %d AND fileName = "%s"'%(self.userId,fileName)
		print sql_cmd
		self.__cursor.execute(sql_cmd)
		self.logger.debug('delete user: %s'%self.getUserNameById(self.userId))
		print self.__cx.commit()
		return 'deleteUserData succeed'

	def insertAUser(self,name,password,email,group_id,gender,question,answer):
		nextId=self.getMaxUserId()+1
		excuteString='INSERT INTO user_list VALUES(%d,"%s","%s","%s",%d,%d,"%s","%s",NULL);'%(nextId,name,email,password,group_id,gender,question,answer)
		self.logger.debug('insert a user: %s ' %excuteString)
		self.__cursor.execute(excuteString)
		self.__cx.commit()
		
	def getUserPasswordById(self,name):
		excuteString='select * from user_list where name = "%s"' %name		
		self.__cursor.execute(excuteString)		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if len(decodejson)==0:
			return None
		else:
			return decodejson[0]['password_SHA1']		
	
	def isUserNameAndPasswordCorrect(self,name,password):
		if self.getUserPasswordById(name) is None:
			return 'No such user!'
		if password==self.getUserPasswordById(name):
			return 'Password correct!'
		else:
			return 'Password not correct!'
	
	def getUserGroup(self,username):
		excuteString="SELECT [user_group].[id],[user_group].[name],  [user_group].[canReadPartList],[user_group].[canWritePartList] FROM user_group,user_list WHERE user_list.name = '%s' AND user_list.group_id = user_group.id" %(username)
		self.logger.debug(excuteString)
		self.__cursor.execute(excuteString)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if len(decodejson)==0:
			return 'No such a user!'
		else:
			for item in decodejson[0]:				
				if decodejson[0][item] is None:
					decodejson[0][item]=0
			return decodejson[0]

	def rememberUser(self,username,pwd):	
		if not self.isRecordExist('remember',recs={'username':username}):
			excuteString='INSERT INTO remember VALUES("%s","%s");'%(username,pwd)
			self.logger.debug('insert a user remember: %s ' %excuteString)
			self.__cursor.execute(excuteString)
			self.__cx.commit()
		else:
			return "the same name user exist"

	def getUserNameById(self,id):
		excuteString='select * from user_list where id = %d' %id				
		self.__cursor.execute(excuteString)	
		self.logger.debug('get user name by id: %d'%id)	
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]['name']		
		
	def getUserIdByName(self,name='Bobby'):
		excuteString='select * from user_list where name = "%s"' %name		
		self.__cursor.execute(excuteString)		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]['id']

	def getUserInfoByName(self,name='Bobby'):
		excuteString='select * from user_list where name = "%s"' %name
		self.__cursor.execute(excuteString)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]

	def updateUserInfo(self, info, userId):
		name = info["name"]
    # TODO gender is not included in database
		gender = info["gender"]
		e_mail = info["e_mail"]
		excuteString= 'UPDATE user_list SET name="%s", e_mail = "%s" WHERE id = "%s"' % (name, e_mail, userId)
		try:
		  self.__cursor.execute(excuteString)
		  return "success"
		except:
		  return "fail"

	"the demo of selecting all data of part_list to the encoded json format"
	def demo1(self):
		pass
		#print self.selectAllOfTable()
		#print self.isUserNameAndPasswordCorrect(name='Bobby',password='1234')		
	
	"add a column to a table"
	def addColumnToTable(self,tableName,field, type, default=''):
		if len(default)==0:
			sql_cmd = '''alter table %s add column %s %s;''' % (tableName,field, type)			
		else:				
			sql_cmd = '''alter table %s add column %s %s default %s;''' % (tableName,field, type,default)
		self.__cursor.execute(sql_cmd)
		self.__cx.commit()		
	
	def printAllTableNames(self):
		result=self.__cursor.execute("select name from sqlite_master where type='table' order by name;")
		temp=''
		for row in result.fetchall():
			temp=temp+row[0]+','
		print temp
		return temp

	def select_row(self, tableName, idx):
		excuteString = "SELECT * FROM %s ORDER BY Number DESC LIMIT %s,1" % (tableName, idx)
		self.__cursor.execute(excuteString)		
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if len(decodejson)==0:
			return None
		else:
			return decodejson[0]['Number']

	def find_actrep(self, link, regulator_set):
		idx = len(regulator_set) + 1
		if link["type"] == "Repressor":
			act_rep_type = "Negative"
		else:
			act_rep_type = "Positive"
		if link["inducer"] not in {"Positive", "Negative"}:
			self.__cursor.execute('SELECT DISTINCT ActRreNumber FROM relation WHERE\
					ActRreType = "%s" AND IncCorType IS NULL ORDER BY ActRreNumber DESC\
					LIMIT 0,%s' % (act_rep_type, idx))
		else:
			if link["inducer"] == "Positive":
				inc_cor_type = "Induced"
			if link["inducer"] == "Negative":
				inc_cor_type = "Corepressed"
			self.__cursor.execute('SELECT DISTINCT ActRreNumber FROM relation WHERE\
					ActRreType = "%s" AND IncCorType = "%s" ORDER BY ActRreNumber DESC\
					LIMIT 0,%s' % (act_rep_type, inc_cor_type, idx))
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		for item in decodejson:
			if item["ActRreNumber"] not in regulator_set:
				regulator_set.add(item["ActRreNumber"])
				return item["ActRreNumber"]


	def select_with_name(self, table, name):
		self.__cursor.execute('SELECT * FROM %s WHERE Number = "%s"' % (table,\
      name))
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if decodejson != []:
			return decodejson[0]
		else:
			return None

	def find_promoter_with_repressor(self, repressor = None):
		self.__cursor.execute('SELECT PromoterNumber FROM relation WHERE\
    ActRreNumber = "%s" AND ActRreType = "Negative"' % repressor)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		promoter = decodejson[0]["PromoterNumber"]
		self.__cursor.execute('SELECT * FROM promoter WHERE Number = "%s"' %
        promoter)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if decodejson != []:
			return decodejson[0]
		else:
			return None

	def find_promoter_with_activator(self, activator = None):
		self.__cursor.execute('SELECT PromoterNumber FROM relation WHERE\
    ActRreNumber = "%s" AND ActRreType = "Positive"' % activator)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		promoter = decodejson[0]["PromoterNumber"]
		self.__cursor.execute('SELECT * FROM promoter WHERE Number = "%s"' %
        promoter)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if decodejson != []:
			return decodejson[0]
		else:
			return None

	def find_cor_ind(self, corep_ind_type, regulator, promoter):
		print 'SELECT HillCoeff2, K2 FROM relation WHERE\
				ActRreNumber = "%s" AND PromoterNumber = "%s" AND IncCorType = "%s"' % (regulator, promoter, corep_ind_type)
		self.__cursor.execute('SELECT HillCoeff2, K2 FROM relation WHERE\
				ActRreNumber = "%s" AND PromoterNumber = "%s" AND IncCorType = "%s"'
				% (regulator, promoter, corep_ind_type))
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if decodejson != []:
			return decodejson[0]
		else:
			return None

	def find_inducer_with_repressor(self, repressor, corep_ind_type):
		if corep_ind_type == "Corepressor":
			self.__cursor.execute('SELECT * FROM Corepressor ORDER BY random() LIMIT 1')
		elif corep_ind_type == "Inducer":
			self.__cursor.execute('SELECT * FROM Inducer ORDER BY random() LIMIT 1')
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if decodejson != []:
			return decodejson[0]
		else:
			return None

	def find_inducer_with_activator(self, activator, corep_ind_type):
		if corep_ind_type == "Corepressor":
			self.__cursor.execute('SELECT * FROM Corepressor ORDER BY random() LIMIT 1')
		elif corep_ind_type == "Inducer":
			self.__cursor.execute('SELECT * FROM Inducer ORDER BY random() LIMIT 1')
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if decodejson != []:
			return decodejson[0]
		else:
			return None

	def find_actrep_with_promoter(self, promoter, link_type, cor_ind_type, regulator_set):
		if link_type == "Constitutive":
			return None
		idx = len(regulator_set) + 1
		if cor_ind_type not in {"Negative", "Positive"}:
			self.__cursor.execute('SELECT DISTINCT ActRreNumber FROM relation WHERE\
					PromoterNumber = "%s" AND ActRreType = "%s" AND IncCorType IS NULL\
					ORDER BY ActRreNumber DESC LIMIT 0, %s' % (promoter, link_type, idx))
		else:
			self.__cursor.execute('SELECT DISTINCT ActRreNumber FROM relation WHERE\
					PromoterNumber = "%s" AND ActRreType = "%s" AND IncCorType = "%s"\
					ORDER BY ActRreNumber DESC LIMIT 0, %s' % (promoter, link_type, cor_ind_type, idx))

		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		print decodejson
		actrep = decodejson[0]["ActRreNumber"]
		self.__cursor.execute('SELECT * FROM repressor WHERE Number = "%s"' %
        actrep)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]

	def find_activator_with_promoter(self, promoter):
		self.__cursor.execute('SELECT ActRreNumber FROM relation WHERE\
    PromoterNumber = "%s" AND ActRreType = "Positive"' % promoter)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		promoter = decodejson[0]["ActRreNumber"]
		self.__cursor.execute('SELECT * FROM activator WHERE Number = "%s"' %
        promoter)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if decodejson != []:
			return decodejson[0]
		else:
			return None
	
	def getRBSNearValue(self,idealValue):
		self.__cursor.execute('select * from RBS order by abs(RBS.MPRBS-%f) limit 0,1' %idealValue)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]

	def getPlasmidBackboneNearValue(self,idealValue):
		self.__cursor.execute('select * from plasmid_backbone order by\
        abs(CopyNumber-%f) limit 0,1' %idealValue)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]

	def getPromoterNearValue(self, idealValue, regulator_set, link_type, p_type,\
      cor_ind_type):
		if cor_ind_type not in {"Negative", "Positive"}:
			sql_cmd = 'SELECT promoter.*, relation.* FROM promoter INNER JOIN relation\
					ON promoter.Number = relation.PromoterNumber WHERE Type = "%s"\
					AND relation.IncCorType IS NULL ORDER BY abs(promoter.%s - %f)' % \
					(link_type, p_type, idealValue)
		else:
			sql_cmd = 'SELECT promoter.*, relation.* FROM promoter INNER JOIN relation\
					ON promoter.Number = relation.PromoterNumber WHERE Type = "%s"\
					AND relation.IncCorType = "%s" ORDER BY abs(promoter.%s - %f)' % \
					(link_type, p_type, corep_ind_type, idealValue)
		self.__cursor.execute(sql_cmd)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		print p_type
		if p_type != "PoPS":
			for item in decodejson:
				regulator = self.find_actrep_with_promoter(item["Number"], link_type,\
						cor_ind_type, regulator_set)
				if regulator["Number"] not in regulator_set:
					regulator_set.add(regulator["Number"])
					return item
		else:
			return decodejson[0]

	def getRepressorNearValue(self, idealValue, regulator_set):
		self.__cursor.execute('select * from repressor order by abs(K1-%f)\
				limit 0,%d' % (idealValue, len(regulator_set)+1))
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		for item in decodejson:
			if item["Number"] not in regulator_set:
				regulator_set.add(item["Number"])
				return item

	def getUserRememberMeTime(self,username):
		self.__cursor.execute('SELECT user_list.rememberTime FROM user_list WHERE name="%s"' % (username))
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson[0]['rememberTime']
				
	def getActivatorNearValue(self, idealValue, regulator_set):
		self.__cursor.execute('select * from activator order by abs(K1-%f)\
				limit 0,%d' % (idealValue, len(regulator_set)+1))
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		for item in decodejson:
			if item["Number"] not in activator_list:
				regulator_set.add(item["Number"])
				return item

	def getUserPartByLoginuser(self):
		excuteString = "SELECT part_id,part_name AS Name,part_type as Type,part_author as Author,uploadUser as username FROM userPart WHERE uploadUser = '%s'" % self.getUserNameById(self.userId)
		self.__cursor.execute(excuteString)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		return decodejson
	def getUserPart(self, part_id):
		excuteString = "SELECT * FROM userPart WHERE part_id = '%s'" % part_id
		self.__cursor.execute(excuteString)
		jsonEncoded = jsonUtil.turnSelectionResultToJson(self.__cursor.description,self.__cursor.fetchall())
		decodejson = json.loads(jsonEncoded)
		if len(decodejson)==0:
			return None
		else:
			return decodejson[0]

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
		if(len(self.selectAllOfTable(tableName))==0):
			self.logger.debug('table:%s with no record'%tableName)
			return False
		self.logger.debug(recs)
		whereCommand=jsonUtil.changeADictToStringThatCanUseBySql(recs)		
		sql_cmd="select * from %s where %s ;"%(tableName,whereCommand)
		self.__cursor.execute(sql_cmd)
		self.logger.debug(sql_cmd)
		res = self.__cursor.fetchall()		
		if len(res) > 0:
			return True
		else:
			return False
			
	def __del__(self):
		self.__cursor.close()
		self.__cx.close()
		self.logger.debug('database close')
		self.logger.debug('')
		
if __name__=="__main__":
	sql=SqliteDatabase()
	# print sql.getUserGroup('Bobby')	
	# sql.updateUserLoginRememberTime()
	sql.userId=1
	#print sql.addAUserPart(part_id='test',part_name='test',part_short_name='set',part_short_desc='sets',part_type='terminater',part_nickname='sdfhsdjf',part_author='huangjunyong',sequence='actga')
	print sql.addARBS('test1','BBa-tst',1.0123,0.1234)
	# print sql.addARepressor('test1','BBa-tst',2,0.1234,0.123)
	#print sql.addAplasmidBackbone('testw','BBa-tst',5)
	# sql.insertAUser('name','password','email',1,1,'question','answer')
	#sql.addATerminator('test','BBa_12345',0.358)
	# sql.addAnInducer('test','BBa-tst',3,0.123)
	# addATerminator(self,name,number,Efficiency)
	#sql.addColumnToTable('part_relation','testw','integer',' 0')	
	#print sql.isRecordExist('part_list')
	#sql.selectAllOfTable('part_relation')
	#sql.printAllTableNames()
