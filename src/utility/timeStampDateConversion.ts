export function getTimeDifference(timestamp: number): [number, number, number] {
  const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000); // Convert to seconds
  const timeDifference = Math.max(0, timestamp - currentTimeInSeconds); // Ensure non-negative value

  const days = Math.floor(timeDifference / (24 * 60 * 60));
  const remainingHoursInSeconds = timeDifference % (24 * 60 * 60);
  const hours = Math.floor(remainingHoursInSeconds / (60 * 60));
  const remainingMinutesInSeconds = remainingHoursInSeconds % (60 * 60);
  const minutes = Math.floor(remainingMinutesInSeconds / 60);

  return [days, hours, minutes];
}

export const formatTimeDifference = (timestamp: number) => {
  if (timestamp) {
    const secondsDifference = Math.floor(
      (timestamp * 1000 - new Date().getTime()) / 1000
    );
    const minutes = Math.floor(secondsDifference / 60);
    const hours = Math.floor(secondsDifference / 3600);
    // const days = Math.floor(secondsDifference / 86400);

    const secondsMod = Math.floor(secondsDifference % 60);
    const minutesMod = Math.floor((secondsDifference % 3600) / 60);
    // const hoursMod = Math.floor((secondsDifference % 86400) / 3600);

    const formatNumber = (num: number) => (num < 10 ? "0" + num : num);
    if (secondsDifference < 0) {
      return `00:00:00:00`;
    } else if (secondsDifference < 60) {
      return `00:00:00:${formatNumber(secondsDifference)}`;
    } else if (secondsDifference < 3600) {
      return `00:00: ${formatNumber(minutes)} :${formatNumber(secondsMod)}`;
    } else if (secondsDifference < 86400000000) {
      return `00:${formatNumber(hours)}:${formatNumber(minutesMod)}:${formatNumber(secondsMod)}`;
    }
  }
  return "";
};

export const formatTimeDifferenceTimer = (timestamp: number) => {
  if (timestamp) {
    const secondsDifference = Math.floor(
      (timestamp * 1000 - new Date().getTime()) / 1000
    );
    const minutes = Math.floor(secondsDifference / 60);
    const hours = Math.floor(secondsDifference / 3600);
    // const days = Math.floor(secondsDifference / 86400);

    const secondsMod = Math.floor(secondsDifference % 60);
    const minutesMod = Math.floor((secondsDifference % 3600) / 60);
    // const hoursMod = Math.floor((secondsDifference % 86400) / 3600);

    const formatNumber = (num: number) => (num < 10 ? "0" + num : num);
    if (secondsDifference < 0) {
      return `00:00:00`;
    } else if (secondsDifference < 60) {
      return `00:00:${formatNumber(secondsDifference)}`;
    } else if (secondsDifference < 3600) {
      return `00: ${formatNumber(minutes)} :${formatNumber(secondsMod)}`;
    } else if (secondsDifference < 864000000000) {
      return `${formatNumber(hours)}:${formatNumber(minutesMod)}:${formatNumber(secondsMod)}`;
    }
  }
  return "";
};

export const formatTimeDifferenceUpcoming = (timestamp: number) => {
  if (timestamp) {
    const secondsDifference = Math.floor(
      (timestamp * 1000 - new Date().getTime()) / 1000
    );
    const minutes = Math.floor(secondsDifference / 60);
    const hours = Math.floor(secondsDifference / 3600);
    const days = Math.floor(secondsDifference / 86400);

    const minutesMod = Math.floor((secondsDifference % 3600) / 60);
    const hoursMod = Math.floor((secondsDifference % 86400) / 3600);

    const formatNumber = (num: number) => (num < 10 ? "0" + num : num);
    if (secondsDifference < 0) {
      return `Match started`;
    } else if (secondsDifference < 3600) {
      return ` ${formatNumber(minutes)} mins`;
    } else if (secondsDifference < 86400) {
      return `${hours} ${hours > 1 ? " hrs • " : " hr • "}${formatNumber(minutesMod)} mins`;
    } else if (secondsDifference < 6048000000) {
      return `${days} ${days > 1 ? "Days" : "Day"}  ${hoursMod ? "•" : ""}  ${hoursMod > 0 ? hoursMod : ""}${hoursMod > 1 ? " hrs  " : hoursMod ? " hr" : ""}  `;
    }
  }
  return "";
};

export const formatTimeDifferenceT20 = (timestamp: number) => {
  if (timestamp) {
    const secondsDifference = Math.floor(
      (timestamp * 1000 - new Date().getTime()) / 1000
    );

    const minutes = Math.floor(secondsDifference / 60);
    const hours = Math.floor(secondsDifference / 3600);
    const days = Math.floor(secondsDifference / 86400);

    const secondsMod = Math.floor(secondsDifference % 60);
    const minutesMod = Math.floor((secondsDifference % 3600) / 60);
    const hoursMod = Math.floor((secondsDifference % 86400) / 3600);

    const formatNumber = (num: number) => (num < 10 ? "0" + num : num);

    if (secondsDifference < 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    } else if (secondsDifference < 60) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: formatNumber(secondsDifference),
      };
    } else if (secondsDifference < 3600) {
      return {
        days: "00",
        hours: "00",
        minutes: formatNumber(minutes),
        seconds: formatNumber(secondsMod),
      };
    } else if (secondsDifference < 86400) {
      return {
        days: "00",
        hours: formatNumber(hours),
        minutes: formatNumber(minutesMod),
        seconds: formatNumber(secondsMod),
      };
    } else if (secondsDifference < 6048000000) {
      return {
        days: formatNumber(days),
        hours: formatNumber(hoursMod),
        minutes: formatNumber(minutesMod),
        seconds: formatNumber(secondsMod),
      };
    }
  }
  return {
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  };
};
export function isDateUpcoming(dateString: string): boolean {
  const inputTime = new Date(dateString).getTime() + 86400 * 1000;
  const currentTime = new Date().getTime();

  return inputTime >= currentTime ? true : false;
}
