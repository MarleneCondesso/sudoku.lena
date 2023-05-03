
export class TimeFormatter{

    formatSeconds = (time: any) => {
      function pad(val: any){
        return val > 9 ? val : "0" + val;
      };
        const hours = pad(parseInt((time / 3600).toString(), 10));
        const minutes = pad(parseInt((time / 60).toString(), 10) % 60);
        const seconds = pad(++time % 60);
    
        const array = [hours, minutes, seconds];
    
        return array;
      };

    
}