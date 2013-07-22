import sys
import xml.etree.ElementTree as ET

def get_sequence(xml_file):
  path = "part_list/part/sequences/seq_data"
  seq = str(xml_file.find(path).text)
  seq = filter(lambda x:x != '\n', seq)
  return seq

def connector(p, q):
  return p+q

def filefucker(file_list):
  seq = ""
  circuit = []
  for name in file_list:
    print name
    circuit.append(ET.parse(name))
  for i in range(1,len(file_list)):
    seq += connector(get_sequence(circuit[i]), get_sequence(circuit[i-1]))
  print seq

if __name__ == "__main__":
  filefucker(sys.argv[1:])
