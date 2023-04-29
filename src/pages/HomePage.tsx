import Navbar from "../components/Navbar";
import Card from "../components/Card";
import NavbarFooter from "../components/NavbarFooter";
import NavbarLevels from "../components/NavbarLevels";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CONSTANT = {
  UNASSIGNED: 0,
  GRID_SIZE: 9,
  BOX_SIZE: 3,
  NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  LEVEL_NAME: ["Easy", "Medium", "Hard", "Expert"],
  LEVEL: [2, 38, 47, 56],
};

function HomePage() {
  const [showMenuLevels, setShowMenuLevels] = useState(false);
  const [disableBtnContinue, setDisableBtnContinue] = useState(false);

  const navigate = useNavigate();

  const toggleShowLevels = useCallback(() => {
    setShowMenuLevels((current) => !current);
  }, []);

  const openLastGame = () => {
    var globalLevel = globalThis.game.level!;
    return navigate(`/game-page/${globalLevel}/${1}`);
  };

  useEffect(() => {
    if (globalThis.game?.level === undefined || globalThis.game?.level === '') {
      setDisableBtnContinue(true);
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full p-10">
      <Navbar />
      <div className="flex flex-col w-full items-center justify-center pt-10">
        {/* <div className='grid grid-cols-1 gap-5 items-center justify-center'>
          <Card type="calendar" title="Desafio diário" button="Jogar" />
        </div> */}
        <div className="py-20 text-3xl text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color-light)]">
          <h2>Sudoku.lena</h2>
        </div>
        <div className="flex flex-col gap-5 w-full text-[color:var(--text-color-light)]">
          <button disabled={disableBtnContinue} onClick={() => openLastGame()} className="disabled:opacity-70 shadow-sm dark:shadow-emerald-800 shadow-orange-300 h-12 w-full dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] rounded-full">
            Continuar o jogo
          </button>
          <button onClick={toggleShowLevels} className="shadow-sm dark:shadow-emerald-800 shadow-orange-300 h-12 w-full dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] rounded-full"
          >
            Novo jogo
          </button>
        </div>
        <div id="navbar-levels" className={`${ showMenuLevels ? "translate-y-0" : "translate-y-96" } bottom-0 fixed z-[1]`} >
          <NavbarLevels onCancel={toggleShowLevels} />
        </div>
        {/*     
        <div className='flex flex-col'>
          <NavbarFooter />
        </div> */}
      </div>
    </div>
  );
}

export default HomePage;
