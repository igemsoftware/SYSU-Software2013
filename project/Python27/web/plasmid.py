import component_union
from sbol2json import format_to_json
import os
import database

groups = {
    "copy": 23.00,
    "circuit":[
      {
        "sbol": [
          {
            "type": "Signalling",
            "name": "BBa_K266005"
            },
          {
            "type": "RBS",
            "name": "BBa_J61104"
            },
          {
            "type": "Coding",
            "name": "BBa_C0060"
            },
          {
            "type": "RBS",
            "name": "BBa_J61104"
            },
          {
            "type": "Coding",
            "name": "BBa_C0060"
            },
          {
            "type": "RBS",
            "name": "BBa_J61104"
            },
          {
            "type": "Coding",
            "name": "BBa_K518003"
            },
          {
            "type": "RBS",
            "name": "BBa_J61104"
            },
          {
            "type": "Coding",
            "name": "BBa_K518003"
            },
          {
            "type": "Terminator",
            "name": "BBa_B0013"
            }
          ],
        "state": "cis"
        },
      {
        "sbol": [
          {
            "type": "Regulatory",
            "name": "BBa_I712074"
            },
          {
            "type": "RBS",
            "name": "BBa_J61104"
            },
          {
            "type": "Coding",
            "name": "BBa_C0160"
            },
          {
            "type": "Terminator",
            "name": "BBa_B0013"
            }
          ],
        "state": "cis"
        },
      {
          "sbol": [
            {
              "type": "Regulatory",
              "name": "BBa_I712074"
              },
            {
              "type": "RBS",
              "name": "BBa_J61104"
              },
            {
              "type": "Coding",
              "name": "BBa_C0178"
              },
            {
              "type": "RBS",
              "name": "BBa_J61104"
              },
            {
              "type": "Coding",
              "name": "BBa_C0178"
              },
            {
              "type": "Terminator",
              "name": "BBa_B0013"
              }
            ],
          "state": "cis"
          }
      ]
    }

reverse = {"A":"T", "T":"A", "C":"G", "G":"C", "a":"t", "t":"a", "g":"c","c":"g"}

def find_file(name, path):
  for root, dirs, files in os.walk(path):
    if name in files:
      return os.path.join(root, name)

def trans(s):
  ret = ''.join([reverse[i] for i in s[::-1]])
  return ret

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
    content = component_union.union(rule, file_list)
    dna_sequence = component_union.connect(rule, content)
    sbol = component_union.formatter_v11(content, dna_sequence)
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
