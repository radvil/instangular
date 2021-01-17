import { Pipe, PipeTransform } from '@angular/core';

export enum TimeTextStyle {
  SHORT = "short",
  LONG = "long"
}

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(isoDate: string, style = TimeTextStyle.LONG): string {
    const timeStamp = new Date(isoDate).getTime();
    const now = new Date();
    const secondsPast = (now.getTime() - timeStamp) / 1000;

    const oneMinute = 60; // 60
    const oneHour = 3600; // oneMinute * 60
    const oneDay = 86400; // oneHour * 24
    const twoDays = 172800; // oneDay * 2
    const oneWeek = 604800; // oneDay * 7
    const twoWeeks = 1209600; // oneWeek * 2
    const oneMonth = 2592000; // oneDay * 30
    const twoMonths = 5184000; // oneMonth * 2
    const oneYear = 31104000; // oneMonth * 12
    const twoYears = 62208000; // oneYear * 2
    const tenYears = 311040000; // oneYear * 10

    if (secondsPast < oneMinute) {
      const postfix = style === TimeTextStyle.SHORT ? 's' : ' seconds ago';
      return this.makeString(secondsPast) + postfix;
    }
    if (secondsPast < oneHour) {
      const postfix = style === TimeTextStyle.SHORT ? 'm' : ' minutes ago';
      return this.makeString(secondsPast / oneMinute) + postfix;
    }
    if (secondsPast < oneDay) {
      const postfix = style === TimeTextStyle.SHORT ? 'h' : ' hours ago';
      return this.makeString(secondsPast / oneHour) + postfix;
    }
    if (secondsPast <= twoDays) {
      const text = style === TimeTextStyle.SHORT ? '1d' : 'Yesterday';
      return text;
    }
    if (secondsPast < oneWeek) {
      const postfix = style === TimeTextStyle.SHORT ? 'd' : ' days ago';
      return this.makeString(secondsPast / oneDay) + postfix;
    }
    if (secondsPast < twoWeeks) {
      const text = style === TimeTextStyle.SHORT ? '1w' : 'A week ago';
      return text;
    }
    if (secondsPast < oneMonth) {
      const postfix = style === TimeTextStyle.SHORT ? 'w' : ' weeks ago';
      return this.makeString(secondsPast / oneWeek) + postfix;
    }
    if (secondsPast < twoMonths) {
      const text = style === TimeTextStyle.SHORT ? '1 month' : 'A month ago';
      return text;
    }
    if (secondsPast < oneYear) {
      const postfix = style === TimeTextStyle.SHORT ? ' months' : ' months ago';
      return this.makeString(secondsPast / oneMonth) + postfix;
    }
    if (secondsPast < twoYears) {
      const text = style === TimeTextStyle.SHORT ? 'y' : 'A year ago';
      return text;
    }
    if (secondsPast < tenYears) {
      const postfix = style === TimeTextStyle.SHORT ? ' y' : ' years ago';
      return this.makeString(secondsPast / oneMonth) + postfix;
    }
    if (secondsPast > tenYears) {
      const day = new Date(timeStamp).getDate();
      const month = new Date(timeStamp).toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
      const year = new Date(timeStamp).getFullYear() === new Date(now).getFullYear() ? "" : " " + new Date(timeStamp).getFullYear();
      return day + " " + month + year;
    }
  }

  private makeString(miliseconds: number): string {
    return `${Math.floor(miliseconds)}`;
  }
}
