import { Requests } from "../requests.js";


export const Auth = (email, token, callback) => {
    const requests = new Requests()
    requests.fetch(
        "AUTHURL",
        "POST",
        null,
        {"Content-Type": "application/json"},
        {"email": email, "token": token},
        "same-origin"
    )
    .then(response => response.json())
    .then(data => {
        callback(data.is_logged_in);
    })
    .catch()
}