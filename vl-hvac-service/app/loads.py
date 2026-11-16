"""Carga térmica de resfriamento — MÉTODO SIMPLIFICADO de pré-dimensionamento.

Não substitui o cálculo horário (ASHRAE RTS/CTF) nem a verificação pela
ABNT NBR 16401. Todos os coeficientes abaixo são parâmetros de referência e
ficam expostos aqui para calibração pelo engenheiro responsável.
"""
from __future__ import annotations

import math

from .climate import air_density, pressure_pa, w_from_rh, w_from_wetbulb
from .models import Project, Room

# Diferença de temperatura equivalente adicional por orientação [K] (parede média, cor média)
DT_WALL_SOLAR = {"N": 4, "NE": 6, "E": 8, "SE": 7, "S": 6, "SW": 8, "W": 10, "NW": 7}
# Irradiância de pico transmitida/incidente em vidro vertical [W/m2] (latitudes tropicais)
SOLAR_GLASS = {"N": 150, "NE": 400, "E": 600, "SE": 450, "S": 200, "SW": 450, "W": 650, "NW": 450}
GLASS_CLF = 0.85          # fator de carga de resfriamento do ganho solar
ROOF_DT_EXTRA = 15.0      # K adicionais para cobertura exposta (laje, cor média)

# uso: (m2/pessoa, W/m2 iluminação, W/m2 equipamentos, W sensível/pessoa, W latente/pessoa, L/s·pessoa, L/s·m2)
USE_DEFAULTS = {
    "escritorio":   (7.0, 10.0, 12.0, 70, 60, 2.5, 0.3),
    "sala_reuniao": (2.0, 10.0, 5.0, 70, 60, 2.5, 0.3),
    "sala_aula":    (1.8, 12.0, 5.0, 70, 60, 5.0, 0.6),
    "auditorio":    (0.8, 12.0, 3.0, 70, 40, 2.5, 0.3),
    "loja":         (3.0, 15.0, 5.0, 75, 70, 3.8, 0.6),
    "consultorio":  (6.0, 10.0, 15.0, 70, 60, 2.5, 0.3),
    "restaurante":  (1.5, 12.0, 10.0, 80, 100, 3.8, 0.9),
    "dormitorio":   (12.0, 6.0, 5.0, 60, 40, 2.5, 0.3),
    "laboratorio":  (5.0, 14.0, 30.0, 75, 70, 5.0, 0.9),
    "recepcao":     (5.0, 12.0, 8.0, 70, 60, 2.5, 0.3),
}

W_TO_BTUH = 3.41214
W_PER_TR = 3516.85


def room_load(room: Room, prj: Project, clim: dict) -> dict:
    opt = prj.options
    t_in = room.setpoint_c or prj.setpoint_c
    rh_in = room.rh_pct or prj.rh_pct
    t_out = clim["tbs"]
    p = pressure_pa(clim["altitude_m"])
    rho = air_density(t_in, p)
    dt = t_out - t_in
    (m2_pp, lux_w, eq_w2, sens_pp, lat_pp, rp, ra) = USE_DEFAULTS[room.use]

    area = room.area
    occ = room.occupants if room.occupants is not None else max(1, math.ceil(area / m2_pp))
    light = (room.lighting_w_m2 if room.lighting_w_m2 is not None else lux_w) * area
    equip = room.equipment_w if room.equipment_w is not None else eq_w2 * area

    wall = glass_cond = glass_sol = 0.0
    for f in room.facades:
        a_gl = min(f.glazing_area_m2, f.length_m * room.height_m)
        a_wall = max(f.length_m * room.height_m - a_gl, 0.0)
        wall += f.wall_u * a_wall * (dt + DT_WALL_SOLAR[f.orientation])
        glass_cond += f.glazing_u * a_gl * dt
        glass_sol += a_gl * f.glazing_shgc * SOLAR_GLASS[f.orientation] * f.shading_factor * GLASS_CLF
    roof = room.roof_u * area * (dt + ROOF_DT_EXTRA) if room.roof_exposed else 0.0

    # ar externo (NBR 16401-3 / ASHRAE 62.1 — confirmar tabela da norma)
    q_ext_m3s = (occ * rp + area * ra) / 1000.0
    w_out = w_from_wetbulb(t_out, clim["tbu"], p)
    w_in = w_from_rh(t_in, rh_in, p)
    vent_s = rho * q_ext_m3s * 1006.0 * dt
    vent_l = rho * q_ext_m3s * max(w_out - w_in, 0.0) * 2501e3

    ppl_s, ppl_l = occ * sens_pp, occ * lat_pp
    sensible = wall + glass_cond + glass_sol + roof + ppl_s + light + equip + vent_s
    latent = ppl_l + vent_l
    sf = opt.safety_factor
    sensible, latent = sensible * sf, latent * sf
    total = sensible + latent

    q_supply_m3h = max(sensible, 0) / (rho * 1006.0 * opt.supply_delta_t) * 3600.0
    return {
        "room_id": room.id, "name": room.name, "level": room.level, "use": room.use,
        "area_m2": round(area, 2), "occupants": occ,
        "components_w": {
            "paredes": round(wall), "vidros_conducao": round(glass_cond),
            "vidros_solar": round(glass_sol), "cobertura": round(roof),
            "pessoas_sensivel": round(ppl_s), "iluminacao": round(light),
            "equipamentos": round(equip), "ar_externo_sensivel": round(vent_s),
            "pessoas_latente": round(ppl_l), "ar_externo_latente": round(vent_l),
        },
        "ar_externo_m3h": round(q_ext_m3s * 3600, 1),
        "sensible_w": round(sensible), "latent_w": round(latent), "total_w": round(total),
        "total_btuh": round(total * W_TO_BTUH), "total_tr": round(total / W_PER_TR, 2),
        "w_per_m2": round(total / area, 1),
        "supply_m3h": round(q_supply_m3h),
    }
