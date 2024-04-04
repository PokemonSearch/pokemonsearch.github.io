import scrape
import json

type_chart = {}
dmgTable = {}

def grab_type_data(data, parameter_name):
    arr = []
    arr_data = data["damage_relations"][parameter_name]
    for dat in arr_data:
        arr.append(dat["name"])
    return arr


for i in range(1,19):
    data = scrape.pokecall('type/'+str(i)).json()
    name = data["name"]
    weakTo = grab_type_data(data, "double_damage_from")
    strongAgainst = grab_type_data(data, "double_damage_to")
    resistedBy = grab_type_data(data, "half_damage_to")
    resists = grab_type_data(data, "half_damage_from")
    immuneTo = grab_type_data(data, "no_damage_from")
    noDamageTo = grab_type_data(data, "no_damage_to")
    type_chart[name] = {"2xFrom": weakTo, "2xTo": strongAgainst, "0xFrom": immuneTo, "0xTo": noDamageTo, "0.5xFrom": resists, "0.5xTo": resistedBy}
    dmgTable[name] = 1


f = open('data/api/typechart.json','w')
f.write(json.dumps(type_chart))
f.close()
print(type_chart)
print(json.dumps(dmgTable))