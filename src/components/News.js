import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)


    const capitaliseFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



    useEffect(() => {
        document.title = `${capitaliseFirstLetter(props.category)} - NewsMonkey`;
        updateNews();
    }, [])


    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=ed0f172c5cb44e0e88d913335458b1c9&page=${page}&pageSize=${props.pageSize}`;
        props.setProgress(30);
        setLoading(true);
        fetch(url).then((res) => res.json())
            .then((json) => {
                setArticles(json.articles)
                setTotalResults(json.totalResults)
                setLoading(false)
            })

        props.setProgress(100);
    }

    const fetchMoreData = async () => {


        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=ed0f172c5cb44e0e88d913335458b1c9&page=${page + 1}&pageSize=${props.pageSize}`;

        setPage(page + 1)
        fetch(url).then((res) => res.json())
            .then((json) => {
                setArticles(articles.concat(json.articles))
                setTotalResults(json.totalResults)
            })
    };

    return (
        <>
            <h1 className='text-center' style={{ marginTop: '90px' }}>NewsMonkey - Top {capitaliseFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row my-3 my-5">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}

                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
}


News.defaultProps = {
    country: 'in',
    pageSize: 15,
    category: 'general'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News
