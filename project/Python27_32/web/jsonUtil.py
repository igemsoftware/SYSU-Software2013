'''
@author Jiexin Guo

a set of methods that using json or the changing of class that related to json

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.
'''

import json

"turn a selection of the database 's result to the encoded json"
def turnSelectionResultToJson(description=[],result=[]):
    dict= {}
    obj=[]
    for line in result:        
        for item in range(len(line)):
            dict.setdefault(description[item][0],line[item])   
        obj.append(dict.copy())
        dict.clear()
    return json.dumps(obj)

'''
{u'desp': u'as you know', u'type': u'pre', u'id': 123, u'name': u'test1'} 
to 
type = 'pre'  and desp = 'as you know'  and id = '123'  and name = 'test1'

the kind of dictionery to string that of sql "where" parse
'''
def changeADictToStringThatCanUseBySql(dict={}):
    command=[]
    for (key,value) in dict.items():
        command.append(str(key+' = '+"'"+str(value)+"' "))    
    toReturn=''
    for item in range(len(command)):
        if item<len(command)-1:
            toReturn+=command[item]+' and '
        else:
            toReturn+=command[item]
    return toReturn

def turnStringDoubleQuoteToSingleQuote(oldStr):
	return oldStr.replace("\"", "\'")


                