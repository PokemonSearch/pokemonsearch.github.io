from PIL import Image
import contruct_dex
import json

def min_offsets(path, gif_path):
    im = Image.open(path).convert("RGBA")
    im2 = Image.open(gif_path).convert("RGBA")
    x_lengths = []
    y_giflengths = []
    y_lengths = []
    x_giflengths = []
    #png:
    for y in range(im.height):
        l = 0
        for x in range(im.width):
            if im.getpixel((x, y))[3] == 0:
                l += 1
            else:
                break
        x_lengths.append(l)
    
    for x in range(im.width):
        l = 0
        for y in range(im.height - 1, -1, -1):
            if im.getpixel((x, y))[3] == 0:
                l += 1
            else:
                break
        y_lengths.append(l)
    #gif:
    for y in range(im2.height):
        l = 0
        for x in range(im2.width):
            if im2.getpixel((x, y))[3] == 0:
                l += 1
            else:
                break
        x_giflengths.append(l)
    
    for x in range(im2.width):
        l = 0
        for y in range(im2.height - 1, -1, -1):
            if im2.getpixel((x, y))[3] == 0:
                l += 1
            else:
                break
        y_giflengths.append(l)

    
    return [min(x_lengths) - min(x_giflengths), min(y_lengths) - min(y_giflengths), im.width - im2.width, im.height - im2.height]

offset_data = {}
for ID in range(contruct_dex.pk_min, contruct_dex.pk_count + 1):
    p = "public\\data\\sprites\\"+str(ID)+"\\front_default.png"
    g = "public\\data\\sprites\\"+str(ID)+"\\generation-v\\front_default_analysis_frame.png"
    offset_data[str(ID)] = min_offsets(p, g)
    print(ID)
json_data = json.dumps(offset_data)
print(json_data)
f = open("public\\data\\sprites\\offset_data.json", 'w')
f.write(json_data)
f.close()
