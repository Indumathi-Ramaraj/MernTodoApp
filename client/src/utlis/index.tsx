export const generateTimeIntervals = () => {
  const intervals = []; 

  // Get the current date and set the time to 00:00 (midnight) for the start of the day
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  const nextDay = new Date(current);
  nextDay.setDate(nextDay.getDate() + 1);

  // Generate time intervals in 15-minute increments, starting from midnight
  while (current < nextDay) {
    const hours = current.getHours(); 
    const minutes = current.getMinutes(); 

    const period = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12;

    const formattedMinutes = minutes.toString().padStart(2, "0");

    const time = `${formattedHours}:${formattedMinutes} ${period}`;

    intervals.push({ label: time, value: time });
    
    current.setMinutes(current.getMinutes() + 15);
  }

  intervals.unshift({ label: "00:00 NT", value: "00:00 NT" });

  return intervals; 
};
