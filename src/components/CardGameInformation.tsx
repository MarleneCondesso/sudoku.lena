import { FC } from "react";
import { CONSTANT_GAME } from "../libs/Modules";

interface CardGameInformationProps {
    level: number;
    time: number[];
    situation: string;
    onContinue?: () => void;
    onHomePage?: () => void;
    onRestartGame?: () => void;
}


const CardGameInformation: FC<CardGameInformationProps> = ({ level, time, situation, onContinue, onHomePage, onRestartGame }) => {

    return (
        <div className={`dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] shadow-2xl shadow-orange-300 dark:shadow-emerald-800 ${situation === 'pause' ? 'w-72 h-72' : 'w-60 h-60'} rounded-xl items-center flex-col flex text-center justify-center`}>
            <div className="flex flex-col gap-8 justify-between w-full p-8 items-center">
                <div className="flex flex-row gap-10 justify-between w-full">
                    <h2 className="h-full text-start lg:text-xl text-[color:var(--text-color-light)] dark:text-[color:(--dark-text-color)] font-semibold ">
                        Level
                    </h2>
                    <p className=" text-center text-lg text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color)] font-semibold">
                        {CONSTANT_GAME.LEVEL_NAME[level]}
                    </p>
                </div>

                <div className="flex flex-row gap-10 justify-between w-full">
                    <h2 className="text-start lg:text-xl h-full text-[color:var(--text-color-light)] dark:text-[color:(--dark-text-color)] font-semibold">
                        Time
                    </h2>
                    <div className="text-lg font-semibold text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color)]">
                        {time.length === 0 ?
                            <span>00:00</span>
                            :
                            <>
                                <span>{time[0] === parseInt('00') ? time[0] + ':' : ''}</span>
                                <span>{time[1]}:</span>
                                <span>{time[2]}</span>
                            </>
                        }
                    </div>
                </div>

                {situation === 'pause' ?
                    <div className="gap-4 flex flex-col">
                        <button className="disabled:opacity-70 shadow-sm text-slate-800 font-semibold dark:shadow-emerald-50 shadow-orange-800 h-8 w-32 dark:bg-teal-50 bg-[var(--background)] rounded-full hover:opacity-60" onClick={onContinue}>
                            Continue
                        </button>
                        <button className="disabled:opacity-70 text-white font-semibold shadow-sm dark:shadow-emerald-200 shadow-orange-800 h-8 w-32 dark:bg-teal-950 bg-slate-700 rounded-full hover:opacity-60" onClick={onRestartGame}>
                            Restart
                        </button>
                        <button className="disabled:opacity-70 text-white font-semibold shadow-sm dark:shadow-emerald-200 shadow-orange-800 h-8 w-32 dark:bg-teal-950 bg-slate-700 rounded-full hover:opacity-60" onClick={onHomePage}>
                            Start Menu
                        </button>
                    </div>
                    :
                    null}
            </div>
        </div>
    );
}

export default CardGameInformation;