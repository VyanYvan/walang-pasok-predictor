"""Builds data/ncr-geo.json (map paths, label points, adjacency edges) from the faeldon/philippines-json-maps 2023 dataset.

Setup:
  pip install shapely
  Download https://github.com/faeldon/philippines-json-maps and place the folder "philippines-json-maps-master" next to this script.
Run:
  python scripts/build_geo.py   (writes geo.json; move it to data/ncr-geo.json)
Then run scripts/build_app.py to inject the data into index.html.
"""
import json,glob,math
from shapely.geometry import shape, box, mapping
from shapely.ops import polylabel
M='philippines-json-maps-master/2023/geojson/'
cities={}
dist={'1303900000':'NCR 1st District','1307400000':'NCR 2nd District','1307500000':'NCR 3rd District','1307600000':'NCR 4th District'}
short={'City of Manila':'Manila','City of Mandaluyong':'Mandaluyong','City of Marikina':'Marikina','City of Pasig':'Pasig','Quezon City':'Quezon City','City of San Juan':'San Juan','City of Caloocan':'Caloocan','City of Malabon':'Malabon','City of Navotas':'Navotas','City of Valenzuela':'Valenzuela','City of Las Piñas':'Las Piñas','City of Makati':'Makati','City of Muntinlupa':'Muntinlupa','City of Parañaque':'Parañaque','Pasay City':'Pasay','City of Taguig':'Taguig','Pateros':'Pateros'}
for f in glob.glob(M+'provdists/medres/municities-provdist-130*.json'):
    code=f.split('provdist-')[1][:10]
    for ft in json.load(open(f))['features']:
        p=ft['properties']; n=short[p['adm3_en']]
        cities[n]=dict(g=shape(ft['geometry']).buffer(0),district=dist[code],lgu_type=p['geo_level'],psgc=p['adm3_psgc'])
allg=[c['g'] for c in cities.values()]
minx=min(g.bounds[0] for g in allg);miny=min(g.bounds[1] for g in allg);maxx=max(g.bounds[2] for g in allg);maxy=max(g.bounds[3] for g in allg)
pad=0.06
bb=(minx-0.30,miny-0.035,maxx+0.05,maxy+0.035)
lat0=(miny+maxy)/2; kx=math.cos(math.radians(lat0))
W=700
scale=W/((bb[2]-bb[0])*kx)
H=(bb[3]-bb[1])*scale
def P(x,y): return ((x-bb[0])*kx*scale,(bb[3]-y)*scale)
def path(g):
    polys=[g] if g.geom_type=='Polygon' else list(g.geoms)
    out=[]
    for pg in polys:
        if pg.geom_type!='Polygon': continue
        for ring in [pg.exterior]+list(pg.interiors):
            pts=[P(x,y) for x,y in ring.coords]
            out.append('M'+'L'.join(f'{a:.1f},{b:.1f}' for a,b in pts)+'Z')
    return ''.join(out)
res={'W':round(W),'H':round(H),'cities':{},'bg':[],'edges':[]}
for n,c in cities.items():
    lp=polylabel(c['g'] if c['g'].geom_type=='Polygon' else max(c['g'].geoms,key=lambda q:q.area),tolerance=0.0005)
    x,y=P(lp.x,lp.y)
    area=c['g'].area*(111.32**2)*kx
    res['cities'][n]=dict(d=path(c['g'].simplify(0.0004)),lx=round(x,1),ly=round(y,1),district=c['district'],type='Municipality' if c['lgu_type']=='Mun' else 'City',psgc=c['psgc'])
# adjacency with shared border km
names=sorted(cities)
for i,a in enumerate(names):
    for b in names[i+1:]:
        ga,gb=cities[a]['g'],cities[b]['g']
        L=ga.boundary.buffer(0.001).intersection(gb.boundary.buffer(0.001)).area/0.002*111
        if L>=0.3: res['edges'].append([a,b,round(L,1)])
# background provinces
clip=box(*bb)
for f in glob.glob(M+'regions/medres/*'):
    for ft in json.load(open(f))['features']:
        g=shape(ft['geometry']).buffer(0).intersection(clip)
        if not g.is_empty:
            big=g if g.geom_type=='Polygon' else max([q for q in getattr(g,'geoms',[g]) if q.geom_type=='Polygon'],key=lambda q:q.area)
            lp=polylabel(big,0.001); lx,ly=P(lp.x,lp.y)
            res['bg'].append(dict(name=ft['properties']['adm2_en'],lx=round(lx),ly=round(ly),area=big.area,d=path(g.simplify(0.0006)) if g.geom_type in('Polygon','MultiPolygon','GeometryCollection') else ''))
json.dump(res,open('geo.json','w'),ensure_ascii=False)
print(res['W'],res['H'],len(res['edges']),[b['name'] for b in res['bg']], len(json.dumps(res))//1024,'KB')
for e in res['edges']: print(e)

g=cities['Caloocan']['g']
labs=[]
for q in sorted(g.geoms,key=lambda q:-q.area)[:2]:
    lp=polylabel(q,0.0005); labs.append([round(v,1) for v in P(lp.x,lp.y)])
res['cities']['Caloocan']['lx'],res['cities']['Caloocan']['ly']=labs[0]; res['cities']['Caloocan']['extra']=labs[1]
json.dump(res,open('geo.json','w'),ensure_ascii=False)
print([(b['name'],b['lx'],b['ly'],round(b['area'],4)) for b in res['bg']])
print({k:(v['lx'],v['ly']) for k,v in res['cities'].items()})
