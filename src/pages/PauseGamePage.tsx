import { useEffect, useState } from "react";
import NavbarTheme from "../components/NavbarTheme";
import { useNavigate } from "react-router-dom";
import { Cookie } from "../libs/Cookie";
import { TimeFormatter } from "../libs/TimeFormatter";
import { CONSTANT_GAME } from "../libs/Modules";
import CardGameInformation from "../components/CardGameInformation";



const PauseGamePage = () => {

  var level = 0;

  const cookie = new Cookie();
  const navigate = useNavigate();
  const formatter = new TimeFormatter();

  const cookieObject = cookie.getCookie('game');

  const [time, setTime] = useState<Array<number>>([]);

  useEffect(() => {
    if (cookieObject.length === 0) return;

    const cookieObjectParse = JSON.parse(cookieObject);

    level = cookieObjectParse.level;
    if (cookieObjectParse.time) setTime(formatter.formatSeconds(cookieObjectParse.time));

  }, []);



  return (
    <div className="flex flex-col gap-28 h-[100vh] w-full items-center justify-center dark:bg-[var(--dark-background)]">
      <div className=" w-full flex items-start">
          <h1 className="text-xl lg:text-3xl text-center fixed top-6 right-0 left-0 font-semibold dark:text-white">
            Sudoku.lena
          </h1>
        <div className="flex fixed top-20 right-7">
          <NavbarTheme onGameScene={false} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-10 ">
        <h2 className="text-4xl lg:text-6xl font-bold dark:text-white text-[color:var(--text-color)]">Pause</h2>
      </div>
      <CardGameInformation level={level} situation="pause" time={time} onContinue={() => navigate(`/game-page/${level}/${1}`)} onNewGame={() => navigate('/')} />
    </div >
  );
}

export default PauseGamePage;