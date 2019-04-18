import numpy as np
import os
import cv2
from tqdm import tqdm
import random
import pickle

DATADIR = "../dataset"

CATEGORIES = ["square", "oval", "heart", "round", "oblong"]

IMG_SIZE = 50

#start building the training data
training_data = []

def create_training_data():
    for category in CATEGORIES:  # iterate over all the categories
	
	# create path 
        path = os.path.join(DATADIR,category) 
	# get the classification 
        class_num = CATEGORIES.index(category) 
 
	# iterate over each image per category
        for img in os.listdir(path):  
            try:
		# convert to array
                img_array = cv2.imread(os.path.join(path,img) ,cv2.IMREAD_GRAYSCALE) 
		# resize to normalize data size
                new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE)) 
		# add this to our training_data
                training_data.append([new_array, class_num])  
            except Exception as e: 
                pass
            except OSError as e:
                print("OSErrroBad img most likely", e, os.path.join(path,img))
            except Exception as e:
                print("general exception", e, os.path.join(path,img))

create_training_data()

#shuffle the data 
random.shuffle(training_data)

#empty lists (X for features, y for labels)
X = []
y = []

for features,label in tqdm(training_data):
    X.append(features)
    y.append(label)

print(training_data)
length = len(training_data)
print(length)

print(y)


X = np.array(X).reshape(-1, IMG_SIZE, IMG_SIZE, 1)



pickle_out = open("X.pickle","wb")
pickle.dump(X, pickle_out)
pickle_out.close()

pickle_out = open("y.pickle","wb")
pickle.dump(y, pickle_out)
pickle_out.close()







