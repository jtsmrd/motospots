import moment from 'moment';

export function currentDateIsAfter(date: string): boolean {
    return moment.utc().isAfter(moment.utc(date));
}

export function getCurrentTimestamp(): number {
    return moment.utc().valueOf() / 1000;
}

export function currentTimeIsAfterTimePlusMinutes(timeInterval: number, minutesToAdd): boolean {
    return moment.utc().isAfter(moment.unix(timeInterval).utc().add(minutesToAdd, 'minutes'));
}

export function formatLocalTodayTomorrowTime(date: Date): string {
    const targetMoment = moment(date).local();
    const formattedDate = targetMoment.format('h:mm a');
    const isToday = targetMoment.isSame(new Date(), 'day');

    if (isToday) {
        return `today at ${formattedDate}`;
    } else {
        return `tomorrow at ${formattedDate}`;
    }
}

export function formatToLocalDate(utcDate: string): Date {
    const targetMoment = moment(moment.utc(utcDate).toDate()).local();
    return targetMoment.toDate();
}

export function getDateAddingMinutes(minutes: number): Date {
    return moment().add(minutes, 'minutes').toDate();
}

export function addMinutesToDate(date: Date, minutes: number): Date {
    return moment(date).add(minutes, 'minutes').toDate();
}
