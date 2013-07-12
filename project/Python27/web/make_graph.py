import graph
import json


def parse_data():
  # TODO currently I simply read the file and parse data, THIS IS
  # UNACCEPTABLY SLOW AND UGLY!!!
  # fp = open("Datafile.txt")
  # content = [(lambda s: [float(x) for x in s])(line.split()) for line in fp.readlines()]
  content = graph.run()
  length = graph.get_length()
  size = graph.get_size()
  content = list(content[:length])
  content = [content[i:i+size] for i in xrange(0, len(content), size)]
  return content

if __name__=="__main__":
  parse_data()

