import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const simulatedResponse = generateYouTubeResponse(prompt)

    return NextResponse.json({
      result: simulatedResponse,
      agent: 'youtube',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('YouTube Agent Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

function generateYouTubeResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('title') || lowerPrompt.includes('thumbnail')) {
    return `# YouTube Video Title Options

## High-CTR Title Variations

### Option 1: How-To Format
**Title**: "How to [Achieve Result] in Just [Timeframe] (Step-by-Step Guide)"
**Why it works**: Clear value proposition + specific outcome

### Option 2: List Format
**Title**: "7 [Things/Tips/Mistakes] That Will Change Your [Topic] Game"
**Why it works**: Specific number creates curiosity + promises value

### Option 3: Question Format
**Title**: "Is [Common Belief] Actually Wrong? The Truth About [Topic]"
**Why it works**: Challenges assumptions + creates intrigue

### Option 4: Results-Focused
**Title**: "I Tried [Method] for 30 Days - Here's What Happened"
**Why it works**: Personal experiment + time-bound results

### Option 5: Ultimate Guide
**Title**: "The Complete Guide to [Topic] (Everything You Need to Know)"
**Why it works**: Comprehensive promise + authority positioning

---

## Thumbnail Design Tips

### Visual Elements:
✓ **High Contrast**: Bright colors that stand out
✓ **Clear Subject**: One focal point, not cluttered
✓ **Emotion**: Expressive faces or dramatic imagery
✓ **Text Overlay**: 3-4 words max, large and bold
✓ **Brand Consistency**: Use consistent colors/style

### Color Psychology:
- 🔴 Red: Urgency, excitement
- 🟡 Yellow: Optimism, attention
- 🔵 Blue: Trust, professionalism
- 🟢 Green: Growth, success
- ⚫ Black: Sophistication, luxury

### A/B Test These Elements:
1. Different facial expressions
2. Text vs. no text
3. Various color schemes
4. Close-up vs. wide shots`
  }
  
  if (lowerPrompt.includes('description') || lowerPrompt.includes('seo')) {
    return `# YouTube Video Description Template

## SEO-Optimized Description Structure

---

### Hook (First 2 Lines - Most Important for CTR)
\`\`\`
Discover the secret to [achieving result] that most people dont know about. 
In this video, Ill show you exactly how to [specific outcome].
\`\`\`

### Timestamps (Improves Watch Time)
\`\`\`
TIMESTAMPS:
0:00 - Introduction
0:45 - Problem overview
2:30 - Solution breakdown
5:15 - Step 1: Foundation
8:00 - Step 2: Implementation
12:30 - Step 3: Optimization
15:45 - Common mistakes to avoid
18:00 - Final thoughts
\`\`\`

### Main Content (SEO Keywords)
\`\`\`
In this comprehensive guide, youll learn everything about [main topic]. 
Whether youre a beginner looking to understand [topic basics] or an 
advanced user wanting to master [advanced technique], this video covers it all.

Key topics covered:
- [Keyword 1]: Essential fundamentals
- [Keyword 2]: Advanced strategies
- [Keyword 3]: Pro tips and tricks
- [Keyword 4]: Common pitfalls
\`\`\`

### Call-to-Action
\`\`\`
If you found this helpful, please LIKE and SUBSCRIBE!
Hit the bell icon to get notified when I post new videos

Comment below with your biggest takeaway or questions!
\`\`\`

### Links and Resources
RESOURCES MENTIONED:
- [Resource 1]: [Link]
- [Resource 2]: [Link]
- Free Guide: [Lead Magnet Link]

WATCH NEXT:
- [Related Video 1]: [Link]
- [Related Video 2]: [Link]

CONNECT WITH ME:
- Twitter: @handle
- Instagram: @handle
- Website: URL

Hashtags (Use 3-5 Relevant Ones):
#MainTopic #SpecificSkill #Industry #BeginnerFriendly #Tutorial

---

## SEO Best Practices:

1. **Include primary keyword in first sentence**
2. **Use variations of target keywords naturally**
3. **Aim for 200-300 words minimum**
4. **Add timestamps for longer videos**
5. **Include relevant links for engagement**
6. **End with clear CTAs`
  }
  
  if (lowerPrompt.includes('tag') || lowerPrompt.includes('keyword')) {
    return `# YouTube Tags & Keywords Strategy

## Primary Tags (Most Important)
These should be your exact target keywords:

1. [main topic]
2. [main topic] tutorial
3. how to [main topic]
4. [main topic] for beginners
5. [main topic] guide

## Secondary Tags (Related Terms)
Broader category and related searches:

6. [industry/niche]
7. [industry] tips
8. [skill] tutorial
9. learn [skill]
10. [topic] explained

## Long-Tail Tags (Specific Searches)
More specific, less competitive:

11. how to [achieve specific result]
12. [topic] step by step
13. best way to [action]
14. [topic] mistakes to avoid
15. [topic] advanced techniques

## Brand Tags
Your channel-specific tags:

16. [your channel name]
17. [your name]
18. [your brand]

---

## Tag Research Tools:

1. **YouTube Search Suggest**: Type your topic and see autocomplete
2. **TubeBuddy**: Tag explorer and optimization
3. **VidIQ**: Keyword research tool
4. **Google Trends**: Compare keyword popularity
5. **AnswerThePublic**: Find question-based keywords

---

## Best Practices:

✓ Use all 500 characters allowed for tags
✓ Put most important tags first
✓ Include both broad and specific terms
✓ Use common misspellings as tags
✓ Include competitor channel names (carefully)
✓ Update tags based on performance data

---

## Example Tag Set for Tutorial Video:

\`\`\`
python tutorial, python for beginners, learn python, 
python programming, python course, python basics, 
coding tutorial, programming tutorial, python 2024, 
how to code in python, python projects, python tips, 
[Channel Name], python mastery
\`\`\``
  }
  
  if (lowerPrompt.includes('script') || lowerPrompt.includes('story')) {
    return `# YouTube Video Script Template

## Video Structure (Proven Formula)

---

### HOOK (0:00 - 0:30)
Goal: Grab attention immediately

[Start with result/emotion/question]
"Have you ever wondered why [common problem]? 
Well, today Im going to show you [promised outcome]."

[Quick preview of whats coming]
"By the end of this video, youll know exactly how to 
[achieve result] in just [timeframe]."

---

### INTRO (0:30 - 1:00)
Goal: Establish credibility and set expectations

[Who you are]
"For those new here, Im [name] and I help people [your mission]."

[What theyll learn]
"Today were covering:
- Point 1
- Point 2  
- Point 3

[Engagement ask]
"And stick around until the end because I have a special tip 
that most people miss."

---

### MAIN CONTENT (1:00 - 8:00+)
Goal: Deliver value in organized segments

[Section 1: Foundation]
"Lets start with the basics. First, you need to understand..."

[Transition]
"Now that you understand [concept], lets talk about..."

[Section 2: Implementation]
"Heres where it gets interesting. The actual process involves..."

[Pattern interrupt - keep attention]
"But wait, theres something important I need to tell you..."

[Section 3: Advanced/Application]
"Once youve mastered the basics, you can level up by..."

---

### CALL TO ACTION (Throughout)
Goal: Drive engagement without being annoying

[Soft CTA - Mid video]
"If youre finding this helpful, hit that like button!"

[Value-first approach]
"Before we continue, make sure youre subscribed so you 
dont miss future videos like this."

---

### CONCLUSION (Last 30 seconds)
Goal: Wrap up and direct next action

[Recap]
"So to summarize:
- Key point 1
- Key point 2
- Key point 3

[Final CTA]
"If you want to dive deeper, check out the link in the 
description for my free guide."

[Next video tease]
"And if you liked this, youll love my video on [related topic] 
which you can watch right here [point to end screen]."

[Sign off]
"Thanks for watching, and Ill see you in the next one!"

---

## Story Ideas for Content:

### 1. Transformation Story
"I went from [starting point] to [ending point] in [timeframe]"

### 2. Experiment Video
"I tried [method] every day for [X days] - Results shocked me"

### 3. Reaction/Analysis
"Reacting to [controversial topic] / Analyzing [success story]"

### 4. Behind the Scenes
"How I [achieve result] - Full workflow revealed"

### 5. Comparison Video
"[Option A] vs [Option B] - Which is actually better?"`
  }

  // Default response
  return `# YouTube Agent Capabilities

I can help you create compelling YouTube content that drives views and engagement.

## What I Can Generate:

### 1. Video Titles
- High-CTR title variations
- A/B test options
- SEO-optimized titles
- Trend-based titles

### 2. Video Descriptions
- SEO-optimized descriptions
- Timestamp formatting
- Link organization
- Call-to-action placement

### 3. Tags & Keywords
- Primary keyword research
- Long-tail tag suggestions
- Competitor analysis
- Trending topics

### 4. Video Scripts
- Complete video scripts
- Hook variations
- Story structures
- Engagement tactics

### 5. Content Ideas
- Video series concepts
- Trending topic suggestions
- Seasonal content ideas
- Audience-requested topics

### 6. Thumbnail Concepts
- Design recommendations
- Color psychology tips
- Text overlay suggestions
- Composition guidelines

## To get started, tell me:
- What's your video topic or niche?
- Who is your target audience?
- What type of video (tutorial, vlog, review, etc.)?
- Any specific keywords you want to target?

Example requests:
- "Generate 10 catchy titles for a cooking video"
- "Write a script for a tech review video"
- "Create tags for a fitness tutorial"`
}
