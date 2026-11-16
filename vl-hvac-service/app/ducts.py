"""Dimensionamento de dutos retangulares pelo método da perda de carga constante."""
from __future__ import annotations

import math

RHO, MU, EPS = 1.2, 1.81e-5, 0.09e-3  # ar, viscosidade, rugosidade chapa galvanizada
MODULE_M = 0.05


def _friction_circular(q_m3s: float, d: float) -> float:
    """Perda de carga [Pa/m] em duto circular (Darcy-Weisbach, Swamee-Jain)."""
    v = q_m3s / (math.pi * d * d / 4)
    re = RHO * v * d / MU
    f = 0.25 / (math.log10(EPS / (3.7 * d) + 5.74 / re ** 0.9)) ** 2
    return f * (1 / d) * RHO * v * v / 2


def _de_circular_for_friction(q_m3s: float, target: float) -> float:
    lo, hi = 0.05, 2.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if _friction_circular(q_m3s, mid) > target:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def _equiv_diameter(a: float, b: float) -> float:
    return 1.30 * (a * b) ** 0.625 / (a + b) ** 0.25


def _round_up(x: float) -> float:
    return math.ceil(x / MODULE_M - 1e-9) * MODULE_M


def size_rectangular(q_m3h: float, friction_pa_m: float, max_h: float, max_v: float) -> dict:
    """Retorna largura x altura [m] (múltiplos de 50 mm), velocidade e perda real."""
    q = max(q_m3h, 1.0) / 3600.0
    de = _de_circular_for_friction(q, friction_pa_m)
    h = min(max_h, max(0.15, _round_up(de * 0.6)))  # altura inicial ~60% de De, limitada
    # largura: menor múltiplo que atinge De >= De alvo
    w = h
    while _equiv_diameter(w, h) < de and w < 3.0:
        w += MODULE_M
    # respeita razão de aspecto <= 4:1; se estourar, sobe a altura até o limite
    while w / h > 4.0 and h < max_h:
        h += MODULE_M
        w = h
        while _equiv_diameter(w, h) < de and w < 3.0:
            w += MODULE_M
    # velocidade máxima
    while q / (w * h) > max_v and w < 3.0:
        w += MODULE_M
    de_real = _equiv_diameter(w, h)
    return {
        "width_m": round(w, 3), "height_m": round(h, 3),
        "velocity_ms": round(q / (w * h), 2),
        "friction_pa_m": round(_friction_circular(q, de_real), 2),
    }


def flex_diameter_mm(q_m3h: float) -> int:
    """Diâmetro nominal de flexível para um difusor (velocidade ~ <= 4 m/s)."""
    for d in (150, 200, 250, 300, 350, 400):
        area = math.pi * (d / 1000) ** 2 / 4
        if q_m3h / 3600 / area <= 4.0:
            return d
    return 400


def grille_size(q_m3h: float, face_velocity: float = 2.5) -> tuple[float, float]:
    """Grelha de retorno (largura x altura em m), razão ~2:1, múltiplos de 50 mm."""
    area = q_m3h / 3600 / face_velocity
    h = _round_up(math.sqrt(area / 2))
    w = _round_up(area / h)
    return round(max(w, 0.2), 3), round(max(h, 0.1), 3)
