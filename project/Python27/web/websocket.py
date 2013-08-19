# coding: utf-8
import json
from database import SqliteDatabase
import user
import mlog
import xmlParse
import os
import group
# import make_graph

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
    if message.has_key("fileName") and message.has_key("fileType"):
      return user.saveUserData(self.db,message['data'],message['fileName'],message['fileType'])
    elif message.has_key("fileName"):
      return user.saveUserData(self.db,message['data'],message['fileName'],"default")
    elif message.has_key("fileType"):
      return user.saveUserData(self.db,message['data'],"default",message['fileType'])
    else:
      return user.saveUserData(self.db,message['data'],"default","default")

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
  def deleteUserData(self,message):
    return {"name":message["name"],
        "result":user.deleteUserData(self.db,message["name"])}
  def updateUserInfo(self,message):
    return user.updateUserInfo(self.db, message["userInfo"])
  def updatePassword(self,message):
    ret= user.changeUserPassword(self.db, message["old"], message["new"])
    return ret
  def loadUserFile(self,message):
    if message.has_key("fileType"):
  	  return user.loadUserData(self.db,message['fileName'],message['fileType'])
    else:
      return user.loadUserData(self.db,message['fileName'],"default")
  def loadSBOL(self,message):
    data = {
    "part": [
      { "id"  : 1,
        "name": "BBa_C0060",
        "type": "Protein"
        },
      { "id"  : 2,
        "name": "repressor",
        "type": "Repressor"
        },
      { "id"  : 3,
        "name": "BBa_C0160",
        "type": "Protein"
        },
      { "id"  : 4,
        "name": "BBa_C0178",
        "type": "Protein"
        }

      ],
    "link": [
      { "from": 1,
        "to"  : 2,
        "type": "Bound",
        },
      { "from": 2,
        "to"  : 3,
        "type": "repressor_protein",
        },
      { "from": 2,
        "to"  : 4,
        "type": "repressor_protein",
        },
      ]
    }        
    print json.loads(message['data'])
    return group.dump_sbol(group.work(json.loads(message['data']), self.db))

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
      print message
      api = apis(db)
      result = getattr(api, message['request'])(message)
      logging.info("message is %s" % message)
      ret = json.dumps({'request':message['request'],'result': result})
      print ret
      logging.info("return %s" % ret)
      ws.send(ret)
