import component_union
import sequence_serializer
import os

groups = [
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

reverse = {"A":"T", "T":"A", "C":"G", "G":"C", "a":"t", "t":"a", "g":"c","c":"g"}

def find_file(name, path):
  for root, dirs, files in os.walk(path):
    if name in files:
      return os.path.join(root, name)

def trans(s):
  ret = ''.join([reverse[i] for i in s[::-1]])
  return ret

def plasmid_sbol(groups, rule = "RFC10"):
  ret = []
  sequence = ""
  offset = 0
  for data in groups:
    components = [cc["name"] for cc in data["sbol"]]
    file_list = [find_file(s + ".xml", ".") for s in components]
    content = component_union.union(rule, file_list)
    dna_sequence = component_union.connect(rule, content)
    sbol = component_union.formatter_v11(content, dna_sequence)
    sbol2 = sequence_serializer.format_to_json(sbol)
    for item in sbol2["DnaComponent"]["annotations"]:
      tmp = item["SequenceAnnotation"]
      tmp["bioStart"] = str(int(tmp["bioStart"]) + offset)
      tmp["bioEnd"] = str(int(tmp["bioEnd"]) + offset)
    offset += len(sbol2["DnaComponent"]["DnaSequence"]["nucleotides"])
    ret += sbol2["DnaComponent"]["annotations"]
    if data["state"] == "trans":
      sequence += trans(sbol2["DnaComponent"]["DnaSequence"]["nucleotides"])
    else:
      sequence += sbol2["DnaComponent"]["DnaSequence"]["nucleotides"]
  sbol2["DnaComponent"]["annotations"] = ret
  sbol2["DnaComponent"]["DnaSequence"]["nucleotides"] = sequence
  return sbol2

if __name__ == "__main__":
  print plasmid_sbol(groups)
