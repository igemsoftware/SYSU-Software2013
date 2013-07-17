# coding: utf-8
import json
from database import SqliteDatabase
import user
import mlog
import xmlParse
#import make_graph

logging = mlog.logging

class apis():
  db = SqliteDatabase()
  def __init__(self):
    db = SqliteDatabase()
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
    print message
    message['data']=message['data'].replace('"','\'')
    print user.saveUserData(self.db,message['data'])
  def getLoginedUserName(self,message):
    return user.getLoginedUserName(self.db)

def handle_websocket(ws):
  logging.info("start handling websocket...")
  #db = SqliteDatabase()
  while True:
    message = ws.receive()
    if message is None:
      print "message is empty"
      break
    else:
      message = json.loads(message)
      api = apis()
      result = getattr(api, message['request'])(message)
      logging.info("message is %s" % message)
      ret = json.dumps({'request':message['request'],'result': result})
      logging.info("return %s" % ret)
      ws.send(ret)
