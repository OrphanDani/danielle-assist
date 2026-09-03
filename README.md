# AI Work Companion

MASTER PROMPT: AI-Powered Productivity Assistant

Project Title

AI Productivity Assistant – SmartWork AI

Project Overview

Design and develop a modern, user-friendly AI-powered Productivity Assistant that solves real-world workplace and professional productivity problems.

The application should act as a centralized workspace where users can generate professional emails, summarize meeting notes, organize tasks, prioritize workloads, and optimize their time using modern AI technologies.

The system should use AI effectively through tools such as ChatGPT/OpenAI APIs and can be developed using Lovable.ai or a similar AI-assisted development platform.

The goal is to demonstrate how responsible AI can improve everyday workplace productivity while maintaining accuracy, transparency, privacy, and user control.

1. Project Objectives

The application must:

A. Address a real-world professional use case

Help employees, managers, entrepreneurs, students, and professionals manage common workplace challenges such as:

Spending too much time writing emails

Struggling to summarize lengthy meetings

Forgetting important action items and deadlines

Having difficulty prioritizing tasks

Poor time management

Information overload

Repetitive administrative work

B. Utilize AI tools effectively

Use modern AI capabilities to:

Generate context-aware professional content

Summarize unstructured information

Extract important information

Classify and prioritize tasks

Recommend efficient schedules

Provide personalized productivity suggestions

Where appropriate, integrate an AI API such as OpenAI/ChatGPT.

C. Demonstrate strong prompt engineering

Use structured prompts containing:

Clear system instructions

User context

Task-specific instructions

Desired output format

Tone requirements

Audience information

Constraints

Examples where useful

Validation and safety instructions

Prompts should be modular and reusable rather than simple one-line instructions.

D. Apply ethical and responsible AI practices

The application must:

Clearly indicate when content is AI-generated

Allow users to review and edit AI outputs

Avoid presenting AI suggestions as unquestionable facts

Protect sensitive workplace information

Minimize collection of personal data

Avoid storing sensitive information unnecessarily

Provide appropriate privacy notices

Prevent discriminatory or harmful recommendations

Encourage users to verify important information

Never fabricate meeting decisions, deadlines, or responsibilities

E. Demonstrate measurable productivity improvement

Show users how much time and effort the assistant can save.

Include a Productivity Dashboard displaying metrics such as:

Emails generated

Meeting notes summarized

Tasks organized

Estimated time saved

Tasks completed

Weekly productivity score

Most-used AI feature

Example:

"You saved approximately 2 hours 35 minutes this week using SmartWork AI."

The time-saving estimates should be clearly labeled as estimates, not guaranteed measurements.

2. Core Feature: Smart Email Generator

Create an AI-powered email generation tool.

Functionality

Users should enter:

Purpose of the email

Key information

Recipient type

Desired tone

Desired length

Optional deadline or call to action

The system should generate a professional email based on the provided context.

Recipient/Audience Options

Provide selectable options:

Client

Manager

Colleague

Team

Customer

Business Partner

General Professional

Tone Options

Allow users to select:

Formal

Professional

Friendly

Informal

Persuasive

Apologetic

Concise

Assertive

Email Output

Generate:

Subject line

Greeting

Main message

Call to action

Closing/sign-off

Allow users to:

Copy email

Edit email

Regenerate

Make shorter

Make longer

Change tone

Make more persuasive

Make more formal

Example Prompt Architecture

Use a structured AI prompt similar to:

Role:
You are an expert professional communication assistant.

Context:
Understand the user's purpose, audience, workplace context, and supplied information.

Task:
Generate a professional email that accurately reflects the user's intended message.

Constraints:
Do not invent facts, dates, commitments, names, or information that the user did not provide.

Tone:
Follow the user's selected tone.

Output:
Return a subject line and complete email.

3. Core Feature: Meeting Notes Summarizer

Create an AI tool that converts lengthy and unstructured meeting notes into concise, actionable information.

Input

Allow users to:

Paste meeting notes

Upload text-based notes

Enter notes manually

AI Processing

The AI should identify:

Summary

A short overview of the meeting.

