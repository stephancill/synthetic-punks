import enum
from math import floor
from PIL import Image
import json

attribute_names = []
missing = []

with open("attributes.txt") as attributes:
  for line in attributes:
    attr = line.strip()
    attribute_names.append(attr)

    ## All of them exist in set
    # found = False
    # for csv_attr in csv_attribute_names:
    #   if attr in csv_attr:
    #     found = True
    #     break
    # if not found:
    #   missing.append(attr)

new_lines = []
with open("spritesheet.csv") as csv:
  for i, line in enumerate(csv):
    parts = line.split(", ")
    csv_attr = parts[1]
    csv_gender = parts[2]
    csv_size = parts[3]
    if i in range(1, 12) or (not "B&W" in csv_attr and csv_attr in attribute_names):
      if csv_gender == "f":
        if csv_size == "s":
          new_lines.append(line)
      else:
        new_lines.append(line)

im = Image.open("spritesheet-original.png")
out_im = Image.new("RGBA", (24*25, floor(len(new_lines) / 25)*24))
for (i, line) in enumerate(new_lines):
  cols = line.split(", ")
  id = int(cols[0])

  x = (id % 25) * 24
  y = (floor(id / 25)) * 24
  box = (x, y, x+24, y+24)

  region = im.crop(box)

  new_x = i % 25
  new_y = floor(i/25)
  new_box = (new_x*24, new_y*24)
  out_im.paste(region, new_box)

out_im.save("spritesheet.png")
out_im.show()

csv_body = None
with open("spritesheet-filtered.json", "w") as f:
  csv_body = "\n".join([", ".join([str(i), *x.split(", ")[1:4]]) for i, x in enumerate(new_lines)])
  with open("spritesheet-filtered.csv", "w") as csv_f:
    csv_f.write("id, name, gender, size\n"+csv_body)
  json_content = {"csv": csv_body}
  json.dump(json_content, f)



print(len(new_lines), len(attribute_names))

    