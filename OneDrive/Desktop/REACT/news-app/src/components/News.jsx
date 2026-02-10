import React, { Component } from "react";
import NewsItem from "./NewsItem";

let article = {
    status: "ok",
    totalResults: 69,
    articles: [
        {
            source: { id: "bloomberg", name: "Bloomberg" },
            author: "Brian W Smith, Michael Gambale",
            title: "Alphabet Looks to Raise About $15 Billion From US Bond Sale",
            description:
                "Alphabet Inc. is looking to raise about $15 billion from a US high grade dollar bond sale.",
            url: "https://www.bloomberg.com",
            urlToImage:
                "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ieTDFXI6mIc8/v0/1200x800.jpg",
            publishedAt: "2026-02-09T14:07:28Z"
        },
        {
            source: { id: "cnn", name: "CNN" },
            author: "Jackie Wattles",
            title: "Elon Musk aims for Moon instead of Mars",
            description:
                "Elon Musk shifts focus from Mars settlement to Moon mission.",
            url: "https://www.cnn.com",
            urlToImage:
                "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
            publishedAt: "2026-02-09T04:26:00Z"
        },
        {
            source: { id: "cnbc", name: "CNBC" },
            author: "Robert Frank",
            title: "Hamptons real estate prices hit record",
            description:
                "Hamptons real estate prices reach all time high in 2026.",
            url: "https://www.cnbc.com",
            urlToImage:
                "https://image.cnbcfm.com/api/v1/image/108261485-1770230975557.jpg",
            publishedAt: "2026-02-09T13:05:30Z"
        }
    ]
};

export class News extends Component {
    constructor() {
        super();
        this.state = {
            articles: [],
            page: 1,
            totalResults: 0
        };
    }
    async componentDidMount() {
        let url = `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&page=1&pageSize=11&apiKey=cb49e71beee64839a0d5dfb8a60b5cc3`;
        let data = await fetch(url);
        let parsedData = await data.json();

        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults
        });
    }


    handlePrevpage = async () => {
        let prevPage = this.state.page - 1;
        let url = `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&page=${prevPage}&pageSize=11&apiKey=cb49e71beee64839a0d5dfb8a60b5cc3`;

        let data = await fetch(url);
        let parsedData = await data.json();

        this.setState({
            page: prevPage,
            articles: parsedData.articles
        });
    };

    handleNextpage = async () => {
        let nextPage = this.state.page + 1;
        let url = `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&page=${nextPage}&pageSize=11&apiKey=cb49e71beee64839a0d5dfb8a60b5cc3`;

        let data = await fetch(url);
        let parsedData = await data.json();

        this.setState({
            page: nextPage,
            articles: parsedData.articles
        });
    };



    render() {
        return (
            <div className="container my-4">
                <h2 className="text-center mb-4">📰 Top News Headlines</h2>

                <div className="row">
                    {this.state.articles.map((element) => {

                        return (
                            <div className="col-md-4 mb-4" key={element.url}>
                                <NewsItem
                                    title={element.title ? element.title.slice(0, 45) + "..." : ""}
                                    description={element.description ? element.description.slice(0, 88) + "..." : ""}
                                    imageurl={element.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c"}

                                    newsURL={element.url}
                                />
                            </div>


                        );
                    })}
                </div>
                <div className="d-flex justify-content-center align-items-center gap-4 my-4">

                    <button className="btn btn-dark px-4 py-2 d-flex align-items-center" disabled={this.state.page === 1} onClick={this.handlePrevpage}>
                        &#8592;&nbsp; PREVIOUS
                    </button>

                    <div className="border px-3 py-2 fw-semibold">
                        {this.state.page}{" "}
                        <span className="text-muted">of</span>{" "}
                        {Math.ceil(this.state.totalResults / 6)}
                    </div>


                    <button className="btn btn-dark px-4 py-2 d-flex align-items-center" onClick={this.handleNextpage}>
                        NEXT &nbsp;&#8594;
                    </button>

                </div>

            </div>
        );
    }
}

export default News;
