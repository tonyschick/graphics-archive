
# coding: utf-8

# # NW Lake and Snowpack Tracker

# An automated script to download and process measurements of reservoir storage and snowpack from the Natural Resources Conservation Service. This script process serves the EarthFix/OPB News interactive found here: http://www.opb.org/news/widget/what-northwest-drought-looks-like-in-62-chart/

# ### Things to Remember 
# 
# Lake levels from the end of the current month need to be matched up with 
# snowpack levels from the first of the latest month. For instance, April lake 
# levels should use May snowpack.
# 
# * The database contains a total of 155 snowpack stations
# * The database contains a total of 62 reservoir stations
# * Charts date back to 1981 for consistency, but averages are for the station's full period of record
# * Upload the finished data here: http://s3.amazonaws.com/opb-news-interactives/news/2015/08August/lake-levels-data

# ### Needed libraries

# In[51]:

import datetime
import urllib2
import pandas as pd
import numpy as np
import dateutil
from dateutil.parser import parse

month = datetime.datetime.now().month
day = datetime.datetime.now().day


# ### Lake levels

# In[70]:

def get_lakelevels():

    #Get the previous month because readings are taken at the end of the month
    if month == 1:
        new_month = 12
    else:
        new_month = month - 1

    # Stick that month into our URL so we're grabbing the right data
    lakelevels_url = 'http://www3.wcc.nrcs.usda.gov/reportGenerator/view_csv/customMultipleStationReport/monthly/state=%22OR%22,%22WA%22%20AND%20element=%22RESC%22%20AND%20outServiceDate=%222100-01-01%22%7Cname/POR_BEGIN,POR_END:M%7C' + str(new_month) + '/name,RESC::pctOfAverage_1981'
   
    # Print the url just so we know what we're scraping
    print lakelevels_url

    # open up the page and read it
    page = urllib2.urlopen(lakelevels_url)
    page_content = page.read()

    # write the content into a csv for us
    with open('current_lakelevels.csv', 'w') as fid:
        fid.write(page_content)

    # the first 5 lines of that csv are unstructured metadata
    f = open('current_lakelevels.csv', 'r') 
    lines = f.readlines()

    # print them into new file 
    metadata = lines[:5]
    print metadata
    mf = open('lakelevels_metadata.txt'.format(state), 'w') 
    mf.write('{}'.format(metadata))
    mf.close()

    # then delete them from file
    f.close()
    open('current_lakelevels.csv'.format(state), 'w').writelines(lines[5:])

    #Enter pandas
    # open the csv into a dataframe called 'df'
    lakelevels_datafile = 'current_lakelevels.csv'
    df = pd.read_csv(lakelevels_datafile)

    # say hello to our datums
    df.head()

    # parse the 'Jul 1998' looking date into a python datetime field that looks like 1998-07-27
    df['new_date'] = pd.to_datetime(df['Date'])

    # take off the trailing spaces that could ruin our name match
    df['Station Name'] = df['Station Name'].str.strip()

    # check to see the results of the conversion
    df.head()

    #rename the fields in a new dataframe
    ndf = df.rename(columns={'Reservoir Storage Volume % of Average (1981-2010)': 'level', 'new_date': 'date', 'Station Name': 'name'})

    # reshape the data how we need it for easier use in D3
    lakes_pivoted = ndf.pivot('date', 'name', 'level')

    #print out a summary of what we're dealing with 
    print "Here's what your data looks like"
    print lakes_pivoted

    # write the new pivoted dataframe into a *new* csv file
    lakes_pivoted.to_csv('data/lakelevels.csv')


# ### Snowpack

# In[69]:

def get_snowpack():

    #Get the previous month because readings are taken at the end of the month
    if month == 1:
        new_month = 12
    else:
        new_month = month - 1
    
    # url that contains the snowpack data we need
    # url template http://www.wcc.nrcs.usda.gov/reportGenerator/view_csv/customMultipleStationReport/monthly/state=%22WA%22,%22OR%22%20AND%20network=%22SNTL%22%20AND%20element=%22WTEQ%22,%22WTEQV%22,%22WTEQX%22,%22WTEQN%22%20AND%20outServiceDate=%222100-01-01%22%7Cname/POR_BEGIN,POR_END:M%7C7/WTEQ::pctOfAverage_1981,name
    snowpack_url = 'http://www.wcc.nrcs.usda.gov/reportGenerator/view_csv/customMultipleStationReport/monthly/state=%22WA%22,%22OR%22%20AND%20network=%22SNTL%22%20AND%20element=%22WTEQ%22,%22WTEQV%22,%22WTEQX%22,%22WTEQN%22%20AND%20outServiceDate=%222100-01-01%22%7Cname/POR_BEGIN,POR_END:M%7C' + str(new_month) + '/WTEQ::pctOfAverage_1981,name'

    print "We're scraping this url:"
    print snowpack_url

    # open it up and read it
    page = urllib2.urlopen(snowpack_url)
    page_content = page.read()

    # write the content into a csv for us
    with open('current_snowpack.csv', 'w') as fid:
        fid.write(page_content)

    # the first 5 lines of that csv are unstructured metadata
    f = open('current_snowpack.csv', 'r') 
    lines = f.readlines()

    # print them into new file 
    metadata = lines[:5]
    print "We pulled this out of the CSV:"
    print metadata
    mf = open('snowpack_metadata.txt', 'w') 
    mf.write('{}'.format(metadata))
    mf.close()

    # then delete them from file
    f.close()
    open('current_snowpack.csv', 'w').writelines(lines[5:])

    
    #Enter pandas
    # open the csv into a dataframe called 'df'
    snowpack_datafile = 'current_snowpack.csv'
    df = pd.read_csv(snowpack_datafile)

    # make sure the data are there
    df.head()

    # parse the 'Jul 1998' looking date into a python datetime field that looks like 1998-07-27
    df['new_date'] = pd.to_datetime(df['Date'])

    # check to see the results of the conversion
    df.head()

    # rename the columns 'snowpack', 'date' and 'station_id' for consistency and ease in importing
    ndf = df.rename(columns={'Snow Water Equivalent % of Average (1981-2010)': 'snowpack', 'Station Name': 'name', 'new_date': 'date'})

    # write the new dataframe into a *new* csv file
    #ndf.to_csv('snowpack_upload_{}.csv'.format(state))
    
    # reshape the data how we need it for easier use in D3
    snowpack_pivoted = ndf.pivot('date', 'name', 'snowpack')

    #print out a summary of what we're dealing with 
    print "Here's what your data looks like"
    print snowpack_pivoted

    # write the new pivoted dataframe into a *new* csv file
    snowpack_pivoted.to_csv('data/snowpack.csv')


