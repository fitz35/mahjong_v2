import React from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * navbar
 * @returns 
 */
export function CustomNavbar() {
  const location = useLocation();
  var td1: string = "w-40 border-r border-white";
  var td2: string = "w-40 border-r border-white";
  var td3: string = "w-40";

  switch (location.pathname) {
    case "/":
      td1 += " bg-pageVeryDark";
      break;
    case "/regles":
      td2 += " bg-pageVeryDark";
      break;
    case "/jouer":
      td3 += " bg-pageVeryDark";
      break;
    default:
  }

  return (
    <nav className="flex-1 h-16 object-right text-center text-3xl">
      <table className="h-16 ml-auto mr-0">
        <tbody>
          <tr>
            <td className={td1}>
              <NavLink
                className="text-white hover:bg-pageVeryDark"
                to="/"
              >
                Calculateur
              </NavLink>
            </td>
            <td className={td2}>
              <NavLink
                className="text-white hover:bg-pageVeryDark"
                to="/regles"
              >
                Régles
              </NavLink>
            </td>
            <td className={td3}>
              <NavLink
                className="text-white hover:bg-pageVeryDark"
                to="/jouer"
              >
                Jouer
              </NavLink>
            </td>
          </tr>
        </tbody>
      </table>
    </nav>
  );
}
