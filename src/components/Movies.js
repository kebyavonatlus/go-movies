import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Movies extends Component {
    state = {
        movies: [],
        isLoaded: false,
        error: null,
    };

    componentDidMount() {
        fetch("http://localhost:4001/v1/movies")
            .then((response) => {
                if (response.status !== 200) {
                    let err = Error;
                    err.message = "Invalid response code: " + response.status
                    this.setState({ error: err })
                }
                return response.json()
            })
            .then((json) => {
                this.setState({
                    movies: json.movies,
                    isLoaded: true
                },
                    (error) => {
                        this.setState({
                            isLoading: true,
                            error
                        })
                    })
            })
    }

    render() {
        const { movies, isLoaded, error } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {
            return (
                <div>
                    <h2>Choose a movie</h2>

                    <div className="list-group">
                        {movies.map((m) => (
                            <Link
                                key={m.id}
                                to={`/movies/${m.id}`}
                                className="list-group-item list-group-item-action">
                                {m.title}
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }
    }
}
