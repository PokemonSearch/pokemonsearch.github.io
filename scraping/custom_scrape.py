import json
import time
import contruct_dex

output = []
for ID in range(contruct_dex.pk_min, contruct_dex.pk_count+1):
    data_io = open('data/api/'+str(ID)+"/api.json")
    data = json.loads(data_io.read())
    data_io.close()
    
    bst = 0
    for s in range(6):
        bst += data['stats'][s]['base_stat']
    type_list = [data['types'][0]['type']['name']]

    if len(data['types']) > 1:
        type_list.append(data['types'][1]['type']['name'])
    
    
    if bst>=600:
        output.append(ID)
        print(ID)

print(output)
