"""Condições externas de projeto e psicrometria básica.

ATENÇÃO: os valores da tabela CITIES são de REFERÊNCIA APROXIMADA para
pré-dimensionamento. O engenheiro deve conferir/substituir pelos valores da
ABNT NBR 16401-1 (ou informar climate.tbs/tbu/altitude_m no payload).
"""
from __future__ import annotations

import math

# cidade: (TBS °C, TBU coincidente °C, altitude m)
CITIES: dict[str, tuple[float, float, float]] = {
    "recife": (32.0, 25.5, 10),
    "paulista": (32.0, 25.5, 10),
    "olinda": (32.0, 25.5, 10),
    "joao pessoa": (32.0, 25.5, 10),
    "natal": (32.0, 25.5, 30),
    "maceio": (32.0, 25.5, 10),
    "aracaju": (32.0, 25.5, 10),
    "salvador": (32.0, 25.5, 10),
    "fortaleza": (32.0, 25.5, 20),
    "sao luis": (33.0, 26.0, 20),
    "teresina": (36.0, 26.0, 70),
    "belem": (33.0, 26.5, 10),
    "manaus": (34.0, 27.0, 90),
    "vitoria": (33.0, 26.0, 10),
    "rio de janeiro": (35.0, 25.0, 10),
    "belo horizonte": (31.0, 21.0, 850),
    "sao paulo": (31.0, 21.0, 760),
    "curitiba": (30.0, 21.0, 930),
    "florianopolis": (32.0, 25.0, 10),
    "porto alegre": (34.0, 24.0, 10),
    "brasilia": (31.0, 20.0, 1170),
    "goiania": (34.0, 22.0, 750),
    "campo grande": (35.0, 24.0, 530),
    "cuiaba": (37.0, 25.0, 180),
}


def _norm(s: str) -> str:
    import unicodedata
    s = unicodedata.normalize("NFD", s.lower().strip())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def resolve_climate(city: str | None, tbs: float | None, tbu: float | None,
                    altitude: float | None) -> dict:
    ref = CITIES.get(_norm(city)) if city else None
    if ref is None and not (tbs and tbu):
        raise ValueError(
            f"cidade '{city}' não está na tabela; informe climate.tbs e climate.tbu"
        )
    r_tbs, r_tbu, r_alt = ref if ref else (None, None, 0.0)
    return {
        "city": city,
        "tbs": tbs if tbs is not None else r_tbs,
        "tbu": tbu if tbu is not None else r_tbu,
        "altitude_m": altitude if altitude is not None else r_alt,
        "from_table": ref is not None and tbs is None,
    }


def pressure_pa(alt_m: float) -> float:
    return 101325.0 * (1 - 2.25577e-5 * alt_m) ** 5.2559


def p_sat(t_c: float) -> float:
    return 610.94 * math.exp(17.625 * t_c / (t_c + 243.04))


def w_from_rh(t_c: float, rh_pct: float, p: float) -> float:
    pw = rh_pct / 100.0 * p_sat(t_c)
    return 0.62198 * pw / (p - pw)


def w_from_wetbulb(tbs: float, tbu: float, p: float) -> float:
    ws = 0.62198 * p_sat(tbu) / (p - p_sat(tbu))
    return ((2501 - 2.326 * tbu) * ws - 1.006 * (tbs - tbu)) / (2501 + 1.86 * tbs - 4.186 * tbu)


def air_density(t_c: float, p: float) -> float:
    return p / (287.05 * (t_c + 273.15))
