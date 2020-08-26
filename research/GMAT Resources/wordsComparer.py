import csv

with open('translateen.csv',"r") as translateen_file:
    translateen = csv.reader(translateen_file)

    with open('graduateOnline.csv', "r") as graduateOnline_file:
        graduateOnline = csv.reader(graduateOnline_file)

        for line1 in translateen:
            for line2 in graduateOnline:
                # try:
                #     if(line1[0] == line2[0]):
                #         print(line2[0])
                # except:
                #     print("passed")
                #     pass
                if(line1[0] == line2[0]):
                    print(line2[0])
                        



        
            
            
            
            