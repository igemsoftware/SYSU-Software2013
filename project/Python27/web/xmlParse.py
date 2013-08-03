import xml.dom.minidom 
import xmltodict
import json
import sys, os, stat

def list_dir(path, res):
    '''
        res = {'dir':'root', 'child_dirs' : [] , 'files' : []}
        print list_dir('/root', res)
    '''
    for i in os.listdir(path):
        temp_dir = os.path.join(path,i)
        if os.path.isdir(temp_dir):
            temp = {'dir':temp_dir, 'child_dirs' : [] , 'files' : []}
            res['child_dirs'].append(list_dir(temp_dir, temp))
        else:
            res['files'].append(i)
    return res

def test(path):
    res=[]
    str=getAllInPathDemo(path,res)
    return str

def getAllInPathDemo(path,result):
    for item in os.listdir(path):
        dirpath=os.path.join(path,item)
        if os.path.isdir(dirpath):
            result.append(os.path.basename(dirpath))
        else:
            result.append(os.path.basename(dirpath))
    return result   

def list_all_fileanddir(path):
    l=[]    
    for p,d,f in os.walk(path):
        for f1 in f:           
            l.append(os.path.join(p,f1))
    print l
    return l    

def get_allfiledirs(path="biobrick"):
    if os.path.isfile(path):
        return {'path':path,'files':'','pathIsAFile':'true'}
    res = []
    dict={}
    dict['path']=path
    dict['files']=getAllInPath(path,res)
    dict['pathIsAFile']='false'
    return dict
    
def getAllInPath(path,result):
    for item in os.listdir(path):
        dirpath=os.path.join(path,item)
        if os.path.isdir(dirpath):
            result.append(dirpath)
        else:
            result.append(dirpath)
    return result   

def outputPathsToFile(res):
	f=open('out.txt','w')
	for item in res:
		str='<option value="%s">%s</option>\n' %(item,item)
		f.write(str)
	f.close()

class xmlBiobrick:
    data=None
    def __init__ (self,path="biobrick/Terminators/BBa_B0010.xml"):
        self.data = xmltodict.parse(open(path).read());
        self.data['filepath']=path
        #print self.data
        #jsonStr = json.dumps(data,indent=1);
        #jsonStr = json.dumps(data);
        #print "jsonStr=",jsonStr;
        #print data["rsbpml"]["part_list"]

    def getPartShortName(self):
		return self.getPart()['part_short_name']

    def getJsonString(self):
        return json.dumps(self.data)
    
    def getPart_id(self):
        return self.getPart()['part_id']
    
    def getPart(self):
        return self.data["rsbpml"]["part_list"]["part"]    
	
#        self.filepath=path
#        dom = xml.dom.minidom.parse(self.filepath)        
#        self.root = dom.documentElement     
#        dict={}
#        nodelist= self.root.getElementsByTagName('part_list')[0].getElementsByTagName('part')[0].childNodes
#        for i in range(1,len(nodelist)):
#            if(i%2!=0):
#                if(len(nodelist[i].childNodes)!=0):
#                    dict[nodelist[i].nodeName]=nodelist[i].childNodes[0].nodeValue
#                else:
#                    dict[nodelist[i].nodeName]="None"
#        print dict    
 
if __name__ == '__main__':  
    xml=xmlBiobrick(path="web/biobrick/Terminators/BBa_B0010.xml")
    print xml.getPart()
	#print get_allfiledirs(path="web/biobrick/Plasmid backbones/Assembly")
	#outputPathsToFile(test(path="web/biobrick/Plasmid backbones/System operation"))
    #getAllFilesInPath("biobrick")
    #getAllDirsInPath("biobrick")
    #print get_allfiledirs("biobrick")  
    #print get_allfiledirs("biobrick") 
    #print get_allfiledirs("biobrick")['child_dirs'][0]
    #print get_config_dirs()
    #print get_config_dirs(path="biobrick")
    
#    for item in getAllFilesInPath("biobrick"):
#        xml= xmlBiobrick(item)
#        print xml.getJsonString()
#        print xml.getPart_id()
        #print xml.getPart()
    
