def SteadyState_Concen(DataSet):
    if DataSet['Type'] == 'Constitutive':
        Concen = DataSet['CopyNumber'] * DataSet['Efficiency'] * (DataSet['MPPromoter'] / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
    elif DataSet['Type'] == 'Positive':
        if DataSet['Activator']:
            if DataSet['Corepressor']:
                Corepressor = pow(DataSet['Corepressor'] / DataSet['K2'], DataSet['HillCoeff2'])
                Activator   = pow(DataSet['Activator'] / DataSet['K1'] / (1 + Corepressor), DataSet['HillCoeff1'])
                Concen      = DataSet['CopyNumber'] * DataSet['Efficiency'] * (((DataSet['MPPromoter'] - DataSet['LeakageRate']) / (1 + 1 / Activator) + DataSet['LeakageRate']) / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
            elif DataSet['Inducer']:
                Inducer   = pow(DataSet['Inducer'] / DataSet['K2'], DataSet['HillCoeff2'])
                Activator = pow(DataSet['Activator'] / DataSet['K1'] / (1 + Inducer), DataSet['HillCoeff1'])
                Concen    = DataSet['CopyNumber'] * DataSet['Efficiency'] * (((DataSet['MPPromoter'] - DataSet['LeakageRate']) * (1 - 1 / (1 + Activator) / (1 + Inducer)) + DataSet['LeakageRate']) / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
            else:
                Activator = pow(DataSet['Activator'] / DataSet['K1'], DataSet['HillCoeff1'])
                Concen    = DataSet['CopyNumber'] * DataSet['Efficiency'] * (((DataSet['MPPromoter'] - DataSet['LeakageRate']) / (1 + 1 / Activator) + DataSet['LeakageRate']) / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
        else:
            Concen = DataSet['CopyNumber'] * DataSet['Efficiency'] * (DataSet['LeakageRate'] / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
    elif DataSet['Type'] == 'Negative':
        if DataSet['Repressor']:
            if DataSet['Corepressor']:
                Corepressor = pow(DataSet['Corepressor'] / DataSet['K2'], DataSet['HillCoeff2'])
                Repressor   = pow(DataSet['Repressor'] / DataSet['K1'] / (1 + Corepressor), DataSet['HillCoeff1'])
                Concen      = DataSet['CopyNumber'] * DataSet['Efficiency'] * (((DataSet['MPPromoter'] - DataSet['LeakageRate']) / (1 + Repressor) / (1 + Corepressor) + DataSet['LeakageRate']) / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
            elif DataSet['Inducer']:
                Inducer   = pow(DataSet['Inducer'] / DataSet['K2'], DataSet['HillCoeff2'])
                Repressor = pow(DataSet['Repressor'] / DataSet['K1'] / (1 + Inducer), DataSet['HillCoeff1'])
                Concen    = DataSet['CopyNumber'] * DataSet['Efficiency'] * (((DataSet['MPPromoter'] - DataSet['LeakageRate']) / (1 + Repressor) + DataSet['LeakageRate']) / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
            else:
                Repressor = pow(DataSet['Repressor'] / DataSet['K1'], DataSet['HillCoeff1'])
                Concen    = DataSet['CopyNumber'] * DataSet['Efficiency'] * (((DataSet['MPPromoter'] - DataSet['LeakageRate']) / (1 + Repressor) + DataSet['LeakageRate']) / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
        else:
            Concen = DataSet['CopyNumber'] * DataSet['Efficiency'] * (DataSet['MPPromoter'] / DataSet['DegRatemRNA']) * (DataSet['MPRBS'] / DataSet['DegRatePro'])
    return Concen
