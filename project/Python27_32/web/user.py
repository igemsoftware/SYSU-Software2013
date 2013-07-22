'''
@author Jiexin Guo

a set of users' methods that can control the database(class database)

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.
'''

from database import SqliteDatabase
import jsonUtil

def userLogin(database,name,password):    
    database.logger.debug('user login now: name:%s,password:%s'%(name,password))
    result=database.isUserNameAndPasswordCorrect(name,password)
    if result=='Password correct!':
        database.userId=database.getUserIdByName(name)
    database.logger.debug(result)
    return result

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
    
def changeUserPassword(database,password):
    database.updateUserPassword(password)
    
def userLogout(database):
    database.logger.debug(database.getUserNameById(database.userId)+' log out')
    database.userId=-1
    return 'success'

def getUserFileList(database):
	return database.getUserFileNameList()

def saveUserData(database,datastr,fileName):
    datastr=jsonUtil.turnStringDoubleQuoteToSingleQuote(datastr)
    if(database.isRecordExist(tableName='user_save',recs={'user_id':database.userId,'fileName':fileName})):
        print 'updateUserData'
        return database.updateUserData(datastr,fileName)
    else:
        print 'insertUserData'
        return database.insertUserData(datastr,fileName)
    
"create a new user whose name cannot be the same as those in the database"
def registAUser(database,name,password,email,group_id):
    if isUserLogined(database) is True:      
        if database.isRecordExist(tableName='user_list',recs={'name':name}):        
            database.logger.debug('user name exist: %s'%name)
            return 'user with the same name exist!'              
        database.insertAUser(name,password,email,group_id)
        return 'registAUser success'
    else:
        database.logger.debug('you have not logined in!')        
        return 'you have not logined in yet!' 
    
"get the name of who has been logined"
def getLoginedUserName(database):
	if(isUserLogined(database)):
		return database.getUserNameById(database.userId)
	else:
		return "NULL"
	
if __name__=="__main__":
    sql=SqliteDatabase()
    print userLogin(sql,'kitty','1212')
    #saveUserData(sql,'{"name":"ffff"}','default1')
    print getUserFileList(sql)
    #print getLoginedUserName(sql)
    #changeUserPassword(sql,'1212')    
    #userLogout(sql)
    #sql.getMaxUserId()
    #sql.isRecordExist('user_list')
    #print registAUser(sql,name='test1',password='test',email='tx@qq.com',group_id=1)
    #print userLogin(sql,'kitty','4567')
    #userLogout(sql)
    #print sql.userId
