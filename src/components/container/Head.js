import React, { Component } from 'react';

import '../css/Head.css';


class Head extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="wedding-header">
                <p>Ashley & Martin '25</p>
                <img src="enginehouse-color2-circle2.svg" width="300" height="200" />
            </div>
        )
    }
}

export default Head;