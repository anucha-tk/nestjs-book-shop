import ms from 'ms';
/**
 * convert millisecond to seconds
 * @return number
 * */
export function seconds(msValue: string): number {
  return ms(msValue) / 1000;
}
