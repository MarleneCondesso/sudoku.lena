import { useState } from "react";
import { BiPauseCircle } from "react-icons/bi";
import { CONSTANT_GAME } from "../libs/Modules";

interface HeaderGameProps{
    index_level: number;

}


const HeaderGame = () => {

    // const [timeArray, setTimeArray] = useState<Array<number>>([]);


    // function pad(val: any){
    //     return val > 9 ? val : "0" + val;
    //   };
    // function getTime(secs: number){

    //     let time: number = secs;
      
    //     interval = setInterval(function () {
            
    //         const hours = pad(parseInt((time / 3600).toString(), 10));
    //         const minutes = pad(parseInt((time / 60).toString(), 10) % 60);
    //         const seconds = pad(++time % 60);
        
    //         const array = [hours, minutes, seconds];

    //         setTimeArray(array);
    //         setSeconds(time);

    //     }, 1000);
    // };


    return (
        <>
            {/* <p>{CONSTANT_GAME.LEVEL_NAME[index_level]}</p>
            <div className="flex flex-row gap-2">
                <p>Erros:</p>
                <div className="flex flex-row">
                    <p>{errors}</p>
                    <p>/</p>
                    <p>3</p>
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                <BiPauseCircle onClick={() => { redirectToPausePage(); }} size={20} />
                {timeArray.length !== 0 ?
                    <div>
                        <span>{timeArray[0]}:</span>
                        <span>{timeArray[1]}:</span>
                        <span>{timeArray[2]}</span>
                    </div>
                    :
                    <div>
                        <span>00:</span>
                        <span>00:</span>
                        <span>00</span>
                    </div>
                }
            </div> */}
        </>
    );

}

export default HeaderGame;