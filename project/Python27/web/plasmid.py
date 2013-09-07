import component_union
import sequence_serializer
import os

groups = [
      {
        "sbol": [
          {'type': 'Signalling', 'name': u'BBa_K266005'},
          {'type': 'RBS', 'name': 'BBa_J61104'},
          {'type': 'Coding', 'name': 'BBa_C0060', 'id': 1},
          {'type': 'RBS', 'name': 'BBa_J61104'},
          {'type': 'Coding', 'name': 'BBa_C0060', 'id': 2},
          {'type': 'RBS', 'name': 'BBa_J61104'},
          {'type': 'Coding', 'name': 'BBa_K518003', 'id': 3},
          {'type': 'RBS', 'name': 'BBa_J61104'},
          {'type': 'Coding', 'name': 'BBa_K518003', 'id': 4},
          {'type': 'Terminator', 'name': 'BBa_B0013'}],
        "state": "cis"
        },
      {
        "sbol": [
          {'type': 'Regulatory', 'name': 'BBa_I712074'},
          {'type': 'RBS', 'name':'BBa_J61104'},
          {'type': 'Coding', 'name': 'BBa_C0160', 'id': 5},
          {'type': 'Terminator', 'name': 'BBa_B0013'}
          ],
        "state": "trans"
        }
      ]

reverse = {"A":"T", "T":"A", "C":"G", "G":"C"}

def find_file(name, path):
  for root, dirs, files in os.walk(path):
    if name in files:
      return os.path.join(root, name)

def plasmid_sbol(groups, rule = "RFC10"):
  for data in groups:
    components = [cc["name"] for cc in data["sbol"]]
    file_list = [find_file(s + ".xml", ".") for s in components]
    content = component_union.union(rule, file_list)
    dna_sequence = component_union.connect(rule, content)
    sbol = component_union.formatter_v11(content, dna_sequence)
    sbol2 = sequence_serializer.format_to_json(sbol)
    print sbol2

if __name__ == "__main__":
  plasmid_sbol(groups)
