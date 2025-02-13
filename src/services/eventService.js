/**
 * Updates the status of an event based on the current date.
 * @param {object} event - Mongoose Event document
 */
const updateEventStatus = (event) => {
    const now = new Date();
  
    if (event.date > now) {
      event.status = "upcoming";
    } else if (event.date <= now && event.date >= new Date(now.setHours(23, 59, 59))) {
      event.status = "ongoing";
    } else {
      event.status = "completed";
    }
  };
  
  /**
   * Validates if an event can accept more attendees.
   * @param {object} event - Mongoose Event document
   * @returns {boolean} - Returns true if the event is not full
   */
  const canJoinEvent = (event) => {
    return event.attendees.length < event.maxAttendees;
  };
  
  module.exports = { updateEventStatus, canJoinEvent };
  