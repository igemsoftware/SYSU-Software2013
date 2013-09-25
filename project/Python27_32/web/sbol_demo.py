import component_union
from sbol2json import format_to_json
import sys

def test():
  rule = "RFC25"
  content = component_union.union(rule, sys.argv[1:])
  # path = 'F:/igemgit/project/Python27/web/test/BBa_E1010.xml'
  # content = component_union.union(rule, path)
  dna_sequence = component_union.connect(rule, content)
  sbol = component_union.formatter_v11(content, dna_sequence)
  print sbol
  print format_to_json(sbol)

test()
