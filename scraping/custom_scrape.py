import json
import time
import contruct_dex

output = []
for ID in range(contruct_dex.pk_min, contruct_dex.pk_count+1):
    data_io = open('data/api/'+str(ID)+"/api.json")
    data = json.loads(data_io.read())
    data_io.close()
    
    type_list = [data['types'][0]['type']['name']]
    if len(data['types']) > 1:
        type_list.append(data['types'][1]['type']['name'])
    
    print(type_list)
    if 'water' in type_list:
        output.append(ID)
        print(ID)

print(output)
