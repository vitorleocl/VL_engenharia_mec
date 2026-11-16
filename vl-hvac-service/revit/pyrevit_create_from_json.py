# -*- coding: utf-8 -*-
"""
Cria dutos e terminais de ar NATIVOS no Revit a partir do resultado.json do serviço.

*** NÃO TESTADO NO REVIT ***  Este script foi escrito sem acesso ao Revit.
Rode primeiro num projeto de teste. Ajuste os nomes de tipos/famílias abaixo
para os do template da VL Engenharia.

Como usar (pyRevit, IronPython 2.7 ou CPython 3): colar em um botão pyRevit ou rodar no
RevitPythonShell com o modelo arquitetônico vinculado/aberto.
"""
import json
import clr
clr.AddReference("RevitAPI")
clr.AddReference("RevitServices")
from Autodesk.Revit.DB import (FilteredElementCollector, Level, XYZ, Transaction, BuiltInCategory,
                               BuiltInParameter, UnitUtils, UnitTypeId, ElementId)
from Autodesk.Revit.DB.Mechanical import Duct, DuctType, MechanicalSystemType
from Autodesk.Revit.DB.Structure import StructuralType

# ---- CONFIGURE ---------------------------------------------------------------------------
JSON_PATH = r"C:\caminho\resultado.json"
DUCT_TYPE_NAME = u"Retangular"                    # nome do tipo de duto no template
SUPPLY_SYSTEM_NAME = u"Insuflamento"             # nome do tipo de sistema mecânico
DIFFUSER_FAMILY = u"Difusor Quadrado"            # família de terminal de ar carregada no projeto
DIFFUSER_TYPE_PREFIX = u"600x600"                # (opcional) tipo dentro da família
# -------------------------------------------------------------------------------------------

doc = __revit__.ActiveUIDocument.Document  # noqa: F821 (injetado pelo pyRevit)


def m(v):  # metros -> unidades internas (pés)
    return UnitUtils.ConvertToInternalUnits(v, UnitTypeId.Meters)


def mm(v):
    return UnitUtils.ConvertToInternalUnits(v, UnitTypeId.Millimeters)


def find_level(index, levels):
    ordered = sorted(levels, key=lambda l: l.Elevation)
    return ordered[min(index, len(ordered) - 1)]


levels = list(FilteredElementCollector(doc).OfClass(Level))
duct_type = next(t for t in FilteredElementCollector(doc).OfClass(DuctType) if t.Name == DUCT_TYPE_NAME)
sys_type = next(s for s in FilteredElementCollector(doc).OfClass(MechanicalSystemType)
                if s.Name == SUPPLY_SYSTEM_NAME)
diff_symbol = next((s for s in FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_DuctTerminal)
                    .WhereElementIsElementType() if s.FamilyName == DIFFUSER_FAMILY), None)

data = json.load(open(JSON_PATH))
t = Transaction(doc, u"VL HVAC — criar dutos e terminais")
t.Start()
try:
    for s in data["ducts"]:
        lvl = find_level(s["level"], levels)
        zc = s["z_bottom_m"] + s["height_m"] / 2.0
        p1, p2 = XYZ(m(s["x1"]), m(s["y1"]), m(zc)), XYZ(m(s["x2"]), m(s["y2"]), m(zc))
        d = Duct.Create(doc, sys_type.Id, duct_type.Id, lvl.Id, p1, p2)
        d.get_Parameter(BuiltInParameter.RBS_CURVE_WIDTH_PARAM).Set(mm(s["width_m"] * 1000))
        d.get_Parameter(BuiltInParameter.RBS_CURVE_HEIGHT_PARAM).Set(mm(s["height_m"] * 1000))
        d.get_Parameter(BuiltInParameter.ALL_MODEL_MARK).Set(s["id"])

    if diff_symbol is not None:
        if not diff_symbol.IsActive:
            diff_symbol.Activate()
        for i, dif in enumerate(data["diffusers"], 1):
            lvl = find_level(dif["level"], levels)
            pt = XYZ(m(dif["x"]), m(dif["y"]), m(dif["z_m"]))
            inst = doc.Create.NewFamilyInstance(pt, diff_symbol, lvl, StructuralType.NonStructural)
            inst.get_Parameter(BuiltInParameter.ALL_MODEL_MARK).Set("D%02d" % i)
    t.Commit()
except Exception:
    t.RollBack()
    raise
print("Criados: %d dutos, %d difusores" % (len(data["ducts"]), len(data["diffusers"])))
