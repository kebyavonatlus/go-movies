import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom'
import {confirmAlert} from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import './EditMovie.css';
import Input from './form-component/Input';
import TextArea from './form-component/TextArea';
import Select from './form-component/Select';
import Alert from './ui-components/Alert';

export default class EditMovie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movie: {
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                rating: "",
                description: "",
            },
            mpaaOptions: [
                { id: "G", value: "G" },
                { id: "PG", value: "PG" },
                { id: "PG13", value: "PG13" },
                { id: "R", value: "R" },
                { id: "NC17", value: "NC17" },
            ],
            isLoaded: false,
            error: null,
            errors: [],
            alert: {
                type: "d-done",
                message: ""
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // client side validation
        let errors = [];

        for (const prop in this.state.movie) {
            if (this.state.movie[prop] === "") errors.push(prop)
        }

        this.setState({
            errors: errors
        })

        if (errors.length > 0) return false;

        const data = new FormData(event.target);
        const payload = Object.fromEntries(data.entries());
        console.log(payload);

        const requestOptions = {
            method: "post",
            body: JSON.stringify(payload)
        }

        fetch("http://localhost:4001/v1/admin/editmovie", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        alert: { type: "alert alert-danger", message: data.error.message }
                    })
                } else {
                    this.setState({
                        alert: { type: "alert alert-success", message: "Changes saved!" }
                    })
                }
            })
    }

    handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;

        this.setState((prevState) => ({
            movie: {
                ...prevState.movie,
                [name]: value
            }
        }))
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        if (id > 0) {
            fetch("http://localhost:4001/v1/movie/" + id)
                .then((response) => {
                    if (response.status !== 200) {
                        let err = Error;
                        err.Message = "Invalid response code: " + response.status;
                        this.setState({ error: err })
                    }

                    return response.json();
                })
                .then((json) => {
                    this.setState({
                        movie: {
                            id: id,
                            title: json.movie.title,
                            release_date: new Date(json.movie.release_date).toISOString().split("T")[0],
                            runtime: json.movie.runtime,
                            mpaa_rating: json.movie.mpaa_rating,
                            rating: json.movie.rating,
                            description: json.movie.description,
                        },
                        isLoaded: true,
                    },
                        (error) => {
                            this.setState({
                                isLoaded: true,
                                error
                            })
                        })
                })
        } else {
            this.setState({ isLoaded: true })
        }
    }

    confirmDelete = (e) => {
        console.log("would delete movie id", this.state.movie.id);

        confirmAlert({
            title: "Delete movie?",
            message: "Are you sure?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => alert('Click yes')
                },
                {
                    label: "No",
                    onClick: () => {}
                }
            ]
        })
    }

    render() {
        let { movie, isLoaded, error } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else return (
            <Fragment>
                <h2>Add/Edit Movie</h2>
                <Alert
                    alertType={this.state.alert.type}
                    alertMessage={this.state.alert.message}
                />
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <input type="hidden"
                        name="id"
                        id="id"
                        value={movie.id}
                        onChange={this.handleChange}
                    />

                    <Input
                        title={"Title"}
                        className={this.hasError("title") ? "is-invalid" : ""}
                        type={"text"}
                        name={"title"}
                        value={movie.title}
                        handleChange={this.handleChange}
                        errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input
                        title={"Release date"}
                        className={this.hasError("release_date") ? "is-invalid" : ""}
                        type={"date"}
                        name={"release_date"}
                        value={movie.release_date}
                        handleChange={this.handleChange}
                        errorDiv={this.hasError("release_date") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a release date"}
                    />

                    <Input
                        title={"Runtime"}
                        className={this.hasError("runtime") ? "is-invalid" : ""}
                        type={"text"}
                        name={"runtime"}
                        value={movie.runtime}
                        handleChange={this.handleChange}
                        errorDiv={this.hasError("runtime") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a runtime"}
                    />

                    <Select
                        title={"MPAA Rating"}
                        name={"mpaa_rating"}
                        className={this.hasError("mpaa_rating") ? "is-invalid" : ""}
                        options={this.state.mpaaOptions}
                        value={movie.mpaa_rating}
                        handleChange={this.handleChange}
                        placeholder={"Choose..."}
                        errorDiv={this.hasError("mpaa_rating") ? "text-danger" : "d-none"}
                        errorMsg={"Please choose a MPAA rating"}
                    />

                    <Input
                        title={"Rating"}
                        className={this.hasError("rating") ? "is-invalid" : ""}
                        type={"text"}
                        name={"rating"}
                        value={movie.rating}
                        handleChange={this.handleChange}
                        errorDiv={this.hasError("rating") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a rating"}
                    />

                    <TextArea
                        title={"Description"}
                        className={this.hasError("description") ? "is-invalid" : ""}
                        id={"description"}
                        name={"description"}
                        rows={4}
                        value={movie.description}
                        handleChange={this.handleChange}
                        errorDiv={this.hasError("description") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a description"}
                    />

                    <hr />

                    <button className="btn btn-primary">Save</button>
                    <Link to="/admin" className="btn btn-warning ms-1">Cancel</Link>
                    {movie.id > 0 && (
                        <a href="#!" onClick={() => this.confirmDelete()}
                            className="btn btn-danger ms-1">
                            Delete
                        </a>
                    )}
                </form>
            </Fragment>
        )
    }
}