Key Points

Important topics discussed.

Decisions

Decisions that were explicitly made.

Action Items

Tasks that need to be completed.

Responsibilities

Identify who is responsible when the notes explicitly state a person or team.

Deadlines

Extract stated deadlines and due dates.

Open Questions

Identify unresolved issues requiring follow-up.

Important Accuracy Rule

The AI must not invent decisions, deadlines, responsibilities, or names.

If information is missing, display:

"Not specified in the meeting notes."

Output Example

Meeting Summary

Brief overview of the discussion.

Key Points

Point 1

Point 2

Point 3

Decisions

Decision 1

Decision 2

Action Items

TaskResponsibleDeadlineStatus Prepare reportSarahFridayPending Contact clientJohnMondayPending

Open Questions

Question requiring follow-up

Allow users to export or copy the summary.

4. Core Feature: AI Task Planner / Scheduler

Develop an intelligent task planning system.

User Input

Allow users to enter:

Task name

Description

Deadline

Estimated duration

Importance

Urgency

Preferred working hours

Existing commitments

Optional energy level/preference

AI Capabilities

The AI should:

Organize tasks

Prioritize tasks

Identify urgent tasks

Identify important tasks

Estimate scheduling requirements

Create daily plans

Create weekly plans

Recommend time blocks

Identify potential scheduling conflicts

Suggest time optimization strategies

Priority System

Use an Urgency × Importance framework.

Classify tasks as:

Urgent + Important – Do first

Important + Not Urgent – Schedule

Urgent + Less Important – Delegate or handle efficiently

Not Urgent + Not Important – Consider postponing/removing

Schedule Output

Example:

Monday

08:30–09:00 — Review emails
09:00–10:30 — Complete client proposal
10:30–10:45 — Break
10:45–11:30 — Team meeting
11:30–12:00 — Follow-up actions

Include explanations for major prioritization decisions.

5. Time Optimization Recommendations

The AI should provide practical productivity recommendations such as:

Group similar tasks together

Schedule high-focus work during preferred working hours

Reduce unnecessary context switching

Break large tasks into smaller actions

Add realistic buffers between meetings

Prioritize deadline-sensitive work

Reserve time for unexpected tasks

Identify overloaded days

Suggest moving flexible tasks when conflicts occur

Recommendations must be presented as suggestions, allowing the user to accept, reject, or modify them.

6. User Interface Design

Create a clean, modern, professional dashboard.

Design Style

Use:

Modern SaaS design

Clean white/light background

Blue/purple AI accent colors

Rounded cards

Clear typography

Simple navigation

Responsive design

Accessible color contrast

Minimal visual clutter

Main Navigation

Create a sidebar or navigation menu containing:

Dashboard

Smart Email

Meeting Summarizer

Task Planner

Productivity Insights

History

Settings

Dashboard

The dashboard should display:

Welcome back!

"What would you like to accomplish today?"

Feature cards:

✉️ Smart Email Generator

📝 Meeting Notes Summarizer

✅ AI Task Planner

📊 Productivity Insights

Also show:

Today's priorities

Upcoming deadlines

Tasks completed

Estimated time saved

Recent AI activities

7. Prompt Engineering Architecture

Implement strong prompt engineering throughout the application.

Each AI function should have a dedicated structured prompt.

Use the following general framework:

Role

Define what the AI is.

Context

Provide relevant user information.

Objective

Clearly define what the AI must accomplish.

Constraints

Define what the AI must not do.

Input

Clearly separate user-provided information.

Output Format

Specify exactly how the response should be structured.

Validation

Require the AI to distinguish between supplied facts and assumptions.

Example:

"Only use information contained in the user input. If required information is unavailable, explicitly state that it was not provided. Do not fabricate names, dates, responsibilities, decisions, or commitments."

Use structured outputs such as JSON internally where appropriate so the frontend can reliably display AI-generated information.

8. Responsible AI Design

Build responsible AI principles into the application.

Transparency

Display:

"AI-generated content. Please review before sending or acting on it."

Human Oversight

Every AI-generated result must be editable.

Users should have final control over:

Emails

Meeting summaries

