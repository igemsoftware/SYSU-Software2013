/* ========== ========== ========== ========== ========== */
/* Declaration of class */
class Base;
class DNA;
class mRNA;
class Protein;
/* Defination of abstract class Base */

class Base {
public:
	Base();
	virtual ~Base();
	virtual void Compute(int) = 0;
	friend  double* Export(int &);
	friend  void Simulate();
protected:
	int id, length;
	double dt;
	double * abundance;
};

/* Defination of class DNA */
class DNA {
public:
	DNA(double, double, double);
	void Connect(Protein *);
	friend class mRNA;
private:
	Protein * repressor;
	double m, alpha, epsilon;
};

/* Defination of class mRNA */
class mRNA:public Base {
public:
	mRNA(double, double, double, double);
	void Connect(DNA *);
	void Compute(int);
	friend class Protein;
private:
	DNA * dna;
	double v_max, k_mich, k_deg;
};

/* Defination of class Protein */
class Protein: public Base {
public:
	Protein(double, double);
	void Connect(mRNA *);
	void Compute(int);
	friend class mRNA;
private:
	mRNA * mrna;
	double k_deg;
};

/* ========== ========== ========== ========== ========== */
/* Public constants and variables */
const int MaxSize = 50;
class Base * ObjectList [MaxSize] = {NULL};
const double SimulateTime = 60;
const double SimulateDt = 0.2;
const int MaxLength = (int) floor(SimulateTime / SimulateDt) + 1;
/* ========== ========== ========== ========== ========== */
/* class Base */
Base::Base()
{
	dt =  SimulateDt;
	length = (int) floor(SimulateTime / dt) + 1;
	abundance = new double [length];
	if(abundance == NULL)
	{
		cerr<<"Fail to construct a Base object!"<<endl;
		exit(0);
	}
	id = -1;
	while(id < MaxSize)
	{
		id++;
		if(id >= MaxSize) break;
		if(ObjectList[id] == NULL)
		{
			ObjectList[id] = this;
			break;
		}
	}
	if(id >= MaxSize)
	{
		cout<<"Number of objects greater than MaxSize!"<<endl;
		exit(0);
	}
}
Base::~Base()
{
	if(abundance) delete [] abundance;
	ObjectList[id] = NULL;
}
/* class DNA */
DNA::DNA(double mm, double a, double e): m(mm), alpha(a), epsilon(e)
{
	repressor = NULL;
}
void DNA::Connect(Protein * p)
{
	repressor = p;
}
/* class mRNA */
mRNA::mRNA(double v, double km, double kd, double ini):
	Base(), v_max(v), k_mich(km), k_deg(kd)
{
	dna = NULL;
	abundance[0] = ini;
}
void mRNA::Connect(DNA * d)
{
	dna = d;
}
void mRNA::Compute(int n)
{
	if(!dna)
	{
		cerr<<"Independent mRNA object!"<<endl;
		exit(0);
	}
	if(dna->repressor)
	{
		abundance[n] = abundance[n - 1]
			+ dt * dna->m * (dna->alpha - dna->epsilon)/(1 + pow(dna->repressor->abundance[n - 1], dna->m))
			+ dt * dna->m * dna->epsilon - dt * k_deg * abundance[n - 1];
	}
	else
	{
		abundance[n] = abundance[n -1]
			+ dt * dna->m * dna->alpha - dt * k_deg * abundance[n - 1];;
	}
}
/* class Protein */
Protein::Protein(double k, double ini):Base(), k_deg(k)
{
	mrna = NULL;
	abundance[0] = ini;
}
void Protein::Connect(mRNA * m)
{
	mrna = m;
}
void Protein::Compute(int n)
{
	if(!mrna)
	{
		cerr<<"Independent Protein object!"<<endl;
		exit(0);
	}
	abundance[n] = abundance[n-1]
		+ dt * mrna->v_max * mrna->abundance[n-1] / (mrna->k_mich + mrna->abundance[n-1])
		- dt * k_deg * abundance[n-1];
}
/* ========== ========== ========== ========== ========== */
/* Definition of public static function */
double* Export(int &total) {
	if(!ObjectList) return NULL;
	int length = ObjectList[0]->length;
	int i, j;
  int top = 0;
  double *ret = new double[MaxLength * MaxSize];
	//datafile<<setiosflags(ios::fixed)<<setprecision(4);
	for(i = 0;i < length;i++)
	{
		//datafile<<i*ObjectList[0]->dt;
    ret[top++] = i*ObjectList[0]->dt;
		for(j = 0;j < MaxSize;j++)
			if(ObjectList[j]) {
				//datafile<<"\t"<<ObjectList[j]->abundance[i];
        ret[top++] = ObjectList[j]->abundance[i];
      }
		//datafile<<endl;
	}
  total = top;
  return ret;
}

void Simulate()
{
	if(!ObjectList) return;
	int length = ObjectList[0]->length;
	int i, j;
	for(i = 1;i < length;i++)
		for(j = 0;j < MaxSize;j++)
			if(ObjectList[j]) ObjectList[j]->Compute(i);
}
