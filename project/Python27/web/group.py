import os
from sbol2json import format_to_json
import component_union
import SteadyState_Rate
import random
import database
from math import log10

prom_name = "BBa_I712074"
rbs_name = "BBa_J61104"
term_name = "BBa_B0013"


data = {u'part': [{u'type': u'Protein', u'id': u'37e604d1-9267-43ff-d6af-109336b65d47', u'name': u'BBa_I752001'}, {u'type': u'Protein', u'id': u'd9904b7a-12ac-29c7-6a02-2b2f2a27ffb0', u'name': u'BBa_J58104'}, {u'type': u'Protein', u'id': u'50cd4c9b-6f30-34b4-bbd6-507de935c5ec', u'name': u'BBa_K091002'}, {u'type': u'Repressor', u'id': u'ab2ab024-8165-afb7-58d0-12481611d12a', u'name': u'Repressor'}], u'link': [{u'to': u'ab2ab024-8165-afb7-58d0-12481611d12a', u'from': u'50cd4c9b-6f30-34b4-bbd6-507de935c5ec', u'inducer': u'none', u'type': u'Bound'}, {u'to': u'37e604d1-9267-43ff-d6af-109336b65d47', u'from': u'ab2ab024-8165-afb7-58d0-12481611d12a', u'inducer': u'none', u'type': u'Repressor'}, {u'to': u'50cd4c9b-6f30-34b4-bbd6-507de935c5ec', u'from': u'd9904b7a-12ac-29c7-6a02-2b2f2a27ffb0', u'inducer': u'none', u'type': u'Bound'}]}
#data = {u'part': [{u'type': u'Protein', u'id': 1, u'name': u'BBa_C0060'}, {u'type': u'Protein', u'id': 2, u'name': u'BBa_C0060'}, {u'type': u'Activator', u'id': 3, u'name': u'Activator'}, {u'type': u'Repressor', u'id': 4, u'name': u'Repressor'}, {u'type': u'Protein', u'id': 5, u'name': u'BBa_C0160'}, {u'type': u'Protein', u'id': 6, u'name': u'BBa_C0178'}, {u'type': u'Protein', u'id': 7, u'name': u'BBa_C0178'}], u'link': [{u'to': 2, u'from': 1, u'type': u'Bound'}, {u'to': 3, u'from': 2, u'type': u'Bound'}, {u'to': 4, u'from': 3, u'type': u'Bound'}, {u'to': 5, u'from': 3, u'inducer': u'None', u'type': u'Activator'}, {u'to': 6, u'from': 4, u'inducer': u'Positive', u'type': u'Repressor'}, {u'to': 7, u'from': 6, u'type': u'Bound'}]}
#data = {
    #"part": [
      #{ "id"  : 1,
        #"name": "BBa_C0060",
        #"type": "Protein"
        #},
      #{ "id"  : 2,
        #"name": "BBa_C0060",
        #"type": "Protein"
        #},
      #{ "id"  : 3,
        #"name": "Activator",
        #"type": "Activator"
        #},
      #{ "id"  : 4,
        #"name": "Repressor",
        #"type": "Repressor"
        #},
      #{ "id"  : 5,
        #"name": "BBa_C0160",
        #"type": "Protein"
        #},
      #{ "id"  : 6,
        #"name": "BBa_C0178",
        #"type": "Protein"
        #},
      #{ "id"  : 7,
        #"name": "BBa_C0178",
        #"type": "Protein"
        #}

      #],
    #"link": [
      #{ "from": 2,
        #"to"  : 4,
        #"type": "Bound",
        #},
      #{ "from": 1,
        #"to"  : 2,
        #"type": "Bound",
        #},
      #{ "from": 2,
        #"to"  : 3,
        #"type": "Bound",
        #},
      #{ "from": 3,
        #"to"  : 5,
        #"type": "Activator",
        #"inducer": "None"
        #},
      #{ "from": 4,
        #"to"  : 6,
        #"type": "Repressor",
        #"inducer": "Positive"
        #},
      #{ "from": 6,
        #"to"  : 7,
        #"type": "Bound",
        #},

      #]
#}

def find_repressor(database, item, regulator_list):
  item = database.select_row("repressor", len(regulator_list) + 1)
  regulator_list += item
  return str(item)

def find_activator(database, item, regulator_list):
  item = database.select_row("activator", len(regulator_list) + 1)
  regulator_list += item
  return str(item)

