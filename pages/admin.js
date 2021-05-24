import React, { useEffect } from 'react'

function admin() {

    useEffect(() => {
        window.location.assign('https://sratavimas-admin.herokuapp.com/admin');
    }, [])

    return (
        <div>
            Paredresuojama į administratoriaus pultą...
        </div>
    )
}

export default admin
