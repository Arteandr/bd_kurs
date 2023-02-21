import "./main-page.css"
import TableSVG from "./assets/table.svg"
import TableWhiteSVG from "./assets/table_white.svg"
import RequestSVG from "./assets/request.svg"
import RequestWhiteSVG from "./assets/request_white.svg"
import { useState } from "react"
import { Outlet, useNavigate, useOutletContext } from "react-router"

type ContextType = {
    setActive: React.Dispatch<React.SetStateAction<Number>>
}

export function useActive() {
    return useOutletContext<ContextType>()
}

const MainPage = () => {
    const [active, setActive] = useState<Number>(1)
    const navigation = useNavigate();

    const onIconHover = (event: React.MouseEvent<HTMLLIElement>) => {
        event.preventDefault()

        event.currentTarget.classList.add("active")
    }

    const onIconExit = (event: React.MouseEvent<HTMLLIElement>) => {
        event.preventDefault()

        if (active === Number.parseInt(event.currentTarget.dataset.id!)) {
            return
        }
        event.currentTarget.classList.remove("active")
    }

    const onIconClickHandler = (event: React.MouseEvent<HTMLLIElement>) => {
        event.preventDefault()

        const id = event.currentTarget.dataset.id
        if (!id)
            return

        setActive(Number.parseInt(id))
        navigation(Number.parseInt(id) === 1 ? "/tables" : "/request", { replace: true })
    }

    return (
        <div className="main-page">
            <div className="dock">
                <ul className="dock-icons">
                    <li key={"1"} onClick={onIconClickHandler} data-id={1} onMouseLeave={onIconExit} onMouseEnter={onIconHover} className={active === 1 ? 'active' : ""}>
                        <img src={active == 1 ? TableWhiteSVG : TableSVG} alt="Таблицы" className="dock-icon" />
                    </li>
                    <li key={"2"} onClick={onIconClickHandler} data-id={2} onMouseLeave={onIconExit} onMouseEnter={onIconHover} className={active === 2 ? 'active' : ""}>
                        <img src={active == 2 ? RequestWhiteSVG : RequestSVG} alt="Запросы" className="dock-icon" />
                    </li>
                </ul>
            </div>
            <Outlet context={{ setActive }} />
        </div >
    )
}

export default MainPage