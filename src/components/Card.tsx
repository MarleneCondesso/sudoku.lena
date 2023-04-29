import { FC } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

interface CardProps{
    title: string;
    type: string;
    button: string;
}

const Card: FC<CardProps> = ({title, type, button}) => {

    return(
        <div className="
        h-36 
        w-28 
        dark:bg-[var(--dark-background-components)] 
        bg-white
        shadow-2xl
        shadow-white
        dark:shadow-emerald-800
        dark:text-[color:(--dark-text-color)]
        rounded-xl 
        items-center 
        justify-center
        flex
        flex-col
        gap-5
        ">   
            {type === 'calendar' && <FaCalendarAlt size={20}/> }
            <h4 className='text-sm dark:text-[color:var(--dark-text-color-light)]'>{title}</h4>
            <button className='
            dark:bg-[var(--dark-background-components)] 
            bg-[var(--background-components)]
            h-8
            w-20
            rounded-full
            text-[color:var(--text-color)]
            dark:text-[color:var(--dark-text-color)]
            font-semibold
            cursor-pointer'>{button}</button>
        </div>
    );
}

export default Card;