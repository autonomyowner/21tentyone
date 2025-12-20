import { DailyContent, HealingGoal, MilestoneData, HealingTask } from './healing-types';

// Week themes and affirmations for the 21-day journey
export const WEEK_PHASES = {
  awareness: {
    label: 'Awareness',
    description: 'Understanding your attachment patterns',
    color: '#7d4560',
  },
  healing: {
    label: 'Healing',
    description: 'Processing and releasing old wounds',
    color: '#9a6b7d',
  },
  integration: {
    label: 'Integration',
    description: 'Building secure attachment',
    color: '#7d98af',
  },
};

export const MILESTONES: MilestoneData[] = [
  {
    day: 7,
    title: 'Week One Complete',
    subtitle: 'Awareness Achieved',
    message: 'You have taken the first brave step. By understanding your patterns, you have begun to unlock the door to healing.',
    achievement: 'You completed 7 days of self-discovery',
  },
  {
    day: 14,
    title: 'Halfway Through',
    subtitle: 'Healing in Progress',
    message: 'You are transforming. The work you are doing is rewiring your heart for secure connection.',
    achievement: 'You have shown up for yourself for 14 days',
  },
  {
    day: 21,
    title: 'Journey Complete',
    subtitle: 'Integration Achieved',
    message: 'You did it. You have planted seeds of secure attachment that will continue to bloom throughout your life.',
    achievement: 'You completed the full 21-day healing journey',
  },
];

const createTask = (
  day: number,
  order: number,
  title: string,
  description: string,
  detailedInstructions: string,
  duration: string,
  category: HealingTask['category']
): HealingTask => ({
  id: `task-${day}-${order}`,
  day,
  title,
  description,
  detailedInstructions,
  duration,
  category,
  order,
});

