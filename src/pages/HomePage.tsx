import Navbar from "../components/Navbar";
import Card from "../components/Card";
import NavbarFooter from "../components/NavbarFooter";
import NavbarLevels from "../components/NavbarLevels";
import { useCallback, useEffect, useState } from "react";
import { Cookie } from "../libs/Cookie";
import { useNavigate } from "react-router-dom";



function HomePage() {

  const cookie = new Cookie();
  const navigate = useNavigate();

  const [showMenuLevels, setShowMenuLevels] = useState(false);
  const [disableBtnContinue, setDisableBtnContinue] = useState(false);


  const toggleShowLevels = useCallback(() => {
    setShowMenuLevels((current) => !current);
  }, []);

  const openLastGame = () => {
   
    const savedGameJsonString = cookie.getCookie('game');

    if (savedGameJsonString?.length === 0) { return; }
    const savedGame = JSON.parse(savedGameJsonString);

    return navigate(`/game-page/${savedGame?.level}/${1}`);
  };

  useEffect(() => {
    if (!cookie.getCookie('game')) setDisableBtnContinue(true);
    
  }, []);

  return (
    <div className="flex flex-col h-full w-full p-10 items-center">
      <Navbar />
      <div className="flex flex-col w-full items-center justify-center pt-10">
        {/* <div className='grid grid-cols-1 gap-5 items-center justify-center'>
          <Card type="calendar" title="Desafio diário" button="Jogar" />
        </div> */}
        <div className="py-20 text-3xl font-semibold text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color-light)]">
          <h2>Sudoku.lena</h2>
        </div>
        <div className="flex flex-col gap-5 w-full text-[color:var(--text-color-light)]">
          <button disabled={disableBtnContinue} onClick={() => openLastGame()} className="disabled:opacity-70 shadow-sm dark:shadow-emerald-800 shadow-orange-300 h-12 w-full dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] rounded-full">
            Continuar o jogo
          </button>
          <button onClick={() => { toggleShowLevels(); cookie.deleteCookie(); }} className="shadow-sm dark:shadow-emerald-800 shadow-orange-300 h-12 w-full dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] rounded-full"
          >
            Novo jogo
          </button>
        </div>
        <div id="navbar-levels" className={`${showMenuLevels ? "translate-y-0" : "translate-y-96"} bottom-0 fixed z-[1]`} >
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
