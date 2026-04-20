export function formatDisplayDate(value) {
  if (!value) {
    return 'Not available yet';
  }

  let date;

  if (value?.toDate) {
    date = value.toDate();
  } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatMinutes(totalMinutes = 0) {
  const minutes = Number(totalMinutes) || 0;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (!hours) {
    return `${remainder} min`;
  }

  if (!remainder) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainder} min`;
}

export function getProgressValue(totalMinutes, sessionCount) {
  if (!sessionCount) {
    return 0;
  }

  const targetMinutes = Math.max(sessionCount * 60, 180);
  return Math.min(100, Math.round((Number(totalMinutes || 0) / targetMinutes) * 100));
}
