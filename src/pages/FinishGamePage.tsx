import { MdOutlineArrowBackIos } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import NavbarTheme from "../components/NavbarTheme";
import { Cookie } from "../libs/Cookie";
import { useNavigate } from "react-router-dom";
import { TimeFormatter } from "../libs/TimeFormatter";
import { CONSTANT_GAME } from "../libs/Modules";
import CardGameInformation from "../components/CardGameInformation";

/**
 * FinishGamePage component displays the game over screen after winning or losing.
 * Shows congratulations or loss message, game stats, and allows navigation back to home.
 */
const FinishGamePage = () => {
  const cookie = useMemo(() => new Cookie(), []);
  const navigate = useNavigate();
  const formatter = useMemo(() => new TimeFormatter(), []);

  let params = useParams();
  let finishType = params?.finish?.toString() || "";

  const cookieObject = cookie.getCookie('game');
  const [level, setLevel] = useState<number>(0);
  const [time, setTime] = useState<Array<number>>([]);

  /**
   * Redirects to the home page and deletes the saved game cookie.
   * Used when the user wants to start a new game or return to menu.
   */
  const redirectToHomePage = () => {
    cookie.deleteCookie();
    navigate('/');
  }

  /**
   * useEffect hook that loads game data from cookies on component mount.
   * Parses the saved game to extract level and time, formatting time into [hours, minutes, seconds].
   * Handles invalid cookie data by logging an error.
   */
  useEffect(() => {
    if (!cookieObject) return;

    try {
      const parsed = JSON.parse(cookieObject);
      if (typeof parsed.level === "number") {
        setLevel(parsed.level);
      } else {
        setLevel(CONSTANT_GAME.LEVEL.indexOf(parsed.level));
      }
      setTime(formatter.formatSeconds(parsed.time));
    } catch (error) {
      console.error("Invalid game cookie", error);
    }
  }, [cookieObject, formatter]);


  return (
    <div className="flex flex-col gap-10 p-7 h-[100vh] w-full items-center dark:bg-[var(--dark-background)]">
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
        <h2 className="text-xl font-bold dark:text-white text-[color:var(--text-color)]">{finishType === 'win' ? 'Congratulation' : 'Lost the game'}</h2>
      </div>
      <CardGameInformation level={level} time={time} situation="end" />
    </div>
  );
};

export default FinishGamePage;
