import component_union
import sequence_serializer

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

def find_file(name, path):
  for root, dirs, files in os.walk(path):
    if name in files:
      return os.path.join(root, name)

def plasmid_sbol(groups, rule = "RFC10"):
  for data in groups:
    print data
    components = [cc["name"] for cc in data["sbol"]]
    file_list = [find_file(s + ".xml", ".") for s in components]
    print file_list
    content = component_union.union(rule, file_list)
    dna_sequence = component_union.connect(rule, content)
    print dna_sequence

if __name__ == "__main__":
  plasmid_sbol(groups)
