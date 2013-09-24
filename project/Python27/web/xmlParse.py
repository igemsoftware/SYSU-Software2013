##
# @file xmlParse.py
# @brief  tools to parse the xml or the os paths
# @author Jiexin guo
# @version 1.0
# @date 2013-07-28
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
import xml.dom.minidom 
import xmltodict
import json
import sys, os, stat
# --------------------------------------------------------------------------
##
# @brief  get a file's path by its name
#
# @param rootdir    the dir to start searching
# @param key        the file's name to be find 
#
# @returns   return the path of file
#
# --------------------------------------------------------------------------
def findFile(rootdir="web\\biobrick\\",key="BBa_J61008"):
	for root,dirs,files in os.walk(rootdir):
		for file in files:
			a,b=os.path.splitext(file)
			if a==key:
				return os.path.join(root,file)
# --------------------------------------------------------------------------
##
# @brief  list all the files and dirs of the path
#
# @param path       the path to be listed
# @param res        the res dict to save the last step's result
#
# @returns   return res that include all the information about the path
#
# --------------------------------------------------------------------------
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
# --------------------------------------------------------------------------
##
# @brief  list all the files and dirs of the path
#
# @param path       the path to be listed
# @param res        the res dict to save the last step's result
#
# @returns   return res that include all the information about the path
#
# --------------------------------------------------------------------------
def getAllInPathDemo(path,result):
    for item in os.listdir(path):
        dirpath=os.path.join(path,item)
        if os.path.isdir(dirpath):
            result.append(os.path.basename(dirpath))
        else:
            result.append(os.path.basename(dirpath))
    return result   
# --------------------------------------------------------------------------
##
# @brief  list all the files and dirs of the path
#
# @param path       the path to be listed
# @param res        the res dict to save the last step's result
#
# @returns   return res that include all the information about the path
#
# --------------------------------------------------------------------------
def list_all_fileanddir(path):
    l=[]    
    for p,d,f in os.walk(path):
        for f1 in f:           
            l.append(os.path.join(p,f1))
    print l
    return l    
# --------------------------------------------------------------------------
##
# @brief  list all the files and dirs of the path
#
# @param path       the path to be listed
# @param res        the res dict to save the last step's result
#
# @returns   return res that include all the information about the path
#
# --------------------------------------------------------------------------
def get_allfiledirs(path="biobrick"):
    if os.path.isfile(path):
        return {'path':path,'files':'','pathIsAFile':'true'}
    res = []
    dict={}
    dict['path']=path
    dict['files']=getAllInPath(path,res)
    for i in xrange(len(dict['files'])):
      dict['files'][i] = dict['files'][i].replace('/', '\\')
    dict['path'] = dict['path'].replace('/', '\\')
    print dict['files']
    dict['pathIsAFile']='false'
    return dict
# --------------------------------------------------------------------------
##
# @brief  list all the files and dirs of the path
#
# @param path       the path to be listed
# @param result     the res dict to save the last step's result
#
# @returns   return res that include all the information about the path
#
# --------------------------------------------------------------------------
def getAllInPath(path,result):
    for item in os.listdir(path):
        dirpath=os.path.join(path,item)
        if os.path.isdir(dirpath):
            result.append(dirpath)
        else:
            result.append(dirpath)
    return result   
# --------------------------------------------------------------------------
##
# @brief  output Paths To File in format as <option> to help making the option groups html tags
#
# @param res        the dict to output to file
#
# @returns   return nothing
#
# --------------------------------------------------------------------------
def outputPathsToFile(res):
	f=open('out.txt','w')
	for item in res:
		str='<option value="%s">%s</option>\n' %(item,item)
		f.write(str)
	f.close()
# --------------------------------------------------------------------------
##
# @brief  the class that can parse a xml to a biobrick object
# ----------------------------------------------------------------------------
class xmlBiobrick:
    data=None
    def __init__ (self,path="biobrick/Terminators/BBa_B0010.xml"):
        self.data = xmltodict.parse(open(path).read());
        self.data['filepath']=path
    # --------------------------------------------------------------------------
    ##
    # @brief  get Part's Short Name
    # 
    # @param self  
    #
    # @returns   return part_short_name
    #
    # --------------------------------------------------------------------------
    def getPartShortName(self):
		return self.getPart()['part_short_name']
    # --------------------------------------------------------------------------
    ##
    # @brief  get Part's data to json string
    # 
    # @param self  
    #
    # @returns   return json string of this biobrick
    #
    # --------------------------------------------------------------------------
    def getJsonString(self):
        return json.dumps(self.data)
    # --------------------------------------------------------------------------
    ##
    # @brief  get Part's Id
    # 
    # @param self  
    #
    # @returns   return part_id
    #
    # --------------------------------------------------------------------------
    def getPart_id(self):
        return self.getPart()['part_id']
    
    def getPart(self):
        return self.data["rsbpml"]["part_list"]["part"]    
 
if __name__ == '__main__':      #xml=xmlBiobrick(path="web/biobrick/Terminators/BBa_B0010.xml")
    #print xml.getPart()
    print findFile()
	#print get_allfiledirs(path="web/biobrick/Plasmid backbones/Assembly")
	#outputPathsToFile(test(path="web/biobrick/Plasmid backbones/System operation"))
    #getAllFilesInPath("biobrick")
    #getAllDirsInPath("biobrick")
    #print get_allfiledirs("biobrick")  
    #print get_allfiledirs("biobrick") 
    #print get_allfiledirs("biobrick")['child_dirs'][0]
    #print get_config_dirs()
    #print get_config_dirs(path="biobrick")
