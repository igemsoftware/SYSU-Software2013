##
# @file extended_sbol.py
# @brief an extended version of SBOL v1.1, with modeling parameter
# @author Jianhong Li
# @version 1.0
# @date 2013-09-25
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
#

from component_union import union, connect, formatter_v11
from new_sequence import get_new_part_sequence, find_file
import json

# --------------------------------------------------------------------------
##
# @brief extend SBOL header with modeling parameter
#
# @param content  components of SBOL
# @param model_param  modeling parameter of components
#
# @returns   the extended SBOL header
#
# --------------------------------------------------------------------------
def extend(content, model_param):
  displayId = content["part_id"]
  name = content["part_name"]
  description = content["part_short_desc"]
  try:
    del model_param["Name"]
    del model_param["Number"]
    model = "".join(["  %s: %s\n" % (k, v) for k, v in model_param.iteritems()])
  except Exception as e:
    print e
    model = ""
  header = """DnaComponent [
  uri: http://sbol.org/
  displayId: %s
  name: %s
  description: %s
%s
  annotations:[
""" % (displayId, name, description, model)
  return header

# --------------------------------------------------------------------------
##
# @brief get extended SBOL
#
# @param db       database instance
# @param part_id  part id of new part
# @param rule     the rule to connect dna sequence
#
# @returns   an SBOL format string
#
# --------------------------------------------------------------------------
def get_extended_sbol(db, part_id, rule = "RFC10"):
  user_part = db.getUserPart(part_id)
  print user_part
  table = user_part["part_type"]
  model_param = None
  if table != "Coding":
    model_param = db.select_with_name(table, user_part["Number"])
  component = json.loads(user_part["parts"])
  sys_comp = filter(lambda x: x[0:3] == "BBa", component)
  sys_comp = [find_file(x+".xml", ".") for x in sys_comp]
  content = union(rule, sys_comp)
  print content
  cnt = 0
  offset = 0
  intermediat = len(getattr(__import__("component_union"), rule).intermediat)
  for i in xrange(len(component)):
    if component[i][0:3] == "BBa":
      content[cnt]["seq"]["bioStart"] += offset
      content[cnt]["seq"]["bioEnd"] += offset
      cnt += 1
    else:
      offset += len(component[i])
      if i > 0:
        offset += intermediat
  header = extend(user_part, model_param)
  print component
  dna_sequence = get_new_part_sequence(component, rule)
  sbol = formatter_v11(content, dna_sequence, header)
  return sbol

if __name__ == "__main__":
  import database
  db = database.SqliteDatabase()
  print get_extended_sbol(db, "test")
