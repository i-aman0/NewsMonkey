import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {

    static defaultProps={
        country: 'in',
        pageSize: 15,
        category: 'general'
    }

    static propTypes={
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    capitaliseFirstLetter = (string)=>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props){
        super(props); // it is mandatory to call super inside the constructor, otherwise an error will be thrown
        console.log("Hello, I am a constructor from the news component.");
        this.state={
            articles: [],
            loading: false,
            page: 1
        }
        document.title=`${this.capitaliseFirstLetter(this.props.category)} - NewsMonkey`;
    }

    // this method will run after render() method is finished
    async componentDidMount(){
        let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ed0f172c5cb44e0e88d913335458b1c9&page=1&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        fetch(url).then((res) => res.json())
                .then((json) => {
                    this.setState({
                        articles: json.articles,
                        loading: false,
                        totalResults: json.totalResults,
                        loading: false
                    });
                })
    }

    async updateNews(){
        const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ed0f172c5cb44e0e88d913335458b1c9&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        fetch(url).then((res) => res.json())
                .then((json) => {
                    this.setState({
                        articles: json.articles,
                        loading: false,
                        totalResults: json.totalResults,
                        loading: false
                    });
                })
    }

    handlePrevClick=()=>{
        console.log("Previous Clicked");
        // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ed0f172c5cb44e0e88d913335458b1c9&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
        // this.setState({loading: true});
        // fetch(url).then((res) => res.json())
        //         .then((json) => {
        //             this.setState({
        //                 articles: json.articles,
        //                 page: this.state.page-1,
        //                 loading: false
        //             });
        //         })

        this.setState({page: this.state.page-1});
        this.updateNews();

    }
    
    handleNextClick=()=>{
        console.log("Next Clicked");

        // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ed0f172c5cb44e0e88d913335458b1c9&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        // this.setState({laoding: true});
        // fetch(url).then((res) => res.json())
        //         .then((json) => {
        //             this.setState({
        //                 articles: json.articles,
        //                 page: this.state.page+1,
        //                 loading: false
        //             });
        //         })

        this.setState({page: this.state.page+1});
        this.updateNews();
    }

  render() {
    return (
      <div className='container my-4'>
        <h1 className='text-center my-3'>NewsMonkey - Top {this.capitaliseFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className="row my-3 my-5">
            {!this.state.loading && this.state.articles.map((element)=>{
                return <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                        </div>
            })}
            
        </div>
        <div className="container d-flex justify-content-between">
        <button type="button" disabled={this.state.page<=1} className="btn btn-primary" onClick={this.handlePrevClick}>&larr; Previous</button>
        <button type="button" disabled={this.state.page+1 > (Math.ceil(this.state.totalResults/this.props.pageSize))} className="btn btn-primary" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News
