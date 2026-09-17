import { useState, useMemo } from "react";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, 
  Sparkles, ArrowRight, Clock, Users, Filter, CheckCircle2, UserCheck, Check,
  LayoutGrid, CalendarDays, Plus, Pencil, Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mapping of month names to month indices (0-indexed)
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Color-coded event types config: Culture, Food, Festivals, Crafts
export const EVENT_TYPES = [
  { 
    id: "Culture", 
    label: "Culture", 
    icon: "🎭", 
    badge: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30",
    dot: "bg-purple-500",
    cellBadge: "bg-purple-500/15 text-purple-800 dark:text-purple-200 border-purple-500/30",
    activeBtn: "bg-purple-600 text-white shadow-xs",
  },
  { 
    id: "Food", 
    label: "Food", 
    icon: "🍲", 
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    dot: "bg-amber-500",
    cellBadge: "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/30",
    activeBtn: "bg-amber-600 text-white shadow-xs",
  },
  { 
    id: "Festivals", 
    label: "Festivals", 
    icon: "🪔", 
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30",
    dot: "bg-rose-500",
    cellBadge: "bg-rose-500/15 text-rose-800 dark:text-rose-200 border-rose-500/30",
    activeBtn: "bg-rose-600 text-white shadow-xs",
  },
  { 
    id: "Crafts", 
    label: "Crafts", 
    icon: "🎨", 
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    dot: "bg-emerald-500",
    cellBadge: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/30",
    activeBtn: "bg-emerald-600 text-white shadow-xs",
  },
];

// Helper to determine the primary event type
export function getEventType(ev) {
  if (!ev) return "Culture";
  const cat = String(ev.category || "").toLowerCase();
  const text = `${ev.name || ""} ${ev.category || ""} ${ev.history || ""} ${ev.description || ""} ${Array.isArray(ev.tags) ? ev.tags.join(" ") : ""}`.toLowerCase();

  // 1. Crafts
  if (
    cat.includes("craft") || cat.includes("artisan") || cat.includes("handloom") ||
    text.includes("craft") || text.includes("artisan") || text.includes("handloom") ||
    text.includes("pottery") || text.includes("brass") || text.includes("sculpt") ||
    text.includes("weave") || text.includes("weaving") || text.includes("textile") ||
    text.includes("carpet") || text.includes("bazaar")
  ) {
    return "Crafts";
  }

  // 2. Food
  if (
    cat.includes("food") || cat.includes("culinary") ||
    text.includes("food") || text.includes("feast") || text.includes("cuisine") ||
    text.includes("sadya") || text.includes("malpua") || text.includes("jalebi") ||
    text.includes("delicac") || text.includes("prasadam") || text.includes("tea")
  ) {
    return "Food";
  }

  // 3. Festivals
  if (
    cat.includes("festival") || cat.includes("harvest") || cat.includes("sacred") ||
    text.includes("festival") || text.includes("mela") || text.includes("utsav") ||
    text.includes("puja") || text.includes("yatra") || text.includes("dasara") ||
    text.includes("diwali") || text.includes("kumbh") || text.includes("rath") ||
    text.includes("onam") || text.includes("carnival")
  ) {
    return "Festivals";
  }

  // 4. Culture default
  return "Culture";
}

export function getTypeConfig(type) {
  return EVENT_TYPES.find((t) => t.id === type) || EVENT_TYPES[0];
}

