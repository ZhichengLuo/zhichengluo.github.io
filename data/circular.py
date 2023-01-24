import pandas as pd
file = './data/CLDS2018_for_visualization.csv'
df = pd.read_csv(file)
print(df['Attitude'])
df['Attitude'] = df['Attitude'].apply(lambda x: -1 if x == 1 else 0 if x== 2 else 1) 
df['SocialMedia'] = df['SocialMediaUsageFrequency']
df['OnlineShopping'] = df['OnlineShoppingFrequency']
df['StudiedAbroad'] = df["HasStudiesAbroad"]
global_mean = float(df[['Attitude']].mean())
print("global_mean", global_mean)
positive_data = []
negative_data = []
for col in ['Education', 'Age', 'Income','SocialMedia', 'MaritalStatus', 'OnlineShopping', 'StudiedAbroad', 'ReligiousBelief']:
    group_means = df[['Attitude', col]].groupby(by=col).mean()
    min_index_value = (None, 1)
    max_index_value = (None, -1)
    for index, item in group_means.iterrows():
        if item['Attitude'] >= max_index_value[1]: 
            max_index_value = (index, item['Attitude'])
        if item['Attitude'] <= min_index_value[1]:
            min_index_value = (index, item['Attitude'])
    print(min_index_value, max_index_value)
    positive_data.append((col, max_index_value[0], max_index_value[1] - global_mean))
    negative_data.append((col, min_index_value[0], global_mean - min_index_value[1],))
positive_df = pd.DataFrame(positive_data, columns=['column', 'index', 'diff'])
negative_df = pd.DataFrame(negative_data, columns=['column', 'index', 'diff'])
print(positive_df)
print(negative_df)
positive_df.to_csv("./data/positive_circular.csv")
negative_df.to_csv("./data/negative_circular.csv")