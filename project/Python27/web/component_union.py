##
# @file component_union.py
# @brief connect component and generate SBOL
# @author Jianhong Li
# @version 1.0
# @date 2013-06-20
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
#

import sys
import xml.etree.ElementTree as ET

# --------------------------------------------------------------------------
##
# @brief a rule of DNA concentration
#
# --------------------------------------------------------------------------
class RFC10():
  prefix = "GAATTCGCGGCCGCTTCTAGAG"
  prefix_with_pro = "GAATTCGCGGCCGCTTCTAG"
  suffix = "TACTAGTAGCGGCCGCTGCAG"
  intermediat = "TACTAGAG"

# --------------------------------------------------------------------------
##
# @brief a rule of DNA concentration
#
# --------------------------------------------------------------------------
class RFC20():
  prefix =  "GAATTCGCGGCCGCTTCTAGAG"
  suffix = "ACTAGTAGCGGCCGCCCTGCAGG"
  intermediat = "TACTAGAG"

# --------------------------------------------------------------------------
##
# @brief a rule of DNA concentration
#
# --------------------------------------------------------------------------
class RFC23():
  prefix =  "GAATTCGCGGCCGCTTCTAGA"
  suffix = "ACTAGTAGCGGCCGCTGCAG"
  intermediat = "ACTAGA"

# --------------------------------------------------------------------------
##
# @brief a rule of DNA concentration
#
# --------------------------------------------------------------------------
class RFC25():
  prefix = "GAATTCGCGGCCGCTTCTAGATGGCCGGC"
  suffix = "ACCGGTTAATACTAGTAGCGGCCGCTGCAG"
  intermediat = "ACCGGC"
  special = "GAATTCGCGGCCGCTTCTAG"

# --------------------------------------------------------------------------
##
# @brief a rule of DNA concentration
#
# --------------------------------------------------------------------------
class RFC21():
  prefix = "GAATTCATGAGATCT"
  suffix = "GGATCCTAACTCGAG"
  intermediat = "GGATCT"

# --------------------------------------------------------------------------
##
# @brief get type of a part
#
# @param xml_file  the path of the xml file of the part
#
# @returns   the type of the part
#
# --------------------------------------------------------------------------
def get_part_type(xml_file):
  t = ET.parse(xml_file)
  path = "part_list/part/"
  return t.find(path + "part_type").text

# --------------------------------------------------------------------------
##
# @brief Get DNA component and sequence annotation info from all files
#
# @param rule_name  the rule of DNA concentration
# @param file_list  list of files of components
#
# @returns   DNA component and sequence annotation info from all files
#
# --------------------------------------------------------------------------
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

# --------------------------------------------------------------------------
##
# @brief connect components with given rule
#
# @param rule_name  the rule
# @param content    components
#
# @returns          DNA sequence of components
# 
# --------------------------------------------------------------------------
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

# --------------------------------------------------------------------------
##
# @brief format info into SBOL v1.1
#
# @param content       components
# @param dna_sequence  the DNA sequence of components
# @param header        customized header, None by default
#
# @returns   SBOL v1.1 format string
#
# --------------------------------------------------------------------------
def formatter_v11(content, dna_sequence, header = None):
  if header == None:
    header = """DnaComponent [
  uri: http://sbol.org/
  displayId: plasmid
  name: plasmid
  description: undefined
  annotations:[
"""
  s = header
  indent = "  "
  for item in content:
    indent_level = 2
    s += indent_level * indent + "SequenceAnnotation [\n"
    indent_level += 1
    for key, value in sorted(item["seq"].items()):
      s += indent_level * indent + "%s: %s\n" % (key, value)

    # a colon is missing here for convience to format into json
    s += indent_level * indent + "subComponent [\n"
    indent_level += 1
    s += indent_level * indent + "DnaComponent [\n"
    indent_level += 1
    for key, value in sorted(item["dna"].items()):
      s += indent_level * indent + "%s: %s\n" % (key, value)
    indent_level -= 1
    s += 4 * indent + "]\n"
    indent_level -= 1
    s += 3 * indent + "]\n"
    indent_level -= 1
    s += 2 * indent + "]\n"
  s += """
  ]
  DnaSequence [
    uri: http://sbols.org/
    nucleotides: %s
  ]
]""" % dna_sequence
  return s

# --------------------------------------------------------------------------
##
# @brief get SBOL for components
#
# @param component  components in SBOL
# @param rule       selected rule, RFC10 by default
#
# @returns          SBOL format string
#
# --------------------------------------------------------------------------
def get_sbol(component, rule = "RFC10"):
  content = union(rule, component)
  dna_sequence = connect(rule, content)
  sbol = formatter_v11(content, dna_sequence)
  return sbol

if __name__ == "__main__":
  rule = "RFC25"
  sbol = get_sbol(sys.argv[2:], rule)

  fp = open(sys.argv[1], "w")
  fp.write(sbol)
