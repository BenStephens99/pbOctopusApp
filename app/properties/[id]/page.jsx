'use client'

import { useState, useEffect } from "react"

export default async function Page ({ params }) {
    let property = {};

    useEffect(() => {
        const postcode = new URLSearchParams(window.location.search).get('postcode');
        
        if (sessionStorage.getItem(`${params.id}-${postcode}`)) {
            property = JSON.parse(sessionStorage.getItem(`${params.id}-${postcode}`));
            console.log(property);
        } else {
            console.log('No data found');
        }
    },[])

    return (
        <h1>Test {params.id}</h1>
    )
}