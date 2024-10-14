import React, { Component } from 'react';

import { Auth } from '../hooks/Auth.js';
import { Requests } from '../requests.js';

import Error from './Error.js';

import '../css/Information.css';


class Information extends Component {
    constructor(props) {
        super(props);
        this.state = { authenticated: null, error: null }
        this.requests = new Requests();
        Auth(this.props.email, this.props.token, (success, err) => { this.setState({ authenticated: success, error: err }, this._onAuthentication ) });
    }

    _renderInfo () {
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

    render () { 
        return (
            <div className="info-container">
                {
                    this.state.authenticated !== null ? (
                        (this.state.authenticated === false || this.state.error !== null) ? <Error err={this.state.error} /> : this._renderInfo()
                    ) : null   
                }
            </div>
        )
    }
}

export default Information;