Tasks

Priorities

Schedules

Privacy

Do not expose sensitive workplace information unnecessarily.

Avoid storing raw meeting notes or email content unless the user explicitly chooses to save them.

Accuracy

The system should avoid hallucinating information.

For example, if a meeting note says:

"John will prepare the report by Friday."

The AI may extract:

John → Prepare report → Friday

But if the notes do not identify the responsible person, it must not guess one.

9. Productivity Measurement

Create a Productivity Insights page.

Track:

Number of emails generated

Number of meetings summarized

Number of tasks planned

Number of tasks completed

Estimated minutes saved

Weekly activity

Feature usage

Display these using simple charts and statistics.

Example:

This Week

Emails generated: 18
Meetings summarized: 6
Tasks organized: 42
Estimated time saved: 3h 20m

Add a disclaimer:

"Time saved is an estimated productivity metric based on typical manual task durations and your usage. It is not a guaranteed measurement."

10. Error Handling

The application should gracefully handle:

Empty inputs

Extremely long inputs

API failures

Invalid data

Missing deadlines

Missing task information

Network failures

AI service interruptions

Use clear messages such as:

"We couldn't generate a response right now. Please try again."

Do not expose technical API errors to normal users.

11. Accessibility and Usability

Ensure the application:

Works on desktop, tablet, and mobile

Uses readable typography

Has accessible buttons

Supports keyboard navigation

Uses meaningful labels

Provides loading indicators

Provides clear success/error messages

Does not rely only on color to communicate information

12. Recommended Technical Architecture

Build the application using a modern web stack.

Suggested architecture:

Frontend

React

TypeScript

Tailwind CSS

Modern component library

Backend

Secure API layer

AI integration

Authentication

Data persistence where required

AI

OpenAI/ChatGPT or another suitable LLM

Structured prompts

Structured AI outputs

Validation before displaying results

Database
Store only information necessary for application functionality.

Possible data entities:

Users

Tasks

Emails

Meeting summaries

Productivity metrics

User preferences

13. Security Requirements

Never expose an AI API key in frontend code.

Use secure server-side API calls.

Implement:

Authentication

Authorization

Secure API handling

Input validation

Rate limiting where appropriate

Secure storage

Protection against malicious prompt injection

Treat user-provided meeting notes, emails, and task descriptions as untrusted input.

14. Example User Journey

Scenario: Busy Project Manager

A project manager has:

30 unread emails

2 hours of meeting notes

12 outstanding tasks

Multiple deadlines

They open SmartWork AI.

Step 1 – Email

They enter:

"Ask the client for an extension on the project deadline because testing requires additional time."

They select:

Audience: Client
Tone: Persuasive + Professional

The AI creates a polished email.

Step 2 – Meeting

They paste lengthy meeting notes.

The AI extracts:

Summary

Decisions

Action items

Owners

Deadlines

Step 3 – Task Planning

They enter their outstanding tasks.

The AI creates a prioritized schedule.

Step 4 – Productivity Insights

The dashboard estimates how much administrative time was saved.

15. Success Criteria

The completed application should demonstrate that AI can:

Reduce time spent writing professional emails

Convert lengthy meeting notes into actionable information

Improve task prioritization

Create realistic schedules

Reduce administrative workload

Improve organization

Support better time management

Provide measurable productivity value

The application should be easy enough for a first-time user to understand without training.

16. Final Deliverable

Build a polished working prototype called:

SmartWork AI – Your Intelligent Productivity Assistant

The final product should feel like a realistic professional SaaS application rather than a simple AI chatbot.

Prioritize:

Usability

AI functionality

Prompt engineering

Responsible AI

Productivity measurement

Professional UI/UX

Reliability

Make all three core AI features fully visible and accessible from the main dashboard:

Smart Email Generator | Meeting Notes Summarizer | AI Task Planner

Include sample/demo data so the application can be demonstrated immediately without requiring a user to enter everything manually.

The final interface should clearly communicate the problem being solved, how AI is being used, and the productivity value delivered.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://danielle-assist.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d97c193e-45bb-4858-b852-cdc232e01f05).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
