"""Modelos de entrada do serviço (pydantic). Unidades: metros, graus C, watts."""
from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator

Orientation = Literal["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
UseType = Literal[
    "escritorio", "sala_reuniao", "sala_aula", "auditorio", "loja",
    "consultorio", "restaurante", "dormitorio", "laboratorio", "recepcao",
]
SystemType = Literal["split", "vrf", "dutado"]


class Facade(BaseModel):
    """Fachada externa do ambiente (parede + esquadria)."""
    orientation: Orientation
    length_m: float = Field(gt=0, description="Comprimento da fachada exposta")
    wall_u: float = Field(2.4, gt=0, description="U da parede [W/m2K]")
    glazing_area_m2: float = Field(0, ge=0)
    glazing_u: float = Field(5.7, gt=0, description="U do vidro [W/m2K]")
    glazing_shgc: float = Field(0.70, gt=0, le=1)
    shading_factor: float = Field(1.0, gt=0, le=1, description="1 = sem proteção solar")


class Room(BaseModel):
    id: str
    name: str
    use: UseType = "escritorio"
    level: int = 0
    x: float = Field(description="Canto inferior esquerdo [m]")
    y: float
    w: float = Field(gt=0, description="Dimensão em X [m]")
    l: float = Field(gt=0, description="Dimensão em Y [m]")
    height_m: float = Field(2.7, gt=0, description="Pé-direito [m]")
    occupants: Optional[int] = Field(None, ge=0)
    lighting_w_m2: Optional[float] = Field(None, ge=0)
    equipment_w: Optional[float] = Field(None, ge=0)
    roof_exposed: bool = False
    roof_u: float = Field(2.0, gt=0)
    facades: list[Facade] = []
    setpoint_c: Optional[float] = None
    rh_pct: Optional[float] = None

    @property
    def area(self) -> float:
        return self.w * self.l


class Climate(BaseModel):
    city: Optional[str] = None
    tbs: Optional[float] = Field(None, description="TBS externa de projeto [C]")
    tbu: Optional[float] = Field(None, description="TBU coincidente [C]")
    altitude_m: Optional[float] = None


class Responsible(BaseModel):
    name: str = ""
    crea: str = ""
    art: str = ""


class Point(BaseModel):
    x: float
    y: float


class Options(BaseModel):
    safety_factor: float = Field(1.10, ge=1.0, le=1.5)
    supply_delta_t: float = Field(10.0, gt=3, le=16, description="T_ambiente - T_insuflamento [K]")
    friction_pa_m: float = Field(1.0, gt=0.2, le=2.0)
    max_duct_height_m: float = Field(0.30, gt=0.1, le=1.0)
    max_velocity_ms: float = Field(6.0, gt=2, le=12)
    diffuser_max_m3h: float = Field(350, gt=50)
    diversity_ahu: float = Field(0.90, gt=0.5, le=1.0)
    scale: int = Field(50, ge=20, le=200, description="Escala de plotagem 1:N")


class Project(BaseModel):
    name: str
    client: str = ""
    address: str = ""
    climate: Climate = Climate()
    setpoint_c: float = 24.0
    rh_pct: float = 50.0
    system: SystemType = "split"
    rooms: list[Room] = Field(min_length=1)
    ahu: Optional[Point] = Field(None, description="Casa de máquinas / shaft (obrigatório em 'dutado')")
    floor_height_m: float = Field(3.2, gt=2)
    responsible: Responsible = Responsible()
    options: Options = Options()
    analysis_markdown: str = Field("", max_length=30000, description="Análise textual auxiliar gerada com IA, revisada pelo responsável técnico")

    @model_validator(mode="after")
    def _checks(self):
        ids = [r.id for r in self.rooms]
        if len(ids) != len(set(ids)):
            raise ValueError("ids de ambientes duplicados")
        if self.system == "dutado" and self.ahu is None:
            raise ValueError("system='dutado' exige o ponto 'ahu' (casa de máquinas/shaft)")
        if not (self.climate.city or (self.climate.tbs and self.climate.tbu)):
            raise ValueError("informe climate.city ou climate.tbs + climate.tbu")
        return self
