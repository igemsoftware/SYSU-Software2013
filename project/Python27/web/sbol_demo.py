import component_union
import sequence_serializer
import sys

def test():
  rule = "RFC25"
  #content = component_union.union(rule, sys.argv[1:])
  content = component_union.union(rule, 'F:/igemgit/project/Python27/web/test/BBa_E1010.xml')
  dna_sequence = component_union.connect(rule, content)
  sbol = component_union.formatter_v11(content, dna_sequence)
  print sequence_serializer.format_to_json(sbol)
