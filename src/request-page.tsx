import { useEffect } from "react"
import { useActive } from "./main-page"

export default function RequestPage() {
    const { setActive } = useActive()
    useEffect(() => {
        setActive(2)
    }, [])
    return (
        <h1>Request</h1>
    )
}