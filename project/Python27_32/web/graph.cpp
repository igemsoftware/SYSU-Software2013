#include <iostream>
#include <iomanip>
#include <fstream>
#include <cmath>
using namespace std;
#include "graph.h"

static int total = 0;

double* run() {
  //fstream datafile("DataFile.txt", ios::out);
  DNA     gene1(1.6, 0.7, 0.3);
  mRNA    mrna1(2.0, 4.0, 0.2, 0); mrna1.Connect(& gene1);
  Protein pro1 (0.6, 0); pro1.Connect(& mrna1);
  DNA     gene2(1.8, 0.8, 0.2); gene2.Connect(& pro1);
  mRNA    mrna2(2.5, 5.0, 0.3, 0); mrna2.Connect(& gene2);
  Protein pro2 (0.2, 0); pro2.Connect(& mrna2);
  gene1.Connect(& pro2);
  Simulate();
  double* graph;

  graph = Export(total);
  //datafile.close();
  //cout<<"[ Finish ]!"<<endl;
  return graph;
}

extern "C" {

#include <python2.7/Python.h>
  static PyObject* run_wrapper(PyObject *self, PyObject *args) {
    double* graph;
    graph = run();
    int count = MaxLength * MaxSize;

    PyObject* tuple = PyTuple_New(count);

    for (int i = 0; i < count; i++) {
      double rVal = graph[i];
      PyTuple_SetItem(tuple, i, Py_BuildValue("d", rVal));
    }

    delete []graph;
    return tuple;
  }

  static PyObject* get_length(PyObject *self, PyObject *args) {
    return Py_BuildValue("i", total);
  }

  static PyObject* get_size(PyObject *self, PyObject *args) {
    return Py_BuildValue("i", total / MaxLength);
  }

  static PyMethodDef graphMethods[] = {
    {"run", run_wrapper, METH_VARARGS, "run the program to get required data"},
    {"get_length", get_length, METH_VARARGS, "get max length"},
    {"get_size", get_size, METH_VARARGS, "get how many function to draw"},
    {NULL, NULL, 0, NULL}
  };

  PyMODINIT_FUNC initgraph(void) {
    Py_InitModule("graph", graphMethods);
  }
}