export const DAILY_CONTENT: DailyContent[] = [
  // Week 1: Awareness (Days 1-7)
  {
    day: 1,
    weekPhase: 'awareness',
    theme: 'Understanding Attachment',
    affirmation: 'I am worthy of secure, loving connections.',
    journalPrompt: 'What patterns do you notice in your closest relationships?',
    attachmentFocus: 'Recognizing your attachment style',
    tasks: [
      createTask(1, 1, 'Attachment Style Reflection', 'Reflect on your earliest relationships', 'Find a quiet space. Close your eyes and think about your childhood. How did your caregivers respond when you were upset? Were they consistently available, or was their presence unpredictable? Write down what comes up without judgment.', '15 min', 'reflection'),
      createTask(1, 2, 'Grounding Breath', 'Center yourself with 4-7-8 breathing', 'Breathe in for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 4 times. This activates your parasympathetic nervous system and creates safety in your body.', '5 min', 'breathing'),
      createTask(1, 3, 'Journal Your Story', 'Write about your relationship history', 'Without editing, write about your significant relationships. Notice themes: Do you often feel abandoned? Do you pull away when things get close? Let the pen move freely.', '20 min', 'journaling'),
    ],
  },
  {
    day: 2,
    weekPhase: 'awareness',
    theme: 'Recognizing Triggers',
    affirmation: 'My triggers are messengers, not enemies.',
    journalPrompt: 'What situations make you feel most unsafe in relationships?',
    attachmentFocus: 'Identifying emotional triggers',
    tasks: [
      createTask(2, 1, 'Trigger Mapping', 'Identify your top 5 relationship triggers', 'List situations that activate strong emotional responses. For each one, note: What happens in your body? What thoughts arise? What do you typically do?', '15 min', 'reflection'),
      createTask(2, 2, 'Body Scan', 'Notice where triggers live in your body', 'Slowly scan from head to toe. Where do you hold tension? Where do you feel emptiness? Your body remembers what your mind forgets.', '10 min', 'exercise'),
      createTask(2, 3, 'Letter to Your Triggers', 'Write to understand, not to fix', 'Dear trigger, I notice you appear when... You are trying to protect me from... Thank you for...', '15 min', 'journaling'),
    ],
  },
  {
    day: 3,
    weekPhase: 'awareness',
    theme: 'The Inner Child',
    affirmation: 'The child within me deserves gentleness.',
    journalPrompt: 'What did you need as a child that you did not receive?',
    attachmentFocus: 'Connecting with your younger self',
    tasks: [
      createTask(3, 1, 'Inner Child Visualization', 'Meet your younger self', 'Close your eyes. Imagine yourself at age 5-7. What does this child look like? How do they feel? Approach them with warmth. What do they need to hear?', '15 min', 'exercise'),
      createTask(3, 2, 'Comfort Letter', 'Write what you needed to hear', 'Write a letter to your younger self. Include the words of comfort, safety, and love you wished someone had said.', '20 min', 'journaling'),
      createTask(3, 3, 'Self-Soothing Practice', 'Learn to parent yourself', 'Place your hand on your heart. Say aloud: "I am here. I am safe. I am loved." Notice how this feels.', '5 min', 'exercise'),
    ],
  },
  {
    day: 4,
    weekPhase: 'awareness',
    theme: 'Relationship Patterns',
    affirmation: 'I can choose new patterns.',
    journalPrompt: 'How do you typically respond when you feel disconnected from someone you love?',
    attachmentFocus: 'Understanding your relational dance',
    tasks: [
      createTask(4, 1, 'Pattern Recognition', 'Map your relationship cycle', 'Think of a recent conflict. What triggered it? How did you respond? How did it resolve (or not)? Draw this cycle.', '15 min', 'reflection'),
      createTask(4, 2, 'Opposite Action', 'Identify one small change', 'If you usually withdraw, what would reaching out look like? If you usually pursue, what would giving space look like?', '10 min', 'reflection'),
      createTask(4, 3, 'Gratitude for Growth', 'Appreciate your awareness', 'Write 3 things you are proud of in your relational growth, no matter how small.', '10 min', 'journaling'),
    ],
  },
  {
    day: 5,
    weekPhase: 'awareness',
    theme: 'Needs and Boundaries',
    affirmation: 'My needs matter and deserve to be voiced.',
    journalPrompt: 'What needs do you find hardest to express?',
    attachmentFocus: 'Identifying unmet needs',
    tasks: [
      createTask(5, 1, 'Needs Inventory', 'List your core relationship needs', 'Security, affection, space, validation, consistency, adventure... Circle your top 5 and rank them.', '15 min', 'reflection'),
      createTask(5, 2, 'Boundary Exploration', 'Where are your edges?', 'Write about a time your boundaries were crossed. How did you know? What did you do? What do you wish you had done?', '15 min', 'journaling'),
      createTask(5, 3, 'Calming Breath', 'Return to center', '5 minutes of slow, deep breathing. Inhale love, exhale fear.', '5 min', 'breathing'),
    ],
  },
  {
    day: 6,
    weekPhase: 'awareness',
    theme: 'Fear of Abandonment',
    affirmation: 'I am whole, even when alone.',
    journalPrompt: 'What does abandonment feel like in your body?',
    attachmentFocus: 'Facing the core fear',
    tasks: [
      createTask(6, 1, 'Abandonment Timeline', 'Trace where this began', 'When did you first feel abandoned? Create a timeline of moments when this fear was activated.', '20 min', 'reflection'),
      createTask(6, 2, 'Safe Container Visualization', 'Build internal safety', 'Imagine a place where you feel completely safe. Describe every detail. This is your inner sanctuary.', '10 min', 'exercise'),
      createTask(6, 3, 'Affirmation Practice', 'Reprogram the fear', 'Repeat 10 times: "I am lovable. I am worthy of staying for. People can love me and leave, and I will still be whole."', '5 min', 'exercise'),
    ],
  },
  {
    day: 7,
    weekPhase: 'awareness',
    theme: 'Week One Integration',
    affirmation: 'I celebrate my courage to look within.',
    journalPrompt: 'What have you discovered about yourself this week?',
    attachmentFocus: 'Celebrating awareness',
    tasks: [
      createTask(7, 1, 'Week Reflection', 'Review your journey so far', 'Read through your journal entries from this week. What themes emerge? What surprised you?', '20 min', 'reflection'),
      createTask(7, 2, 'Self-Compassion Letter', 'Acknowledge your bravery', 'Write a letter thanking yourself for showing up this week. Be specific about what you are proud of.', '15 min', 'journaling'),
      createTask(7, 3, 'Grounding Practice', 'Embody your learnings', 'Stand with feet hip-width apart. Feel your connection to the earth. You are grounded. You are growing.', '5 min', 'exercise'),
    ],
  },
  // Week 2: Healing (Days 8-14)
  {
    day: 8,
    weekPhase: 'healing',
    theme: 'Grieving Old Wounds',
    affirmation: 'I allow myself to feel so I can heal.',
    journalPrompt: 'What losses in love have you never fully grieved?',
    attachmentFocus: 'Allowing grief to move through',
    tasks: [
      createTask(8, 1, 'Grief Inventory', 'Name what was lost', 'List the relationships, hopes, or versions of yourself you have lost. Let yourself feel the weight of each.', '20 min', 'journaling'),
      createTask(8, 2, 'Emotional Release', 'Let the tears come', 'Find a private space. Allow yourself to cry, scream into a pillow, or move your body to release stuck emotions.', '15 min', 'exercise'),
      createTask(8, 3, 'Comfort Ritual', 'Soothe yourself after release', 'Take a warm bath or shower. Wrap yourself in something soft. Treat yourself as you would a grieving friend.', '15 min', 'exercise'),
    ],
  },
  {
    day: 9,
    weekPhase: 'healing',
    theme: 'Reparenting Yourself',
    affirmation: 'I can give myself what I never received.',
    journalPrompt: 'What would the perfect parent have done differently?',
    attachmentFocus: 'Becoming your own secure base',
    tasks: [
      createTask(9, 1, 'Ideal Parent Letter', 'Describe the parent you needed', 'Write in detail about the parent you wish you had. How would they have responded to your fears, your achievements, your mistakes?', '20 min', 'journaling'),
      createTask(9, 2, 'Self-Parenting Practice', 'Speak to yourself with love', 'Throughout the day, talk to yourself as this ideal parent would. Notice how it feels.', '15 min', 'exercise'),
      createTask(9, 3, 'Nurturing Breath', 'Breathe in parent love', 'Inhale imagining love flowing in. Exhale releasing old pain. Repeat for 5 minutes.', '5 min', 'breathing'),
    ],
  },
  {
    day: 10,
    weekPhase: 'healing',
    theme: 'Releasing Blame',
    affirmation: 'I release what no longer serves my healing.',
    journalPrompt: 'Who do you need to forgive, including yourself?',
    attachmentFocus: 'Letting go of resentment',
    tasks: [
      createTask(10, 1, 'Blame Inventory', 'Who carries your anger?', 'List everyone you blame for your attachment wounds. Include yourself. For each, write what you wish they had done differently.', '20 min', 'reflection'),
      createTask(10, 2, 'Release Ritual', 'Symbolically let go', 'Write each resentment on a small piece of paper. Safely burn or tear them up while saying "I release you."', '15 min', 'exercise'),
      createTask(10, 3, 'Compassion Meditation', 'Soften toward all involved', 'Close your eyes. Send compassion to yourself, then to those who hurt you. "May you be free from suffering."', '10 min', 'exercise'),
    ],
  },
  {
    day: 11,
    weekPhase: 'healing',
    theme: 'Rewriting Your Story',
    affirmation: 'I am the author of my own narrative.',
    journalPrompt: 'How would you tell your story if you were the hero?',
    attachmentFocus: 'Transforming victim to survivor to thriver',
    tasks: [
      createTask(11, 1, 'Hero Narrative', 'Retell your story', 'Write your attachment story as if you are the hero on a journey. What obstacles did you face? What wisdom did you gain?', '25 min', 'journaling'),
      createTask(11, 2, 'Strength Inventory', 'Name your superpowers', 'What strengths have you developed because of your attachment wounds? Empathy? Independence? Intuition?', '10 min', 'reflection'),
      createTask(11, 3, 'Grounding in Strength', 'Embody your power', 'Stand tall. Name each strength aloud. Feel them in your body.', '5 min', 'exercise'),
    ],
  },
  {
    day: 12,
    weekPhase: 'healing',
    theme: 'Vulnerability Practice',
    affirmation: 'Vulnerability is my bridge to connection.',
    journalPrompt: 'What would you share if you felt completely safe?',
    attachmentFocus: 'Opening the heart safely',
    tasks: [
      createTask(12, 1, 'Vulnerability Map', 'Layers of your truth', 'Draw concentric circles. In the center, your deepest secrets. Moving out, things slightly easier to share. Notice your edges.', '15 min', 'reflection'),
      createTask(12, 2, 'Micro-Vulnerability', 'Practice small openings', 'Share something slightly vulnerable with a trusted person today. Notice what happens.', '15 min', 'exercise'),
      createTask(12, 3, 'Self-Validation', 'Honor your courage', 'Write about how it felt to be vulnerable. Validate your bravery regardless of the response you received.', '10 min', 'journaling'),
    ],
  },
  {
    day: 13,
    weekPhase: 'healing',
    theme: 'Building Trust',
    affirmation: 'I can learn to trust again, starting with myself.',
    journalPrompt: 'What would trusting yourself fully look like?',
    attachmentFocus: 'Rebuilding trust foundations',
    tasks: [
      createTask(13, 1, 'Trust Inventory', 'Where is trust broken?', 'List areas where trust was broken - in others, in yourself, in life. For each, write one small step toward rebuilding.', '20 min', 'reflection'),
      createTask(13, 2, 'Self-Trust Promise', 'Make a commitment to yourself', 'Write a promise to yourself that you will keep this week. Make it small and achievable. Keep it.', '10 min', 'journaling'),
      createTask(13, 3, 'Trust Breathing', 'Breathe in possibility', 'With each inhale, think "I can trust." With each exhale, release doubt.', '5 min', 'breathing'),
    ],
  },
  {
    day: 14,
    weekPhase: 'healing',
    theme: 'Week Two Integration',
    affirmation: 'I am healing, and that is enough.',
    journalPrompt: 'How has your relationship with yourself changed this week?',
    attachmentFocus: 'Honoring the healing process',
    tasks: [
      createTask(14, 1, 'Healing Review', 'Reflect on week two', 'Read through this week\'s journal entries. What emotions came up most? What felt hardest? What felt most freeing?', '20 min', 'reflection'),
      createTask(14, 2, 'Body Gratitude', 'Thank your vessel', 'Your body held all of this. Place hands on your heart and belly. Thank your body for carrying you through.', '10 min', 'exercise'),
      createTask(14, 3, 'Celebration Moment', 'Honor your halfway point', 'Do something kind for yourself today. You are halfway through. This is huge.', '15 min', 'exercise'),
    ],
  },
  // Week 3: Integration (Days 15-21)
  {
    day: 15,
    weekPhase: 'integration',
    theme: 'Secure Attachment Vision',
    affirmation: 'I am creating the love I deserve.',
    journalPrompt: 'What does secure love look and feel like to you?',
    attachmentFocus: 'Envisioning secure connection',
    tasks: [
      createTask(15, 1, 'Secure Love Visualization', 'Imagine your ideal relationship', 'Close your eyes and imagine a relationship where you feel completely secure. What does daily life look like? How do you handle conflict?', '15 min', 'exercise'),
      createTask(15, 2, 'Relationship Vision Board', 'Describe your future love', 'Write or draw elements of the secure relationship you are creating. Be specific and expansive.', '20 min', 'journaling'),
      createTask(15, 3, 'Embodiment Practice', 'Feel secure in your body', 'Stand or sit comfortably. Imagine security as a warm light filling you from within. Let it expand.', '5 min', 'exercise'),
    ],
  },
  {
    day: 16,
    weekPhase: 'integration',
    theme: 'Communication Skills',
    affirmation: 'I can express my needs with clarity and love.',
    journalPrompt: 'What do you need to say that you have been holding back?',
    attachmentFocus: 'Learning secure communication',
    tasks: [
      createTask(16, 1, 'Needs Script', 'Practice expressing needs', 'Write scripts for expressing your top 3 needs using "I feel... when... I need..." format.', '20 min', 'reflection'),
      createTask(16, 2, 'Mirror Practice', 'Say it out loud', 'Stand before a mirror and practice saying one need statement. Notice your body language and tone.', '10 min', 'exercise'),
      createTask(16, 3, 'Grounding Breath', 'Prepare for difficult conversations', 'Before hard conversations, take 5 deep breaths. Ground into your body. Speak from center.', '5 min', 'breathing'),
    ],
  },
  {
    day: 17,
    weekPhase: 'integration',
    theme: 'Healthy Boundaries',
    affirmation: 'My boundaries protect what I treasure.',
    journalPrompt: 'What boundaries do you need to set or strengthen?',
    attachmentFocus: 'Establishing protective limits',
    tasks: [
      createTask(17, 1, 'Boundary Blueprint', 'Define your non-negotiables', 'List 5 boundaries that are essential for your wellbeing. For each, write what happens if it is crossed.', '20 min', 'reflection'),
      createTask(17, 2, 'Boundary Language', 'Practice saying no', 'Write 5 ways to say no or set a limit with kindness and firmness. Practice saying them aloud.', '10 min', 'exercise'),
      createTask(17, 3, 'Self-Appreciation', 'Honor your limits', 'Write a paragraph about why your boundaries are acts of self-love, not walls.', '10 min', 'journaling'),
    ],
  },
  {
    day: 18,
    weekPhase: 'integration',
    theme: 'Rupture and Repair',
    affirmation: 'Conflict can deepen connection when handled with care.',
    journalPrompt: 'How do you typically handle relationship ruptures?',
    attachmentFocus: 'Learning to repair after conflict',
    tasks: [
      createTask(18, 1, 'Rupture Patterns', 'Identify your conflict style', 'Do you attack, withdraw, freeze, or people-please? Write about your typical rupture response and its origins.', '15 min', 'reflection'),
      createTask(18, 2, 'Repair Scripts', 'Practice healing conversations', 'Write scripts for: apologizing, asking for an apology, expressing hurt, and reaching out after distance.', '20 min', 'journaling'),
      createTask(18, 3, 'Repair Visualization', 'Imagine successful resolution', 'Visualize a recent conflict being resolved with mutual understanding. How does it feel?', '10 min', 'exercise'),
    ],
  },
  {
    day: 19,
    weekPhase: 'integration',
    theme: 'Self-Love Practices',
    affirmation: 'I am my own first love.',
    journalPrompt: 'How can you love yourself better starting today?',
    attachmentFocus: 'Cementing self-love as foundation',
    tasks: [
      createTask(19, 1, 'Self-Love Inventory', 'How do you show yourself love?', 'List all the ways you currently care for yourself. Then list 5 new ways you could add.', '15 min', 'reflection'),
      createTask(19, 2, 'Love Letter to Self', 'Write as your own beloved', 'Write a love letter to yourself from your highest self. Be romantic, appreciative, and specific.', '20 min', 'journaling'),
      createTask(19, 3, 'Self-Embrace', 'Physically hold yourself', 'Wrap your arms around yourself in a hug. Hold for 2 minutes. Notice what arises.', '5 min', 'exercise'),
    ],
  },
  {
    day: 20,
    weekPhase: 'integration',
    theme: 'Future Self Connection',
    affirmation: 'My healed self is guiding me forward.',
    journalPrompt: 'What advice would your future healed self give you?',
    attachmentFocus: 'Connecting with your potential',
    tasks: [
      createTask(20, 1, 'Future Self Visualization', 'Meet yourself 5 years from now', 'Imagine yourself 5 years from now, in a secure, loving relationship. What do they want you to know?', '15 min', 'exercise'),
      createTask(20, 2, 'Letter from the Future', 'Receive wisdom', 'Write a letter from your healed future self to your present self. What guidance do they offer?', '20 min', 'journaling'),
      createTask(20, 3, 'Gratitude for the Journey', 'Thank your path', 'List 10 things you are grateful for about your healing journey so far.', '10 min', 'reflection'),
    ],
  },
  {
    day: 21,
    weekPhase: 'integration',
    theme: 'Completion and Continuation',
    affirmation: 'This ending is a beautiful beginning.',
    journalPrompt: 'How will you carry this healing forward?',
    attachmentFocus: 'Celebrating and committing to continue',
    tasks: [
      createTask(21, 1, 'Journey Reflection', 'Review your transformation', 'Read through all 21 days of journal entries. Write about who you were on Day 1 vs who you are now.', '25 min', 'reflection'),
      createTask(21, 2, 'Commitment Letter', 'Promise your continued healing', 'Write a commitment letter to yourself about how you will continue healing after these 21 days.', '15 min', 'journaling'),
      createTask(21, 3, 'Celebration Ritual', 'Honor your completion', 'Do something special to celebrate. Light a candle, take a bath, dance, create art. Mark this moment.', '15 min', 'exercise'),
    ],
  },
];

