# Google Meet-Style Interview UI

## Overview
Redesigned the interview session to look like a live video call (Google Meet style) with an AI interviewer avatar.

## UI Features

### 1. Full-Screen Video Layout
- **Black background** - Professional video call aesthetic
- **Large AI avatar area** - Takes up most of the screen like a video call
- **Picture-in-picture** - Your answer appears in bottom-right corner

### 2. AI Interviewer Avatar
- **Animated gradient avatar** - Blue/purple gradient with person icon
- **Pulse animation** - Avatar pulses when speaking
- **Audio visualizer** - Bouncing bars below avatar when speaking
- **Status indicators** - Shows "AI is speaking", "Listening", or "Ready"

### 3. Top Bar (Dark)
- **Live indicator** - Red "LIVE" badge
- **Progress tracking** - Question X of Y
- **Percentage complete** - Visual progress indicator

### 4. Question Display
- **Centered in video area** - Large, readable text
- **Semi-transparent card** - Black background with blur effect
- **Category & difficulty** - Shown above question

### 5. Bottom Control Bar (Google Meet Style)
- **Left side:**
  - Repeat Question button
  
- **Center (main controls):**
  - Large circular mic button (blue when ready, red when recording)
  - Submit Answer button (green)
  - Skip button
  
- **Right side:**
  - End Interview button

### 6. Your Answer Display
- **Picture-in-picture style** - Bottom-right corner
- **Avatar for "You"** - Green/blue gradient
- **Real-time transcript** - Shows as you speak
- **Semi-transparent card** - Doesn't block main view

## Visual States

### When AI is Speaking:
- Avatar pulses with blue ring
- Bouncing audio visualizer bars
- "AI is speaking..." status
- Mic button disabled

### When Listening:
- Green dot indicator
- "Listening to your answer..." status
- Red mic button (recording)
- Answer appears in PIP

### When Ready:
- Static avatar
- "Ready for your answer" status
- Blue mic button
- All controls enabled

## Color Scheme
- **Background:** Black (#000000)
- **Bars:** Dark gray (#1F2937)
- **AI Avatar:** Blue to Purple gradient
- **Your Avatar:** Green to Blue gradient
- **Accent:** Blue (#3B82F6)
- **Recording:** Red (#DC2626)
- **Submit:** Green (#16A34A)

## Responsive Design
- Max width container for ultra-wide screens
- Maintains aspect ratio
- Controls always visible at bottom
- PIP answer box scales appropriately

## Animations
- Avatar pulse when speaking
- Audio visualizer bounce
- Smooth transitions
- Gradient animations in background
