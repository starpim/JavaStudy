from flask import Flask,render_template,request,send_file
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from io import BytesIO
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import numpy as np
import pickle 
from tmdbv3api import Movie,TMDb


movie=Movie()
tmdb=TMDb()

tmdb.api_key = 'c668cda4cf75bf267ef2aeffa2da0341'
tmdb.language='ko-KR'

app=Flask(__name__)
 




@app.route('/')
def index():
    return render_template('index.html')

@app.route('/page1')
def page1():
    return render_template('page1.html')
@app.route('/page2')
def page2():
    return render_template('page2.html')

@app.route('/page3')
def page3():
    return render_template('page3.html')

@app.route('/movie1.json')
def movie1():
    
    movies=pickle.load(open('movies1.pickle','rb'))
    json=[]
    for i in range(10):
        etitle=movies['title'].iloc[i]
        title=movies['title'].iloc[i]
        id=movies['id'].iloc[i]
        details = movie.details(id)
        image=details['poster_path']
        title=details['title']
        if image:
            image='http://image.tmdb.org/t/p/w500'+image
        else:
            image='http://via.placeholder.com/100x120'
        score=round(movies['score'].iloc[i],2)        
        data={'제목':title, '아이디':str(id), '점수':str(score)+'점', 'image':image, 'etitle':etitle}
        json.append(data)
        
        
    return json



@app.route('/movies.json')
def movies():
    
    movies=pickle.load(open('movies.pickle','rb'))
    json=movies.to_json(orient='records')       
        
    return json

@app.route('/movies2.json/<title>')
def movies2(title):
    #유사도 값 
    sim=pickle.load(open('./data/sim.pickle','rb'))
    movies=pickle.load(open('movies.pickle','rb'))
    
    
    filter=movies['title']==title
    idx=movies[filter].index[0]

    sim_scores=sim[idx]
    sim_scores=list(enumerate(sim_scores))
    sim_scores=sorted(sim_scores,key=lambda x:x[1], reverse=True)
    
    sim_scores=sim_scores[1:13]
    
    sim_movies=[i[0] for i in sim_scores ]
    
    json=[]
    for i in range(12):
         
        etitle=movies['title'].iloc[sim_movies[i]]
        id=movies['id'].iloc[sim_movies[i]]
        details = movie.details(id)
        image=details['poster_path']
        title=details['title']
        if image:
            image='http://image.tmdb.org/t/p/w500'+image
        else:
            image='http://via.placeholder.com/100x120'
            
        data={'etitle':etitle,'title':title,'image':image}
        json.append(data)
    
    
    
   # json=movies.to_json(orient='records')       
        
    return json



 

@app.route('/movies3.json/<title>')
def movies3(title):
    #유사도 값 
    sim=pickle.load(open('./data/sim2.pickle','rb'))
    movies=pickle.load(open('movies.pickle','rb'))
    
    
    filter=movies['director']==director
    idx=movies[filter].index[0]

    sim_scores=sim[idx]
    sim_scores=list(enumerate(sim_scores))
    sim_scores=sorted(sim_scores,key=lambda x:x[1], reverse=True)
    
    sim_scores=sim_scores[1:13]
    
    sim_movies=[i[0] for i in sim_scores ]
    
    json=[]
    for i in range(12):
        director=movies['director'].iloc[sim_movies[i]]
        etitle=movies['title'].iloc[sim_movies[i]]
        id=movies['id'].iloc[sim_movies[i]]
        details = movie.details(id)
        image=details['poster_path']
        title=details['title']
        if image:
            image='http://image.tmdb.org/t/p/w500'+image
        else:
            image='http://via.placeholder.com/100x120'
            
        data={'etitle':etitle,'title':title,'image':image, 'director':director}
        json.append(data)
    
    
    
   # json=movies.to_json(orient='records')       
        
    return json
     
     
     

if __name__=='__main__':
    app.run(port=5000, debug=True)
