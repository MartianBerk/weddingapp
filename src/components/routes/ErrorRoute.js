import { useRouteError } from "react-router-dom";

import Error from '../container/Error.js'


export default function ErrorRoute() {
  const error = useRouteError();
  console.error(error);

  return (
      <Error />
  )
}