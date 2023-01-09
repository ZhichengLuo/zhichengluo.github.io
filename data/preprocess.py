import numpy as np
import pandas as pd

file = 'CLDS2018_cleaned_data.csv'
df = pd.read_csv(file)
# negative - neutral - positive
df['Attitude'] = df['AttitudeToHomosexuality'].apply(lambda x: 1 if x <= 2 else 2 if x <= 3 else 3) 

# young - middle - old
df['Age'] = (2018-df['Birthyear']).apply(lambda x: 1 if x <= 30 else 2 if x <= 60 else 3) 

# low - middle - high income
df['Income'] = df['AnnualIncome'].apply(lambda x: 1 if x <= 20000 else 2 if x <= 100000 else 3) 

# low - middle - hight education
df['Education'] = df['EducationLevel'].apply(lambda x: 4 if x >= 8 else 3 if x >= 4 else 2 if x >= 2 else 1) 

df.to_csv('CLDS2018_for_visualization.csv')