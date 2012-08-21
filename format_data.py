# -*- coding: UTF-8 -*-
# # Copyright (C) 2007 Norman Khine <norman@zmgc.net>
import operator, json
from BeautifulSoup import BeautifulSoup

combos={0: 'id',
		2: 'country',
		3: 'type',
		5: 'lat',
		6: 'lon',
		8: 'depth',
		9: 'yield',
		12: 'name' }



event_list = []
for event in TABLE_CONTENT:
	event_dict = {}
	for index, item in enumerate(event):
		if index == 4:
			soup = BeautifulSoup(item)
			for a in soup.findAll('a'):
				event_dict['date'] = ''.join(a.findAll(text=True))
		elif index in combos:
			event_dict[combos[index]]=item
	event_list.append(event_dict)
event_list = sorted(event_list, key = operator.itemgetter('id'))

f = open('detonations.json', 'w')
f.write(json.dumps(event_list) + "\n")
f.close()
print 'detonations.json, written!'