# In[71]:

# Function!
get_lakelevels()
get_snowpack()


# ### Basin snowpack for lakes

# In[100]:

# Get current snowpack measurements, averages and hydrologic unit codes
snowpack_url = 'http://www.wcc.nrcs.usda.gov/reportGenerator/view_csv/customMultipleStationReport/monthly/state=%22WA%22,%22OR%22%20AND%20network=%22SNTL%22%20AND%20element=%22WTEQ%22,%22WTEQV%22,%22WTEQX%22,%22WTEQN%22%20AND%20outServiceDate=%222100-01-01%22%7Cname/0,0/name,WTEQ::value,WTEQ::pctOfAverage_1981,WTEQ::average_1981,huc.huc'

# Get the list of lakes and hydrologic unit codes
lakelist_url = 'http://www3.wcc.nrcs.usda.gov/reportGenerator/view_csv/customMultipleStationReport/monthly/state=%22OR%22,%22WA%22%20AND%20element=%22RESC%22%20AND%20outServiceDate=%222100-01-01%22%7Cname/POR_BEGIN,POR_END:M%7C' + str(new_month) + '/name,huc.huc'

print "We're scraping these urls:"
print snowpack_url
print lakelist_url

# open up the snowpack page and read it
snowpack_page = urllib2.urlopen(snowpack_url)
snowpack_page_content = snowpack_page.read()


# open up the snowpack page and read it
lakelist_page = urllib2.urlopen(lakelist_url)
lakelist_page_content = lakelist_page.read()


### For snowpack ... 
# write the content into a csv for us
with open('snowpack_current.csv', 'w') as sfid:
    sfid.write(snowpack_page_content)

# the first 5 lines of that csv are unstructured metadata
sf = open('snowpack_current.csv', 'r') 
slines = sf.readlines()

# print them into new file 
smetadata = slines[:5]
print "We pulled this out of the CSV:"
print smetadata
smf = open('snowpack_metadata.txt', 'w') 
smf.write('{}'.format(smetadata))
smf.close()

# then delete them from file
sf.close()
open('snowpack_current.csv', 'w').writelines(slines[5:])


### For lakelevels ... 
# write the content into a csv for us
with open('lakelist_current.csv', 'w') as lfid:
    lfid.write(lakelist_page_content)

# the first 5 lines of that csv are unstructured metadata
lf = open('lakelist_current.csv', 'r') 
llines = lf.readlines()

# print them into new file 
lmetadata = llines[:5]
print "We pulled this out of the CSV:"
print lmetadata
lmf = open('lakelist_metadata.txt', 'w') 
lmf.write('{}'.format(lmetadata))
lmf.close()

# then delete them from file
lf.close()
open('lakelist_current.csv', 'w').writelines(llines[5:])


# In[101]:

# open the csv into a dataframe called 'df'
snowpack_datafile = 'snowpack_current.csv'
sdf = pd.read_csv(snowpack_datafile)
    
# open the csv into a dataframe called 'df'
lakelist_datafile = 'lakelist_current.csv'
ldf = pd.read_csv(lakelist_datafile)


# In[155]:

# Set a new field equal to HUC, converted to a string
sdf['basin_huc'] = sdf['HUC'].astype(str)
ldf['basin_huc'] = ldf['HUC'].astype(str)


# In[156]:

# Then pull out the left six characters. That's our basin code
sdf['basin_huc'] = sdf['basin_huc'].str[:6]
ldf['basin_huc'] = ldf['basin_huc'].str[:6]


# In[187]:

mean_sdf = sdf.groupby(['basin_huc'], as_index=False).mean()


# In[186]:

# Merge this new dataframe of basin aggregations with our lake list
mdf = pd.merge(ldf, mean_sdf, on='basin_huc', how='outer')


# In[181]:

# Limit the dataframe ot only the columns we want 
mdf = mdf[['Station Name', 'Snow Water Equivalent (in)', 'Average Snow Water Equivalent (1981-2010) (in)']]

# And rename them into more manageable field names
mdf = mdf.rename(columns={'Station Name': 'name', 'Snow Water Equivalent (in)': 'current_basin_snowpack', 'Average Snow Water Equivalent (1981-2010) (in)': 'average_basin_snowpack'})


# In[185]:

mdf.to_csv('data/lake_snowpack.csv')


# ### Load it into S3!

# In[188]:

import os
os.system('aws s3 cp data s3://opb-news-interactives/news/2015/08August/lake-levels-data --recursive --acl public-read')


# In[ ]:



