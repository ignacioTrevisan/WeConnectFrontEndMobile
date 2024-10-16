import React, { useEffect, useState } from 'react'

export const UseDebouncer = (input: string, time: number = 500) => {

    const [debouncerValue, setDebouncerValue] = useState(input)

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setDebouncerValue(input)
        }, time);
        return () => {
            clearTimeout(timeOut)
        }
    }, [input])
    console.log('devolvio', debouncerValue)
    return debouncerValue
}
