import os
import sequence_serializer
import component_union
import SteadyState_Rate
import random
import database
from math import log10

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
        "name": "BBa_C0060",
        "type": "Protein"
        },
      { "id"  : 3,
        "name": "activator",
        "type": "Activator"
        },
      { "id"  : 4,
        "name": "repressor",
        "type": "Repressor"
        },
      { "id"  : 5,
        "name": "BBa_C0160",
        "type": "Protein"
        },
      { "id"  : 6,
        "name": "BBa_C0178",
        "type": "Protein"
        },
      { "id"  : 7,
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
        "type": "Bound",
        },
      { "from": 3,
        "to"  : 4,
        "type": "Bound",
        },
      { "from": 3,
        "to"  : 5,
        "type": "Activator",
        "inducer": "None"
        },
      { "from": 4,
        "to"  : 6,
        "type": "Repressor",
        "inducer": "Negative"
        },
      { "from": 6,
        "to"  : 7,
        "type": "Bound",
        },

      ]
}

def find_repressor(database, item, regulator_list):
  item = database.select_row("repressor", len(regulator_list) + 1)
  regulator_list += item
  return str(item)

def find_activator(database, item, regulator_list):
  item = database.select_row("activator", len(regulator_list) + 1)
  regulator_list += item
  return str(item)

def find_promoter(database, activator = None, repressor = None):
  if activator is not None:
    return database.find_promoter_with_activator(activator)
  else:
    return database.find_promoter_with_repressor(repressor)

def find_file(name, path):
    for root, dirs, files in os.walk(path):
        if name in files:
            return os.path.join(root, name)


def pre_work(part):
  return [prom_name, rbs_name, part["name"], term_name]

def bind(protein1, protein2):
  l1 = len(protein1) - 1
  l2 = len(protein2) - 1
  return [prom_name] + protein1[1:l1] + protein2[1:l2] + [term_name]

def find_bound_src(i, bound_list):
  if bound_list[i] != i:
    bound_list[i] = find_bound_src(bound_list[i], bound_list)
  return bound_list[i]

def work(data, database):
  groups = {}
  part_list = {}
  bound_list = {}
  pro_pos = {}
  rev_bound_list = {}
  regulator_list = []
  # Initialization
  for part in data["part"]:
    idx = part["id"]
    groups[idx] = pre_work(part)
    part_list[idx] = part["name"]
    bound_list[idx] = idx
    pro_pos[idx] = 2

  # combine bound link
  for link in data["link"]:
    if link["type"] == "Bound":
      groups[link["to"]] = bind(groups[link["from"]], groups[link["to"]])
      offset = len(groups[link["from"]]) - 2
      for p in data["part"]:
        idx = p["id"]
        if bound_list[idx] == link["to"]:
          pro_pos[idx] += offset
        if bound_list[idx] == link["from"]:
          bound_list[idx] = link["to"]
      bound_list[link["from"]] = find_bound_src(link["to"], bound_list)
      rev_bound_list[link["to"]] = link["from"]
      del groups[link["from"]]

  # replace repressor with exact component
  for elem in groups:
    for i in xrange(len(groups[elem])):
      if groups[elem][i] == "repressor":
        groups[elem][i] = find_repressor(database, groups[elem][i],\
            regulator_list)
      if groups[elem][i] == "activator":
        groups[elem][i] = find_activator(database, groups[elem][i],\
            regulator_list)

  for i in bound_list:
    bound_list[i] = find_bound_src(bound_list[i], bound_list)
  for link in data["link"]:
    if link["type"] == "Bound":
      continue
    next_grp = bound_list[link["from"]]
    for p in data["part"]:
      if p["id"] == link["from"]:
        cur = p
        break
    if cur["type"] == "Repressor":
      groups[next_grp][0] = find_promoter(db, repressor=cur["name"])["Number"]
    if cur["type"] == "Activator":
      groups[next_grp][0] = find_promoter(db, activator=cur["name"])["Number"]
  return (groups, bound_list, pro_pos)

def get_start_pos(groups):
  start_pos = []
  for i in groups:
    if groups[i]["from"] == -1:
      start_pos.append(i)
  return start_pos

