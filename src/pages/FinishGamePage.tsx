import { MdOutlineArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { CONSTANT } from "./HomePage";
import NavbarTheme from "../components/NavbarTheme";
import { BsPalette } from "react-icons/bs";
import { Game } from "./GamePage";
const FinishGamePage = () => {


  const navigate = useNavigate();

  const information = globalThis.game;
  const [time, setTime] = useState<Array<number>>([]);
  const formatSeconds = (time: any) => {
    function pad(val: any) {
      return val > 9 ? val : "0" + val;
    }
    var hours = pad(parseInt((time / 3600).toString(), 10));
    var minutes = pad(parseInt((time / 60).toString(), 10) % 60);
    var seconds = pad(++time % 60);

    var array = [hours, minutes, seconds];

    setTime(array);
  };

  const redirectToHomePage = () => {
    var clearGame: Game = {
      level: '',
      solution: '',
      sudoku: '',
      sudokuOrigin: '',
      time: ''
    };
    globalThis.game = clearGame;
    navigate('/');
  }

  useEffect(() => {
    if (information?.time) formatSeconds(information.time);
  });



  return (
    <div className="flex flex-col gap-28 p-7 h-[100vh] w-full items-center dark:bg-[var(--dark-background)]">
      <div className="grid grid-cols-3 justify-between items-center w-full">
        <button className="dark:text-white text-black" onClick={() => redirectToHomePage()}>
          <MdOutlineArrowBackIos size={25} />
        </button>
        <h1 className="text-xl text-center font-semibold dark:text-white">
          Sudoku.lena
        </h1>
        <div className="flex fixed top-20 right-7">
          <NavbarTheme onGameScene={false} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-10 ">
        <h2 className="text-4xl font-bold dark:text-white text-[color:var(--text-color)]">Parabéns</h2>
        <h2 className="text-4xl font-bold dark:text-white text-[color:var(--text-color)] ">Concluiu o Sudoku</h2>
      </div>
      <div className="dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] shadow-2xl shadow-orange-300 dark:shadow-emerald-800 w-60 h-60 rounded-xl items-center flex-col flex text-center justify-center gap-10">
        <div className="flex flex-row gap-10 justify-between w-full px-10">
          <h2 className="h-full text-2xl text-[color:var(--text-color-light)] dark:text-[color:(--dark-text-color)] font-semibold ">
            Nível
          </h2>
          <p className=" text-center text-lg text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color)] font-semibold">
            {CONSTANT.LEVEL_NAME[information?.level]}
          </p>
        </div>

        <div className="flex flex-row gap-10 justify-between w-full px-10">
          <h2 className="text-start h-full text-2xl text-[color:var(--text-color-light)] dark:text-[color:(--dark-text-color)] font-semibold">
            Tempo
          </h2>
          <div className="text-lg font-semibold text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color)]">
            <span>{time[0] === parseInt('00') ? time[0]+':' : ''}</span>
            <span>{time[1]}:</span>
            <span>{time[2]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishGamePage;