export default function EventCalendarView({ 
  events = [], 
  onSelectEvent, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent, 
  isAdmin = false 
}) {
  const navigate = useNavigate();

  const formatIsoDate = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // View Mode: 'month' or 'week'
  const [calendarViewMode, setCalendarViewMode] = useState("month");

  // Month navigation anchor (Default to October 2026 for rich festive season)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1));
  
  // Week navigation anchor (Default to week of October 18, 2026)
  const [weekAnchor, setWeekAnchor] = useState(() => new Date(2026, 9, 18));

  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // RSVP state saved in localStorage
  const [rsvps, setRsvps] = useState(() => {
    try {
      const saved = localStorage.getItem("by-event-rsvps");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [rsvpCounts, setRsvpCounts] = useState(() => {
    try {
      const saved = localStorage.getItem("by-event-rsvp-counts");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Pre-calculate days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Helper to calculate week days (7 days from Sunday to Saturday)
  const weekDays = useMemo(() => {
    const d = new Date(weekAnchor.getFullYear(), weekAnchor.getMonth(), weekAnchor.getDate());
    const dayOfWeek = d.getDay(); // 0 is Sunday
    const sunday = new Date(d);
    sunday.setDate(d.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);

    const list = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(sunday);
      cur.setDate(sunday.getDate() + i);
      list.push(cur);
    }
    return list;
  }, [weekAnchor]);

  // Formatted string for Week header
  const weekRangeLabel = useMemo(() => {
    if (weekDays.length < 7) return "";
    const start = weekDays[0];
    const end = weekDays[6];
    const startMonth = MONTH_NAMES[start.getMonth()].slice(0, 3);
    const endMonth = MONTH_NAMES[end.getMonth()].slice(0, 3);

    if (start.getMonth() === end.getMonth()) {
      return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
  }, [weekDays]);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayDate(null);
  };

  const jumpToCurrentMonth = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDayDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  // Week navigation
  const prevWeek = () => {
    setWeekAnchor((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
    setSelectedDayDate(null);
  };

  const nextWeek = () => {
    setWeekAnchor((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
    setSelectedDayDate(null);
  };

  const jumpToCurrentWeek = () => {
    const now = new Date();
    setWeekAnchor(now);
    setSelectedDayDate(now);
  };

  // Helper to calculate base attendee count
  const getAttendeeCount = (ev) => {
    if (!ev) return 0;
    if (rsvpCounts[ev.id] !== undefined) {
      return rsvpCounts[ev.id];
    }
    let base = 250;
    if (ev.id === "kumbh") base = 8500;
    else if (ev.id === "pushkar") base = 3400;
    else if (ev.id === "mysore-dasara") base = 4200;
    else if (ev.id === "puri-ratha-yatra") base = 6100;
    else if (ev.id === "durga-puja") base = 5800;
    else if (ev.id === "onam") base = 2900;
    else if (ev.id === "vizag-utsav") base = 1850;
    else {
      const nameStr = String(ev.name || "event");
      base = (nameStr.charCodeAt(0) * 17 + nameStr.length * 45) % 2500 + 400;
    }
    return base;
  };

  // Toggle RSVP attendance status
  const toggleRsvp = (ev, e) => {
    if (e) e.stopPropagation();
    if (!ev || !ev.id) return;
    const evId = ev.id;
    const isCurrentlyRsvped = Boolean(rsvps[evId]);
    const currentCount = getAttendeeCount(ev);

    const newRsvps = { ...rsvps, [evId]: !isCurrentlyRsvped };
    const newCounts = {
      ...rsvpCounts,
      [evId]: isCurrentlyRsvped ? Math.max(0, currentCount - 1) : currentCount + 1,
    };

    setRsvps(newRsvps);
    setRsvpCounts(newCounts);

    try {
      localStorage.setItem("by-event-rsvps", JSON.stringify(newRsvps));
      localStorage.setItem("by-event-rsvp-counts", JSON.stringify(newCounts));
    } catch {}
  };

  // Helper to match category filter (Culture, Food, Festivals, Crafts)
  const matchesCategory = (ev, cat) => {
    if (!cat || cat === "all") return true;
    const evType = getEventType(ev);
    if (cat === "Crafts" || cat === "Local Crafts") {
      return evType === "Crafts";
    }
    return evType.toLowerCase() === cat.toLowerCase();
  };

  // Determine events occurring on any specific date
  const getEventsForDate = (targetDate) => {
    const tYear = targetDate.getFullYear();
    const tMonth = targetDate.getMonth();
    const tDay = targetDate.getDate();
    const targetMonthName = MONTH_NAMES[tMonth];

    return events.filter((ev) => {
      if (!matchesCategory(ev, categoryFilter)) return false;

      // Check explicit ISO date
      if (ev.date) {
        const parsed = new Date(ev.date);
        if (!isNaN(parsed.getTime())) {
          return (
            parsed.getFullYear() === tYear &&
            parsed.getMonth() === tMonth &&
            parsed.getDate() === tDay
          );
        }
      }

      // Check month name match
      const evMonthStr = String(ev.month || "").toLowerCase();
      if (!evMonthStr.includes(targetMonthName.toLowerCase())) return false;

      // Regional rules for multi-day festivals
      const name = (ev.name || "").toLowerCase();
      if (name.includes("dasara") || name.includes("navratri") || name.includes("durga")) {
        return tDay >= 15 && tDay <= 24;
      }
      if (name.includes("kumbh")) {
        return tDay % 3 === 0;
      }
      if (name.includes("pushkar") || name.includes("kartik")) {
        return tDay >= 18 && tDay <= 26;
      }
      if (name.includes("ratha yatra")) {
        return tDay >= 7 && tDay <= 16;
      }
      if (name.includes("onam") || name.includes("vallam")) {
        return tDay >= 10 && tDay <= 20;
      }
      if (name.includes("diwali") || name.includes("deepavali")) {
        return tDay >= 28 && tDay <= 31;
      }
      if (name.includes("vizag") || name.includes("utsav")) {
        return tDay >= 22 && tDay <= 28;
      }

      const pseudoHash = (ev.name.charCodeAt(0) + ev.name.length * 3) % 25 + 1;
      return tDay === pseudoHash || tDay === pseudoHash + 1;
    });
  };

  // Get all events occurring this month matching the filter
  const monthEvents = useMemo(() => {
    const currentMonthName = MONTH_NAMES[month];
    return events.filter((ev) => {
      const evMonthStr = String(ev.month || ev.date || "").toLowerCase();
      const matchesMonth = evMonthStr.includes(currentMonthName.toLowerCase());
      if (!matchesMonth) return false;
      return matchesCategory(ev, categoryFilter);
    });
  }, [events, month, categoryFilter]);

  // Selected Day's events
  const selectedDayEvents = selectedDayDate ? getEventsForDate(selectedDayDate) : [];

  // Helper to check if two dates are same day
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Calendar Top Card */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs">
        {/* Row 1: Title & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-foreground font-heading">
                  {calendarViewMode === "month" ? `${MONTH_NAMES[month]} ${year}` : weekRangeLabel}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {calendarViewMode === "month" ? `${monthEvents.length} Festivals` : "Weekly Schedule"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Indian Cultural & Vedic Festival Calendar with monthly/weekly views and color-coded event types
              </p>
            </div>
          </div>

          {/* Right Toolbar: View Toggle & Date Navigation */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Monthly / Weekly View Toggle */}
            <div className="flex items-center rounded-2xl bg-muted/80 p-1 border border-border shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setCalendarViewMode("month");
                  if (selectedDayDate) {
                    setCurrentDate(new Date(selectedDayDate.getFullYear(), selectedDayDate.getMonth(), 1));
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  calendarViewMode === "month"
                    ? "bg-card text-foreground shadow-xs font-extrabold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Switch to Monthly Calendar View"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-primary" />
                <span>Month View</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCalendarViewMode("week");
                  if (selectedDayDate) {
                    setWeekAnchor(selectedDayDate);
                  } else {
                    setWeekAnchor(new Date(year, month, 18));
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  calendarViewMode === "week"
                    ? "bg-card text-foreground shadow-xs font-extrabold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Switch to Weekly Schedule View"
              >
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                <span>Weekly View</span>
              </button>
            </div>

            {/* Jump Button */}
            <button
              onClick={calendarViewMode === "month" ? jumpToCurrentMonth : jumpToCurrentWeek}
              className="px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              {calendarViewMode === "month" ? "Current Month" : "Current Week"}
            </button>

            {/* Arrow Navigators */}
            <div className="flex items-center rounded-xl border border-border bg-background p-1 shadow-xs">
              <button
                onClick={calendarViewMode === "month" ? prevMonth : prevWeek}
                className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
                title={calendarViewMode === "month" ? "Previous Month" : "Previous Week"}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={calendarViewMode === "month" ? nextMonth : nextWeek}
                className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
                title={calendarViewMode === "month" ? "Next Month" : "Next Week"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Add Event Button for Admin */}
            {(onAddEvent || isAdmin) && (
              <button
                type="button"
                onClick={() => onAddEvent && onAddEvent(selectedDayDate ? formatIsoDate(selectedDayDate) : "")}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-primary/90 transition-all cursor-pointer select-none"
                title="Add Event to Calendar"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Event</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Color-Coded Event Type Tags & Category Filter */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none text-xs">
            <span className="text-muted-foreground font-semibold flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Event Types:
            </span>

            {/* All Tag */}
            <button
              onClick={() => {
                setCategoryFilter("all");
                setSelectedDayDate(null);
              }}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 shrink-0 select-none ${
                categoryFilter === "all"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>🌐</span>
              <span>All Events</span>
            </button>

            {/* Color-Coded Tags: Culture, Food, Festivals, Crafts */}
            {EVENT_TYPES.map((type) => {
              const isSelected = categoryFilter === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setCategoryFilter(type.id);
                    setSelectedDayDate(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 shrink-0 border select-none ${
                    isSelected
                      ? `${type.activeBtn} scale-105 border-transparent`
                      : `${type.badge} hover:opacity-90`
                  }`}
                  title={`Filter by ${type.label} events`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Info Badge */}
          {categoryFilter !== "all" && (
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 shrink-0">
              <span>Showing <strong>{monthEvents.length}</strong> {categoryFilter} events</span>
              <button
                onClick={() => setCategoryFilter("all")}
                className="text-primary hover:underline font-bold cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* VIEW 1: MONTHLY CALENDAR GRID */}
        {calendarViewMode === "month" && (
          <div className="mt-6 border border-border rounded-2xl overflow-hidden bg-background">
            {/* Day Names Header */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-bold text-muted-foreground py-2.5">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div key={day} className={idx === 0 || idx === 6 ? "text-amber-600 dark:text-amber-400" : ""}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border text-xs">
              {/* Empty slots for start of month */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[85px] sm:min-h-[105px] p-2 bg-muted/10 opacity-30" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(year, month, day);
                const dayEvents = getEventsForDate(cellDate);
                const isSelected = selectedDayDate && isSameDay(selectedDayDate, cellDate);
                const isCurrentToday = isSameDay(today, cellDate);
                const hasEvents = dayEvents.length > 0;
                const userHasRsvpedDay = dayEvents.some((ev) => rsvps[ev.id]);

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDayDate(isSelected ? null : cellDate)}
                    className={`min-h-[85px] sm:min-h-[105px] p-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary z-10"
                        : userHasRsvpedDay
                        ? "bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20"
                        : hasEvents
                        ? "hover:bg-primary/5 bg-card"
                        : "hover:bg-muted/30 bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : isCurrentToday
                            ? "bg-amber-500 text-stone-950 ring-2 ring-amber-400"
                            : userHasRsvpedDay
                            ? "bg-emerald-600 text-white"
                            : hasEvents
                            ? "bg-muted text-foreground font-semibold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day}
                      </span>

                      {userHasRsvpedDay ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold flex items-center gap-0.5 shadow-xs">
                          <Check className="w-2.5 h-2.5" /> RSVP
                        </span>
                      ) : hasEvents ? (
                        <div className="flex items-center gap-0.5">
                          {dayEvents.slice(0, 3).map((ev) => {
                            const type = getEventType(ev);
                            const conf = getTypeConfig(type);
                            return (
                              <span
                                key={ev.id}
                                className={`w-1.5 h-1.5 rounded-full ${conf.dot}`}
                                title={`${conf.label}: ${ev.name}`}
                              />
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                    {/* Color-Coded Event Badges on Day Cell */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => {
                        const isRsvped = Boolean(rsvps[ev.id]);
                        const type = getEventType(ev);
                        const conf = getTypeConfig(type);

                        return (
                          <div
                            key={ev.id}
                            className={`truncate text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-all flex items-center gap-1 border ${
                              isRsvped
                                ? "bg-emerald-600 text-white font-bold border-emerald-700 shadow-xs"
                                : conf.cellBadge
                            }`}
                            title={`${conf.label} Event: ${ev.name} (${getAttendeeCount(ev)} Attending)`}
                          >
                            <span className="shrink-0">{isRsvped ? "✓" : conf.icon}</span>
                            <span className="truncate">{ev.name}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-muted-foreground font-semibold px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: WEEKLY SCHEDULE VIEW */}
        {calendarViewMode === "week" && (
          <div className="mt-6 space-y-4">
            {/* Weekdays 7-Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {weekDays.map((dayDate) => {
                const dayEvents = getEventsForDate(dayDate);
                const isSelected = selectedDayDate && isSameDay(selectedDayDate, dayDate);
                const isCurrentToday = isSameDay(today, dayDate);
                const dayOfWeek = DAYS_OF_WEEK[dayDate.getDay()];
                const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;

                return (
                  <div
                    key={dayDate.toISOString()}
                    onClick={() => setSelectedDayDate(isSelected ? null : dayDate)}
                    className={`rounded-2xl border p-3 flex flex-col justify-between transition-all cursor-pointer min-h-[220px] ${
                      isSelected
                        ? "bg-primary/10 border-primary ring-2 ring-primary/40 shadow-sm"
                        : isCurrentToday
                        ? "bg-card border-amber-500/60 shadow-xs"
                        : "bg-background border-border hover:border-primary/40"
                    }`}
                  >
                    {/* Day Column Header */}
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <div>
                          <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                            isWeekend ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                          }`}>
                            {dayOfWeek}
                          </span>
                          <span className="text-base font-extrabold text-foreground font-heading">
                            {MONTH_NAMES[dayDate.getMonth()].slice(0, 3)} {dayDate.getDate()}
                          </span>
                        </div>

                        {isCurrentToday ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-extrabold text-[9px] uppercase tracking-wide">
                            Today
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold text-[10px]">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Day Events List */}
                      <div className="space-y-2 mt-2.5">
                        {dayEvents.length === 0 ? (
                          <div className="py-8 text-center text-muted-foreground/60 text-[11px] italic">
                            No events scheduled
                          </div>
                        ) : (
                          dayEvents.map((ev) => {
                            const isAttending = Boolean(rsvps[ev.id]);
                            const type = getEventType(ev);
                            const conf = getTypeConfig(type);

                            return (
                              <div
                                key={ev.id}
                                className={`p-2.5 rounded-xl border text-xs transition-all space-y-1.5 ${
                                  isAttending
                                    ? "bg-emerald-500/10 border-emerald-500/40"
                                    : "bg-card border-border/80 hover:border-primary/40"
                                }`}
                              >
                                {/* Color-Coded Event Tag */}
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border flex items-center gap-1 ${conf.badge}`}>
                                    <span>{conf.icon}</span>
                                    <span>{conf.label}</span>
                                  </span>

                                  {isAttending && (
                                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-0.5">
                                      <CheckCircle2 className="w-3 h-3" /> Going
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-snug">
                                  {ev.name}
                                </h4>

                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5 text-primary shrink-0" />
                                  <span className="truncate">{ev.city || ev.state}</span>
                                </div>

                                {/* Quick RSVP action */}
                                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                                  <button
                                    type="button"
                                    onClick={(e) => toggleRsvp(ev, e)}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      isAttending
                                        ? "bg-emerald-600 text-white"
                                        : "bg-muted hover:bg-primary/10 text-foreground"
                                    }`}
                                  >
                                    {isAttending ? "Attending ✓" : "RSVP"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/planner?destination=${encodeURIComponent(ev.city || ev.state)}&to=${encodeURIComponent(
                                          ev.city || ev.state
                                        )}&from=Delhi&event=${encodeURIComponent(ev.name)}&month=${encodeURIComponent(ev.month)}`
                                      );
                                    }}
                                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                                  >
                                    Plan <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Day Event Drawer */}
      {selectedDayDate && (
        <div className="p-6 rounded-3xl bg-card border-2 border-primary/30 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base text-foreground font-heading">
                Celebrations on {MONTH_NAMES[selectedDayDate.getMonth()]} {selectedDayDate.getDate()}, {selectedDayDate.getFullYear()}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {(onAddEvent || isAdmin) && (
                <button
                  type="button"
                  onClick={() => onAddEvent && onAddEvent(formatIsoDate(selectedDayDate))}
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event on this Date</span>
                </button>
              )}
              <button
                onClick={() => setSelectedDayDate(null)}
                className="text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer px-2 py-1"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">
              No events found for this date matching category <strong>"{categoryFilter}"</strong>. Try switching the category filter to <strong>All Events</strong>.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {selectedDayEvents.map((ev) => {
                const isAttending = Boolean(rsvps[ev.id]);
                const count = getAttendeeCount(ev);
                const type = getEventType(ev);
                const conf = getTypeConfig(type);

                return (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* Color-Coded Event Tag Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${conf.badge}`}>
                          <span>{conf.icon}</span>
                          <span>{conf.label}</span>
                        </span>

                        <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {ev.city ? `${ev.city}, ${ev.state}` : ev.state}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-foreground">{ev.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {ev.history || ev.description}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-foreground font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{ev.timing || "Check local hours"}</span>
                        </div>

                        {/* Attendees Count Display */}
                        <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="text-foreground">{count.toLocaleString()}</span>
                          <span className="text-[11px]">Going</span>
                          {isAttending && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] ml-0.5">
                              (You)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Toolbar with RSVP Toggle */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                      {/* RSVP Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleRsvp(ev, e)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isAttending
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                            : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                        }`}
                      >
                        {isAttending ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Attending ✓</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>RSVP</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {onEditEvent && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent(ev);
                            }}
                            className="p-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                            title="Edit Event Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteEvent && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(ev);
                            }}
                            className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onSelectEvent && (
                          <button
                            type="button"
                            onClick={() => onSelectEvent(ev)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/25 flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> AI Guide
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/planner?destination=${encodeURIComponent(ev.city || ev.state)}&to=${encodeURIComponent(
                                ev.city || ev.state
                              )}&from=Delhi&event=${encodeURIComponent(ev.name)}&month=${encodeURIComponent(ev.month)}`
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 flex items-center gap-1 cursor-pointer"
                        >
                          Plan Trip <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Month Highlights with Color-Coded Tags and RSVP */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Key Festivals Occurring in {MONTH_NAMES[month]}
          </h3>
          <span className="text-xs text-muted-foreground">
            RSVP to add festivals to your personal attendance list
          </span>
        </div>

        {monthEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No specific regional festivals found for {MONTH_NAMES[month]} matching category <strong>"{categoryFilter}"</strong>.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {monthEvents.map((ev) => {
              const isAttending = Boolean(rsvps[ev.id]);
              const count = getAttendeeCount(ev);
              const type = getEventType(ev);
              const conf = getTypeConfig(type);

              return (
                <div
                  key={ev.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isAttending
                      ? "bg-emerald-500/10 border-emerald-500/40 shadow-xs"
                      : "bg-muted/30 border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0 text-lg">
                      {conf.icon}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`px-2 py-0.2 rounded-md text-[9px] font-bold border flex items-center gap-1 ${conf.badge}`}>
                          <span>{conf.icon}</span>
                          <span>{conf.label}</span>
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-foreground truncate pt-0.5">{ev.name}</h4>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {ev.city ? `${ev.city}, ${ev.state}` : ev.state}
                      </p>
                      <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 pt-0.5">
                        <Users className="w-3 h-3 text-primary" />
                        <span>{count.toLocaleString()} Attending</span>
                        {isAttending && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                            (You)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <button
                      type="button"
                      onClick={(e) => toggleRsvp(ev, e)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isAttending
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {isAttending ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Going ✓</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>RSVP</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/planner?destination=${encodeURIComponent(ev.city || ev.state)}&to=${encodeURIComponent(
                            ev.city || ev.state
                          )}&from=Delhi&event=${encodeURIComponent(ev.name)}&month=${encodeURIComponent(ev.month)}`
                        )
                      }
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Plan <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
