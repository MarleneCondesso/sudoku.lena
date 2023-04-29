import { useEffect, useState } from "react";
import { FiSettings } from 'react-icons/fi';
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { MdDesktopWindows } from "react-icons/md";
import NavbarTheme from "./NavbarTheme";
function Navbar() {

    // useEffect(() => {
    //   const head = document.querySelector("head");
    //   const script = document.createElement("script");


    // }, []);

    

    //const [showMenu, setShowMenu] = useState(false);

    

    return (
        <div>
            <div>
            <NavbarTheme onGameScene={false}/>
            </div>
            {/* <div className='flex justify-end text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color-light)] p-4' onClick={() => setShowMenu(true)}>
                <FiSettings size={25} className='self-end justify-self-end cursor-pointer' />
            </div>
            {showMenu &&
                <nav className="relative flex flex-row items-end justify-end">
                </nav>
            } */}
        </div>

    );
}

export default Navbar;
