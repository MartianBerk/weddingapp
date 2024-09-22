import React, { Component } from 'react';

import { Auth } from '../hooks/Auth.js';
import { Requests } from '../requests.js';

import Error from './Error.js';

import '../css/Rsvp.css';


class Rsvp extends Component {
    constructor(props) {
        super(props);
        this.state = { authenticated: null, error: null, guests: [], confirmed: false, allChecked: false }
        this.requests = new Requests();

        Auth(this.props.email, this.props.token, (success, err) => { this.setState({ authenticated: success, error: err }, this._onAuthentication ) });

        this._handleRsvpClick = this._handleRsvpClick.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDietChange = this._handleDietChange.bind(this);
    }

    _handleRsvpClick(i, event) {
        this.setState((_) => {
            let guests = [...this.state.guests]
            let allChecked = true;

            guests.map((guest, j) => {
                if (i === j) {
                    guest.rsvp = event.target.value === "yes" ? guest.invite : "none"
                }
                allChecked = allChecked && guest.rsvp !== null;
            })

            return { guests: guests, allChecked: allChecked }
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
            let allChecked = true;

            data.guests.map((guest, i) => {
                if (guest.rsvp === null) {
                    confirmed = false
                    allChecked = false
                }
            })

            return {guests: data.guests, confirmed: confirmed, allChecked: allChecked}
        }))
        .catch(e => this.setState({ error: e }))
    }

    // _renderResponse1() {
    //     return (
    //         <div className="rsvp-response">
    //             <div className="rsvp-response-options">
    //             {
    //                 this.state.guests.map((guest, i) => {
    //                     return (
    //                         <div className="rsvp-response-guest">
    //                             { guest.firstname }
    //                             <br />
    //                             <div className="rsvp-response-guest-buttons">
    //                                 <div className="rsvp-response-option">
    //                                     <button className={"rsvp-response-button" + (guest.rsvp === guest.invite ? " active" : "")} value="yes" onClick={ (e) => this._handleRsvpClick(i, e) }>
    //                                         { guest.rsvp === guest.invite ? 'X' : '' }
    //                                     </button>
    //                                     Wouldn't miss it
    //                                 </div>
    //                                 <br />
    //                                 <div className="rsvp-response-option">
    //                                     <button className={"rsvp-response-button" + (guest.rsvp === "none" ? " active" : "")} key={i} value="no" onClick={ (e) => this._handleRsvpClick(i, e) }>
    //                                         { guest.rsvp === "none" ? 'X' : '' }
    //                                     </button>
    //                                     I'll be there in spirit
    //                                 </div>
    //                                 {
    //                                     guest.rsvp === guest.invite && 
    //                                     <textarea id={`rsvp-response-diet-${i}`} className="rsvp-response-diet" placeholder="Dietary restrictions (if any)" rows="4" onChange={ (e) => this._handleDietChange(i, e) }></textarea>
    //                                 }
    //                             </div>
    //                         </div>
    //                     )
    //                 })
    //             }
    //             </div>
    //             <div className="rsvp-response-submit">
    //                 <button className="rsvp-response-submit-button" onClick={ this._handleSubmit }>
    //                     { this.state.confirmed ? "Confirmed" : "Submit" }
    //                 </button>
    //             </div>
    //         </div>
    //     )
    // }

    _renderResponse() {
        return (
            <div className="rsvp-response">
                <br />
                <table className="rsvp-response-table">
                    <tr>
                        <td></td>
                        <td>Wouldn't Miss It</td>
                        <td>Be There In Spirit</td>
                    </tr>
                    {
                        this.state.guests.map((guest, i) => {
                            return (
                                <tr>
                                    <td>
                                        { guest.firstname }
                                        {
                                            guest.rsvp === guest.invite && 
                                            <tr>
                                                <textarea 
                                                    id={`rsvp-response-diet-${i}`} 
                                                    className="rsvp-response-diet" 
                                                    placeholder="Dietary restrictions (if any)" 
                                                    rows="4" 
                                                    onChange={ (e) => this._handleDietChange(i, e) } 
                                                />
                                            </tr>
                                        }
                                    </td>
                                    <td className="rsvp-response-button-container">
                                        <button className={"rsvp-response-button" + (guest.rsvp === guest.invite ? " active" : "")} value="yes" onClick={ (e) => this._handleRsvpClick(i, e) } />
                                    </td>
                                    <td className="rsvp-response-button-container">
                                        <button className={"rsvp-response-button" + (guest.rsvp === "none" ? " active" : "")} key={i} value="no" onClick={ (e) => this._handleRsvpClick(i, e) } />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>
                {
                    this.state.allChecked &&
                    (
                        <div className="rsvp-response-submit">
                            <button className="rsvp-response-submit-button" onClick={ this._handleSubmit }>
                                { this.state.confirmed ? "Confirmed" : "Submit" }
                            </button>
                        </div>
                    )
                }
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
                { invitationString.join("") }
                <br />
                Please join us in celebrating our wedding day.
                <p>{ "May 17th 2025 @ 3pm" }</p>
                The Engine House
                <br />
                Walthamstow Wetlands
                <br />
                N17 9DG
                </div>
                { this._renderResponse() }
            </div>
        )
    }

    render () { 
        return (
            <div className="rsvp-container">
                {
                    this.state.authenticated !== null && this.state.guests.length > 0 ? (
                        (this.state.authenticated === false || this.state.error !== null) ? <Error err={this.state.error} /> : this._renderRsvp()
                    ) : null   
                }
            </div>
        )
    }
}

export default Rsvp;