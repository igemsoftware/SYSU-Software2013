##
# @file plasmid.py
# @brief get SBOL with plasmid part and type
# @author Jianhong Li
# @version 1.0
# @date 2013-08-15
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
#

import component_union
from sbol2json import format_to_json
import os
import database

# --------------------------------------------------------------------------
##
# @brief A dict to reverse DNA sequence
#
# --------------------------------------------------------------------------
reverse = {"A":"T", "T":"A", "C":"G", "G":"C", "a":"t", "t":"a", "g":"c","c":"g"}

# --------------------------------------------------------------------------
##
# @brief find file in a directory
#
# @param name  file name
# @param path  root directory to search
#
# @returns   the path to the file
#
# --------------------------------------------------------------------------
def find_file(name, path):
  for root, dirs, files in os.walk(path):
    if name in files:
      return os.path.join(root, name)

# --------------------------------------------------------------------------
##
# @brief turn DNA sequence in trans
#
# @param s  a DNA sequence
#
# @returns   DNA in trans
#
# --------------------------------------------------------------------------
def trans(s):
  ret = ''.join([reverse[i] for i in s[::-1]])
  return ret

# --------------------------------------------------------------------------
##
# @brief get SBOL with plasmid part and type
#
# @param db      database instance
# @param groups  the plasmid parts and types
# @param rule    connect rule
#
# @returns   SBOL-like json
#
# --------------------------------------------------------------------------
def plasmid_sbol(db, groups, rule = "RFC10"):
  circuit = groups["circuit"]
  copy = groups["copy"]
  components = []
  sequence = ""
  offset = 0
  plasmid_backbone = db.getPlasmidBackboneNearValue(copy)["Number"]
  circuit[-1]["sbol"].append({"type": "PlasmidBackbone", "name":
    plasmid_backbone})
  for data in circuit:
    comp_names = [cc["name"] for cc in data["sbol"]]
    file_list = [find_file(s + ".xml", ".") for s in comp_names]
    sbol = component_union.get_sbol(file_list, rule)
    sbol2 = format_to_json(sbol)
    idx = 0
    for item in sbol2["DnaComponent"]["annotations"]:
      tmp = item["SequenceAnnotation"]
      tmp["subComponent"]["DnaComponent"]["type"] = data["sbol"][idx]["type"]
      tmp["bioStart"] = str(int(tmp["bioStart"]) + offset)
      tmp["bioEnd"] = str(int(tmp["bioEnd"]) + offset)
      idx += 1
    offset += len(sbol2["DnaComponent"]["DnaSequence"]["nucleotides"])
    components += sbol2["DnaComponent"]["annotations"]
    if data["state"] == "trans":
      sequence += trans(sbol2["DnaComponent"]["DnaSequence"]["nucleotides"])
    else:
      sequence += sbol2["DnaComponent"]["DnaSequence"]["nucleotides"]
  sbol2["DnaComponent"]["annotations"] = components
  sbol2["DnaComponent"]["DnaSequence"]["nucleotides"] = sequence
  return sbol2

if __name__ == "__main__":
  db = database.SqliteDatabase()
  print plasmid_sbol(db, groups)
