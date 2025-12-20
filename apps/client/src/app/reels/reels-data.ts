// Reels Data Configuration

export interface ReelScene {
  id: number;
  voiceover: string;
  timestamp: string;
}

export interface ReelData {
  id: string;
  title: string;
  description: string;
  duration: number;
  hashtags: string[];
  scenes: ReelScene[];
  timeline: { scene: number; start: number; end: number }[];
}

export const reelsData: ReelData[] = [
  {
    id: 'transformation',
    title: '21-Day Transformation',
    description: 'A cinematic story showing the emotional reset journey from struggle to transformation.',
    duration: 26000,
    hashtags: [
      '#emotionalhealing',
      '#21daychallenge',
      '#mentalhealth',
      '#selflove',
      '#anxietyrelief',
      '#transformation',
      '#healingjourney',
      '#mindfulness',
    ],
    scenes: [
      { id: 1, timestamp: '0:00', voiceover: "You've been carrying this weight for years..." },
      { id: 2, timestamp: '0:03', voiceover: 'The anxiety. The overthinking. The emotional exhaustion.' },
      { id: 3, timestamp: '0:07', voiceover: 'What if 21 days could change everything?' },
      { id: 4, timestamp: '0:11', voiceover: 'Day by day. Breath by breath. You learn to let go.' },
      { id: 5, timestamp: '0:18', voiceover: 'And finally... you feel light again.' },
      { id: 6, timestamp: '0:23', voiceover: 'Your reset starts now.' },
    ],
    timeline: [
      { scene: 1, start: 0, end: 3000 },
      { scene: 2, start: 3000, end: 7000 },
      { scene: 3, start: 7000, end: 11000 },
      { scene: 4, start: 11000, end: 18000 },
      { scene: 5, start: 18000, end: 23000 },
      { scene: 6, start: 23000, end: 26000 },
    ],
  },
  {
    id: 'relationships',
    title: 'Toxic Relationship Recovery',
    description: 'Breaking free from toxic patterns and learning to love yourself again.',
    duration: 28000,
    hashtags: [
      '#toxicrelationships',
      '#relationshiphealing',
      '#boundaries',
      '#selflove',
      '#emotionalabuse',
      '#narcissisticabuse',
      '#healing',
      '#lettinggo',
    ],
    scenes: [
      { id: 1, timestamp: '0:00', voiceover: "You gave everything... and lost yourself." },
      { id: 2, timestamp: '0:04', voiceover: "Walking on eggshells. Never good enough. Always apologizing." },
      { id: 3, timestamp: '0:09', voiceover: "You knew something was wrong... but you stayed." },
      { id: 4, timestamp: '0:13', voiceover: "Because leaving felt scarier than staying broken." },
      { id: 5, timestamp: '0:17', voiceover: "But here's the truth they never told you..." },
      { id: 6, timestamp: '0:20', voiceover: "You were never the problem." },
      { id: 7, timestamp: '0:23', voiceover: "It's time to choose yourself." },
    ],
    timeline: [
      { scene: 1, start: 0, end: 4000 },
      { scene: 2, start: 4000, end: 9000 },
      { scene: 3, start: 9000, end: 13000 },
      { scene: 4, start: 13000, end: 17000 },
      { scene: 5, start: 17000, end: 20000 },
      { scene: 6, start: 20000, end: 23000 },
      { scene: 7, start: 23000, end: 28000 },
    ],
  },
  {
    id: 'coffee-health',
    title: 'Coffee & Health',
    description: 'The balanced truth about coffee — when it helps and when it hurts.',
    duration: 32000,
    hashtags: [
      '#coffeehealth',
      '#healthycoffee',
      '#wellness',
      '#mindfuldrinking',
      '#caffeine',
      '#healthyhabits',
      '#balancedlife',
      '#morningroutine',
    ],
    scenes: [
      { id: 1, timestamp: '0:00', voiceover: 'Coffee can be a powerful ally for your mind and body.' },
      { id: 2, timestamp: '0:04', voiceover: 'It supports energy, focus, and mood.' },
      { id: 3, timestamp: '0:08', voiceover: 'Rich in antioxidants. Promotes healthy aging. Boosts cognitive health.' },
      { id: 4, timestamp: '0:13', voiceover: 'But too much caffeine works against you.' },
      { id: 5, timestamp: '0:17', voiceover: 'Anxiety. Poor sleep. Elevated stress. Dependence.' },
      { id: 6, timestamp: '0:22', voiceover: 'Sensitivity varies — know your limits.' },
      { id: 7, timestamp: '0:26', voiceover: 'Used mindfully, coffee becomes a daily ritual that truly supports your health.' },
    ],
    timeline: [
      { scene: 1, start: 0, end: 4000 },
      { scene: 2, start: 4000, end: 8000 },
      { scene: 3, start: 8000, end: 13000 },
      { scene: 4, start: 13000, end: 17000 },
      { scene: 5, start: 17000, end: 22000 },
      { scene: 6, start: 22000, end: 26000 },
      { scene: 7, start: 26000, end: 32000 },
    ],
  },
];
