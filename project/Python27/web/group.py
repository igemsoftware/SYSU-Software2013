import os
import sequence_serializer
import component_union
import random
import modeling

prom_name = "BBa_I712074"
rbs_name = "BBa_J61104"
term_name = "BBa_B0013"


data = {
    "part": [
      { "id"  : 1,
        "name": "BBa_C0060",
        "type": "Protein"
        },
      { "id"  : 2,
        "name": "repressor",
        "type": "Repressor"
        },
      { "id"  : 3,
        "name": "BBa_C0160",
        "type": "Protein"
        },
      { "id"  : 4,
        "name": "BBa_C0178",
        "type": "Protein"
        }

      ],
    "link": [
      { "from": 1,
        "to"  : 2,
        "type": "Bound",
        },
      { "from": 2,
        "to"  : 3,
        "type": "repressor_protein",
        },
      { "from": 2,
        "to"  : 4,
        "type": "repressor_protein",
        },

      ]
}

def find_repressor(item, repressor_list, database):
  if item[3] == "repressor":
    item[3] = database.select_row("repressor", len(repressor_list) + 1)
    repressor_list += item[3]
  if item[-2] == "repressor":
    item[-2] = database.select_row("repressor", len(repressor_list) + 1)
    repressor_list += item[-2]
  return item

def find_activator(item, activator_list, database):
  if item[3] == "activator":
    item[3] = database.select_row("activator", len(activator_list) + 1)
    activator_list += item[3]
  if item[-2] == "activator":
    item[-2] = database.select_row("activator", len(activator_list) + 1)
    activator_list += item[-2]
  return item

def find_promoter(database, activator = None, repressor = None):
  if activator is not None:
    return database.find_promoter(activator = activator)
  else:
    return database.find_promoter(repressor = repressor)

def find_file(name, path):
    for root, dirs, files in os.walk(path):
        if name in files:
            return os.path.join(root, name)


def pre_work(part):
  return [prom_name, rbs_name, part["name"], term_name]

def bind(protein1, protein2):
  return [prom_name, rbs_name, protein1, rbs_name, protein2, term_name]

def activate(database, from_part, to_part):
  ret = to_part
  ret[0] = find_promoter(database, activator = from_part[-2])
  return ret

def repress(database, from_part, to_part):
  ret = to_part
  ret[0] = find_promoter(database, repressor = from_part[-2])
  return ret


def work(data, database):
  groups = {}
  part_list = {}
  bound_list = {}
  repressor_list = []
  activator_list = []
  for part in data["part"]:
    groups[part["id"]] = pre_work(part)
    part_list[part["id"]] = part["name"]
  for link in data["link"]:
    if link["type"] == "Bound":
      groups[link["from"]] = bind(part_list[link["from"]], part_list[link["to"]])
      bound_list[link["to"]] = link["from"]
      del groups[link["to"]]
  for elem in groups:
    groups[elem] = find_repressor(groups[elem], repressor_list, database)
  #groups = [find_activator(item, activator_list, database) for item in groups]
  for link in data["link"]:
    # TODO: inducer
    if link["from"] not in groups:
      link["from"] = bound_list[link["from"]]
    if link["to"] not in groups:
      link["to"] = bound_list[link["to"]]

    if link["type"] == "repressor_protein":
      groups[link["to"]] = repress(database, groups[link["from"]], groups[link["to"]])
    if link["type"] == "activator_protein":
      groups[link["to"]] = activate(database, groups[link["from"]], groups[link["to"]])
  return groups

def dump_sbol(network, database):
  data = work(network, database)
  sbol = []
  rule = "RFC10"
  for i in data:
    data[i] = [find_file(s + ".xml", ".") for s in data[i]]
    content = component_union.union(rule, data[i])
    dna_sequence = component_union.connect(rule, content)
    sbol.append(sequence_serializer.format_to_json(component_union.formatter_v11(content, dna_sequence)))
  return sbol
"""
var genecircuitData = {
	proteins: [
		{
			PoPs: 60,
			RiPs: 52,
			copy: 30,
			repress_rate: 15,
			induce_rate: 66,
			before_regulated: 53,
			after_regulated: 30,
			after_induced: 20,
		},
		{
			PoPs: 6,
			RiPs: 50,
			copy: 71,
			repress_rate: 15,
			induce_rate: 66,
			before_regulated: 25,
			after_regulated: 53,
			after_induced: 20,
		},
		{
			PoPs: 46,
			RiPs: 95,
			copy: 71,
			repress_rate: 45,
			induce_rate: 6,
			before_regulated: 51,
			after_regulated: 23,
			after_induced: 20,
		},
	],
	plasmids: [
		[{sbol:[{'type': 'Regulatory', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0060'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_K518003'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'trans'}, {sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0160'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'cis'},{sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0178'}, {'type': 'Terminator', 'name': 'BBa_B0013'}],state:'trans'}],
		[{sbol:[{'type': 'Regulatory', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0060'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_K518003'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'trans'}, {sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0160'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], state:'cis'},{sbol:[{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0178'}, {'type': 'Terminator', 'name': 'BBa_B0013'}],state:'trans'}],
	]
}
"""

def get_pro_info(database, protein_idx, group, grp_id, backbone = "pSB1AT3"):
  ret = {}
  ret["name"] = group[protein_idx]
  ret["grp_id"] = grp_id
  promoter_info= database.select_with_name("promoter", group[0])
  rbs_info= database.select_with_name("RBS", group[protein_idx - 1])
  plasmid_backbone_info = database.select_with_name("plasmid_backbone", backbone)
  ret["PoPs"] = promoter_info["MPPromoter"] * 100
  ret["RiPs"] = rbs_info["MPRBS"] * 100
  ret["copy"] = plasmid_backbone_info["CopyNumber"] * 100
  ret["repress_rate"] = 0
  ret["induce_rate"] = 0
  ret["before_regulated"] = 0
  ret["after_regulated"] = 0
  ret["after_induced"] = 0
  return ret

def get_graph(link):
  ret = {}
  for item in link:
    ret[item["to"]] = item["from"]
  return ret

def dump_group(network, database):
  graph = get_graph(network["link"])
  data = work(network, database)
  print data
  plasmids = []
  proteins = []
  print data
  for i in data:
    proteins.append(get_pro_info(database, 2, data[i], i))
    if len(data[i]) == 6:
      proteins.append(get_pro_info(database, 4, data[i], i))
    grp = []
    for elem in data[i]:
      xml_file = find_file(elem + ".xml", ".")
      grp.append({"name": elem, "type": component_union.get_rule(xml_file)})
    if i in graph:
      prev = graph[i]
    else:
      prev = -1
    plasmids.append({"id": i, "sbol":grp, "state": "cis", "from": prev})
  return {"plasmids": plasmids, "proteins": proteins}

'''	sbol_dict is the sbol create by this python program
	rbs_value is the new value that user want for the rbs
	proteinName is the protein that the user want to change
'''
def changeRBS_MPRBS(database,sbol_dict,rbs_value,proteinName):
  bestRBS= database.getRBSNearValue(rbs_value)
  for item in sbol_dict:
    for i in range(0,len(item)):
      if item[i]['name']==proteinName:
        if item[i-1]['type']=='RBS':
          item[i-1]['name']=bestRBS['Number']
  return sbol_dict

if __name__ == "__main__":
  import database
  db = database.SqliteDatabase()
  sbol=dump_group(data, db)
  print sbol
  print changeRBS_MPRBS(db,sbol,0.97,data["part"][2]['name'])