export const DEFAULT_GOALS: Omit<HealingGoal, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Complete Daily Check-ins',
    description: 'Show up for yourself every day',
    targetValue: 21,
    currentValue: 0,
    unit: 'days',
    category: 'mindfulness',
  },
  {
    title: 'Practice Self-Soothing',
    description: 'Use a calming technique when triggered',
    targetValue: 14,
    currentValue: 0,
    unit: 'times',
    category: 'self-care',
  },
  {
    title: 'Express a Need',
    description: 'Practice voicing your needs to someone',
    targetValue: 7,
    currentValue: 0,
    unit: 'times',
    category: 'relationship',
  },
  {
    title: 'Inner Child Connection',
    description: 'Spend time nurturing your younger self',
    targetValue: 10,
    currentValue: 0,
    unit: 'sessions',
    category: 'attachment',
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  reflection: '#7d4560',
  exercise: '#9a6b7d',
  journaling: '#7d98af',
  breathing: '#a8aabe',
  attachment: '#7d4560',
  relationship: '#9a6b7d',
  'self-care': '#7d98af',
  mindfulness: '#a8aabe',
};

export const CATEGORY_LABELS: Record<string, string> = {
  reflection: 'Reflection',
  exercise: 'Exercise',
  journaling: 'Journaling',
  breathing: 'Breathing',
  attachment: 'Attachment',
  relationship: 'Relationship',
  'self-care': 'Self-Care',
  mindfulness: 'Mindfulness',
};
