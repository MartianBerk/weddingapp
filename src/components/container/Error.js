import React, { Component } from 'react';


class Error extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="error-page">
              <h1>Oops!</h1>
              <p>Sorry, an unexpected error has occurred.</p>
            </div>
        );
    }
}

export default Error;