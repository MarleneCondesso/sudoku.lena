import { useEffect, useState } from "react";
import NavbarTheme from "../components/NavbarTheme";
import { useNavigate } from "react-router-dom";
import { Cookie } from "../libs/Cookie";
import { TimeFormatter } from "../libs/TimeFormatter";
import CardGameInformation from "../components/CardGameInformation";



/**
 * PauseGamePage component displays the pause screen during a game.
 * Shows current game stats and provides options to continue, restart, or go home.
 */
const PauseGamePage = () => {
  const cookie = new Cookie();
  const navigate = useNavigate();
  const formatter = new TimeFormatter();

  const cookieObject = cookie.getCookie('game');

  const [time, setTime] = useState<Array<number>>([]);
  const [level, setLevel] = useState();

  /**
   * useEffect hook that loads paused game data from cookies on component mount.
   * Parses the saved game to extract level and time, formatting time into [hours, minutes, seconds].
   * Handles invalid cookie data by logging an error.
   */
  useEffect(() => {
    if (!cookieObject) return;

    try {
      const parsed = JSON.parse(cookieObject);
      setLevel(parsed.level);

      if (parsed.time) {
        setTime(formatter.formatSeconds(parsed.time));
      }
    } catch (error) {
      console.error("Invalid game cookie", error);
    }
  }, []);


  return (
    <div className="flex flex-col gap-10 mt-20 w-full items-center justify-center dark:bg-[var(--dark-background)]">
      <div className=" w-full flex items-start">
        <h1 className="text-xl text-center fixed top-6 right-0 left-0 font-semibold dark:text-white">
          Sudoku.lena
        </h1>
        <div className="flex fixed top-20 right-7">
          <NavbarTheme onGameScene={false} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-10 ">
        <h2 className="text-4xl font-bold dark:text-white text-[color:var(--text-color)]">Pause</h2>
      </div>
      <CardGameInformation level={level!} situation="pause" time={time} onContinue={() => navigate(`/game-page/${level}/${0}`)} onHomePage={() => navigate('/')} onRestartGame={() => navigate(`/game-page/${level}/${1}`)} />
    </div >
  );
}

export default PauseGamePage;