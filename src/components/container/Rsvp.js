import React, { Component } from 'react';

import { Auth } from '../hooks/Auth.js';
import { Requests } from '../requests.js';

import Error from './Error.js';


class Rsvp extends Component {
    constructor(props) {
        super(props);
        this.state = { authenticated: null, error: null, guests: [], confirmed: false }
        this.requests = new Requests();

        Auth(this.props.email, this.props.token, (success) => { this.setState({ authenticated: success }, this._onAuthentication ) });

        this._handleRsvpClick = this._handleRsvpClick.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleRsvpClick(i, event) {
        this.setState((_) => {
            let guests = [...this.state.guests]

            guests.map((guest, j) => {
                if (i === j) {
                    guest.rsvp = event.target.value === "yes" ? guest.invite : "none"
                }
            })

            return { guests: guests }
        })
    }

    _handleSubmit(event) {
        let payload = {rsvp: []}

        this.state.guests.map(guest => {
            if (guest.rsvp !== null) {
                payload.rsvp.push({email: guest.email, rsvp: guest.rsvp})
            }
        })

        this.requests.fetch(
            "RSVPURL",
            "POST",
            {},
            {"Content-Type": "application/json"},
            payload,
            "same-origin"
        )
        .then(response => response.json())
        .then(data => this.setState((_) => {
            let guests = [...this.state.guests]
            let confirmed = true;

            data.guests.map((guest, i) => {
                guests[i] = guest
                if (guest.rsvp === null) {
                    confirmed = false
                }
            })

            return {guests: guests, confirmed: confirmed}
        }))
        .catch()
    }

    _onAuthentication () {
        if (!this.state.authenticated) {
            return null
        }

        this.requests.fetch("RSVPURL")
        .then(response => response.json())
        .then(data => this.setState((_) => {
            let confirmed = true;

            data.guests.map((guest, i) => {
                if (guest.rsvp === null) {
                    confirmed = false
                }
            })

            return {guests: data.guests, confirmed: confirmed}
        }))
        .catch(e => this.setState({ error: true }))
    }

    _renderResponse() {
        return (
            <div id="rsvp-response">
                {
                    this.state.guests.map((guest, i) => {
                        return (
                            <div className="rsvp-response-guest">
                                { guest.firstname }
                                <button value="yes" onClick={ (e) => this._handleRsvpClick(i, e) }>
                                    Yes, I'll be there
                                </button>
                                <button key={i} value="no" onClick={ (e) => this._handleRsvpClick(i, e) }>
                                    Sorry, but I'll be there in spirit
                                </button>
                            </div>
                        )
                    })
                }
                <div className="rsvp-response-submit">
                    <button onClick={ this._handleSubmit }>
                        Submit
                    </button>
                </div>
            </div>
        )
    }

    _renderRsvp() {
        let invitationString = []

        this.state.guests && this.state.guests.map((guest, i) => {
            if (i > 0 && i < this.state.guests.length - 1) {
                invitationString.push(", ")
            }
            else if (i > 0 && i === this.state.guests.length - 1) {
                invitationString.push(" & ")
            }

            invitationString.push(`${guest.firstname}`)
        })

        return (
            <div className="rsvp">
                <div id="rsvp-invite">
                {
                    invitationString.join("") + " - Please join us in celebrating our wedding day"
                }
                </div>
                { this._renderResponse() }
            </div>
        )
    }

    render () {
        return (
            <div className="rsvp-container">
                {
                    this.authenticated !== null && this.guests !== null ? (
                        (this.state.authenticated === false || this.state.error === true) ? <Error /> : this._renderRsvp()
                    ) : null   
                }
            </div>
        )
    }
}

export default Rsvp;