def dump_sbol(network, database):
  data, r_list, a_list = work(network, database)
  sbol = []
  rule = "RFC10"
  for i in data:
    data[i] = [find_file(s + ".xml", ".") for s in data[i]]
    content = component_union.union(rule, data[i])
    dna_sequence = component_union.connect(rule, content)
    sbol.append(sequence_serializer.format_to_json(component_union.formatter_v11(content, dna_sequence)))
  return sbol

def get_pro_info(database, protein_idx, groups, grp_id, regulator, backbone = "pSB1AT3"):
  # TODO where is K1?
  ret = {}
  cur_group = groups[grp_id]["sbol"]
  link_type = groups[grp_id]["type"]
  if link_type == "Positive":
    regulator_info = database.select_with_name("activator", regulator)
  elif link_type == "Negative":
    regulator_info = database.select_with_name("repressor", regulator)
  else:
    regulator_info = None
  promoter_info= database.select_with_name("promoter", cur_group[0]["name"])
  rbs_info= database.select_with_name("RBS", cur_group[protein_idx - 1]["name"])
  plasmid_backbone_info = database.select_with_name("plasmid_backbone", backbone)
  ret["grp_id"] = grp_id
  ret["name"] = cur_group[protein_idx]["name"]
  ret["PoPS"] = promoter_info[get_type_of_promoter(link_type)] * 100
  ret["RiPS"] = rbs_info["MPRBS"] * 100
  ret["copy"] = plasmid_backbone_info["CopyNumber"]
  if regulator_info is not None:
    ret["K1"] = log10(regulator_info["K1"])
  else:
    ret["K1"] = None
  ret["repress_rate"] = -1
  ret["induce_rate"] = -1
  ret["concen"] = 0.1
  ret["pos"] = protein_idx
  # following arguments are DEPRECATED
  return ret

def get_index_in_group(pro_name, group):
  for i in range(len(group)):
    if group[i]["name"] == pro_name:
      return i

def update_proteins_repress(database, gene_circuit):
  repress_rates = SteadyState_Rate.ActRepRate(gene_circuit, database)
  # induce_rates = SteadyState_Rate.CorepIndRate(gene_circuit, database)
  print repress_rates
  for i in repress_rates:
    pro = gene_circuit["proteins"][i]
    gene_circuit["proteins"][i]["before_regulated"] =\
        pro["PoPS"] * pro["RiPS"] * pro["copy"]
    gene_circuit["proteins"][i]["repress_rate"] = log10(repress_rates[i])
    # gene_circuit["proteins"][i]["induce_rate"] = log10(induce_rates[i])

def get_graph(link):
  ret = {}
  for item in link:
    if item["type"] != "Bound":
      ret[item["to"]] = item["from"]
  return ret

def get_graph_type(link):
  link_type = {}
  inducer_type = {}
  for item in link:
    if item["type"] == "Bound":
      continue
    if item["type"] == "Repressor":
      link_type[item["to"]] = "Negative"
    elif item["type"] == "Activator":
      link_type[item["to"]] = "Positive"
    if item["inducer"] == "Positive":
      inducer_type[item["to"]] = "Corepressor"
    else:
      inducer_type[item["to"]] = "Inducer"
  return link_type, inducer_type

