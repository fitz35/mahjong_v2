import React from "react";
import { NavLink } from "react-router-dom";

type NavbarState = {
    link:number
}

export class CustomNavbar extends React.Component <{}, NavbarState>{
    constructor(props: {}) {
        super(props)
        this.state = {link : 1};
    }

    render() {
        return (
            <nav className='flex-1 object-right text-right text-3xl'>
                <NavLink className="hover:bg-pageVeryDark" to="/">Calculateur</NavLink> |{" "}
                <NavLink className="hover:bg-pageVeryDark" to="/regles">Régles</NavLink> |{" "}
                <NavLink className="hover:bg-pageVeryDark" to="/jouer">Jouer</NavLink>
            </nav>
        )
    }

}