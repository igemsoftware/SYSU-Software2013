from component_union import union, connect, formatter_v11
from new_sequence import get_new_part_sequence
import json

def extend(content, model_param):
  displayId = content["part_id"]
  name = content["part_name"]
  description = content["part_short_desc"]
  try:
    del model_param["Name"]
    del model_param["Number"]
    model = "".join(["  %s: %s" % (k, v) for k, v in model_param])
  except:
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
  print user_part["parts"]
  component = json.loads(user_part["parts"])
  content = union(rule, component)
  header = extend(user_part, model_param)
  dna_sequence = get_new_part_sequence(rule, component)
  sbol = formatter_v11(content, dna_sequence, header)

if __name__ == "__main__":
  import database
  db = database.SqliteDatabase()
  get_extended_sbol(db, "test")
