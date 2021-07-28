import moment from 'moment';

Object.assign(String.prototype, {
    formatTodayTomorrowTime(): string {
        const targetMoment = moment(moment.utc(this).toDate()).local();
        const formattedDate = targetMoment.format('h:mm a');
        const isToday = targetMoment.isSame(new Date(), 'day');

        if (isToday) {
            return `today at ${formattedDate}`;
        } else {
            return `tomorrow at ${formattedDate}`;
        }
    },
});

Object.assign(String.prototype, {
    addMinutes(minutes: number): string {
        return moment.utc(this).add(minutes, 'minutes').format('yyyy-MM-DD kk:mm:ss');
    },
});

Object.assign(String.prototype, {
    formatToLocalDate(): string {
        return moment(moment.utc(this).toDate()).local().format('yyyy-MM-DD kk:mm:ss');
    },
});
