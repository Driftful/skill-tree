**Neil**: So now you're spending 20% of your— I know you're gonna say zero. You're saying 20% of your time for a lot of developers. Except for Nick.

**Nick**: Hoy hoy! Welcome to the Skill Tree. My name is Nick Nisi and I am joined as always by Neil. Neil, how's it going?

**Neil**: It's an honor just to be nominated.

**Nick**: Nominated for best new skill, maybe? It's only been maybe 2 generational jumps since we've last had an episode in AI world.

**Neil**: I'm pretty sure.

**Nick**: Lots been going on. What have you been up to?

**Neil**: I've been using [Fable](../directory/fable.md).

**Nick**: Did you use it for 3 days and then take a nice long mandatory break, and then come back?

**Neil**: Mandatory break, yeah. Was it only 3 days before they took it off? I don't know.

**Nick**: I think it was.

**Neil**: I've been doing a mental check of what are the things I've worked on over the last 10 years that I got stuck on and quit, and it has gotten me back on track with a lot of stuff. That's my main use case of Fable. I'm not gonna be using it all the time, but every time I'm stuck, it has figured a lot of very interesting things out for me.

**Nick**: It's been amazing. One question I do have for you, because things have changed for me. Have you changed the way that you prompt? Or the way that you interact with AI, or the way that you trust it to get work done? Specifically with Fable, because I have.

**Neil**: Sort of. We'll get to the loop stuff later, I think. That's where I found it to be really valuable. Most of what I've been asking it to do is saying, I have a tough problem. Can you help me figure this out?

**Nick**: That's great. That's kind of similar, in that I just trust it a little bit more to do things. Specifically, I don't need to be so verbose in what I ask it to do. Taking the guardrails off a little, just a tiny bit, to let it more freely think about how to do things. I will say I am running it 100% of the time. It's great though. It does so much. I can just give it plans and it just goes.

I've gotten into this workflow where I also use [Greptile](../directory/greptile.md) to review my code, and they have a CLI. And so I just tell it after it's done, `/loop` go until Greptile gives us a 5 out of 5. And it's just gonna go in a loop forever until Greptile is satisfied. And it'll fix things that come up. It's pretty darn great.

**Neil**: Seeing and fixing problems — that's really the place that I see it really excelling. Obviously planning. I think [Anthropic's](../directory/anthropic.md) always nailed the planning part of AI really, really well.

