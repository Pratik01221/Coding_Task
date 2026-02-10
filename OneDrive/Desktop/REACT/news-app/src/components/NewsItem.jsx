import React, { Component } from 'react'

export  class NewsItem extends Component {

    render() {
        let {title,description,imageurl,newsURL}= this.props;
        return (
            <div>
                <div  className="card" style={{width: "18rem"}}>
                    <img src={imageurl}  className="card-img-top" alt="..."/>
                        <div  className="card-body">
                            <h4  className="card-title">{title}</h4>
                            <p  className="card-text">{description}</p>
                            <a href={newsURL} target='_blank' className="btn btn-success btn-sm">Read More</a>
                            
                        </div>
                </div>
            </div>
        )
    }
}

export default NewsItem;