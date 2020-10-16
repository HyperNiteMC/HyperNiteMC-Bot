export const toDateString = (sec: number): string => {
    const yearUnit = "年";
    const monthUnit = "個月";
    const dayUnit = "日";
    const hourUnit = "小時";
    const minUnit = "分鐘";
    const secUnit = "秒";
    const split = ", ";
    const units: number[] = getTimeUnit(sec);
    const year = units[0];
    const month = units[1];
    const day = units[2];
    const hour = units[3];
    const min = units[4];
    sec = units[5];
    const builder: string[] = [];
    if (year > 0) builder.push(year.toFixed() + yearUnit);
    if (month > 0) {
        if (year > 0) builder.push(split);
        builder.push(month.toFixed() + monthUnit);
    }
    if (day > 0) {
        if (month > 0) builder.push(split);
        builder.push(day.toFixed() + dayUnit);
    }
    if (hour > 0) {
        if (day > 0) builder.push(split);
        builder.push(hour.toFixed() + hourUnit);
    }
    if (min > 0) {
        if (hour > 0) builder.push(split);
        builder.push(min.toFixed() + minUnit);
    }
    if (sec > 0) {
        if (min > 0) builder.push(split);
        builder.push(sec.toFixed() + secUnit);
    }

    return builder.join('');
};


export const getTimeUnit = (sec: number): number[] => {
    let year: number = 0;
    let month: number = 0;
    let day: number = 0;
    let hour: number = 0;
    let min: number = 0;

    while (sec / 60 > 0 && sec > 0) {
        min++;
        sec -= 60;
    }
    while (min / 60 > 0 && min > 0) {
        hour++;
        min -= 60;
    }

    while (hour / 24 > 0 && hour > 0) {
        day++;
        hour -= 24;
    }

    while (day / 30 > 0 && day > 0) {
        month++;
        day -= 30;
    }

    while (month / 12 > 0 && month > 0) {
        year++;
        month -= 12;
    }

    return [year, month, day, hour, min, sec];
};
