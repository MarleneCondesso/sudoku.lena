import { FC } from "react";
import { CONSTANT_GAME } from "../libs/Modules";

interface CardGameInformationProps {
    level: number;
    time: number[];
    situation: string;
    onContinue?: () => void;
    onNewGame?: () => void;
}


const CardGameInformation: FC<CardGameInformationProps> = ({ level, time, situation, onContinue, onNewGame }) => {

    return (
        <div className="dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] shadow-2xl shadow-orange-300 dark:shadow-emerald-800 w-60 h-60 lg:w-80 lg:h-80 rounded-xl items-center flex-col flex text-center justify-center">
            <div className="flex flex-col gap-8 justify-between w-full px-8 items-center">
                <div className="flex flex-row gap-10 justify-between w-full">
                    <h2 className="h-full text-2xl lg:text-4xl text-[color:var(--text-color-light)] dark:text-[color:(--dark-text-color)] font-semibold ">
                        Nível
                    </h2>
                    <p className=" text-center text-lg lg:text-2xl text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color)] font-semibold">
                        {CONSTANT_GAME.LEVEL_NAME[level]}
                    </p>
                </div>

                <div className="flex flex-row gap-10 justify-between w-full">
                    <h2 className="text-start h-full text-2xl lg:text-4xl text-[color:var(--text-color-light)] dark:text-[color:(--dark-text-color)] font-semibold">
                        Tempo
                    </h2>
                    <div className="text-lg font-semibold lg:text-2xl text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color)]">
                        <span>{time[0] === parseInt('00') ? time[0] + ':' : ''}</span>
                        <span>{time[1]}:</span>
                        <span>{time[2]}</span>
                    </div>
                </div>

                {situation === 'pause' ?
                    <div className="gap-4 flex flex-col">
                        <button className="disabled:opacity-70 shadow-sm text-slate-800 font-semibold dark:shadow-emerald-200 shadow-orange-800 h-8 w-32 lg:h-12 lg:w-60 dark:bg-teal-200 bg-[var(--background)] rounded-full" onClick={onContinue}>
                            Continuar
                        </button>
                        <button className="disabled:opacity-70 text-white font-semibold shadow-sm dark:shadow-emerald-200 shadow-orange-800 h-8 w-32 lg:h-12 lg:w-60 dark:bg-teal-950 bg-slate-700 rounded-full" onClick={onNewGame}>
                            Novo jogo
                        </button>
                    </div>
                    :
                    null}
            </div>
        </div>
    );
}

export default CardGameInformation;