**Nick**: Definitely. It does really well. And [I can tell you where I was when Fable came back](https://www.youtube.com/watch?v=9fubhllmsBU), because it was just a couple weeks ago and I was in San Francisco at the [AI Engineer World's Fair](https://www.ai.engineer/worldsfair/2026). And they actually announced, I think on stage — Thariq from [Claude Code](../directory/claude-code.md) had an announcement there that Fable was coming back. And that was very exciting. The energy was high.

**Neil**: What is the AI Engineer World's Fair?

**Nick**: It's a conference. It's this signature conference that the [Latent Space](https://www.latent.space/) podcast and [swyx (Sean Wang)](https://swyx.io), runs. I had him on as a guest a couple of times on [JS Party](../directory/js-party.md) way back in the day. And now he's running the world's largest AI conference. I think there was like 8,000 people there. It's absolutely insane. And it was in San Francisco. It was in Moscone, quite big.

**Neil**: I've been there.

**Nick**: It was awesome and it was just so much fun. We had a booth there for [my company](../directory/workos.md), and I also did a workshop, an hour-long workshop called Lifestyles of the AI Native. In that workshop — it was only an hour — we filled the room and we had like 150 people outside waiting to get in. That's how big it was. It was pretty sweet. And we had lots of great conversations about that. It was so much fun.

But that is not even the most memorable thing for me at that conference. Do you want to hear? I don't know if you heard what happened to me at that conference.

**Neil**: I did see some photos of that.

**Nick**: I got the opportunity, on Wednesday of that conference, to be picked up outside of Moscone in a big limo van and be taken an hour down south to where the 49ers play, to attend the US–Bosnia World Cup game in a private suite as part of the conference. It was amazing.

Thariq from Claude Code, speaking of, was in that suite with me. So was Lee Robinson from [Cursor](../directory/cursor.md). So was Dexter Horthy from [HumanLayer](https://humanlayer.dev). I rode down in the limo bus with Ryan Dahl, who created Node and [Deno](../directory/deno.md). Simon Willison was in there, chatted with him a bit.

**Neil**: Oh, awesome. Nice.

**Nick**: And then I look over to the suite directly next to us. And I just have to say this: our suite was slightly nicer because it was less in the corner, so I slightly had a better seat than the people in this suite. And you'll never guess who was in there.

**Neil**: I will not.

**Nick**: Someone by the name of Sergey Brin, created this little app called Google way back in the day. And then also Sundar Pichai, the current CEO of Google, was also in there. That was quite insane. What an event. The US won. We got to stay 2 hours afterwards in the suite to let all of the crowd clear out.

**Neil**: Oh cool.

**Nick**: It was a lot of fun.

**Neil**: Excellent.

**Nick**: Life event for sure.

**Neil**: And now you're much better at AI.

**Nick**: Yeah, for sure. All he did was talk about AI and kind of watch soccer.

**Neil**: Oh, that sounds really fun. I like to tell people that I was on my high school team — I was national champion in the Bahamas, yes.

**Nick**: In the Bahamas? Amazing.

**Neil**: In a country with a total population smaller than the city I live in now, we were national champions, yes.

**Nick**: Hey, that's nothing to laugh at though. That's still an achievement.

**Neil**: I'm a big soccer fan. I had a really, really good coach in high school. I didn't know it at the time, I guess, but in retrospect, very good coach.

**Nick**: Awesome, awesome.

**Neil**: I was talking to someone else and they were like, our coach just yelled at us all the time. And I was like, well, that was not my experience. It's too bad for you. He just told me what to do all the time. That's not how I would coach soccer, but what do I know?

**Nick**: Well, sometimes they yell at you like a dad does, like a good dad.

**Neil**: Like a dad on the sidelines, yeah.

**Nick**: And speaking of dad — have I told you about [dad](../directory/dad.md)? It's this project I've been kind of cooking up, playing around with this idea of just thinking about my workflow and how it's changed with AI.

Writing the code is no longer the bottleneck. I can ship thousands and thousands of lines of code. And you know what the problem is? Everyone else can too.

**Neil**: It could be terrible.

**Nick**: It could be terrible. And everyone else expects me to review their vibe coded code. So that's where the bottleneck really is showing: in reviewing all of that code, because everything feels like a drive-by now. You're less familiar with the code and it's more difficult to focus on it. Especially if you're like me — I've got 12 agents running at a time, and then you want me to look at your code, and now I got 99 problems.

dad is this idea of: what if I could use AI to better equip me with the content of what this code is doing? Not necessarily looking at it for bugs. Not necessarily trying to find all of the syntactical things that I would correct you on. But I want to know why you chose to do it this way, and why it is happening this way, and what the consequences potentially of the logic are — not necessarily just the code.

I thought about it and I was like, I'd love for it to just be able to tell me a story, a bedtime story. And then I would probably put my kids to bed or something and was like, oh, I should just call this dad. The reality is I just like the `.dad` TLD, so I got `diff.dad` and then just called it dad.

**Neil**: Nice.

**Nick**: But it's a fun little CLI written in [Bun](../directory/bun.md). Now you can just install it as a daemon on your machine. So you just run `dad daemon install` and then it'll just be persistently running on one port, and it'll give you a list of all of the PRs that you are expected to review, that you're tagged on, and all of that.

When you click on one, it starts using your Claude account or your [Codex](../directory/codex.md) account or whatever. You can set it up to use whatever you want. And it will use that to tell you a story about the code that's being changed. And it looks at things like the description, what the code is actually doing. If you did force pushes, it tries to glean why that was happening, looking at the history on [GitHub](../directory/github.md), and tries to reverse engineer: oh, you tried this way, but then you went this different route. So I can tell the story about that, about how the code changed and how it became what it is, what you're expecting me to review.

Then it just writes it up as prose, along with full code review, just like you would do on GitHub. But the big difference is, instead of doing code review and telling you these lines in this file change, and then these lines in this file change, and you're just going through it like that — it's like the lines from this file and the lines from this file go together to tell this story about what is happening here. So all of that logic clumps together. It doesn't break it down by file boundary. It's more by logical boundary and what's happening, so that you can better follow it while it tells you a story around that.

But it does have the same functionality that you have on GitHub, where you can comment on a line or grab a chunk of lines and comment on them. And those are bidirectionally synced back to GitHub. So if someone is just looking at GitHub and making comments there, those will immediately show up in dad and vice versa. So you can keep in sync, you're never missing out on any other story. And then you can review, request changes, and approve PRs right from there. And as the PR gets updated, the story gets updated. So it tries to keep it all in sync. It's a continuously evolving thing.

But I think that it's a pretty cool take on it, if nothing else, just experimenting with how we might do code reviews better as we have more code than ever to review.

**Neil**: Even if we didn't have a ton of code to review, I think we're still seeing people being more isolated a little bit. Because you don't necessarily need to have 2 or 3 engineers working on the same bit of code anymore. You really can just have one person going all out on it.

**Nick**: Which means there's only one person who knows that code.

**Neil**: Which is tough. It's just very weird because it's also easier to understand that code at the same time. That's what you're showing with dad. Because I do feel sometimes that when I'm looking at a new piece of code, spending a couple hours getting familiar with it using AI tools, I feel like I'm more knowledgeable about it than I was when I used to work on something for weeks sometimes. Or it'll just explain something in a way that helps me understand it really, really well.

**Nick**: And through the power of AI, you never have to approach any code with fear, like, oh, I just really don't understand this and I spent hours looking at it.

**Neil**: I don't know where to get started.

**Nick**: Just ask AI where to get started. And if you don't understand it, ask it to give it to you at a level of abstraction higher. Or draw a graph, or use [Excalidraw](../directory/excalidraw.md) and draw something. You can tell it infinite different ways of getting it into your brain. And that is one of the most underrealized features of AI: we're always worried about filling its context window, but you can use it to fill your context window. And that's a big shift.

**Neil**: I do like the whole pulling at threads approach to using it, just asking where do I get started and then finding out from there. I wonder if there's a good skill for that, like the idea of a code spelunking skill, if that exists or not.

**Nick**: It does. Well, I found one that I like pretty well, and it relates to a topic potentially that we're going to talk about later, but Matt Pocock has a skill called [`zoom-out`](../directory/zoom-out.md). And you can just keep running it and it'll zoom out a level higher every time. You don't understand it, go zoom out again.

**Neil**: I was thinking it'd be really fun to have something where you find a starting point and then you have to choose your own adventure. And you can say, oh, I want to go back into the API, or I want to go forward into the component that wraps it and provides the interface. [I did see someone create a really cool UI where they had that kind of approach](https://rabbithole.ing/), and then you can thread off of it and keep exploring and then come back to where you were before and branch again and go out from there. I feel like that would be a really good little pattern for that approach.

**Nick**: I like that.

**Neil**: And now I get myself a weekend activity to do. Stay tuned for next episode.

**Nick**: There is one piece of learning that I had while doing dad and working on a feature that I haven't shipped yet. But it's something that I didn't know was possible and I think it's pretty cool. And I think more people should know about it.

**Neil**: Okay.

**Nick**: And that is [MCP](../directory/mcp.md). I bet you didn't know about MCP, Neil.

**Neil**: What is MCP?

**Nick**: The Model Context Protocol.

**Neil**: Wait, no, I heard it's a failed agentic tool.

**Nick**: I think it's more important than ever. I think everything is kind of coalescing around it. Claude just calls them connectors. It's a superpower when I can just be like, find out where we were talking about this in [Slack](../directory/slack.md), and let's continue the conversation here and do it. That's amazing.

But there is a little feature in the MCP spec that is kind of amazing. It's called notifications. Claude calls them channels. I don't know why they invented the protocol and now they have to have multiple names for it. But when I read the blog post about it, when channels came out, I was like, okay, it doesn't seem all that useful, because they framed it in this context of, oh, you can connect Slack and Zoom to Claude Code. My initial thought was, that doesn't make sense, because Claude sessions are kind of ephemeral, right? They just exist, or I have several of them running. So which one does it connect to, and how do you do all of that? And then why would I want it connected to Discord? That just sounds like a terrible idea.

But it is kind of cool because you can actually use them. Well, let me set the stage with what I want to do with dad.

**Neil**: Okay.

**Nick**: dad takes care of the PR piece. But I want dad to be this helper that also helps me get to a PR. I wanted to basically add a watch command where, instead of having a PR as this artifact that it's reviewing, it's reviewing my working directory and guiding me, or helping me understand the context as Claude is just filling in thousands of lines of code.

**Neil**: Like a good dad.

**Nick**: Like a good dad, that's right. And I want that same interface. And I want to be able to comment on it and ask questions. And instead of going to a PR, because there is no PR, I wanted to go back to Claude — to not just any Claude, but my running Claude session — and have the context of the lines that I'm commenting on and why I'm asking it and what question I'm asking, and then having it do all of that inline.

And I was like, I wonder if there's a way to do that, because MCP is very much a push thing. I push and ask for this and then I pull back, but no one can really pull into that, into your running Claude session. That's what notifications are. They let you pull in info as it's coming to you.

It is a little janky. I do have a branch of dad where that works. The problem is your org, whoever's running your Claude account, has to enable channels. And you have to start Claude from the command line with a special flag that enables channels. And you can even specify what channels are enabled and all of that.

It's not quite there to ship a feature around this yet because it's very hard to use, but it's promising and it is something that's pretty cool. And I think that, as I think about it, there's a lot of cool things that you could do when you can push more context into a running Claude session and just have it there. Instead of having Claude run a poller or something, you could just have your logs being pushed in there. Or only your errors — filter the logs to errors and then have those being immediately pushed in, and it can react to those in different ways. Just lots of fun things.

**Neil**: Well, have I told you about [Vercel's](../directory/vercel.md) [eve](../directory/eve.md)? Because they have channels in their tooling, which I think is how you're supposed to really communicate with it, but that's not how I wanted to use it.

There's this concept of basically [Claude plugins](../directory/claude-plugins.md) that I've been fascinated with, and I think I've complained in previous episodes where I'm like, I don't know why people don't think that bundling stuff together into basically a program using different tools—

**Nick**: Like programming.

**Neil**: I don't know why something like that doesn't exist, and I keep my eye open for these kind of things all the time. When Vercel eve came out, that immediately piqued my interest, because it lets you define [skills](../directory/skills.md), MCP servers, instructions, tools, and then channels, right? And so you can connect it to Discord and Telegram and you can communicate with it like that. And it is a harness around all of this stuff. It'll do all your skill loading and connect everything up.

I messed around with it for a little while to try to work on one of my little side projects. And I think it's probably gonna be pretty good someday. It's new enough to where — I mean, they release every day — but I ran into enough paper cuts that I decided to move things back to my favorite little buddy, [OpenCode](../directory/opencode.md).

**Nick**: Nice. I have heard of eve. I haven't used it quite yet. It looks interesting. I'm not super keen on the Vercel lock-in, as they tend to like to do. But if you like the idea of eve and you want something that is not locked to Vercel, but maybe locked to something else — maybe like [Convex](../directory/convex.md), for example. A clone of eve called [adam](../directory/adam.md).

**Neil**: I love Convex. Okay, yes. I love Convex, I'm a really big fan. I follow a lot of their stuff on YouTube.

One of the apps I use — I use an app called [Tapestry](../directory/tapestry.md) on my phone.

**Nick**: Iconfactory, I think.

**Neil**: Yeah, I think it is. I originally got it because I wanted to blend social media, but their UI is so big that a single tweet is the whole screen. So I'd use it just to view YouTube videos. So you're gonna add YouTube channels to it. And so I go through that, and that's the thing that really feeds a lot of my content for my [Docker setup](../directory/docker.md) I talked about last episode.

**Nick**: I have Tapestry. I haven't used it for anything.

**Neil**: For videos and RSS feeds that you want to check a lot. Because I check my stuff every day to find stuff that I'm interested in. So I keep up to date on stuff.

**Nick**: I've been wanting to do that with [Hermes](../directory/hermes-agent.md), but maybe I should just go older school and not have AI do it.

**Neil**: Hermes is the other — I asked you if you had used the skill bundle that they have, which I think is also a step in the right direction. That's my kind of argument, right? I don't care necessarily about eve as a tool. I like that they thought through this way to package all of these different things, to where I can just zip it up and give it to you. And then you can run it in whatever harness you want. And it's this full set of functionality that does a certain task.

Because that's what I've started to do in all my setups. My directories had a lot of globally installed things. I've actually started removing a lot of my globally installed stuff. My directories are kind of these tailored applications for different tasks.

So they had the skill bundle, which is basically just skills and instructions. And then eve is that, but expanded to pretty much every agent functionality you'd want to put into a little package.

**Nick**: Okay, so subagents, hooks — can you do hooks?

**Neil**: I think you can do some sort of hooks, yeah.

**Nick**: That's cool. I think about the same thing. I haven't looked at eve too much, but I do have a lot of Claude plugins specifically. And they have all of that, but of course the downside is that it's Claude only. I have made some of them compatible with [Pi](../directory/pi-dev.md) specifically, but I would love for some portable package for all of these.

**Neil**: You can put in agents too in this format as well. So you can spawn subagents and stuff like that.

**Nick**: But I'm sorry — I thought it was specifically tied to Vercel. Is that not the case?

**Neil**: Not the directory structure, right? They have a harness that runs this directory structure. But there's no reason that any other tool couldn't say, oh well, I'm going to support something packaged like this. It's very close to what you could drop into — so with OpenCode, they have a `.opencode` root folder. And so you can drop a lot of this type of structure in there already. But they're basically promoting this tool as exactly what I'm describing, versus OpenCode, which is more of just a general coding agent.

**Nick**: But if I think about it like the Claude plugins folder structure — is it similar-ish to that?

**Neil**: Similar-ish, yeah.

**Nick**: That's a decent mental model to help me understand the ground that eve is covering.

**Neil**: If this idea of packaging stuff up into these bundles becomes more popular, I'm gonna be pretty excited.

**Nick**: Me too. That's the future. And that's the way I wanna be using all of this stuff. I do use Claude Code primarily, and I both like that because it is a good tool, but I also don't like it because it's a proprietary tool and I'm at the whims of them, and it only supports Claude models — except I did get GPT running in it as well. And I have used that kind of regularly and it's kinda fun.

**Neil**: People have been taking the GPT models and running them in Claude Code and basically saying, oh, these are really good models. It's just their harness is terrible and the instruction set is terrible. And then other people are like, well, Claude's not even that good, but it's just a lot better than what they're doing with Codex.

**Nick**: It's wild how much innovation can be in the harness itself.

**Neil**: Oh, for sure. I think that's one of the things that I had been thinking about talking about today: I feel like I've been kind of getting better at AI development. Or things seem to be working better for me with the AI development I've been doing, but I have not been using frontier models that just came out in the last 2 weeks.

And I think it's just a mixture of decrufting things and putting really targeted bundles of skills and instructions together in the different directories and systems that I'm working on. I've been able to structure things in such a way that I've been able to tackle some hairy problems that I wasn't able to really get done before, but it's not because I'm working with a better model. I don't feel like I've gone out of my way to organize things better. I just think that little by little I've homed in on how I approach it, and it seems to just be doing what it's supposed to be doing now.

**Nick**: It really feels like this is a real thing long term. It's getting easier. It's also shipping more than ever and responsible for more than ever. And that's difficult, but fun.

**Neil**: I heard someone say there's this Pareto principle, which is that 80% of the time coders were coding, and 20% of the time they were thinking through difficult problems and planning and making decisions and stuff like that. And this flipped. So now you're spending 20% of your— I know you're gonna say zero. You're spending 20% of your time on code-related things, for a lot of developers. Except for Nick.

20% of the time on code-related things, and 80% of your time planning, thinking through things, orchestrating things, making sure that things aren't falling through the cracks. It's more of a mental load, because that 80% of the time used to be like me time, where it's a little bit more relaxing, you can get a little bit more into flow state. And so that's kind of gone by the wayside a little bit.

**Nick**: I was thinking about that this past week. I spent like 7 hours in the SFO airport just waiting for my delayed flight.

**Neil**: With your Vision Pro on.

**Nick**: Yeah, you know it.

And then I was so incredibly productive, and I kind of figured out why. You know how someone, for example, might down like 5 espressos and then they feel calm and chill and ready to focus? That was like me, but I had like 15 agents across like 5 different projects. And I was just in this flow state of, okay, now that one's running, now go to this one — and just jumping everywhere. It's not that I felt calmer, but I felt in this flow with everything, and the work was just spinning around me getting done. It felt so good. And then I got on the plane and I was just totally wiped, but it was great.

**Neil**: You're like Tom Cruise in [*Minority Report*](https://en.wikipedia.org/wiki/Minority_Report_%28film%29), just throwing that out there and pulling that—

**Nick**: They literally were spinning around me, with the Vision Pro on.

**Neil**: I want to connect this to something else that I've been thinking about, which is a lot of these productivity gains that I'm seeing. Last episode we talked about this whole loop thing that was going on. And then I've seen all these threads where people are like, I'm going to explain what loops are. And to make myself laugh, I've been running them through my summarization process. And it's just kind of nonsense. But it's been fun to read all those Twitter threads and try to pick out the gems from the ones that aren't gems.

The thing that I realized is that what people are calling loops is what you and I have been doing for a year and a half or more. Which is just, you're building orchestration into your flows where you have skills and tools and MCP servers. You have a script that checks for success or some metric or validation, and then you're improving your skills, sometimes automatically, and there's some sort of memory. And I'm just like, I've been struggling so hard to figure out what loops are, and then I'm just like, oh, it's using AI, but they started calling it loops.

And I know people have — well, they're like, oh well, I have one that wakes up every day and it does this. Or I have a goal and then I have a process that I go through to reach the goal. But I'm like, it's just AI. And I still can't connect the dots about why is it called loops? Like hill climbing, right? Hill climbing is a big part of it — the idea that your next loop is going to be better than your previous loop, I guess. Maybe you have some insight, because I'm lost.

**Nick**: I think because you have some action that it takes, some instructions that it does, and then some verification. And if that verification fails, then it should, with the output of that verification, go back into the implementation and do it again. And then go back to the verification, so it loops on itself to keep going. It's like [Ralph loops](../directory/ralph-loop.md), right? We're the earliest iteration of this.

**Neil**: Yeah, but they talk about it in terms of still a single session sometimes. But it's still called a loop. I think the main thing — the thing that kind of started it off — is people were saying, I'm not running prompts anymore. Or, you know, [the guy that said I'm not writing prompts anymore](https://x.com/steipete/status/2063697162748260627). I think that's probably the thing that is trying to define it, which is that you're not sitting down and saying, I need you to do exactly this thing. And it's kind of flipping it on its back.

I have 2 examples of things I did this past week that I found really cool with loops. One is that I have this website, [`rankduel.app`](../directory/rankduel.md), and I wanted to create a pairwise ranking system, which I was inspired by — [Flickchart](https://www.flickchart.com/) is the name of the site, which lets you rank movies so you find out your favorite movies. And I think that uses [TrueSkill](https://en.wikipedia.org/wiki/TrueSkill) or [Elo](https://en.wikipedia.org/wiki/Elo_rating_system), a scoring system, to do it. But I always wanted to have an exhaustive pairwise sort.

And so I ended up making this site, and I figured out — I mean, years ago, maybe 3 or 4 years ago — I created this really complicated way of doing a pairwise sort that you can just do with like `.sort()`, right? But I made it so that it doesn't stack up a bunch of the same thing multiple times in a row. Because if you were to use [Timsort](https://en.wikipedia.org/wiki/Timsort) or something like that, which is what's in the browser right now — if you were to just run that and say, ask me to compare these two things, I'll tell you the answer — it would end up comparing the same thing against a bunch of other things all in a row.

And so I ended up figuring out a way to get pretty close to a mathematically perfect sort, but without that stacking stuff. And it's more computationally heavy, but I use it for a lot of stuff.

And so one of the things I'd always wanted to do is figure out if it could be faster or better. And so I created a validation, a bunch of scores about stuff that I cared about, which is like, how many choices do you have to make? What's the recurrence number for the first 80% of the run? And what's the area below the curve in the later half of the run? When's the first time that you end up seeing two of them asked in a row? I did all these stats, and so I had this really, really clear validation set and scoring system.

And so I was able to just give it a goal and tell it to just keep experimenting with every sort it could possibly think of. And so it tried everything and it was like, no, yours is the best. Which made me feel good. I mean, it is my scoring, but it was just neat to see that even with Fable trying to predict better ways of sorting. But what was neat is I was able to optimize my implementation a little bit. And so I went from an average of like 5 choices between recurrence of an item to like 5.7. And I'm like, that's huge. To me, that was really impressive.

And then I even went a step further and I was like, well, I want to tell people accurate progress based on an estimate. I want to tell them how confident I am at this point in what I'm showing you, and I want to have a plus-minus range on each of the items. And so then I set it free on that and had it try to come up with the best possible way of dealing with that.

And then I was like, well, I actually found a bug for the way that you're calculating ranges. And that actually makes the sort better, because I was bisecting based on that range. And so now you have a more accurate range, now you're getting more accurate sorting.

And so this didn't take that long. Writing these scoring systems was me just thinking through — that's that 20% or whatever, right? It was me thinking through what are the things that I care about that I need to measure, and then how do I gate that, and how do I tell you what is better and what isn't better. Running across two different areas, and it still ended up making everything faster. I did end up with fewer choices — it's like 3% fewer choices, which is pretty huge. That's really fun to see that all working.

**Nick**: That's really cool. I was gonna say, to that end about loops, it reminds me a lot of my early career days when everyone was talking about functional programming. I did JavaScript for the majority of my career, and so functional just kind of works easily in JavaScript. And I was like, what, I have to learn this? And there were books on functional programming. And then realizing, oh, it's just a function that takes something in and returns the same thing. Or, you know, there's mutation and stuff — there's nuances to it, but the concept itself is incredibly simple. It was just made complicated by using the word functional.

**Neil**: I think I have my book — [*Higher-Order Perl*](https://hop.perl.plover.com/) was one that I read that blew my mind. Perl and JavaScript are both very similar in terms of you can do crazy things with functions.

**Nick**: Yes. We were doing loops before, but now I saw a tweet yesterday, I think, from Peter Steinberger, the guy behind [OpenClaw](../directory/openclaw.md), and it was like—

I know we just all figured out what loops are, but [are we all using graphs now?](https://x.com/steipete/status/2078277297791189132) I don't know, I haven't figured it out yet. It's probably very similar to stuff I'm already doing.

**Neil**: People have really been big on wikilink-style Markdown documents, which I'm a big fan of.

**Nick**: With progressive disclosure in there, right? If you're touching the front end, load this. If you're using the testing framework, load this. Things like that.

**Neil**: One of the things I had in here was about [OpenWiki](../directory/openwiki.md). Which I guess I was gonna talk about later, but it's not anything that is incredibly interesting. The thing that is neat about it is it's designed to, as PRs are merged, read them and update a wiki of high-level stuff about your code base. I think that's pretty cool.

I tried using the personal version of it. They have where you can ingest your tweets and things you save on [Hacker News](https://news.ycombinator.com) and stuff like that. But then they require you to write your own custom instruction in order to drive it, which is fine, but I don't think that I know what I want to do with it clearly enough to write an instruction that is gonna fire once on new stuff that comes in.

**Nick**: I don't want to have to do that.

**Neil**: I trust the code one, right? I assume that whoever wrote the code one did a good job. But they do have — you can do a chat interface with it too, where you can say, take everything that's in this folder and then turn it into a wiki organized by X, Y, and Z. And it'll do that. And you can just keep asking it to do that again, right? It'll take things and it'll update it.

But all that it's doing really is creating a folder of Markdown files with wiki links and stuff like that. But then it's just a harness for that specific behavior, and you can use whatever skill you want.

A lot of the stuff that my wife does — we've done a lot of wikilink-style folders of Markdown files in the stuff that she's doing. And so I've done a lot of this stuff already. So I was kind of hoping OpenWiki would be a little bit more interesting in terms of being able to work with those kind of files, but it really is kind of just an ingestion and organization tool, as far as I can tell.

It's neat to see they have an OpenWiki format for the Markdown files, which is different front matter that you're expected to have in different files, and how you're supposed to have stuff laid out and connected. I'm excited about more of that stuff. Especially if you can put indexes in front of some of that data. It's another little tool that I have in my back pocket for whenever I decide that I need it.

**Nick**: Do you think that it's useful for memories, as a memory format? Or would it be something different from that?

**Neil**: I think you could. It would be interesting to have one oriented to looking through your old chat transcripts and stuff like that. The way that people do some of that analysis now, right? Where you're saying, look for common things that I do, look for things that take longer than they should. You can give the OpenWiki tool that instruction. So you can say, I'm gonna be giving you a bunch of threads of sessions that I've done. I want you to look through and try to identify these things. And then it'll just build a wiki that has those things, right? It'll be like, here's what Neil sucks at when he's using AI.

It's not a bad way to use it. It automates and makes some of that stuff a little bit easier and cleaner. I love specialized tools like that, where someone obviously made this one thing to do this one task really well. And so I can see it for all sorts of tasks.

**Nick**: Nice. I was wondering about that. I'm thinking a lot about memories, but that's why OpenWiki has been on my radar, and I haven't quite used it yet, but I want to.

**Neil**: I think the best way to use it is to just chat with it rather than using an ingestion pipeline. And I think that they have a way you can directly just give it a prompt and let it run. So I think you could just take that kind of approach, because I don't think there's a good way to list a bunch of — you'd have to automate it outside of OpenWiki. Their ingestion pipeline is very oriented around data capture.

But you could easily have, like, every morning I'm gonna have it go through, pull all my sessions since the last time I used it, and then send it all to this wiki, and that wiki already has that instruction baked in about how to ingest that stuff. And you would just say, hey, read this directory, put it in your wiki. Read this, put it in your wiki.

**Nick**: Okay, nice. I'm gonna have a look into that.

**Neil**: The only thing I'm not familiar with is how it indexes, or if it indexes anything. 'Cause I have opinions on that.

**Nick**: On indexing?

**Neil**: Yeah, indexing. I think that Markdown files can act as really good databases, as long as someone's taking the time to properly communicate what is in those files to an AI agent.

**Nick**: I can see that. I have a tool that goes through — we've talked about it before — [sessions](../directory/sessions.md), that goes through your—

**Neil**: I used it the other day. I was doing this research for this one specific thing. And the next day I went into that directory and I went to read the research and it was gone. I didn't delete it. I promise I didn't delete it. And so I'm just like, well, I'm never gonna be able to find this on disk.

I installed sessions and I got the MCP hooked up, and I was like, the other day I had this conversation, I created these specific reports about these specific things. And it was like, oh, you did it in this directory. And it was a completely unrelated directory.

**Nick**: Amazing. Really?

**Neil**: I don't know how I started running it from that directory, but I did all this research in a completely unrelated project. But I found it and recovered it, and you saved me hours of trying to figure out where I accidentally ran something. It was in the most random unrelated directory. It was a completely different area than I normally write code in. It was very interesting.

**Nick**: Check out the update to it. I added a fun tool. Well, it'll be fun at the end of the year for sure, but it's a `sessions wrapped`. It's like a [Spotify Wrapped](https://en.wikipedia.org/wiki/Spotify_Wrapped) style thing. It's super fun. And you do `sessions wrapped --roast`, and it'll use Claude to roast you — make categories that are roasting you a little bit in a friendly way. It's super fun.

**Neil**: Mine's gonna be, you were much angrier at AI in the first few months of the year than you are now.

**Nick**: Mine tells me, you spent this much money and your number one command that you run is `git status`. So you have wasted all that money on a glorified git tool, or something silly.

**Neil**: Speaking of your skills and tools, you made some updates to [ideation](../directory/ideation.md).

**Nick**: Yeah, I have been working on things around ideation. That's my number one skill by far. Or number one plugin, I guess, since it's a number of skills. It does some amazing things, and I wanted to optimize the way that I use it, and so I really worked on simplifying it for Fable specifically, because Fable doesn't need as much handholding on things. But it still keeps the guide and the structure of what it means to know how to do something and all of that.

I added a new brainstorm, which is kind of like a lightweight — let's just talk about this from high level without you jumping in and having to create a contract and all of that.

Let's just talk about it in kind of the same general rubric and framework, but without having to do all of that. So it's a little bit quicker. And then it can naturally flow that conversation into the contract generation for ideation.

And then also, once you get there, one thing that I really like doing is — depending on my trust or understanding of the project that I'm actually trying to do, I like to make it go faster. And I'm constantly looking for ways to optimize that. And so I made an express version of ideation that basically just does ideation and it does the whole contract thing, but once it deems that it has enough info, it just auto-approves the contract and goes. It doesn't ask you to look at it and review it. It's optimized for: you got the information you need from me, let's go. Which I tend to quite like, especially with Fable. Fable is really good at that.

**Neil**: And you just trigger that — you have a different skill name for that one.

**Nick**: Yeah, you can just trigger it with `/express` or `/brainstorm`.

**Neil**: And you had talked about adding HTML to it last time.

**Nick**: Oh yeah, that's there.

**Neil**: I updated it and it does HTML.

**Nick**: Much more readable. I like it. I love Markdown, but — I don't know, they were onto something when they invented HTML for this, because it's good.

**Neil**: My attitude from the last time we talked about it is Markdown's really good if you need to edit something. HTML is really good if you need to read something. We all agreed a long time ago that styled text was a lot better than lines on a page for understanding complicated things all at once.

**Nick**: It's real good at that.

**Neil**: I have actually started using something even before ideation, and that is another one of Matt Pocock's skills, which is called [Wayfinder](../directory/wayfinder.md).

**Nick**: Oh yeah? Nice.

**Neil**: I find ideation useful for things that I don't need to do a ton of research on and that I generally have my head around. That's where I found ideation to be really helpful: I know exactly this feature I need to do, I'm gonna explain it all to you, you're gonna help me make sure I've thought it through enough, and then we're gonna implement it.

Whereas Wayfinder is more like, I feel a little bit lost. And so it starts sort of the same way as you might use ideation, but the best way to use it, in my opinion, is hooking it up to GitHub or GitLab or some other issue tracker. And it will take whatever you're trying to figure out and it'll break it into a bunch of different tasks, where a lot of them are based on the different tools that he also has, like prototyping. Well, grilling is one of them, right? Which is something that ideation does really well, which is going back and forth with you and stuff. And it has research as well, where it'll actually go and do research.

Because these things are all managed in these independent tasks, it creates interdependencies between them and they update each other kind of along a graph. The main ticket is called a map.

I can have something where it's like, I'm not sure what web server I want at this part of the thing I'm building, right? And then it can say, there's these two that have these different trade-offs. I can research how that would apply to your project. And so it builds this map where it can go and research these two servers, and then it'll have a grilling session after that that's based on that research. So it'll say, I found all these trade-offs between these two servers. What do you care about more, this or this? How important is it, this or this? And then that can feed into a later decision that you make. That can build out a whole plan when you're done.

I usually take it and say, I finished this Wayfinder map, and then I send it to the ideation plugin and pick it up from there. ideation is very complimentary. It's like, you've really thought this through, right? I don't have any questions for you. I'm gonna create a contract.

**Nick**: Amazing. That's awesome.

**Neil**: I think he's still getting up to speed on it, but I think the approach of splitting these things into these smaller tasks is really great. There's kind of a gamified aspect to it, because you can look at the different tickets and you can say, well, actually I think if I research this thing first, that's where you're gonna get the most bang for your buck. And so you're kind of picking and choosing what you want it to explore next.

This has happened to me: let's say it does research and it comes back and it's wrong. Or let's say those two tools are named the same thing and they're very similar, and it comes back and it's researched the other tool. I've gone back and said, hey, I need you to rerun this research. You got this, this, and this wrong. And so now it rebuilds that node, right? In this big Wayfinder map that he has. Or I'll ask it to go through decisions again now that I have more clarity about this part of the map.

That whole process, I find it really satisfying. That's the big rub with AI sometimes: you can feel like you don't have the right entry points into some of the stuff, and Wayfinder kind of splits it out in a way that is way more interesting. And then I really like the artifacts that you get when you're done. I've been able to do a couple of things where I was able to take the artifacts and just send someone else a GitHub issue and say, here's why I decided to do this. That's all right there and easy to see.

**Nick**: Nice.

**Neil**: ideation should be able to ingest a Wayfinder map.

**Nick**: I will definitely look into that. That sounds awesome.

**Neil**: We're just giving ourselves homework. I don't know. This podcast is a net loss.

**Nick**: No, it's great. I'm constantly looking for ways to improve and optimize my workflow. Sounds like the perfect way, honestly.

Speaking of, I did want to mention something that happened — totally forgotten till now — that happened to me last week. I was at an offsite in Monterey, California. And while I was there, I got asked by my boss to basically take over this project, which is kind of like a [Devin](../directory/devin.md)-like tool that we use internally.

**Neil**: Okay.

**Nick**: And we've talked about it before publicly. So it's called [TARS](../directory/tars.md). It's like an agent, a software agent that you can run and it can proactively take work and things like that.

And so I've started looking at what I can do. And at first I was just like, oh, I just want to play with this. And I didn't know if I was going to take it over or anything. And I gave Claude this — I was going out to dinner and I literally told it, I'm going out to dinner. I want, by the time I get back, everything to be set up so that I don't have to think about this. And it's just there. And it just works. So you have access to [Notion](../directory/notion.md) and Slack and GitHub and everywhere that we put things — figure it out.

And it went. And it created a folder and it cloned all these repos and set them up. And then it started going through and it was like, oh, I need to set up a Slack bot. And it used computer use to set up a Slack bot. And that all worked.

And then it needed access to some different things. And so it sent a message in a Slack channel saying, hey, can you give my user these scopes or whatever. And they did. And it waited and did that.

And then I needed some admin key thing. And it DM'd someone and very authoritatively said, hey, per the CEO, I'm taking over this project, and I need you to hand over the keys to the— Like in a very direct, authoritative way. And I didn't see it for hours.

And I came back and I was looking at my recent list in Slack and I'm like, I've never messaged this guy before in my life. I read it and I'm like, oh my god. And the only saving grace is when Claude sends a message in Slack, it says sent by Claude, or sent from Claude. And so I was just apologetic. Like, I gave it instructions to set this up and I didn't know it was gonna be like a dictator over here. But it was so funny.

But also, I gave it so little. I gave it 2 sentences about what I wanted and where it could find info about what I wanted. And it just went for hours and just did that, and used computer use, and sent Slack messages on my behalf. This is kind of the future. This is amazing.

I did get it all set up. I have it working and it's great. I shipped 7 PRs today.

**Neil**: And you're getting involved with it? How does that work?

**Nick**: I'm looking at making it much better. We can build the exact tool that we want to have, which I really think that we can do well. And I've got all of these ideas. I've talked about [Case](../directory/case.md) before on this podcast. Case is a much smaller version of this. And this is taking the ideas that I have from Case and doing them on a bigger scale, that runs in a sandbox and can do its own thing. So it's very promising.

I already have been having so much fun getting things working exactly the way I want and setting up a local workflow for it, which has been great. I run one command and then I've got Slack setup, and it's using a local socket connection so that my Slack bot — I created a special one called TARS - Nick. And it's specifically a Slack bot that talks to the dev version of TARS running on my local machine. So I can do local dev completely on it. And it's great. It's so good. So fast.

**Neil**: Is there any details about it you want to go into?

**Nick**: I'm gonna be sharing a lot more about it as things go, as I get really deep into it. But I've been officially on it one day, and it has been a fun one day. I spent a lot of the weekend — I think I spent over $7,000 on Claude this weekend. And it's been fun. It's one of those projects where I just want to hack on it at night and get things going. And I love work like that. Not that I want to work all the time, but work I'm excited about.

**Neil**: We have all these new tools and I feel like people want to implement them right now. And I'm seeing that everyone's really seeing that there might be some potential to this stuff. But from a lot of the stuff that I've seen, people aren't necessarily ready to implement it yet.

Something I'm thinking of is that so much of AI stuff relies on having context and knowing about you. And if that stuff isn't in place — every single week I am adding a new tool to my tool belt that then becomes super useful. So there's all these new tools coming out and new models coming out that are going to become more affordable and more capable. And there's this desire to start using AI now. I see the desire for AI adoption sometimes taking place before any sort of frameworks in which AI can thrive.

**Nick**: I think that that's definitely the case. In some ways, when you said that, the immediate thing that came to my mind was the connector. I want to do all this stuff, but I actually don't have a way of reliably getting the data that I need to work with — whether that's Slack or GitHub even, or Salesforce or Oracle or whatever — into where I would use that tool or that data, and how I would make Claude, or whatever tool, actually good, because it needs that real data. That's one way.

But then there's also that process piece. I call that making your code base agentic-ready, or agent-ready, in some ways. Because not only is it, oh, I need to know what I can do and what I shouldn't do, and kind of have an agreement, whether official or unofficial, with people — but also, if it takes me all day to spin up a staging environment or a dev server or something, imagine how hard it is for an agent that's effectively doing it blind. And if it's not easy to use these very graphical tools, you might have a bad time, or your agent might have a bad time with that too.

So it's thinking a lot about that process, about how easy it is to actually get your code base up and running and testable in different ways. And that's, I think, a big piece of it that people just don't think about when they're first starting off. Like, I need to be ready to use agents just as much as my code needs to be capable of having agents use it.

**Neil**: The context that lives outside of your code. There are a lot of companies that take really heavy engineering approaches to things. It's not just the code, it's why this code. They've documented all the decisions that they've made before that. And I think you get a lot of that when you're connecting Slack or connecting a chat service. 'Cause a lot of those conversations are happening, and it can infer how you like to work, why you make certain decisions, and that can go a long way into these products that are implemented.

Years ago I worked with designers where they'll give me some sort of output. I don't necessarily know anything about how they came up with that. I don't know why they chose those things, what their goal was. Sometimes you'll hire a designer and they'll give you a design brief, and it'll have a ton of information about why things were chosen a certain way. You can use that to help make informed choices about how you implement things. If they say, I created this design system to spark joy, the code that you create is probably going to be able to pick up on that. If it's exactly the same thing, but it's just some designs in a Photoshop file or Illustrator or whatever, so much of that context is lost.

My take, if I was to start recommending to people who want to start adopting AI more, who are writing a lot of code and producing a lot of things — sure, you should start looking at what AI you can add, but you should start trying to figure out what context you can start building. A practice of not keeping records of who you are and why you do the things you do, I think, is a big detriment.

**Nick**: I think being able to pull that context out of anywhere — it has to exist in different places. One of the things that I'm really focusing on with TARS as I'm building it, that agent tool that I'm building — I had a big discussion about this today. I built this whole web UI, and you can start conversations in Slack and then take it over in the web. And my boss was like, if you're having the conversation in the web, we should bring it back to Slack. And I'm like, oh, that sounds disgusting and noisy.

But his argument really is: that's where the work is, and that's where the conversation is, and that's where the context is. For so many people, that's the connector, the main connector for everything. Or MCP — but Claude calls them connectors. And so driving that back in, having that context in a way that is consumable, is a huge thing.

The second most important one, definitely in my work: I use a tool called [Granola](../directory/granola.md), and I have that running actually right now as we're doing this podcast. It just starts up for all of my meetings on my computer. It's gonna give me a summary of this call. And not only that, but I can ask questions live right now — what did Neil just say? — and go through that.

But also those transcripts are available for me via a connector in Claude later on, and I can have that conversation with Claude later to talk about exactly what we talked about on this podcast. What was said in that meeting, and pull action items out of that, and pull relevant context out of that in a way that I might not have gotten on my own if I was just taking handwritten notes or wasn't doing anything at all.

And so it's so important to just have ways of capturing and then ingesting all of that context into where it needs to go. And it can feel wasteful, or information overload at first, because it can be so much data. But honestly, the machines are really good at doing that. Granola's MCP is really good at surfacing the relevant bits. I haven't inspected what it's doing — is it asking a question and Granola's answering, or is it just giving it a full transcript or summary or whatever? But there's all those different ways that it can operate. And none of that is possible if I don't capture it in the first place. So that's why especially a tool like Granola is so good, because it captures it on its own and I don't have to think about it.

This section brought to you by Granola.

**Neil**: I think the recommendation you had, where you were encouraged to take these conversations and bring them back into Slack — I think the thing that is even better than just having them on Slack is that now people can then pick that conversation back up on Slack.

I think that is one of these other things people can do if they're trying to get things as ready for AI as possible: surface things for other people to weigh in on. That conversation, when it comes back into Slack and someone sees it and they respond to it, that response that they made might be the thing that solves the design problem, solves the implementation problem you were having.

The more that you can have the right people be able to see some of these conversations and some of these different threads and provide their feedback on it, that's gonna be way richer in terms of knowing you, knowing your company, knowing what you care about, all of that stuff.

**Nick**: 100%. It's good to surface it to people who might not otherwise find it, because Slack — depending on your company, of course, it might be Teams — but that chat is kind of like where work happens. Unfortunately, that's Slack's tagline.

This is just such an interesting and exciting time, I think, right now, because so many companies are going through this. Everyone has to do this journey, and it's very personal to the company, I think, and how they go about it and all of that. But there's things that definitely set you up for success. And I think that more is more in this case. You should have as much context in there as possible.

**Neil**: I feel like there's a lot of things you have to figure out in order to figure out what tools you need. I don't feel like you can start with tools and then reverse engineer how you might use that tool. I feel like tools are dictated by a bunch of other things.

**Nick**: I see what you're saying. I think that the best way that I've seen companies do this — and I've actually helped a couple of companies with this process — is realizing what it is, and that it is a very personal thing to the company. And so one way for one company is not going to necessarily be the right way for all companies. And it depends a lot on your company culture and all of that.

But to be the most successful — I've seen it done at [companies like mine](../directory/workos.md), that's very AI-pilled and self-described as being AI-pilled. And I've seen it at companies that are traditionally a little more conservative when it comes to tools like this, and they're not really tech companies, but they use a lot of tech in what they do.

The way that I have seen it work, especially at companies like that, but really at all companies, is you need two things to get it off the ground and successful. You need a champion, someone who is really passionate about it, or really eager to learn and understand how to bring the relevant context of the company into the tools and what's currently available.

And then just as importantly, that champion needs a real budget. Not, oh, Microsoft gave us Copilot for a weekend, so we'll let you have that. It's gotta be: no, I need to be able to drive these tools, and I need to be able to actually connect data and figure out what it means to connect data safely to this, because that's where all of the magic is and where all of the power is.

And so you need someone who's actually going to drive it, not just half-heartedly try something with AI and then claim that it didn't work, or it's not for us, or whatever. You need someone who's actually like, no, I'm gonna go change things. And, oh, I just learned this other thing, so I'm gonna tear it all down and try it this way.

Not necessarily to be burning thousands of dollars on Fable, but I need a lot of time and money to figure out what works and what doesn't. And then start building champions across departments, to be like, hey, look, this is what I did. Look at how many hours I'm saving because of this. This one simple task that I did every week — AI now does that, and I don't have to spend more than a minute on it. Or it just schedules now and it's done.

And figuring that out — I think that's some of the biggest things that you can do. And where I've seen it successful is that champion plus budget.

**Neil**: If they're not ready to commit that, I feel like it would make a lot of sense for them to start thinking about: what are the processes I'm doing that I don't like to do, that are repetitive? Have I been documenting that stuff? Have I thought through some of that data? Even before they get AI.

**Nick**: They need to have the space to experiment. And that's what a champion helps the organization realize: I need to understand what it can do and how I can connect. And I need to understand that this is kind of non-deterministic, and so mistakes can happen. Have a more blameless culture around that, have safeguards in place as much as possible, and be able to focus attention on what matters — knowing what the goals of the org are and being able to boil that down to different things, and then being able to experiment and try things. Because not everything's gonna work right off the bat. And you're probably gonna do a lot of changing over the first couple of weeks. But there's real power there if you have the time and the space to do it.

**Neil**: I think what you're almost saying is: yes, do what I'm kind of arguing for, right? Yes, start putting practices and procedures and data sharing and all that stuff in place. And also have a person familiar with AI, championing AI, that can help guide some of that. While also using AI.

You do have to tell people, hey, if we're gonna be starting to use AI, we need to be surfacing some of this stuff. I would need to be paying more attention to some of this stuff. And it can make your lives a lot better depending on how you approach it.

**Nick**: Definitely. There's so much there. It's so difficult.

**Neil**: I want to revisit it as we go, for sure.

**Nick**: For sure. All right, well, that was a fun conversation. Should we end it here today, Neil?

**Neil**: I think so. It was a good chat, a good Monday chat. We'll see how long this one takes me to edit. I'm hopeful. I'm hopeful. I'll chop it up. Chop it up and see what we get.
