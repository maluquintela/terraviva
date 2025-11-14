"""
Dados regionais do Brasil para contextualização de recomendações agrícolas
"""

REGIONAL_DATA = {
    "AC": {
        "nome": "Acre",
        "clima": "Equatorial úmido",
        "temperatura_media": {"verao": "24-32°C", "inverno": "22-30°C"},
        "precipitacao_anual": "1900-2200mm",
        "solo_predominante": "Latossolo amarelo e argissolo",
        "culturas_principais": ["mandioca", "milho", "arroz", "feijão", "banana"],
        "pragas_comuns": ["formiga saúva", "broca-do-coleto", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["milho", "feijão", "arroz"],
            "outono": ["mandioca"],
            "inverno": ["hortaliças"],
            "primavera": ["milho", "feijão"]
        }
    },
    "AL": {
        "nome": "Alagoas",
        "clima": "Tropical com chuvas de outono-inverno",
        "temperatura_media": {"verao": "25-30°C", "inverno": "22-27°C"},
        "precipitacao_anual": "1200-1800mm",
        "solo_predominante": "Latossolo e argissolo",
        "culturas_principais": ["cana-de-açúcar", "coco", "mandioca", "fumo", "feijão"],
        "pragas_comuns": ["broca-da-cana", "cigarrinha", "pulgão"],
        "epoca_plantio": {
            "verao": ["feijão", "milho"],
            "outono": ["cana-de-açúcar"],
            "inverno": ["feijão"],
            "primavera": ["mandioca"]
        }
    },
    "AM": {
        "nome": "Amazonas",
        "clima": "Equatorial úmido",
        "temperatura_media": {"verao": "25-32°C", "inverno": "24-31°C"},
        "precipitacao_anual": "2000-2500mm",
        "solo_predominante": "Latossolo amarelo",
        "culturas_principais": ["mandioca", "guaraná", "açaí", "cupuaçu", "pimenta"],
        "pragas_comuns": ["formiga saúva", "pulgão", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["mandioca", "milho"],
            "outono": ["feijão"],
            "inverno": ["hortaliças"],
            "primavera": ["milho"]
        }
    },
    "BA": {
        "nome": "Bahia",
        "clima": "Tropical semiárido e tropical úmido",
        "temperatura_media": {"verao": "24-28°C", "inverno": "20-24°C"},
        "precipitacao_anual": "600-1600mm (varia por região)",
        "solo_predominante": "Latossolo amarelo e neossolo",
        "culturas_principais": ["cacau", "café", "mandioca", "feijão", "milho", "coco"],
        "pragas_comuns": ["vassoura-de-bruxa", "broca-do-café", "lagarta"],
        "epoca_plantio": {
            "verao": ["feijão", "milho"],
            "outono": ["cacau", "café"],
            "inverno": ["mandioca"],
            "primavera": ["feijão", "milho"]
        }
    },
    "CE": {
        "nome": "Ceará",
        "clima": "Tropical semiárido",
        "temperatura_media": {"verao": "26-30°C", "inverno": "24-28°C"},
        "precipitacao_anual": "600-1000mm",
        "solo_predominante": "Neossolo e argissolo",
        "culturas_principais": ["milho", "feijão", "mandioca", "caju", "coco"],
        "pragas_comuns": ["lagarta", "pulgão", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["milho", "feijão"],
            "outono": ["mandioca"],
            "inverno": ["feijão"],
            "primavera": ["milho"]
        }
    },
    "DF": {
        "nome": "Distrito Federal",
        "clima": "Tropical de altitude",
        "temperatura_media": {"verao": "22-28°C", "inverno": "18-24°C"},
        "precipitacao_anual": "1200-1600mm",
        "solo_predominante": "Latossolo vermelho",
        "culturas_principais": ["soja", "milho", "feijão", "café", "hortaliças"],
        "pragas_comuns": ["lagarta", "percevejos", "pulgão"],
        "epoca_plantio": {
            "verao": ["feijão", "hortaliças"],
            "outono": ["milho"],
            "inverno": ["feijão"],
            "primavera": ["soja", "milho"]
        }
    },
    "ES": {
        "nome": "Espírito Santo",
        "clima": "Tropical úmido",
        "temperatura_media": {"verao": "24-30°C", "inverno": "20-26°C"},
        "precipitacao_anual": "1000-1400mm",
        "solo_predominante": "Latossolo e argissolo",
        "culturas_principais": ["café", "cacau", "mamão", "banana", "mandioca"],
        "pragas_comuns": ["broca-do-café", "ferrugem", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["feijão", "milho"],
            "outono": ["café"],
            "inverno": ["mandioca"],
            "primavera": ["feijão"]
        }
    },
    "GO": {
        "nome": "Goiás",
        "clima": "Tropical semiúmido",
        "temperatura_media": {"verao": "22-28°C", "inverno": "18-24°C"},
        "precipitacao_anual": "1200-1800mm",
        "solo_predominante": "Latossolo vermelho",
        "culturas_principais": ["soja", "milho", "sorgo", "feijão", "tomate"],
        "pragas_comuns": ["lagarta", "percevejos", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["feijão", "tomate"],
            "outono": ["milho"],
            "inverno": ["feijão"],
            "primavera": ["soja", "milho"]
        }
    },
    "MA": {
        "nome": "Maranhão",
        "clima": "Tropical úmido",
        "temperatura_media": {"verao": "26-32°C", "inverno": "24-30°C"},
        "precipitacao_anual": "1400-2000mm",
        "solo_predominante": "Latossolo e plintossolo",
        "culturas_principais": ["arroz", "mandioca", "milho", "soja", "babaçu"],
        "pragas_comuns": ["brusone", "lagarta", "pulgão"],
        "epoca_plantio": {
            "verao": ["arroz", "milho"],
            "outono": ["mandioca"],
            "inverno": ["feijão"],
            "primavera": ["soja", "milho"]
        }
    },
    "MG": {
        "nome": "Minas Gerais",
        "clima": "Tropical de altitude e tropical semiúmido",
        "temperatura_media": {"verao": "20-26°C", "inverno": "16-22°C"},
        "precipitacao_anual": "1200-1800mm",
        "solo_predominante": "Latossolo vermelho e vermelho-amarelo",
        "culturas_principais": ["café", "milho", "soja", "feijão", "cana-de-açúcar", "banana"],
        "pragas_comuns": ["broca-do-café", "lagarta", "percevejos"],
        "epoca_plantio": {
            "verao": ["feijão", "tomate"],
            "outono": ["café"],
            "inverno": ["feijão", "alho"],
            "primavera": ["milho", "soja"]
        }
    },
    "MS": {
        "nome": "Mato Grosso do Sul",
        "clima": "Tropical úmido",
        "temperatura_media": {"verao": "24-30°C", "inverno": "18-24°C"},
        "precipitacao_anual": "1200-1600mm",
        "solo_predominante": "Latossolo vermelho",
        "culturas_principais": ["soja", "milho", "cana-de-açúcar", "mandioca", "arroz"],
        "pragas_comuns": ["lagarta", "percevejos", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["milho safrinha", "feijão"],
            "outono": ["trigo"],
            "inverno": ["feijão"],
            "primavera": ["soja", "milho"]
        }
    },
    "MT": {
        "nome": "Mato Grosso",
        "clima": "Tropical úmido e semiúmido",
        "temperatura_media": {"verao": "24-32°C", "inverno": "20-28°C"},
        "precipitacao_anual": "1400-2000mm",
        "solo_predominante": "Latossolo vermelho",
        "culturas_principais": ["soja", "milho", "algodão", "arroz", "girassol"],
        "pragas_comuns": ["lagarta", "percevejos", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["milho safrinha", "feijão"],
            "outono": ["algodão"],
            "inverno": ["feijão"],
            "primavera": ["soja", "milho"]
        }
    },
    "PA": {
        "nome": "Pará",
        "clima": "Equatorial úmido",
        "temperatura_media": {"verao": "25-32°C", "inverno": "24-31°C"},
        "precipitacao_anual": "2000-3000mm",
        "solo_predominante": "Latossolo amarelo",
        "culturas_principais": ["mandioca", "açaí", "cacau", "pimenta-do-reino", "banana"],
        "pragas_comuns": ["formiga saúva", "broca", "vassoura-de-bruxa"],
        "epoca_plantio": {
            "verao": ["mandioca", "milho"],
            "outono": ["cacau"],
            "inverno": ["feijão"],
            "primavera": ["milho"]
        }
    },
    "PB": {
        "nome": "Paraíba",
        "clima": "Tropical semiárido e tropical úmido",
        "temperatura_media": {"verao": "26-30°C", "inverno": "22-27°C"},
        "precipitacao_anual": "400-1200mm",
        "solo_predominante": "Neossolo e luvissolo",
        "culturas_principais": ["milho", "feijão", "mandioca", "cana-de-açúcar", "abacaxi"],
        "pragas_comuns": ["lagarta", "broca", "pulgão"],
        "epoca_plantio": {
            "verao": ["milho", "feijão"],
            "outono": ["mandioca"],
            "inverno": ["feijão"],
            "primavera": ["milho"]
        }
    },
    "PE": {
        "nome": "Pernambuco",
        "clima": "Tropical semiárido e tropical úmido",
        "temperatura_media": {"verao": "24-30°C", "inverno": "22-27°C"},
        "precipitacao_anual": "500-2000mm (varia por região)",
        "solo_predominante": "Latossolo e neossolo",
        "culturas_principais": ["cana-de-açúcar", "mandioca", "feijão", "milho", "uva"],
        "pragas_comuns": ["broca-da-cana", "lagarta", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["feijão", "milho"],
            "outono": ["cana-de-açúcar"],
            "inverno": ["uva"],
            "primavera": ["mandioca"]
        }
    },
    "PI": {
        "nome": "Piauí",
        "clima": "Tropical semiárido",
        "temperatura_media": {"verao": "26-32°C", "inverno": "24-30°C"},
        "precipitacao_anual": "600-1400mm",
        "solo_predominante": "Latossolo e neossolo",
        "culturas_principais": ["soja", "milho", "feijão", "mandioca", "arroz"],
        "pragas_comuns": ["lagarta", "percevejos", "pulgão"],
        "epoca_plantio": {
            "verao": ["feijão", "arroz"],
            "outono": ["mandioca"],
            "inverno": ["feijão"],
            "primavera": ["soja", "milho"]
        }
    },
    "PR": {
        "nome": "Paraná",
        "clima": "Subtropical úmido",
        "temperatura_media": {"verao": "20-26°C", "inverno": "14-20°C"},
        "precipitacao_anual": "1200-2000mm",
        "solo_predominante": "Latossolo vermelho e terra roxa",
        "culturas_principais": ["soja", "milho", "trigo", "café", "feijão", "mandioca"],
        "pragas_comuns": ["lagarta", "percevejos", "ferrugem"],
        "epoca_plantio": {
            "verao": ["feijão", "mandioca"],
            "outono": ["trigo"],
            "inverno": ["feijão", "aveia"],
            "primavera": ["soja", "milho"]
        }
    },
    "RJ": {
        "nome": "Rio de Janeiro",
        "clima": "Tropical úmido e tropical de altitude",
        "temperatura_media": {"verao": "23-30°C", "inverno": "18-25°C"},
        "precipitacao_anual": "1000-1500mm",
        "solo_predominante": "Argissolo e cambissolo",
        "culturas_principais": ["tomate", "batata", "aipim", "banana", "laranja"],
        "pragas_comuns": ["requeima", "mosca-branca", "pulgão"],
        "epoca_plantio": {
            "verao": ["tomate", "feijão"],
            "outono": ["batata"],
            "inverno": ["alho", "cebola"],
            "primavera": ["milho"]
        }
    },
    "RN": {
        "nome": "Rio Grande do Norte",
        "clima": "Tropical semiárido",
        "temperatura_media": {"verao": "26-30°C", "inverno": "24-28°C"},
        "precipitacao_anual": "400-800mm",
        "solo_predominante": "Neossolo e cambissolo",
        "culturas_principais": ["caju", "melão", "manga", "coco", "feijão"],
        "pragas_comuns": ["mosca-branca", "pulgão", "trips"],
        "epoca_plantio": {
            "verao": ["melão", "feijão"],
            "outono": ["caju"],
            "inverno": ["feijão"],
            "primavera": ["milho"]
        }
    },
    "RO": {
        "nome": "Rondônia",
        "clima": "Equatorial úmido",
        "temperatura_media": {"verao": "24-32°C", "inverno": "22-30°C"},
        "precipitacao_anual": "1900-2500mm",
        "solo_predominante": "Latossolo vermelho-amarelo",
        "culturas_principais": ["café", "cacau", "mandioca", "milho", "feijão"],
        "pragas_comuns": ["broca-do-café", "formiga", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["milho", "feijão"],
            "outono": ["café"],
            "inverno": ["mandioca"],
            "primavera": ["feijão"]
        }
    },
    "RR": {
        "nome": "Roraima",
        "clima": "Equatorial",
        "temperatura_media": {"verao": "24-32°C", "inverno": "23-31°C"},
        "precipitacao_anual": "1600-2000mm",
        "solo_predominante": "Latossolo amarelo",
        "culturas_principais": ["arroz", "feijão", "milho", "mandioca", "banana"],
        "pragas_comuns": ["brusone", "lagarta", "pulgão"],
        "epoca_plantio": {
            "verao": ["arroz", "milho"],
            "outono": ["feijão"],
            "inverno": ["mandioca"],
            "primavera": ["milho"]
        }
    },
    "RS": {
        "nome": "Rio Grande do Sul",
        "clima": "Subtropical úmido",
        "temperatura_media": {"verao": "18-26°C", "inverno": "10-18°C"},
        "precipitacao_anual": "1200-2000mm",
        "solo_predominante": "Latossolo vermelho e argissolo",
        "culturas_principais": ["soja", "arroz", "trigo", "milho", "uva", "maçã"],
        "pragas_comuns": ["lagarta", "percevejos", "ferrugem"],
        "epoca_plantio": {
            "verao": ["soja", "arroz"],
            "outono": ["trigo"],
            "inverno": ["aveia", "trigo"],
            "primavera": ["milho", "soja"]
        }
    },
    "SC": {
        "nome": "Santa Catarina",
        "clima": "Subtropical úmido e oceânico",
        "temperatura_media": {"verao": "18-26°C", "inverno": "12-20°C"},
        "precipitacao_anual": "1200-1800mm",
        "solo_predominante": "Cambissolo e argissolo",
        "culturas_principais": ["arroz", "milho", "soja", "maçã", "cebola", "alho"],
        "pragas_comuns": ["lagarta", "percevejos", "ferrugem"],
        "epoca_plantio": {
            "verao": ["arroz", "feijão"],
            "outono": ["trigo", "cebola"],
            "inverno": ["alho", "aveia"],
            "primavera": ["milho", "soja"]
        }
    },
    "SE": {
        "nome": "Sergipe",
        "clima": "Tropical úmido",
        "temperatura_media": {"verao": "24-30°C", "inverno": "22-27°C"},
        "precipitacao_anual": "1000-1400mm",
        "solo_predominante": "Latossolo e argissolo",
        "culturas_principais": ["cana-de-açúcar", "laranja", "coco", "mandioca", "milho"],
        "pragas_comuns": ["broca-da-cana", "mosca-branca", "pulgão"],
        "epoca_plantio": {
            "verao": ["milho", "feijão"],
            "outono": ["cana-de-açúcar"],
            "inverno": ["mandioca"],
            "primavera": ["feijão"]
        }
    },
    "SP": {
        "nome": "São Paulo",
        "clima": "Subtropical úmido e tropical de altitude",
        "temperatura_media": {"verao": "22-28°C", "inverno": "15-22°C"},
        "precipitacao_anual": "1200-1800mm",
        "solo_predominante": "Latossolo vermelho e terra roxa",
        "culturas_principais": ["cana-de-açúcar", "laranja", "café", "soja", "milho", "tomate"],
        "pragas_comuns": ["broca-da-cana", "mosca-branca", "lagarta", "pulgão"],
        "epoca_plantio": {
            "verao": ["feijão", "tomate", "milho"],
            "outono": ["café", "trigo"],
            "inverno": ["feijão", "alho"],
            "primavera": ["soja", "milho", "amendoim"]
        }
    },
    "TO": {
        "nome": "Tocantins",
        "clima": "Tropical úmido",
        "temperatura_media": {"verao": "24-32°C", "inverno": "22-30°C"},
        "precipitacao_anual": "1400-1800mm",
        "solo_predominante": "Latossolo vermelho-amarelo",
        "culturas_principais": ["soja", "milho", "arroz", "mandioca", "melancia"],
        "pragas_comuns": ["lagarta", "percevejos", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["arroz", "feijão"],
            "outono": ["mandioca"],
            "inverno": ["feijão"],
            "primavera": ["soja", "milho"]
        }
    }
}

def get_region_info(state: str) -> dict:
    """Retorna informações da região ou dados padrão se estado não encontrado"""
    return REGIONAL_DATA.get(state.upper(), {
        "nome": "Região não especificada",
        "clima": "Tropical",
        "temperatura_media": {"verao": "22-30°C", "inverno": "18-26°C"},
        "precipitacao_anual": "1000-1800mm",
        "solo_predominante": "Latossolo",
        "culturas_principais": ["milho", "feijão", "mandioca"],
        "pragas_comuns": ["lagarta", "pulgão", "mosca-branca"],
        "epoca_plantio": {
            "verao": ["milho", "feijão"],
            "outono": ["mandioca"],
            "inverno": ["feijão"],
            "primavera": ["milho"]
        }
    })

