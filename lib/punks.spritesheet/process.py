from collections import namedtuple
import enum
from math import ceil, floor
from PIL import Image
import json

Attribute = namedtuple("Attribute", ["id", "name", "gender", "size", "type"])

index_category_map = {
  "base": range(0, 229),
  "eyes": range(229, 281),
  "cheeks": range(281, 293),
  "ears": range(293, 297),
  "mouth": range(297, 305),
  "mouthAccessory": range(305, 317),
  "neck": range(317, 324),
  "beard": range(324, 336),
  "headAccessory": range(336, 729), 
}
category_order = ["base", "cheeks", "mouth", "neck", "beard", "headAccessory", "mouthAccessory", "eyes", "ears"]
category_map = [None] * 729
for category, _range in index_category_map.items():
  for i in _range:
    category_map[i] = category

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

attributes_by_category = {key: [] for key in index_category_map.keys()}
with open("spritesheet.csv") as csv:
  for i, line in enumerate(csv):
    parts = line.split(", ")
    original_id = int(parts[0])
    csv_attr = parts[1]
    csv_gender = parts[2]
    csv_size = parts[3]
    csv_type = category_map[original_id]
    attribute = Attribute(original_id, csv_attr, csv_gender, csv_size, csv_type)
    if i in range(0, 12) or (not "B&W" in csv_attr and csv_attr in attribute_names):
      if csv_gender == "f":
        if csv_size in ["s", "u"]:
          attributes_by_category[csv_type].append(attribute)
      else:
        attributes_by_category[csv_type].append(attribute)

# Sort each category
lengths_per_gender_by_category = {key: [] for key in index_category_map.keys()}
for category, attributes in attributes_by_category.items():
  
  male = [x for x in attributes if x.gender in ["u", "m"]]
  unisex = [] #[x for x in attributes if x.gender == "u"]
  female = [x for x in attributes if x.gender == "f"]

  attributes_by_category[category] = [
    *sorted(male, key=lambda x: x.id),
    *sorted(unisex, key=lambda x: x.id),
    *sorted(female, key=lambda x: x.id)
  ]

  lengths_per_gender_by_category[category] = [len(male), len(unisex), len(female)]
  
sorted_attributes = []
ranges_per_category = {key: [] for key in index_category_map.keys()}
counter = 0
for category in category_order:
  ranges_per_category[category] = [counter]
  cumsum = counter
  print(lengths_per_gender_by_category[category])
  for length in lengths_per_gender_by_category[category]:
    cumsum += length
    ranges_per_category[category].append(cumsum)
    
  for attribute in attributes_by_category[category]:
    sorted_attributes.append(attribute)
    counter += 1

print(ranges_per_category)
    

im = Image.open("spritesheet-original.png")
out_im = Image.new("RGBA", (24*25, ceil(len(sorted_attributes) / 25)*24))
for (i, attribute) in enumerate(sorted_attributes):
  id = attribute.id

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
  csv_body = "\n".join([",".join([str(i), *x[1:5]]) for i, x in enumerate(sorted_attributes)])
  csv_body_original_ids = "\n".join([",".join([str(x[0]), *x[1:5]]) for x in sorted_attributes])
  with open("spritesheet-filtered.csv", "w") as csv_f:
    csv_f.write("id, name, gender, size, category\n"+csv_body)
  json_content = {"csv": csv_body, "ranges": ranges_per_category, "render_order": category_order}
  json.dump(json_content, f)

print(len(sorted_attributes), len(attribute_names))

    