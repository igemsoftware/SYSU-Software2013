'''
@author Jiexin Guo

a set of users' methods that can control the database(class database)

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.
'''

from database import SqliteDatabase
import jsonUtil
import encrypt
def userSetRememberMe(database):
	if(isUserLogined(database)):
		database.updateUserLoginRememberTime()
		return 'rememberSuccess'
	else:
		return 'Not login but want to remember'
def userLogin(database,name,password):
    database.logger.debug('user login now: name:%s,password:%s'%(name,password))
    result=database.isUserNameAndPasswordCorrect(name,password)
    if result=='Password correct!':
        database.userId=database.getUserIdByName(name)
    database.logger.debug(result)
    return result

def getUserQuestion(database,userName):
	if(database.isRecordExist(tableName='user_list',recs={'name':userName})):
		return database.getUserQuestion(userName)
	else:
		print 'no such a user named %s'%userName
		return 'no such a user named %s'%userName

def isNameedUserLogined(database,name):
    database.logger.debug('is nameed user logined name:%s'%name)
    if not isUserLogined(database):
        return False
    if database.getUserIdByName(name)==database.userId:
        return True
    else:
        return False

def isUserLogined(database):
    if database.userId==-1:
        return False
    else:
        return True

def changeUserPassword(database, old, password):
  name = getLoginedUserName(database)
  result=database.isUserNameAndPasswordCorrect(name,old)
  if result=='Password correct!':
    database.updateUserPassword(password)
    return "success"
  else:
    return "fail"

def userLogout(database):
	if(isUserLogined(database)):
		database.logger.debug(database.getUserNameById(database.userId)+' log out')
		database.userId=-1
		return 'user logout success'
	else:
		database.logger.error('Not loggin but want to log out')
		return 'you have not logined in yet!'

def getUserFileList(database):
	return database.getUserFileNameList()

def getUserGroup(database,username):
	return database.getUserGroup(username)

def isUserAnswerRight(database,username,answer):
	result=database.getUserAnswer(username)
	if result=='no such a user':
		return 'user not exist'
	else:
		return (answer==result)

def resetUserPassword(database,username,answer,newpassword):
	flag=isUserAnswerRight(database,username,answer)
	if flag==True:
		newpassword=encrypt.getPasswordSHA1(newpassword)
		return database.resetUserPassword(username,newpassword)
	elif flag==False:
		return 'reset user password fail'
	else:
		return flag

def saveUserData(database,datastr,fileName,fileType):
    #datastr=jsonUtil.turnStringDoubleQuoteToSingleQuote(datastr)
    #if(database.isRecordExist(tableName='user_save',recs={'user_id':database.userId,'fileName':fileName,'fileType':fileType})):
    print 'updateUserData'
    return database.updateUserData(datastr,fileName,fileType)
    #else:
        #print 'insertUserData'
        #return database.insertUserData(datastr,fileName,fileType)

def deleteUserData(database, fileName):
    if(database.isRecordExist(tableName='user_save',recs={'user_id':database.userId,'fileName':fileName})):
        return database.deleteUserData(fileName)
    else:
        database.logger.error("file does not exist")
        return "file does not exist!"

def loadUserData(database,fileName, fileType):
	fileList=getUserFileList(database)
	for item in fileList:
		if(fileName==item['fileName']):
			return database.getUserFile(fileName, fileType)
	return "no such file"

"create a new user whose name cannot be the same as those in the database"
def registAUser(database,name,password,email,group_id,gender,question,answer):
    if database.isRecordExist(tableName='user_list',recs={'name':name}):
        database.logger.debug('user name exist: %s'%name)
        return 'user with the same name exist!'
    database.insertAUser(name,password,email,group_id,gender,question,answer)
    return 'registAUser success'
    
"get the name of who has been logined"
def getLoginedUserName(database):
	if(isUserLogined(database)):
		return database.getUserNameById(database.userId)
	else:
		return "NULL"

def getUserInfo(database):
	if (isUserLogined(database)):
		name = getLoginedUserName(database)
		return database.getUserInfoByName(name)
	else:
		return "NULL"

def updateUserInfo(database, info):
	if (isUserLogined(database)):
		return database.updateUserInfo(info, database.userId)
	else:
		return "NULL"
		
def userLoginByTicket(database,username,ticket):
	database.logger.debug('user login now: name:%s,ticket:%s'%(username,ticket))
	if getRememberMeTicket(database,username)==ticket:
		database.userId=database.getUserIdByName(username)
		userSetRememberMe(database)
		return getRememberMeTicket(database,username)
	else:
		return 'Ticket error!'
		
def getRememberMeTicket(database,username):	
	str=database.getUserRememberMeTime(username)+username
	return encrypt.getPasswordSHA1(str)

if __name__=="__main__":
    sql=SqliteDatabase()
    print userLogin(sql,'kitty',encrypt.getPasswordSHA1('1212'))
    print userSetRememberMe(sql)
    print getUserQuestion(sql,'kitty')
    #print isUserAnswerRight(sql,'kitty','123144')
    print resetUserPassword(sql,'kitty','kitty','1212')
    print sql.getUserRememberMeTime(getLoginedUserName(sql))
    print getRememberMeTicket(sql,getLoginedUserName(sql))
    #saveUserData(sql,'sdfsdfdaf}','default1',"default2")
    #print getUserFileList(sql)
    #print loadUserData(sql,'filetse','data1')
    #print getLoginedUserName(sql)
    #changeUserPassword(sql,'1212')
    #userLogout(sql)
    #sql.getMaxUserId()
    #sql.isRecordExist('user_list')
    #print registAUser(sql,name='test1',password='test',email='tx@qq.com',group_id=1)
    #print userLogin(sql,'kitty','4567')
    #userLogout(sql)
    #print sql.userId
