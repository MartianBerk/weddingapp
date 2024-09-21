import { useSearchParams } from 'react-router-dom';

import Information from '../container/Information.js';


export default function InformationRoute() {
    const [searchParams, setSearchParams] = useSearchParams();
    const email = searchParams.get("e");
    const token = searchParams.get("t");

    return (
        <Information />
    )
}
