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
  for line in csv:
    csv_attr = line.split(", ")[1]
    csv_size = line.split(", ")[3]
    if not "B&W" in csv_attr and csv_attr in attribute_names:
      pos = attribute_names.index(csv_attr)
      new_lines.append(line)

with open("spritesheet-filtered.csv", "w") as f:
  f.writelines(new_lines)

print(len(new_lines), len(attribute_names))

    