import React, { Component } from 'react';
import { subscribeToQueue } from './../api/TweetsAPI';
import {Bar, Line, Pie} from 'react-chartjs-2';
import positive_image from './../public/positive.svg';
import negative_image from './../public/negative.svg';

class App extends Component {

    state = {
        tweet_pred: [],
        positive_count: 0,
        negative_count: 0,
        tweet_pred_display: [],
        isHold: false,
    };

    constructor(props) {
        super(props);
        subscribeToQueue((err, tweet) => {
            if(!this.state.isHold){
                var tweets = this.state.tweet_pred;
                // console.log(tweet);
                tweet = JSON.parse(tweet);
                if(tweets.length > 100)
                    tweets.shift();
                tweets.push(tweet);
                if(tweet.sentiment == "0.0"){
                    this.setState({
                        tweet_pred : tweets,
                        negative_count : this.state.negative_count + 1
                    })
                }
                else{
                    this.setState({
                        tweet_pred : tweets,
                        positive_count : this.state.positive_count + 1
                    })
                }
            }
        });
    }

    addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(this.state.positive_count);
        });
        chart.update();
    }

    

    createItemsList(){
        return this.state.tweet_pred.map((tweet) => {
            return(
                    <tr>
                        <td>
                            {tweet.text}
                        </td>
                        <td width = "60">
                            {this.renderIcon(tweet)}
                        </td>
                    </tr>
            );
        });
    }

    renderIcon(tweet){
        if(tweet.sentiment == "0.0"){
        return(
            <img type="image/svg+xml" src={negative_image} height="30px" alt='logo'/>
        )}
        else{
        return(
            <img type="image/svg+xml" src={positive_image} height="30px" alt='logo'/>
        )}
    }

    render() {
        const style = { display: 'flex', justifyContent: 'center', alignItems: 'center'}
        const style_p = { display: 'flex', justifyContent: 'center', alignItems: 'center', 'margin-right': '30px'}
        // const style_color = { backgroundColor: '#eaebed'}
        return (
        <div class="container-fluid">
            <div class="row">
                <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                    <div class="sidebar-sticky">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link active">
                                    Sentiment Analysis
                                    <span class="sr-only">(current)</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <input className="form-control" type="text" label="Keyword" placeholder="Keyword"/>
                            </li>
                            <li class="nav-item">
                                <div class="btn-toolbar mb-2 mb-md-0">
                                    <button class="btn btn-sm btn-outline-secondary">Analyze Tweets</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div class="col-md-9 ml-sm-auto col-lg-10">
                    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 class="h2">Dashboard</h1>
                        <div class="btn-toolbar mb-2 mb-md-0">
                            <div class="btn-group mr-2">
                            {this.state.isHold ?
                                <button class="btn btn-sm btn-outline-secondary"
                                    onClick={(event) => 
                                        this.setState({
                                            isHold: false
                                        })
                                    }>
                                Resume
                                </button>:
                                <button class="btn btn-sm btn-outline-secondary"
                                    onClick={(event) => 
                                        this.setState({
                                            isHold: true
                                        })
                                    }>
                                Pause
                                </button>
                            }
                            </div>
                        </div>
                    </div>
                    <div className = "row">
                        <div class="my-4 w-50" width="500px" height="180px" position="absolute">
                            <Pie id="lineChart" data={{
                                    labels: ["positive", "negative"],
                                    datasets: [
                                        {
                                            label:"Tweets",
                                            data:[this.state.positive_count/(this.state.positive_count + this.state.negative_count)*100,this.state.negative_count/(this.state.positive_count + this.state.negative_count)*100],
                                            backgroundColor:['rgba(124, 254, 0, 0.6)','rgba(255, 0, 0, 0.6)']
                                        },
                                        ]
                                    }}
                                options={{
                                title:{
                                display:"display", text:"Analysis Result", fontSize:15},
                                legend:{
                                display:"false", position:"xyz"},
                                // scales: {
                                //     yAxes: [{
                                //         display: true,
                                //         ticks: {
                                //             beginAtZero: true,
                                //             max: 100
                                //         }
                                //     }]
                                // },
                                responsive: true,
                                maintainAspectRatio: true}}/>
                        </div>
                        <div  className = "col-md-1 ml-sm-1 col-lg-1"/>
                        <div  className = "row col-md-3 ml-sm-3 col-lg-3" style={style}>
                            <div className="col-md-6 ml-sm-6 col-lg-6">
                                <img style={style} type="image/svg+xml" src={positive_image} height="60px" alt='logo'/>
                                <p style={style_p}>{this.state.positive_count}</p>
                            </div>
                            <div className="col-md-6 ml-sm-6 col-lg-6"> 
                                <img style={style} type="image/svg+xml" src={negative_image} height="60px" alt='logo'/>
                                <p style={style_p}>{this.state.negative_count}</p>    
                            </div>
                        </div>
                    </div>
                    <h4>Tweet Sentiments</h4>
                    <div class="table-responsive">
                        <table class="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>Tweet</th>
                                    <th width = "60">Sentiment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.createItemsList()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default App;