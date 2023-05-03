import { useState, useEffect, FC } from "react";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { MdDesktopWindows } from "react-icons/md";

interface NavbarThemeProps{
    onGameScene: boolean;
}

const NavbarTheme: FC<NavbarThemeProps> = ({onGameScene}) => {



    const [theme, setTheme] = useState(typeof window !== 'undefined' && localStorage.getItem('theme') ? localStorage.getItem('theme') : 'system');

    const onWindowMatch = () => {
        if (typeof window !== 'undefined') {
            let darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && darkQuery.matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

    }

    useEffect(() => {
        switch (theme) {
            case 'dark':
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                break;
            case 'light':
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                break;
            default:
                localStorage.removeItem('theme');
                onWindowMatch();
                break;
        }

    }, [theme]);

    return (
        <div>
            <div className={`
                flex
                ${!onGameScene ? 'fixed' : ''}
                right-3
                float-right
                bg-gray-400
                opacity-60
                top-5
                p-2
                dark:bg-teal-800
                dark:bg-opacity-60
                rounded-xl
                duration-300
                gap-4`}
            >
                <button onClick={() => { setTheme('light'); }}
                    className={`
                        ${theme === 'light' ? 'text-[#DDD0C8]' : 'text-white'}
                        cursor-pointer
                    `}
                >
                    <BsFillSunFill size={20} />
                </button>
                <button onClick={() => { setTheme('dark'); }}
                    className={`
                        ${theme === 'dark' ? 'text-[color:var(--dark-text-color)]' : 'text-white'}
                        cursor-pointer
                    `}
                >
                    <BsFillMoonFill size={18} />
                </button>
                <button onClick={() => { setTheme('system'); }}
                    className={`
                            ${theme === 'dark' ? 'text-[color:var(--dark-text-color)]' : 'text-white'}
                             cursor-pointer  
                        `}
                >
                    <MdDesktopWindows size={20} />
                </button>
            </div>
        </div>
    )
}

export default NavbarTheme;