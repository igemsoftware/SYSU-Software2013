# coding: utf-8
import json
from database import SqliteDatabase
import user
import mlog
import xmlParse
import os
import make_graph

logging = mlog.logging

class apis():
  def __init__(self, db):
    self.db = db
  def get_part(self, message):
    return self.db.selectAllOfTable(tableName = message['table_name'])
  def userLogin(self,message):
    return user.userLogin(self.db,name=message['name'],password=message['password'])
  def getDirList(self,message={'dir':'biobrick'}): 
    return xmlParse.get_allfiledirs(message['dir'])
  def getBiobrick(self,message={'path':'biobrick/Terminators/BBa_B0010.xml'}):
    return xmlParse.xmlBiobrick(message['path']).getJsonString()
  def getSimulationData(self,message):
    content = make_graph.parse_data()
    return content
  def saveUserData(self,message):
    message['data']=message['data'].replace('"','\'')
    if message.has_key("fileName"):
		user.saveUserData(self.db,message['data'],message['fileName'])
    else:
		user.saveUserData(self.db,message['data'],"default")
  def getLoginedUserName(self,message):
    return user.getLoginedUserName(self.db)
  "ws.send(JSON.stringify({'request': 'getXmlJson','path':'web/biobrick/Terminators/BBa_B0010.xml'}));"
  def getXmlJson(self,message):
	xml=xmlParse.xmlBiobrick(path=message['path'])
	return xml.getJsonString()
  def loginOut(self,message):
	return user.userLogout(self.db)
  def getUserFileList(self,message):
	return user.getUserFileList(self.db)

def handle_websocket(ws, db):
  logging.info("start handling websocket...")
  #db = SqliteDatabase()
  while True:
    message = ws.receive()
    if message is None:
      print "message is empty"
      break
    else:
      message = json.loads(message)
      api = apis(db)
      result = getattr(api, message['request'])(message)
      logging.info("message is %s" % message)
      ret = json.dumps({'request':message['request'],'result': result})
      logging.info("return %s" % ret)
      ws.send(ret)
