import { useSearchParams } from 'react-router-dom';

import Rsvp from '../container/Rsvp.js';


export default function RsvpRoute() {
    const [searchParams, setSearchParams] = useSearchParams();
    const email = searchParams.get("e")
    const token = searchParams.get("t");

    return (
        <Rsvp email={email} token={token} />
    )
}
