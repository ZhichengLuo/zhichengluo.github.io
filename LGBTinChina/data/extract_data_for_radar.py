import pandas as pd

file = 'CLDS2018_for_visualization.csv'
df = pd.read_csv(file)

data = df.groupby('Attitude').mean()
cols = ['Education', 'Age', 'Income', 'HomosexualPeopleYouKnow', 'HowMuchYouAgreeThatHavingBoysBetterThanGirls']
data = data[cols]

for col in cols:
    data[col] = data[col].apply(lambda x: (x-data[col].min())/(data[col].max()-data[col].min()))
    data[col] = data[col].apply(lambda x: 0.6 * x + 0.2)

data.to_csv('data_for_radar.csv', float_format='%.3f')
