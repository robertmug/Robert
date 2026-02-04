
export enum ViewMode {
  HOME = 'home',
  PROJECTS = 'projects',
  SKILLS = 'skills',
  AI_AGENT = 'ai_agent',
  VOICE = 'voice',
  CHAT = 'chat',
  IMAGE = 'image',
  LIVE = 'live',
  DASHBOARD = 'dashboard'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  thinking?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}
