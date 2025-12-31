'use client';

import { useState } from 'react';
import { HealingTask, TaskCategory } from '@/lib/healing-types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/healing-mock-data';

interface HealingTasksProps {
  tasks: HealingTask[];
  completedTaskIds: string[];
  onTaskToggle: (taskId: string) => void;
}

interface TaskItemProps {
  task: HealingTask;
  isCompleted: boolean;
  onToggle: () => void;
  index: number;
}

function TaskItem({ task, isCompleted, onToggle, index }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryColor = CATEGORY_COLORS[task.category];

  return (
    <div
      className="relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: isCompleted
          ? 'rgba(186, 84, 72, 0.06)'
          : 'var(--white)',
        borderLeft: `4px solid ${categoryColor}`,
        border: '1px solid rgba(129, 53, 46, 0.08)',
        borderLeftWidth: '4px',
        borderLeftColor: categoryColor,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Custom checkbox */}
          <button
            onClick={onToggle}
            className="relative flex-shrink-0 w-6 h-6 border-2 transition-all duration-300 mt-0.5"
            style={{
              borderColor: isCompleted ? categoryColor : 'rgba(129, 53, 46, 0.2)',
              backgroundColor: isCompleted ? categoryColor : 'transparent',
            }}
          >
            {isCompleted && (
              <svg
                className="absolute inset-0 w-full h-full p-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 0,
                    animation: 'checkmark 0.3s ease-out forwards',
                  }}
                />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4
                className={`text-sm font-medium transition-all duration-300 ${
                  isCompleted ? 'line-through' : ''
                }`}
                style={{
                  color: isCompleted ? 'rgba(129, 53, 46, 0.4)' : 'var(--navy)',
                }}
              >
                {task.title}
              </h4>

              {/* Category badge */}
              <span
                className="text-xs px-2 py-0.5"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: categoryColor,
                }}
              >
                {CATEGORY_LABELS[task.category]}
              </span>

              {/* Duration badge */}
              <span
                className="text-xs px-2 py-0.5"
                style={{
                  backgroundColor: 'rgba(129, 53, 46, 0.06)',
                  color: 'var(--navy)',
                  opacity: 0.6,
                }}
              >
                {task.duration}
              </span>
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{
                color: isCompleted ? 'rgba(129, 53, 46, 0.4)' : 'var(--navy)',
                opacity: isCompleted ? 1 : 0.6,
              }}
            >
              {task.description}
            </p>

            {/* Expand button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs font-medium transition-colors duration-200 hover:underline"
              style={{ color: categoryColor }}
            >
              {isExpanded ? 'Hide details' : 'View instructions'}
            </button>
          </div>
        </div>

        {/* Expanded instructions */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isExpanded ? '500px' : '0',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div
            className="mt-4 ml-9 p-4 text-sm leading-relaxed"
            style={{
              backgroundColor: 'rgba(129, 53, 46, 0.03)',
              color: 'var(--navy)',
              opacity: 0.7,
            }}
          >
            {task.detailedInstructions}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HealingTasks({
  tasks,
  completedTaskIds,
  onTaskToggle,
}: HealingTasksProps) {
  const completedCount = tasks.filter((t) =>
    completedTaskIds.includes(t.id)
  ).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div
      className="p-6"
      style={{
        background: 'var(--white)',
        border: '1px solid rgba(129, 53, 46, 0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-serif text-lg font-light" style={{ color: 'var(--navy)' }}>
          Today's Exercises
        </h3>
        <span
          className="text-sm font-medium"
          style={{ color: completedCount === totalCount ? 'var(--gold)' : 'var(--blue)' }}
        >
          {completedCount} of {totalCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div
          className="h-2 overflow-hidden"
          style={{ backgroundColor: 'rgba(129, 53, 46, 0.08)' }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background:
                progress === 100
                  ? 'var(--gold)'
                  : 'linear-gradient(90deg, #81352E 0%, #9D433A 100%)',
            }}
          />
        </div>

        {/* Completion message */}
        {progress === 100 && (
          <p
            className="text-sm mt-3 text-center animate-fadeIn"
            style={{ color: 'var(--gold)' }}
          >
            All exercises complete! You showed up for yourself today.
          </p>
        )}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {tasks
          .sort((a, b) => a.order - b.order)
          .map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              isCompleted={completedTaskIds.includes(task.id)}
              onToggle={() => onTaskToggle(task.id)}
              index={index}
            />
          ))}
      </div>

      {/* Keyframes for checkmark animation */}
      <style jsx global>{`
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
