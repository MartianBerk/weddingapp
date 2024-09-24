import React, { Component } from 'react';

import '../css/Head.css';


class Head extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="wedding-header">
                <p>Ashley & Martin</p>
                <img src="enginehouse-color2-circle2.svg" width="400" height="250" />
            </div>
        )
    }
}

export default Head;