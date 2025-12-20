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
      className="relative rounded-xl p-4 transition-all duration-300 group"
      style={{
        backgroundColor: isComplete
          ? 'rgba(125, 152, 175, 0.08)'
          : 'rgba(255, 255, 255, 0.9)',
        borderLeft: `4px solid ${categoryColor}`,
        boxShadow: isComplete ? 'none' : '0 2px 12px rgba(125, 69, 96, 0.06)',
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Delete button */}
      <button
        onClick={onDelete}
        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center
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
            style={{ color: isComplete ? '#a8aabe' : '#4a3a42' }}
          >
            {goal.title}
          </h4>
          <p
            className="text-xs mt-0.5"
            style={{ color: isComplete ? '#c8cad5' : '#8a7a82' }}
          >
            {goal.description}
          </p>
        </div>

        {/* Category badge */}
        <span
          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
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
          className="h-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(125, 69, 96, 0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              background: isComplete
                ? 'linear-gradient(90deg, #7d98af 0%, #9ab5c8 100%)'
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
              className="w-16 px-2 py-1 text-sm rounded-lg border"
              style={{
                borderColor: categoryColor,
                color: '#4a3a42',
                outline: 'none',
              }}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition-colors hover:bg-gray-100"
            >
              <span className="text-sm font-medium" style={{ color: categoryColor }}>
                {goal.currentValue}
              </span>
              <span className="text-xs" style={{ color: '#a8aabe' }}>
                / {goal.targetValue} {goal.unit}
              </span>
            </button>
          )}

          {!isComplete && !isEditing && (
            <button
              onClick={handleIncrement}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110"
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
          style={{ color: isComplete ? '#7d98af' : categoryColor }}
        >
          {percentage}%
        </span>
      </div>

      {/* Completion indicator */}
      {isComplete && (
        <div
          className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#7d98af' }}
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
      style={{ backgroundColor: 'rgba(74, 58, 66, 0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: '#fafafa',
          boxShadow: '0 24px 48px rgba(125, 69, 96, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-serif mb-4" style={{ color: '#7d4560' }}>
          Add New Goal
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#4a3a42' }}>
              Goal Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Practice boundaries"
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(125, 69, 96, 0.15)',
                color: '#4a3a42',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#4a3a42' }}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(125, 69, 96, 0.15)',
                color: '#4a3a42',
                outline: 'none',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#4a3a42' }}>
                Target
              </label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                min={1}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(125, 69, 96, 0.15)',
                  color: '#4a3a42',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#4a3a42' }}>
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="times, days, etc."
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(125, 69, 96, 0.15)',
                  color: '#4a3a42',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#4a3a42' }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
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
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'rgba(125, 69, 96, 0.1)',
                color: '#7d4560',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: 'linear-gradient(135deg, #7d4560 0%, #9a6b7d 100%)',
                color: '#fff',
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
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(180deg, #fff 0%, rgba(250, 250, 250, 0.9) 100%)',
        boxShadow: '0 4px 24px rgba(125, 69, 96, 0.06)',
        border: '1px solid rgba(125, 69, 96, 0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-serif" style={{ color: '#7d4560' }}>
            Healing Goals
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#9a6b7d' }}>
            {completedGoals} of {totalGoals} completed
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #7d4560 0%, #9a6b7d 100%)',
            color: '#fff',
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
          <p className="text-sm" style={{ color: '#a8aabe' }}>
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