def find_promoter(db, activator = None, repressor = None):
  if activator is not None:
    return db.find_promoter_with_activator(activator)
  else:
    return db.find_promoter_with_repressor(repressor)

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
      u = bound_list[link["from"]]
      v = bound_list[link["to"]]
      if u == v:
        continue
      groups[v] = bind(groups[u], groups[v])
      offset = len(groups[u]) - 2
      for p in data["part"]:
        idx = p["id"]
        if bound_list[idx] == v:
          pro_pos[idx] += offset
        if bound_list[idx] == u:
          bound_list[idx] = v
      bound_list[u] = v
      rev_bound_list[v] = u
      del groups[u]

  # replace repressor with exact component
  for elem in groups:
    for i in xrange(len(groups[elem])):
      if groups[elem][i] == "Repressor":
        groups[elem][i] = find_repressor(database, groups[elem][i],\
            regulator_list)
      if groups[elem][i] == "Activator":
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
      groups[next_grp][0] = find_promoter(database, repressor=cur["name"])["Number"]
    if cur["type"] == "Activator":
      groups[next_grp][0] = find_promoter(database, activator=cur["name"])["Number"]
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
    data_sbol = component_union.get_sbol(file_list, rule)
    sbol.append(format_to_json(data_sbol))
    #content = component_union.union(rule, data[i])
    #dna_sequence = component_union.connect(rule, content)
    #sbol.append(format_to_json(component_union.formatter_v11(content, dna_sequence)))
  return sbol

def get_pro_info(database, protein_idx, groups, grp_id, regulator, backbone = "pSB1AT3"):
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
  ret["PoPS"] = promoter_info[get_type_of_promoter(link_type)]
  ret["RiPS"] = rbs_info["MPRBS"]
  ret["copy"] = plasmid_backbone_info["CopyNumber"]
  if regulator_info is not None:
    ret["K1"] = log10(regulator_info["K1"])
  else:
    ret["K1"] = None
  ret["repress_rate"] = -1
  ret["induce_rate"] = -1
  if groups[grp_id]["corep_ind_type"] == "None":
    ret["concen"] = None
  else:
    ret["concen"] = 0.1

  ret["pos"] = protein_idx
  return ret

def get_index_in_group(pro_name, group):
  for i in range(len(group)):
    if group[i]["name"] == pro_name:
      return i

def update_proteins_repress(database, gene_circuit):
  repress_rates = SteadyState_Rate.ActRepRate(gene_circuit, database)
  induce_rates = SteadyState_Rate.CorepIndRate(gene_circuit, database)
  for i in repress_rates:
    pro = gene_circuit["proteins"][i]
    gene_circuit["proteins"][i]["before_regulated"] =\
        pro["PoPS"] * pro["RiPS"] * pro["copy"]
    gene_circuit["proteins"][i]["repress_rate"] = log10(repress_rates[i])
    gene_circuit["proteins"][i]["induce_rate"] = log10(induce_rates[i])

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
      inducer_type[item["to"]] = "Inducer"
    elif item["inducer"] == "Negative":
      inducer_type[item["to"]] = "Corepressor"
    else:
      inducer_type[item["to"]] = "None"
  return link_type, inducer_type

