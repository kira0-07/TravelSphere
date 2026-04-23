import { motion } from 'framer-motion';

export default function ItineraryTimeline({ itinerary = [] }) {
  if (!itinerary.length) return null;

  return (
    <div className="space-y-0">
      {itinerary.map((day, index) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          className="flex gap-5"
        >
          {/* Timeline column */}
          <div className="flex flex-col items-center flex-shrink-0">
            {/* Day circle */}
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-display font-bold text-sm flex-shrink-0 z-10">
              {day.day}
            </div>
            {/* Connector line */}
            {index < itinerary.length - 1 && (
              <div className="w-0.5 flex-1 bg-secondary-fixed my-1 min-h-[32px]" />
            )}
          </div>

          {/* Content */}
          <div className="pb-8 flex-1 min-w-0">
            <h4 className="font-display font-semibold text-title-md text-on-surface mb-1">{day.title}</h4>
            {day.accommodation && (
              <p className="text-xs text-primary font-medium mb-3">🏨 {day.accommodation}</p>
            )}
            <ul className="space-y-1.5">
              {day.activities?.map((activity, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container flex-shrink-0 mt-2" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
