export default function sortTasksByDateTime(tasks) {
    tasks.sort((a, b) => {
        // Sort by priority (higher priority first)
        if (a.priority !== b.priority) {
            return b.priority - a.priority; // Higher priority first
        }

        // Sort by date (earlier dates first)
        const parseDate = (dateStr) => {
            if (!dateStr || dateStr === "null") return new Date(9999, 11, 31); // Max date
            try {
                return new Date(dateStr); // Assumes "YYYY-MM-DD" format
            } catch {
                return new Date(9999, 11, 31);
            }
        };

        const dateA = parseDate(a.due_date);
        const dateB = parseDate(b.due_date);
        if (dateA - dateB !== 0) return dateA - dateB;

        // Sort by time (earlier times first)
        const parseTime = (timeStr) => {
            if (!timeStr || timeStr === "null") return new Date(0, 0, 0, 0, 0, 0); // Min time
            try {
                const [hours, minutes, seconds] = timeStr.split(":").map(Number);
                return new Date(0, 0, 0, hours, minutes, seconds);
            } catch {
                return new Date(0, 0, 0, 0, 0, 0);
            }
        };

        const timeA = parseTime(a.due_time);
        const timeB = parseTime(b.due_time);
        return timeA - timeB;
    });

    return tasks;
}
