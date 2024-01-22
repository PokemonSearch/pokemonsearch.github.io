import json
import time
import contruct_dex

output = []
for ID in range(contruct_dex.pk_min, contruct_dex.pk_count+1):
    data_io = open('data/api/'+str(ID)+"/species.json")
    data = json.loads(data_io.read())
    data_io.close()
    if "varieties" in list(data.keys()):
        if len(data['varieties']) > 1:
            output.append(ID)
            print(ID)

print(output)
