"""Seleção de equipamentos por capacidade nominal (catálogo genérico).

Capacidades comerciais típicas; a seleção final deve ser feita com a tabela do
fabricante (capacidade real nas condições de projeto, vazão, pressão estática).
"""
from __future__ import annotations

import math

from .loads import W_PER_TR, W_TO_BTUH

SPLIT_BTUH = [9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000]
VRF_INDOOR_KW = [2.2, 2.8, 3.6, 4.5, 5.6, 7.1, 9.0, 11.2, 14.0, 16.0]
AHU_TR = [1, 1.5, 2, 3, 4, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60]

# BTU/h -> (linha de líquido, linha de gás) em polegadas — REFERÊNCIA, confirmar no manual
REFRIG_PIPES = {
    9000: ('1/4"', '3/8"'), 12000: ('1/4"', '3/8"'), 18000: ('1/4"', '1/2"'),
    24000: ('3/8"', '5/8"'), 30000: ('3/8"', '5/8"'), 36000: ('3/8"', '5/8"'),
    48000: ('3/8"', '5/8"'), 60000: ('3/8"', '3/4"'),
}
DRAIN_DN = "PVC 25 mm (3/4\")"


def _pick(options: list[float], need: float) -> tuple[float, int]:
    """Menor capacidade >= need; se não houver, n unidades da maior."""
    for o in options:
        if o >= need:
            return o, 1
    big = options[-1]
    return big, math.ceil(need / big)


def select_split(total_w: float) -> dict:
    btuh, n = _pick(SPLIT_BTUH, total_w * W_TO_BTUH)
    tipo = "hi-wall" if btuh <= 24000 and n == 1 else "cassete/piso-teto"
    liq, gas = REFRIG_PIPES[int(btuh)]
    return {"tipo": tipo, "nominal_btuh": int(btuh), "quantidade": n,
            "tubo_liquido": liq, "tubo_gas": gas, "dreno": DRAIN_DN}


def select_vrf_indoor(total_w: float) -> dict:
    kw, n = _pick(VRF_INDOOR_KW, total_w / 1000.0)
    return {"tipo": "VRF cassete/duto baixa pressão", "nominal_kw": kw, "quantidade": n}


def select_ahu(sum_load_w: float, diversity: float, supply_m3h: float) -> dict:
    need_tr = sum_load_w * diversity / W_PER_TR
    tr, n = _pick(AHU_TR, need_tr)
    return {"tipo": "fan-coil dutado / AHU água gelada ou expansão direta",
            "nominal_tr": tr, "quantidade": n, "carga_necessaria_tr": round(need_tr, 2),
            "vazao_ar_m3h": round(supply_m3h)}
