import pandas as pd
file = './data/CLDS2018_for_visualization.csv'
df = pd.read_csv(file)

df['Attitude'] = df['Attitude'].apply(lambda x: -1 if x == 1 else 0 if x== 2 else 1)
global_mean = float(df[['Attitude']].mean())
print("global_mean", global_mean)

df['Attitude_diff'] = df['Attitude'].apply(lambda x: x - global_mean)
df['OnlineShopping'] = df['OnlineShoppingFrequency']
df['StudiedAbroad'] = df["HasStudiesAbroad"]
cols = ['Education', 'Age', 'Income', 'MaritalStatus',]
for i, c1 in enumerate(cols):
    for j, c2 in enumerate(cols[i+1:]):
        df_group = df[[c1, c2, 'Attitude_diff']].groupby([c1, c2]).mean()
        df_group.to_csv("./data/heatmap_data/"+c1+"_"+c2+".csv")
        # print(df_group)
        