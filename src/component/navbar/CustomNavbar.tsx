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
        var td1 : string = "w-40 border-r border-white";
        var td2 : string = "w-40 border-r border-white";
        var td3 : string = "w-40";

        switch(this.state.link){
            case 1 :
                td1 += " bg-pageVeryDark";
                break;
            case 2 :
                td2 += " bg-pageVeryDark";
                break;
            case 3 :
                td3 += " bg-pageVeryDark";
                break;
            default:

        }

        return (
            <nav className='flex-1 h-16 object-right text-center text-3xl'>
                <table className="h-16 ml-auto mr-0">
                    <tbody>
                        <tr>
                            <td className={td1}>
                                <NavLink className="hover:bg-pageVeryDark" onClick={() => this.setState({link : 1})} to="/">Calculateur</NavLink>
                            </td>
                            <td className={td2}>
                                <NavLink className="hover:bg-pageVeryDark" onClick={() => this.setState({link : 2})} to="/regles">Régles</NavLink>
                            </td>
                            <td className={td3}>
                                <NavLink className="hover:bg-pageVeryDark" onClick={() => this.setState({link : 3})} to="/jouer">Jouer</NavLink>
                            </td>
                        </tr>
                    </tbody>
                </table>                
            </nav>
        )
    }

}