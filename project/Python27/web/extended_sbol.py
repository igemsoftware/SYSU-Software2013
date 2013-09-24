from component_union import union, connect, formatter_v11
from new_sequence import get_new_part_sequence, find_file
import json

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
  header = extend(user_part, model_param)
  print component
  dna_sequence = get_new_part_sequence(component, rule)
  sbol = formatter_v11(content, dna_sequence, header)
  return sbol

if __name__ == "__main__":
  import database
  db = database.SqliteDatabase()
  print get_extended_sbol(db, "test")
