import sys
import xml.etree.ElementTree as ET

class RFC10():
  prefix = "GAATTCGCGGCCGCTTCTAGAG"
  prefix_with_pro = "GAATTCGCGGCCGCTTCTAG"
  suffix = "TACTAGTAGCGGCCGCTGCAG"
  intermediat = "TACTAGAG"

class RFC20():
  prefix =  "GAATTCGCGGCCGCTTCTAGAG"
  suffix = "ACTAGTAGCGGCCGCCCTGCAGG"
  intermediat = "TACTAGAG"

class RFC23():
  prefix =  "GAATTCGCGGCCGCTTCTAGA"
  suffix = "ACTAGTAGCGGCCGCTGCAG"
  intermediat = "ACTAGA"

class RFC25():
  prefix = "GAATTCGCGGCCGCTTCTAGATGGCCGGC"
  suffix = "ACCGGTTAATACTAGTAGCGGCCGCTGCAG"
  intermediat = "ACCGGC"
  special = "GAATTCGCGGCCGCTTCTAG"

class RFC21():
  prefix = "GAATTCATGAGATCT"
  suffix = "GGATCCTAACTCGAG"
  intermediat = "GGATCT"

def get_rule(xml_file):
  t = ET.parse(xml_file)
  path = "part_list/part/"
  return t.find(path + "part_type").text

# return dna component and sequence annotation info from all files
def union(rule_name, file_list):
  rule = globals()[rule_name]()
  ret = []
  path = "part_list/part/"
  current_pos = len(rule.prefix)
  first = True

  for xml_file in file_list:
    dna_component = {}
    sequence_annotation = {}
    t = ET.parse(xml_file)

    # get info for dna_component
    dna_component["uri"] = t.find(path + "part_url").text
    dna_component["displayId"] = t.find(path + "part_id").text
    dna_component["name"] = t.find(path + "part_name").text
    dna_component["description"] = t.find(path + "part_short_desc").text
    dna_component["type"] = t.find(path + "part_type").text

    # get info for sequence_annotation
    sequence = t.find(path + "sequences/seq_data").text
    sequence = filter(lambda x: x != '\n', sequence)

    if rule_name == "RFC10" and first and dna_component["type"] == "Coding":
      first = False
      current_pos -= 2
    if rule_name == "RFC25" and dna_component["type"] == "Coding":
      current_pos += len(rule.special)
    sequence_annotation["bioStart"] = current_pos
    current_pos += len(sequence)
    sequence_annotation["bioEnd"] = current_pos
    current_pos += len(rule.intermediat)

    sequence_annotation["uri"] = "http://sbols.org/"
    sequence_annotation["strand"] = "+"

    ret.append({"dna": dna_component, "seq": sequence_annotation,
      "sequences": sequence})
  return ret

def connect(rule_name, content):
  rule = globals()[rule_name]()
  if rule_name == "RFC10" and content[0]["dna"]["type"] == "Coding":
    ret = rule.prefix_with_pro
  else:
    ret = rule.prefix
  if rule_name == "RFC25":
    for i in content:
      if i["dna"]["type"] == "Coding":
        i["sequences"] = rule.special + i["sequences"]
  ret += rule.intermediat.join([i["sequences"] for i in content])
  ret += rule.suffix
  return ret

#format info into SBOL v1.1
def formatter_v11(content, dna_sequence):
  header = """DnaComponent [
  uri: http://sbol.org/
  displayId: undefined
  name: undefined
  description: undefined
  annotations:[
"""
  s = header
  # indent level: 2 spaces
  indent = "  "
  for item in content:
    s += 2 * indent + "SequenceAnnotation [\n"
    for key, value in sorted(item["seq"].items()):
      s += 3 * indent + "%s: %s\n" % (key, value)

    # a colon is missing here for convience to format into json
    s += 3 * indent + "subComponent [\n"
    s += 4 * indent + "DnaComponent [\n"
    for key, value in sorted(item["dna"].items()):
      s += 5 * indent + "%s: %s\n" % (key, value)
    s += 4 * indent + "]\n"
    s += 3 * indent + "]\n"
    s += 2 * indent + "]\n"
  #dna_sequence = '\n'.join([dna_sequence[i:i+100] for i in range(0,
    #len(dna_sequence), 100)])
  s += """
  ]
  DnaSequence [
    uri: http://sbols.org/
    nucleotides: %s
  ]
]""" % dna_sequence
  return s

def get_sbol(component, rule = "RFC10", extended = False):
  content = union(rule, component)
  dna_sequence = connect(rule, content)
  sbol = formatter_v11(content, dna_sequence)
  return sbol


if __name__ == "__main__":
  rule = "RFC25"
  sbol = get_sbol(sys.argv[2:], rule)

  fp = open(sys.argv[1], "w")
  fp.write(sbol)
