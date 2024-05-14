export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const longMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    return `${longMonth} ${dateDay}, ${dateYear}`;
}