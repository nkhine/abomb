# -*- coding: UTF-8 -*-
# # Copyright (C) 2007 Norman Khine <norman@zmgc.net>
import operator, json
import time, datetime
from BeautifulSoup import BeautifulSoup
from content_table import TABLE_CONTENT

combos={0: 'id',
		2: 'country',
		3: 'type',
		5: 'lat',
		6: 'lon',
		12: 'name' }

time_format = "%Y/%m/%d %H:%M:%S"

event_list = []
for event in TABLE_CONTENT:
	previousDetonation = None
	print previousDetonation
	event_dict = {}
	for index, item in enumerate(event):
		# time to next event
		previousDetonation = None
		if index == 8:
			if item == '&nbsp;':
				event_dict['depth'] = '0'
			else:
				event_dict['depth'] = item
		if index == 9:
			try:
				items = item.split()
				if len(items) >= 2:
					event_dict['yield'] = items[-1]
				else:
					if item == '&nbsp;':
						event_dict['yield'] = '10'
					else:
						event_dict['yield'] = item
			except:
				pass
		if index == 4:
			soup = BeautifulSoup(item)
			for a in soup.findAll('a'):
				event_date = ''.join(a.findAll(text=True))
				event_date = datetime.datetime.fromtimestamp(time.mktime(time.strptime(event_date, time_format)))
				event_dict['date'] = str(event_date)
		if index == 3:
			if 'Atmospheric' in item:
				event_dict['fill'] = 'red'
			if 'Underground' in item:
				event_dict['fill'] = 'green'
		elif index in combos:
			event_dict[combos[index]]=item
	event_list.append(event_dict)
event_list = sorted(event_list, key = operator.itemgetter('id'))

f = open('detonations.json', 'w')
f.write(json.dumps(event_list))
f.close()
print 'detonations.json, written!'