def dump_group(network, database):
  graph = get_graph(network["link"])
  link_type, inducer_type = get_graph_type(network["link"])
  data, b_list, pro_pos = work(network, database)
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
    corep_ind_type = cur_group["corep_ind_type"]
    if corep_ind_type != "None" and cur_group["type"] == "Positive":
      inducer = database.find_inducer_with_activator(regulator, corep_ind_type)
      groups[b_list[i]]["corep_ind"] = inducer["Number"]
    if corep_ind_type != "None" and cur_group["type"] == "Negative":
      inducer = database.find_inducer_with_activator(regulator, corep_ind_type)
      groups[b_list[i]]["corep_ind"] = inducer["Number"]
    ## get protein info
    proteins[i] = get_pro_info(database, pro_pos[i], groups, b_list[i],\
        regulator)

  # do not display regulation protein
  for part in network["part"]:
    pro_id = part["id"]
    grp_id = proteins[pro_id]["grp_id"]
    pos = proteins[pro_id]["pos"]
    proteins[pro_id]["display"] = part["type"] == "Protein"
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
  return gene_circuit
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
      not i["display"]]
  detail = update_info["detail"]
  pro_id = detail["pro_id"]
  protein = gene_circuit["proteins"][pro_id]
  pro_name = protein["name"]
  pro_idx = protein["pos"]
  grp_id = protein["grp_id"]
  group = gene_circuit["groups"][grp_id]
  if detail["type"] == "RiPS":
    rbs_value = float(detail["new_value"])
    # idx = get_index_in_group(pro_name, group["sbol"])
    bestRBS = db.getRBSNearValue(rbs_value)
    gene_circuit["groups"][grp_id]["sbol"][pro_idx - 1]["name"] = bestRBS["Number"]
    gene_circuit["proteins"][pro_id]["RiPS"] = bestRBS["MPRBS"]

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
      promoter_value = float(detail["new_value"])
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
        best_promoter = find_promoter(db, activator=best_regulator["Number"])
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
        gene_circuit["proteins"][pro2_id]["PoPS"] = best_promoter[p_type]

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
            gene_circuit["proteins"][pro2_id]["PoPS"] = best_promoter[p_type]

  update_proteins_repress(db, gene_circuit)
  return gene_circuit

if __name__ == "__main__":
  db = database.SqliteDatabase()
  sbol=dump_group(data, db)
  print sbol
  update_info = {u'detail': {u'new_value': 72.549, u'type': u'copy', u'pro_id': u'3685f39b-40b4-6249-e3a4-77f2016a7001'}, u'gene_circuit': {u'proteins': {u'0ec6c528-fe70-4ed0-e14f-6862c0211b12': {u'RiPS': 0.1149, u'name': u'BBa_K518003', u'repress_rate': 0, u'concen': None, u'grp_id': u'0ec6c528-fe70-4ed0-e14f-6862c0211b12', u'pos': 4, u'PoPS': 0.6069, u'before_regulated': 5, u'K1': None, u'induce_rate': 0, u'copy': 73, u'display': False}, u'3685f39b-40b4-6249-e3a4-77f2016a7001': {u'RiPS': 0.1149, u'name': u'BBa_J58104', u'repress_rate': 0, u'concen': None, u'grp_id': u'3685f39b-40b4-6249-e3a4-77f2016a7001', u'pos': 2, u'PoPS': 0.9489, u'before_regulated': 8, u'K1': -2.4288, u'induce_rate': 0, u'copy': 72.549, u'display': True}, u'b953de13-1995-e928-4c38-468aa0059ebd': {u'RiPS': 0.1149, u'name': u'BBa_I752001', u'repress_rate': 0, u'concen': None, u'grp_id': u'0ec6c528-fe70-4ed0-e14f-6862c0211b12', u'pos': 2, u'PoPS': 0.6069, u'before_regulated': 5, u'K1': None, u'induce_rate': 0, u'copy': 73, u'display': True}}, u'plasmids': [[u'3685f39b-40b4-6249-e3a4-77f2016a7001'], [u'0ec6c528-fe70-4ed0-e14f-6862c0211b12']], u'groups': {u'0ec6c528-fe70-4ed0-e14f-6862c0211b12': {u'from': -1, u'state': u'cis', u'corep_ind_type': u'None', u'to': [u'3685f39b-40b4-6249-e3a4-77f2016a7001'], u'sbol': [{u'type': u'Promoter', u'name': u'BBa_K124002'}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Protein', u'name': u'BBa_I752001', u'id': u'b953de13-1995-e928-4c38-468aa0059ebd'}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Repressor', u'name': u'BBa_K518003', u'id': u'0ec6c528-fe70-4ed0-e14f-6862c0211b12'}, {u'type': u'Terminator', u'name': u'BBa_B0013'}], u'type': u'Constitutive'}, u'3685f39b-40b4-6249-e3a4-77f2016a7001': {u'from': u'0ec6c528-fe70-4ed0-e14f-6862c0211b12', u'state': u'cis', u'corep_ind_type': u'None', u'to': [], u'sbol': [{u'type': u'Promoter', u'name': u'BBa_I712074'}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Protein', u'name': u'BBa_J58104', u'id': u'3685f39b-40b4-6249-e3a4-77f2016a7001'}, {u'type': u'Terminator', u'name': u'BBa_B0013'}], u'type': u'Negative'}}}}
  print update_controller(db, update_info)
