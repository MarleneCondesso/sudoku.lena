import { MdOutlineArrowBackIos } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarTheme from "../components/NavbarTheme";
import { Cookie } from "../libs/Cookie";
import { useNavigate } from "react-router-dom";
import { TimeFormatter } from "../libs/TimeFormatter";
import { CONSTANT_GAME } from "../libs/Modules";
import CardGameInformation from "../components/CardGameInformation";

const FinishGamePage = () => {

  const cookie = new Cookie();
  const navigate = useNavigate();
  const formatter = new TimeFormatter();

  let params = useParams();
  let finishType = params?.finish?.toString() || "";

  const cookieObject = cookie.getCookie('game');
  const [time, setTime] = useState<Array<number>>([]);

  let level = 0;

  const redirectToHomePage = () => {
    cookie.deleteCookie();
    navigate('/');
  }

  useEffect(() => {
    if (cookieObject?.length === 0) { return; }

    const cookieObjectParse = JSON.parse(cookieObject);

    level = cookieObjectParse.level;
    setTime(formatter.formatSeconds(cookieObjectParse?.time));

  }, []);


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
        <h2 className="text-4xl font-bold dark:text-white text-[color:var(--text-color)]">{finishType === 'win' ? 'Parabéns' : 'Perdeu'}</h2>
        <h2 className="text-4xl font-bold dark:text-white text-[color:var(--text-color)] ">{finishType === 'win' && 'Concluiu o Sudoku'} </h2>
      </div>
      <CardGameInformation level={level} time={time} situation="end"/>
    </div>
  );
};

export default FinishGamePage;
