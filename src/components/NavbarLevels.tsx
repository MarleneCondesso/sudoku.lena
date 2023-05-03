import { FC } from "react";
import { CONSTANT_GAME } from "../libs/Modules";

interface NavbarLevelsProps {
  onCancel: (res: false) => void;
}

const NavbarLevels: FC<NavbarLevelsProps> = ({ onCancel }) => {


  return (
    <>
      <div className={`h-full w-full backdrop-brightness-75 bg-slate-500/20 z-10 lg:hidden top-0 left-0`}></div>
      <div className="bg-white dark:bg-[var(--dark-background)] dark:bg-opacity-80 w-80 h-96  py-5 flex-col border-2 dark:border-teal-400 border-slate-300 flex rounded-lg">
        <div className="flex flex-col gap-5 pt-2">
          <div className="px-3 group/item flex flex-col gap-5 w-full">
            {CONSTANT_GAME.LEVEL_NAME.map((e, i) => (
              <a key={e} href={`/game-page/${i}/${0}`} className="w-full text-center pt-[6px] bg-[var(--background)] text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color-light)] dark:bg-[var(--dark-background-components)] font-semibold h-10 rounded-full">
                {e}
              </a>
            ))}
          </div>
          <div className="pt-5">
            <button onClick={() => onCancel(false)} className="w-full bg-[var(--background-components)] text-[color:var(--text-color-light)] dark:bg-white dark:text-[#115e59] font-extrabold text-xl h-12 rounded-full">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarLevels;
