import numpy as np
import pandas as pd

file = 'CLDS2018_cleaned_data.csv'
df = pd.read_csv(file)
# 1-3 : negative - neutral - positive
df['Attitude'] = df['AttitudeToHomosexuality'].apply(lambda x: 'Negative' if x <= 2 else 'Neutral' if x <= 3 else 'Positive') 

# 1-3 : young - middle - old
df['Age'] = (2018-df['Birthyear']).apply(lambda x: 'Youth(<=30)' if x <= 30 else 'Middle-Age(30~60)' if x <= 60 else 'Elder(>60)') 

# 1-3 : low - middle - high income
df['Income'] = df['AnnualIncome'].apply(lambda x: 'Low(<=20k)' if x <= 20000 else 'Medium(20k~100k)' if x <= 100000 else 'High(>100k)') 

# 1-4 : uneducated - low - middle - hight education
df['Education'] = df['EducationLevel'].apply(lambda x: 'High-Educated' if x >= 8 else 'Mid-Educated' if x >= 4 else 'Low-Educated' if x >= 2 else 'Uneducated') 

df.to_csv('CLDS2018_vis_str.csv')