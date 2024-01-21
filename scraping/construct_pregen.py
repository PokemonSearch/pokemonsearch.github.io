import contruct_dex
import os
import orjson
import json
parent = os.getcwd()
final_dict = {}
final_arr = []

for i in range(1, contruct_dex.pk_count):
    targ = "data/api/"+str(i)+"/api.json"
    j = open(os.path.join(parent, targ), 'r')
    value = j.read()
    j.close()
    dat = {"data":orjson.loads(value),"hasData":True}
    final_dict[str(i)] = dat
    final_arr.append(dat)
targ = "data/api/pregen.json"
print("done...")
final_data: str = json.dumps(final_arr)

dict_loc = open(os.path.join(parent, targ), 'w')
dict_loc.write(final_data)
dict_loc.close()