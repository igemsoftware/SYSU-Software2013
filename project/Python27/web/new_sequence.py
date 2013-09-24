import component_union
import os
import xml.etree.ElementTree as ET

def find_file(name, path):
  for root, dirs, files in os.walk(path):
    if name in files:
      return os.path.join(root, name)

def get_new_part_sequence(component, rule = "RFC10"):
  content = []
  for i in range(len(component)):
    info = {}
    if component[i][0:3] == "BBa":
      xml_file = find_file(component[i] + ".xml", '.')
      t = ET.parse(xml_file)
      path = "part_list/part/"
      info["sequences"] = t.find(path+"sequences/seq_data").text[1:-1]
      info["dna"] = {"type": t.find(path+"part_type").text}
    else:
      info["sequences"] = component[i]
      info["dna"] = {"type": "Sequence"}
    content.append(info)

  dna_sequence = component_union.connect(rule, content)
  return dna_sequence

if __name__ == "__main__":
  print get_new_part_sequence(["BBa_B0011", "AAAAAAAAAAAAAAAAAAAAAAAAAAAA"])
