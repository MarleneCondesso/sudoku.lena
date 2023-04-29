import { FiHome } from 'react-icons/fi';
import { FaCalendarAlt } from 'react-icons/fa';
import { VscGraph } from 'react-icons/vsc';
function NavbarFooter(){

    return(
        <div className="
        flex 
        w-full 
        px-10
        justify-between 
        fixed 
        bottom-0
        right-0
        left-0 
        text-[color:var(--text-color)] 
        text-opacity-40 
        dark:text-[color:var(--dark-text-color-light)] 
        drop-shadow-sm 
        border-t-2
        border-[color:var(--text-color-light)]
        " >
            <button className='w-7 flex items-center justify-center h-16 focus:text-orange-300 dark::text-[color:var(--dark-text-color)] cursor-pointer' onClick={()=>{}}>
                <FiHome size={30}/>
            </button>
            <button className='w-7 flex items-center justify-center h-16 focus:text-orange-300 dark:focus:text-[color:var(--dark-text-color)] cursor-pointer' onClick={()=>{}}>
                <FaCalendarAlt size={30}/>
            </button>
            <button className='w-7 flex items-center justify-center h-16 focus:text-orange-300 dark:focus:text-[color:var(--dark-text-color)] cursor-pointer' onClick={()=>{}}>
                <VscGraph size={30}/>
            </button>


        </div>
    );
}

export default NavbarFooter;