def dump_group(network, database):
  graph = get_graph(network["link"])
  link_type, inducer_type = get_graph_type(network["link"])
  data, b_list, pro_pos = work(network, database)
  print data
  groups = {}
  proteins = {}
  plasmid = []

  # get group info
  for i in data:
    grp = []
    # get name and type of group member
    for elem in data[i]:
      xml_file = find_file(elem + ".xml", ".")
      grp.append({"name": elem, "type": component_union.get_rule(xml_file)})
    for idx in range(1, len(grp) - 1, 2):
      grp[idx]["type"] = "RBS"
    grp[0]["type"] = "Promoter"
    grp[-1]["type"] = "Terminator"

    # get link type and inducer type
    prev = -1
    l_type = "Constitutive"
    i_type = "None"
    for j in b_list:
      if b_list[j] == i and j in graph:
        prev = graph[j]
        l_type = link_type[j]
        i_type = inducer_type[j]
        break
    groups[i] = {"sbol":grp, "state": "cis", "type": l_type,\
        "corep_ind_type": i_type, "from": prev, "to": []}
    plasmid.append(i)

  # get next nodes of a group
  for i in graph:
    groups[b_list[graph[i]]]["to"].append(i)
  for i in b_list:
    cur_group = groups[b_list[i]]
    # add id of proteins in a group
    groups[b_list[i]]["sbol"][pro_pos[i]]["id"] = i

    # get protein info
    ## get coresponding repressor
    prev_node = cur_group["from"]
    if prev_node != -1:
      prev_grp = groups[b_list[prev_node]]
      regulator = prev_grp["sbol"][pro_pos[prev_node]]["name"]
    else:
      regulator = None
    ## get inducer of a link
    if cur_group["corep_ind_type"] != "None" and cur_group["type"] == "Positive":
      groups[b_list[i]]["corep_ind"] = \
      database.find_inducer_with_activator(regulator, cur_group["corep_ind_type"])
    if cur_group["corep_ind_type"] != "None" and cur_group["type"] == "Negative":
      groups[b_list[i]]["corep_ind"] = \
      database.find_inducer_with_repressor(regulator, cur_group["corep_ind_type"])
    ## get protein info
    proteins[i] = get_pro_info(database, pro_pos[i], groups, b_list[i],\
        regulator)

  # do not display regulation protein
  for part in network["part"]:
    pro_id = part["id"]
    grp_id = proteins[pro_id]["grp_id"]
    pos = proteins[pro_id]["pos"]
    proteins[pro_id]["display"] = str(part["type"] == "Protein")
    groups[grp_id]["sbol"][pos]["type"] = part["type"]


  # update_proteins_repress(database, proteins, groups)
  gene_circuit = {"groups": groups, "proteins": proteins, "plasmids": [plasmid]}
  update_proteins_repress(database, gene_circuit)
  return gene_circuit

def get_type_of_promoter(p_type):
  if p_type == "Constitutive":
    return "PoPS"
  elif p_type == "Negative":
    return "MPPromoter"
  elif p_type == "Positive":
    return "LeakageRate"

def js_formatter(gene_circuit):
  new_proteins = {}
  for i in gene_circuit["proteins"]:
    new_proteins[int(i)] = gene_circuit["proteins"][i]
  gene_circuit["proteins"] = new_proteins

  new_groups = {}
  for i in gene_circuit["groups"]:
    new_groups[int(i)] = gene_circuit["groups"][i]
  gene_circuit["groups"] = new_groups
  return gene_circuit

