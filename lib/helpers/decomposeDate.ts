import { hours, days, shift } from '../constants/times';

interface decomposedDate {
  day: number;
  start: string;
  finish: string;
  shift: string;
}
export default function decomposeDate(date: string): decomposedDate {
  const [
    _,
    dayPrefix,
    shiftLetter,
    firstHour,
    lastHour,
  ] = /^(Lu|Ma|Mi|Ju|Vi|Sa)\(([mtn])\)([0-6]):([0-6])$/.exec(
    date.replace('á', 'a'),
  ) as string[];

  return {
    day: days[dayPrefix],
    start: hours[shiftLetter][firstHour].start,
    finish: hours[shiftLetter][lastHour].end,
    shift: shift[shiftLetter],
  };
}
