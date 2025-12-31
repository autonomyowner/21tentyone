'use client';

import { useState } from 'react';
import { HealingGoal, GoalCategory } from '@/lib/healing-types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/healing-mock-data';

interface GoalTrackerProps {
  goals: HealingGoal[];
  onUpdateProgress: (goalId: string, newValue: number) => void;
  onAddGoal: (goal: Omit<HealingGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteGoal: (goalId: string) => void;
}

interface GoalItemProps {
  goal: HealingGoal;
  onUpdateProgress: (newValue: number) => void;
  onDelete: () => void;
}

function GoalItem({ goal, onUpdateProgress, onDelete }: GoalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal.currentValue.toString());
  const [showDelete, setShowDelete] = useState(false);

  const percentage = Math.round((goal.currentValue / goal.targetValue) * 100);
  const isComplete = goal.currentValue >= goal.targetValue;
  const categoryColor = CATEGORY_COLORS[goal.category];

  const handleSave = () => {
    const newValue = Math.max(0, Math.min(goal.targetValue, parseInt(editValue) || 0));
    onUpdateProgress(newValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(goal.currentValue.toString());
      setIsEditing(false);
    }
  };

  const handleIncrement = () => {
    if (goal.currentValue < goal.targetValue) {
      onUpdateProgress(goal.currentValue + 1);
    }
  };

  return (
    <div
      className="relative p-4 transition-all duration-300 group"
      style={{
        backgroundColor: isComplete
          ? 'rgba(186, 84, 72, 0.06)'
          : 'var(--white)',
        borderLeft: `4px solid ${categoryColor}`,
        border: '1px solid rgba(129, 53, 46, 0.08)',
        borderLeftWidth: '4px',
        borderLeftColor: categoryColor,
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Delete button */}
      <button
        onClick={onDelete}
        className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center
          transition-all duration-200 hover:bg-red-100 ${
            showDelete ? 'opacity-100' : 'opacity-0'
          }`}
        style={{ color: '#e57373' }}
      >
        <span className="text-sm font-medium">x</span>
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-2 pr-6">
        <div>
          <h4
            className={`text-sm font-medium ${isComplete ? 'line-through' : ''}`}
            style={{ color: isComplete ? 'rgba(129, 53, 46, 0.4)' : 'var(--navy)' }}
          >
            {goal.title}
          </h4>
          <p
            className="text-xs mt-0.5"
            style={{ color: isComplete ? 'rgba(129, 53, 46, 0.3)' : 'var(--navy)', opacity: isComplete ? 1 : 0.5 }}
          >
            {goal.description}
          </p>
        </div>

        {/* Category badge */}
        <span
          className="text-xs px-2 py-0.5 flex-shrink-0"
          style={{
            backgroundColor: `${categoryColor}15`,
            color: categoryColor,
          }}
        >
          {CATEGORY_LABELS[goal.category]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 mb-2">
        <div
          className="h-2.5 overflow-hidden"
          style={{ backgroundColor: 'rgba(129, 53, 46, 0.06)' }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              background: isComplete
                ? 'var(--gold)'
                : `linear-gradient(90deg, ${categoryColor}80 0%, ${categoryColor} 100%)`,
            }}
          />
        </div>
      </div>

      {/* Progress info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              min={0}
              max={goal.targetValue}
              autoFocus
              className="w-16 px-2 py-1 text-sm border"
              style={{
                borderColor: categoryColor,
                color: 'var(--navy)',
                outline: 'none',
              }}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-2 py-1 transition-colors hover:bg-gray-100"
            >
              <span className="text-sm font-medium" style={{ color: categoryColor }}>
                {goal.currentValue}
              </span>
              <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>
                / {goal.targetValue} {goal.unit}
              </span>
            </button>
          )}

          {!isComplete && !isEditing && (
            <button
              onClick={handleIncrement}
              className="w-7 h-7 flex items-center justify-center text-sm font-bold transition-all hover:scale-110"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
            >
              +
            </button>
          )}
        </div>

        <span
          className="text-xs font-medium"
          style={{ color: isComplete ? 'var(--gold)' : categoryColor }}
        >
          {percentage}%
        </span>
      </div>

      {/* Completion indicator */}
      {isComplete && (
        <div
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center"
          style={{ backgroundColor: 'var(--gold)' }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </div>
  );
}

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<HealingGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function AddGoalModal({ isOpen, onClose, onAdd }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('10');
  const [unit, setUnit] = useState('times');
  const [category, setCategory] = useState<GoalCategory>('mindfulness');

  const categories: GoalCategory[] = ['attachment', 'relationship', 'self-care', 'mindfulness'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      targetValue: parseInt(targetValue) || 10,
      currentValue: 0,
      unit,
      category,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTargetValue('10');
    setUnit('times');
    setCategory('mindfulness');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(129, 53, 46, 0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6"
        style={{
          backgroundColor: 'var(--cream)',
          boxShadow: '0 24px 48px rgba(129, 53, 46, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="heading-serif text-lg font-light mb-4" style={{ color: 'var(--navy)' }}>
          Add New Goal
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--navy)' }}>
              Goal Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Practice boundaries"
              className="w-full px-4 py-2.5 text-sm"
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid rgba(129, 53, 46, 0.12)',
                color: 'var(--navy)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--navy)' }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full px-4 py-2.5 text-sm"
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid rgba(129, 53, 46, 0.12)',
                color: 'var(--navy)',
                outline: 'none',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--navy)' }}>
                Target
              </label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                min={1}
                className="w-full px-4 py-2.5 text-sm"
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid rgba(129, 53, 46, 0.12)',
                  color: 'var(--navy)',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--navy)' }}>
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="times, days, etc."
                className="w-full px-4 py-2.5 text-sm"
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid rgba(129, 53, 46, 0.12)',
                  color: 'var(--navy)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy)' }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor:
                      category === cat ? CATEGORY_COLORS[cat] : `${CATEGORY_COLORS[cat]}15`,
                    color: category === cat ? '#fff' : CATEGORY_COLORS[cat],
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'rgba(129, 53, 46, 0.08)',
                color: 'var(--navy)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-medium transition-colors"
              style={{
                background: 'var(--gold)',
                color: 'var(--navy)',
              }}
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GoalTracker({
  goals,
  onUpdateProgress,
  onAddGoal,
  onDeleteGoal,
}: GoalTrackerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const completedGoals = goals.filter((g) => g.currentValue >= g.targetValue).length;
  const totalGoals = goals.length;

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
        <div>
          <h3 className="heading-serif text-lg font-light" style={{ color: 'var(--navy)' }}>
            Healing Goals
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--blue)' }}>
            {completedGoals} of {totalGoals} completed
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-sm font-medium transition-all hover:opacity-90"
          style={{
            background: 'var(--gold)',
            color: 'var(--navy)',
          }}
        >
          + Add Goal
        </button>
      </div>

      {/* Goals list */}
      <div className="space-y-3">
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onUpdateProgress={(value) => onUpdateProgress(goal.id, value)}
            onDelete={() => onDeleteGoal(goal.id)}
          />
        ))}
      </div>

      {goals.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.4 }}>
            No goals yet. Add your first healing goal!
          </p>
        </div>
      )}

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddGoal}
      />
    </div>
  );
}
