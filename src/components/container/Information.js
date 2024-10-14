import React, { Component } from 'react';

import Error from './Error.js';

import '../css/Information.css';


class Information extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="info-body">
                <h3>Hotels</h3>
                The nearest hotel is: 
                <br />
                <br />
                <a href="https://www.premierinn.com/gb/en/hotels/england/greater-london/london/london-tottenham-hale.html">Premier Inn, Tottenham Hale</a>
                <br />
                Station Road
                <br />
                London
                <br />
                N17 9LR
                <br />
                <br />
                The venue is a 15 minute walk from the Tottenham Hale underground station and only 20 minutes from Central London.
                <h3>Dress Code</h3>
                Semi-Formal / Cocktail Attire.
                <h3>Parking</h3>
                There is parking available for the duration at the venue.
                <br />
                <br />
            </div>
        )
    }
}

export default Information;