def update_controller(db, update_info):
  gene_circuit = js_formatter(update_info["gene_circuit"])
  # regulator_list = [name for name in gene_circuit["proteins"]]
  regulator_list = [i["name"] for i in gene_circuit["proteins"].values() if
      i["display"] == 'False']
  detail = update_info["detail"]
  pro_id = detail["pro_id"]
  protein = gene_circuit["proteins"][pro_id]
  pro_name = protein["name"]
  pro_idx = protein["pos"]
  grp_id = protein["grp_id"]
  group = gene_circuit["groups"][grp_id]
  if detail["type"] == "RiPS":
    rbs_value = float(detail["new_value"]) / 100
    # idx = get_index_in_group(pro_name, group["sbol"])
    bestRBS = db.getRBSNearValue(rbs_value)
    gene_circuit["groups"][grp_id]["sbol"][pro_idx - 1]["name"] = bestRBS["Number"]
    gene_circuit["proteins"][pro_id]["RiPS"] = bestRBS["MPRBS"] * 100

  elif detail["type"] == "copy":
    for plasmid in gene_circuit["plasmids"]:
      for item in plasmid:
        if item == grp_id:
          updated_plasmid = plasmid
          break
    ideal_value = detail["new_value"]
    best_value = db.getPlasmidBackboneNearValue(ideal_value)["CopyNumber"]
    for i in gene_circuit["proteins"]:
      if gene_circuit["proteins"][i]["grp_id"] in updated_plasmid:
        gene_circuit["proteins"][i]["copy"] = best_value

  elif detail["type"] == "PoPS" or detail["type"] == "K1":
    link_type = group["type"]
    p_type = get_type_of_promoter(link_type)
    # pre_work, find best_promoter and best_repressor
    if detail["type"] == "PoPS":
      promoter_value = float(detail["new_value"]) / 100
      #select best promoter according to link type
      if link_type == "Positive":
        best_promoter = db.getActivatedPromoterNearValue(promoter_value,\
            regulator_list, link_type, p_type)
        best_regulator = db.find_activator_with_promoter(best_promoter["Number"])
        regulator_value = log10(best_regulator["K1"])
      elif link_type == "Negative":
        best_promoter = db.getRepressedPromoterNearValue(promoter_value,\
            regulator_list, link_type, p_type)
        best_regulator = db.find_repressor_with_promoter(best_promoter["Number"])
        regulator_value = log10(best_regulator["K1"])
      else:
        best_promoter = db.getRepressedPromoterNearValue(promoter_value,\
            [], link_type, p_type)
    else:
      regulator_value = pow(10, float(detail["new_value"]))
      if link_type == "Positive":
        best_regulator = db.getActivatorNearValue(regulator_value, regulator_list)
        best_promoter = find_promoter(database, activator=best_regulator["Number"])
        promoter_value = best_promoter[p_type]
      else:
        best_regulator = db.getRepressorNearValue(regulator_value, regulator_list)
        best_promoter = find_promoter(db, repressor=best_regulator["Number"])
        promoter_value = best_promoter[p_type]

    # update corresponding repressor
    prev_node = group["from"]
    regulator = None
    # update related promoters
    if detail["type"] == "PoPS":
      gene_circuit["groups"][grp_id]["sbol"][0]["name"] = best_promoter["Number"]
      for j in range(2, len(group["sbol"]), 2):
        pro2_id = gene_circuit["groups"][grp_id]["sbol"][j]["id"]
        gene_circuit["proteins"][pro2_id]["PoPS"] = best_promoter[p_type] * 100

    if prev_node != -1:
      prev_grp = gene_circuit["proteins"][prev_node]["grp_id"]
      prev_pos = gene_circuit["proteins"][prev_node]["pos"]
      gene_circuit["proteins"][prev_node]["K1"] = regulator_value
      gene_circuit["proteins"][prev_node]["name"] = best_regulator["Number"]
      gene_circuit["groups"][prev_grp]["sbol"][prev_pos]["name"] = best_regulator["Number"]

      # update related promoters
      for i in gene_circuit["groups"]:
        if gene_circuit["groups"][i]["from"] == prev_node:
          gene_circuit["groups"][i]["sbol"][0]["name"] = best_promoter["Number"]
          for j in range(2, len(gene_circuit["groups"][i]["sbol"]), 2):
            pro2_id = gene_circuit["groups"][i]["sbol"][j]["id"]
            gene_circuit["proteins"][pro2_id]["PoPS"] = best_promoter[p_type] * 100

  update_proteins_repress(db, gene_circuit)
  return gene_circuit

