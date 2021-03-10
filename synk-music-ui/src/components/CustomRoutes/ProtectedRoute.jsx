import React from 'react'
import { Redirect, Route } from 'react-router-dom'
const ProtectedRoute = ({ Component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                var party = JSON.parse(localStorage.getItem("userInfo"))
                if (party !== null && party.partyName === window.location.pathname.split("/")[2])
                    return (<Component {...props} {...rest} />)
                else
                    return <Redirect to="/" />
            }}
        />
    )
}
export default ProtectedRoute;