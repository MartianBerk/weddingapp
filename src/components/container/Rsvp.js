import React, { Component } from 'react';

import { Auth } from '../hooks/Auth.js';
import { Requests } from '../requests.js';

import Error from './Error.js';

import '../css/Rsvp.css';


class Rsvp extends Component {
    constructor(props) {
        super(props);
        this.state = { authenticated: null, error: null, guests: [], confirmed: false }
        this.requests = new Requests();

        Auth(this.props.email, this.props.token, (success) => { this.setState({ authenticated: success }, this._onAuthentication ) });

        this._handleRsvpClick = this._handleRsvpClick.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDietChange = this._handleDietChange.bind(this);
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

    _handleSubmit(_event) {
        let payload = {rsvp: []}

        this.state.guests.map(guest => {
            if (guest.rsvp !== null) {
                payload.rsvp.push({email: guest.email, rsvp: guest.rsvp, diet: guest.diet})
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
                guest.diet = null
                guests[i] = guest
                if (guest.rsvp === null) {
                    confirmed = false
                }
            })

            return {guests: guests, confirmed: confirmed}
        }))
        .catch()
    }

    _handleDietChange(i, event) {
        this.state.guests.map((_guest, j) => {
            if (j === i) {
                this.setState((_) => {
                    let guests = [...this.state.guests]
                    guests[j].diet = event.target.value
                    return {guests: guests}
                })
            }
        })
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
            <div className="rsvp-response">
                <div className="rsvp-response-options">
                {
                    this.state.guests.map((guest, i) => {
                        return (
                            <div className="rsvp-response-guest">
                                { guest.firstname }
                                <br />
                                <div className="rsvp-response-guest-buttons">
                                    <button className={"rsvp-response-button" + (guest.rsvp === guest.invite ? " active" : "")} value="yes" onClick={ (e) => this._handleRsvpClick(i, e) }>
                                        Yes, I'll be there
                                    </button>
                                    {
                                        guest.rsvp === guest.invite && 
                                        <textarea id={`rsvp-response-diet-${i}`} className="rsvp-response-options" placeholder="Dietary restrictions (if any)" rows="4" onChange={ (e) => this._handleDietChange(i, e) }></textarea>
                                    }
                                    <button className={"rsvp-response-button" + (guest.rsvp === "none" ? " active" : "")} key={i} value="no" onClick={ (e) => this._handleRsvpClick(i, e) }>
                                        Sorry, I'll be there in spirit
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
                </div>
                <div className="rsvp-response-submit">
                    <button className="rsvp-response-button" onClick={ this._handleSubmit }>
                        { this.state.confirmed ? "Confirmed" : "Submit" }
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