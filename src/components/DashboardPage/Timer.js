import React, { useEffect, useState } from 'react';
import useInterval from '../../hooks/useInterval'

const Timer = (props) => {
    const { isSearching } = props;
    const [timer, setTimer] = useState({ mins: 0, secs: 0 });
    useInterval(() => {
      if (timer.secs === 59) {
        setTimer({mins: timer.mins+1, secs: 0})
      } else {
        setTimer({mins: timer.mins, secs: timer.secs+1});
      }
    }, isSearching ? 1000 : null);
  
    return(
      <div>
        { timer.mins }:{ timer.secs }
      </div>
    );
};

export default Timer;