if __name__ == "__main__":
  db = database.SqliteDatabase()
  sbol=dump_group(data, db)
  print sbol
  update_info = {u'detail': {u'new_value': 60, u'type': u'PoPS', u'pro_id': 5},
      u'gene_circuit': {'proteins': {1: {'RiPS': 11.49, 'name': 'BBa_C0060',
        'before_regulated': 49613.245500000005, 'concen': 0.1, 'grp_id': 4,
        'pos': 2, 'PoPS': 59.150000000000006, 'repress_rate': 0.0, 'K1': None,
        'induce_rate': -1, 'copy': 73.0, 'display': 'True'}, 2: {'RiPS': 11.49,
          'name': 'BBa_C0060', 'before_regulated': 49613.245500000005, 'concen':
          0.1, 'grp_id': 4, 'pos': 4, 'PoPS': 59.150000000000006,
          'repress_rate': 0.0, 'K1': None, 'induce_rate': -1, 'copy': 73.0,
          'display': 'True'}, 3: {'RiPS': 11.49, 'name': 'BBa_K518003',
            'before_regulated': 49613.245500000005, 'concen': 0.1, 'grp_id': 4,
            'pos': 6, 'PoPS': 59.150000000000006, 'repress_rate': 0.0, 'K1':
            None, 'induce_rate': -1, 'copy': 73.0, 'display': 'False'}, 4:
          {'RiPS': 11.49, 'name': 'BBa_K142002', 'before_regulated':
            49613.245500000005, 'concen': 0.1, 'grp_id': 4, 'pos': 8, 'PoPS':
            59.150000000000006, 'repress_rate': 0.0, 'K1': None, 'induce_rate':
            -1, 'copy': 73.0, 'display': 'False'}, 5: {'RiPS': 11.49, 'name':
              'BBa_C0160', 'before_regulated': 28711.097099999995, 'concen':
              0.1, 'grp_id': 5, 'pos': 2, 'PoPS': 34.23, 'repress_rate':
              0.4428135474975083, 'K1': -2.4287510356503725, 'induce_rate': -1,
              'copy': 73.0, 'display': 'True'}, 6: {'RiPS': 11.49, 'name':
                'BBa_C0178', 'before_regulated': 79590.88530000001, 'concen':
                0.1, 'grp_id': 7, 'pos': 2, 'PoPS': 94.89, 'repress_rate':
                -0.44281354749750707, 'K1': -2.451703061628793, 'induce_rate':
                -1, 'copy': 73.0, 'display': 'True'}, 7: {'RiPS': 11.49, 'name':
                  'BBa_C0178', 'before_regulated': 79590.88530000001, 'concen':
                  0.1, 'grp_id': 7, 'pos': 4, 'PoPS': 94.89, 'repress_rate':
                  -0.44281354749750707, 'K1': -2.451703061628793, 'induce_rate':
                  -1, 'copy': 73.0, 'display': 'True'}}, 'plasmids': [[4, 5,
                    7]], 'groups': {4: {'from': -1, 'state': 'cis',
                      'corep_ind_type': 'None', 'to': [5, 6], 'sbol': [{'type':
                        'Promoter', 'name': u'BBa_M13105'}, {'type': 'RBS',
                          'name': 'BBa_J61104'}, {'type': 'Protein', 'name':
                            'BBa_C0060', 'id': 1}, {'type': 'RBS', 'name':
                              'BBa_J61104'}, {'type': 'Protein', 'name':
                                'BBa_C0060', 'id': 2}, {'type': 'RBS', 'name':
                                  'BBa_J61104'}, {'type': 'Activator', 'name':
                                    'BBa_K518003', 'id': 3}, {'type': 'RBS',
                                      'name': 'BBa_J61104'}, {'type':
                                        'Repressor', 'name': 'BBa_K142002',
                                        'id': 4}, {'type': 'Terminator', 'name':
                                          'BBa_B0013'}], 'type':
                                        'Constitutive'}, 5: {'from': 3, 'state':
                                          'cis', 'corep_ind_type': 'Inducer',
                                          'to': [], 'sbol': [{'type':
                                            'Promoter', 'name': 'BBa_I712074'},
                                            {'type': 'RBS', 'name':
                                              'BBa_J61104'}, {'type': 'Protein',
                                                'name': 'BBa_C0160', 'id': 5},
                                              {'type': 'Terminator', 'name':
                                                'BBa_B0013'}], 'corep_ind':
                                              'BBa_P0140', 'type': 'Positive'},
                                        7: {'from': 4, 'state': 'cis',
                                          'corep_ind_type': 'Inducer', 'to': [],
                                          'sbol': [{'type': 'Promoter', 'name':
                                            'BBa_I712074'}, {'type': 'RBS',
                                              'name': 'BBa_J61104'}, {'type':
                                                'Protein', 'name': 'BBa_C0178',
                                                'id': 6}, {'type': 'RBS',
                                                  'name': 'BBa_J61104'},
                                                {'type': 'Protein', 'name':
                                                  'BBa_C0178', 'id': 7},
                                                {'type': 'Terminator', 'name':
                                                  'BBa_B0013'}], 'corep_ind':
                                                'BBa_P0140', 'type':
                                                'Negative'}}}}
  print update_controller(db, update_info)
