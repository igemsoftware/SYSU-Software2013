import os
import sequence_serializer
import component_union

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

def dump_sbol(data):
  sbol = []
  rule = "RFC10"
  for i in data:
    data[i] = [find_file(s + ".xml", ".") for s in data[i]]
    content = component_union.union(rule, data[i])
    dna_sequence = component_union.connect(rule, content)
    sbol.append(sequence_serializer.format_to_json(component_union.formatter_v11(content, dna_sequence)))
  return sbol

if __name__ == "__main__":
  import database
  db = database.SqliteDatabase()
  print dump_sbol(work(data, db))
