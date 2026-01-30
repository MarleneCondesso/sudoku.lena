import Navbar from "../components/Navbar";
import NavbarLevels from "../components/NavbarLevels";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Cookie } from "../libs/Cookie";
import { useNavigate } from "react-router-dom";

/**
 * HomePage component serves as the main entry point of the Sudoku application.
 * It displays the app title, continue and new game buttons, and handles navigation to saved or new games.
 */
function HomePage() {
  const cookie = useMemo(() => new Cookie(), []);
  const navigate = useNavigate();

  const [showMenuLevels, setShowMenuLevels] = useState(false);
  const [disableBtnContinue, setDisableBtnContinue] = useState(false);

  /**
   * Toggles the visibility of the level selection menu.
   * Uses useCallback to prevent unnecessary re-renders.
   */
  const toggleShowLevels = useCallback(() => {
    setShowMenuLevels((current) => !current);
  }, []);

  /**
   * Attempts to open the last saved game from cookies.
   * If a saved game exists, parses the JSON and navigates to the game page with the saved level and type 0 (continue).
   * If no saved game or empty string, does nothing.
   */
  const openLastGame = () => {
    const savedGameJsonString = cookie.getCookie('game');

    if (savedGameJsonString?.length === 0) { return; }
    const savedGame = JSON.parse(savedGameJsonString);

    return navigate(`/game-page/${savedGame?.level}/${0}`);
  };

  /**
   * useEffect hook that runs on component mount.
   * Checks if there's a saved game in cookies. If not, disables the continue button.
   */
  useEffect(() => {
    if (!cookie.getCookie('game')) setDisableBtnContinue(true);
  }, [cookie]);

  return (
    <div className="flex flex-col h-full w-max p-10 items-center">
      <Navbar />
      <div className="flex flex-col w-full items-center justify-center pt-10">

        <div className="py-20 text-3xl font-semibold text-[color:var(--text-color)] dark:text-[color:var(--dark-text-color-light)]">
          <h2>Sudoku.lena</h2>
        </div>
        <div className="flex flex-col gap-5 w-full text-[color:var(--text-color-light)]">
          <button disabled={disableBtnContinue} onClick={() => openLastGame()} className="disabled:opacity-70 shadow-sm dark:shadow-emerald-800 shadow-orange-300 h-12 w-full dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] rounded-full hover:opacity-80">
            Continue
          </button>
          <button onClick={() => { toggleShowLevels(); cookie.deleteCookie(); }} className="shadow-sm dark:shadow-emerald-800 shadow-orange-300 h-12 w-full dark:bg-[var(--dark-background-components)] bg-[var(--background-components)] rounded-full hover:opacity-80"
          >
            New game
          </button>
        </div>
        <div id="navbar-levels" className={`${showMenuLevels ? "translate-y-0" : "translate-y-96"} bottom-0 fixed z-[1]`} >
          <NavbarLevels onCancel={toggleShowLevels} />
        </div>

      </div>
    </div>
  );
}

export default HomePage;
