**Nick**: We're back.

**Neil**: We haven't really talked about what I chose for the name for the podcast, so what do you think of "The Skill Tree"?

**Nick**: I like it.

**Neil**: There was this TV show I used to watch when I was little called Fred Penner's Place. And [the intro is a guy going through the woods and through bushes, and he goes through a log and ends up in a secret little clearing in the woods](https://youtu.be/4frIsSEp03E?si=w74lcBQsYgzpOsl_&t=37). And so that's what I think of, us gathering around under the Skill Tree. I sent you a little AI image that I played around with that was trying to convey the vibe that I'm going for.

**Nick**: It immediately invoked the vibe that I've been getting a lot lately with... did you ever watch *The Simpsons*? [The Lemon Tree episode](https://en.wikipedia.org/wiki/Lemon_of_Troy) where Grandpa Simpson's sitting under the lemon tree talking about how things were in the past. That's us right now talking about pre-AI days.

**Neil**: I mean, I learned assembly, so it's moved a while since there.

**Nick**: I am not that old.

**Neil**: I didn't have to learn it for fun. I did computer engineering in college, and that was part of it, just to know what it was.

**Nick**: When did you graduate college?

**Neil**: 2004. Yeah, I graduated high school in the year 2000. That's the easy way to establish where I am.

**Nick**: Got it. I was '05 for high school and '08 for college.

**Neil**: Oh, you did great in college.

**Nick**: I just took summer classes and went as fast as I could.

**Neil**: I almost did a little bit early, but I went to a liberal and applied arts college, so I took an incredible amount of credits that I look back on and I'm like, that was probably dumb to do, a liberal arts degree and an engineering degree at the same time, but I appreciate that I did it. It was a lot.

**Nick**: Well, it made you who you are now. You're here now, so it's all good.

**Neil**: I am. I exist, yes. I think one of the fun ideas someone proposed for the podcast was "Skill Issue," which I did like too, and I was just trying to figure out how to say it in a way that either conveyed the bit or sounded catchy, and I just couldn't. "Skills Issue" sounds a little bit better, but then it's not quite the same joke, so I don't know. I like The Skill Tree. It makes me happy when I say it.

**Nick**: I do too. And that's kind of playing on the way that you're supposed to make skills, right? Like you have a tree of paths that you can take and load in what you need based on that.

**Neil**: I got in touch with you after I had this idea, which was just a weird random idea as we were both getting into skills at the same time, which is probably right after they announced that it was this format that they were pursuing. And I was learning about it and I was just like, it seems like it's a really good platform, not just for learning about the format, but the way that people can use it is so broad and so interesting that I really think it can be a great way to talk about a lot of different things.

**Nick**: For sure. Do you know what the first skill was that you made after learning about them?

**Neil**: I do not remember, no. I'd been using [Cursor](../directory/cursor.md) for a while and I'd been doing a lot of rules, and so a lot of what I needed was already covered by that. So I probably just merged a couple of those over. I started using it for documentation initially. Just the different stuff that I was using would start releasing skills, and I would move those over.

**Nick**: I was at an onsite in San Francisco when skills dropped, and I was actually supposed to give a little AI hour-long talk or workshop, just internally. That morning I woke up and saw Skills, and I'm like, "Oh, this is cool." And it actually took me a lot longer than I should probably admit to understand how this markdown file is different from another markdown file. They're all markdown files. What does this even do? But the one that really opened my eyes to it, I think, was they had some image generation exAmple that it shipped with, and that was cool. Or it would animate them. The first one that I made was a "Claude Skill" Claude Skill, which was supposed to be a meta way to improve your skills with Claude. And it would analyze your `.jsonl` files that Claude makes and figure out how you talk to it and understand the things that you do to it, and then it would go do a code search on GitHub for `SKILL.md` files that would match based on the names, like what you might be doing, and it would suggest them in there. Plus it would suggest some other things about your workflow. "Oh, your `CLAUDE.md` is too big. You seem to be doing this a lot. Maybe you should package that up in this way." It would also analyze how many times it had to ask you for permission on things. And it would be like, "Oh, you sure use the `find` tool a lot. You should maybe add that to your allow list so you don't get bothered by it so much."

**Neil**: This is before they had skill registries.

**Nick**: Yes.

**Neil**: Back in the day.

**Nick**: Literally day 1, like 3 or 4 hours later, after I woke up, I was giving this talk.

**Neil**: Nice. I was thinking we could talk about a couple of the things that we've done with it since. I want to talk about your [ideation](../directory/ideation.md) skill because I feel like that's gotten the most momentum. It seems like you work on it a lot. Every time I use it, it seems like it's slightly different.

**Nick**: I have a pull request out now.

**Neil**: I think the story for it is probably pretty fun too, about how that all started.

**Nick**: I was at [NebraskaJS](../directory/nebraskajs.md), which is a meetup in Nebraska that I have helped run since 2012. And it's basically, we talk about AI now.

**Neil**: It's weird to talk about the nuances of programming languages now, isn't it?

**Nick**: It's so weird. Total tangent, but I was reading the [TypeScript 6 beta notes](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-beta/), like what's coming in TypeScript 6 and all the new features, and I'm like, "Oh, that's cool. I'm sure Claude's gonna enjoy that syntax." Like, I don't care anymore. Such a weird thing to say.

**Neil**: I don't know. I opened up one of the type files that whatever LLM I was using had generated and I was like, "I feel like you could do a little bit better here." I think it was Matt Pocock. He's talking about [how he thinks of things in terms of modules and interfaces](https://www.youtube.com/watch?v=e0AIkYrXAYE). And he spends time on modules and interfaces and then worries a little bit less about the inner workings. And so I feel like TypeScript's a really good one of those interfaces where you can spend a little bit of extra time. You can be indulgent a little bit, perhaps, with your types.

**Nick**: Yeah, and I'm being a little silly in that I look at code all day, but I do feel the importance of it waning a bit. Just the minutiae of every line of code.

**Neil**: It's the little indulgent snack that you can have while you're using your LLM. You can be like, "I'm gonna take a peek at what types it generated and I'm gonna use `satisfies`."

**Nick**: I just added [Oxlint](../directory/oxlint.md) to a project. I wanted to play with Oxlint and [Oxfmt](../directory/oxfmt.md), and it had some issues, and I was like, "I'm gonna go manually fix these. I'm gonna contribute." And I was doing that while Claude was running something else. But I contributed. It felt good.

The skill came about at NebraskaJS. We're kind of doing a show-your-workflow type thing, like, "How are you using AI? Show that off." And people came and showed off what they were doing, and there was one person who showed off a thing that they were building that was really interesting. It was a web app, but it was LLM-backed, and it would ask you questions about the project that you were working on. So you would describe what you were doing, and then it would ask you questions until it got a better understanding of what you actually wanted and kind of pulled that information out of you, which I'm a huge fan of. I immediately started doing that with LLMs the first time I got them.

LinkedIn recommendations was the first thing. It was like, I could have ChatGPT generate this recommendation, but that doesn't seem honest or unique to you. So instead, "ChatGPT, ask me questions about that person and I'll give you answers and then you can help me formulate that." You're extracting the information out of me rather than just making something up. And I've been so hooked on Claude since it first showed up in the terminal, because that's where I live, and I just loved it. And so I'm like, I wonder if I could make this into a skill and use it. And while they were talking, I just made it into a skill. And it's called ideation because at the time I was really getting into dictation and using [Wispr Flow](../directory/wispr-flow.md) for everything, which I still do. But I really wanted a way for me to just brain-dump. I just want to talk for as long as Wispr Flow will let me and then have it brain-dump everything in there, and that's just my raw everything. I don't want to formulate it. I want to jump back and forth between things, and I want it to help me make sense of that chaos that's in my brain. So I thought ideation would be a good name for that because I'm just brain-dumping to you and then you formulate that and you ask me questions to clarify things. It continuously asks you questions until it meets a specific criteria, and there's 5 different things that it scores and they each are worth 20 points. The points have to add up to 95 or greater. If it's any less than that, then it just keeps adding questions to ask you to refine that. It has a whole rubric in it about what makes for good criteria for each of these things and all of that. Once it gets that, it builds a contract. The contract is a markdown file that you can read through and understand from a 10,000-foot view what we're building, what's in scope, what's out of scope.

**Neil**: It isn't super verbose, which is nice. You look at it and you're like, "Oh, I can read this."

**Nick**: Yes. It takes a few minutes to read. You can skim it, honestly, and I do that mostly, skim, jump to different sections, and it's always the same sections. Once you approve that contract, and you can ask it questions once it's built and change things from there, then it starts generating specs. And you can have it generate PRDs too, Product Requirements Documents, if you want. That's if you need buy-in from other stakeholders and you want to generate those to tell the full story. Most of the time I'm just working on things that I know I want to do, so I skip those, and I added an option to let you skip that now too.

**Neil**: PRDs are also really nice interfaces for other tools, [Taskmaster](../directory/taskmaster-ai.md) and stuff like that, that are designed to start from a PRD. Because I feel like the contract is that agreement that you're making with the ideation system, and that's where you really can make a lot of corrections. And then from there the spec is very prescriptive, and a PRD gives you a little bit more flexibility to have something else implemented.

**Nick**: Yes. It kind of follows that "as a user, I want to do this" and tells those user stories in there.

**Neil**: The other thing I like about the way that the contract stage works is that it'll be like, "Do you need to make any changes?" And you're like, "Yeah, I need to make some changes." And then it's like, "Is it this that you want to change?" And a lot of times it's right. It sent you a contract and it kind of knows the parts where it might be a little off the mark, which is fun.

**Nick**: It's really good about that, honestly. I wish I could take credit for that, but that's all Claude. Just filling the blanks. But the specs are a little bit more in the weeds. They oftentimes tell exactly what files to change, what to change the code to, still from... it's not like a 0-foot level. It's probably from a 100-foot level, like what you should do, and it goes from there. And then it generates all of those and it tries to break them up in a couple of different ways. First off, this was generated in the days before the Opus 1 million context window. So it was like, break this up into things that we can do in a single fill of the context, and then we can clear the context and start over with phase 2 and 3 and so on. And so it breaks it up by that, but it also tries to identify what things could be done in parallel and breaks up specs based on that. And this is specifically to support the agent teams mode that you can turn on. It's a beta feature in Claude right now. It'll just spin up a bunch of agents that can all talk to each other, and they have a manager that manages them all. You can interact with that manager and grant permissions to the other agents in the team, and they can go do things and then they'll die. And so it tries to break it up like that. And then it gives you a final prompt of what to do next once those are all generated. And it really comes down to a command, which I just changed into a skill because commands are now deprecated, but it's called "execute spec." And at that point, this is where you can completely clear your context, you can start a new Claude session, do whatever you need to do, and it will basically reload what it needs based on the specs and the contract and the PRD if you have that as well. For each one, you can just say "execute spec" and then point it at phase 1 and it'll start from there and go. This is where I have some changes that are in there now, but right now it kicks off, and before it starts implementing it actually kicks off a scout sub-agent. And the scout's job is to do nothing but read the code and deliver up-to-date information to the main Claude agent to tell it exactly how to do things. So this is where it's really going to dig in from, "I'm trying to do this task. I'm gonna go dig in and make sure I read the code and understand it." It's just forcing it to get into that mindset. Then it's going to understand the code. It'll start making the changes, and it starts going through a loop. While it's going through that, it kicks off another sub-agent that's a reviewer. And it's just looking at the diffs and doing a diff-level review of it as it's going. The main Claude agent is also doing understanding and reviewing it. It has its own concept of feedback loops that are built into the spec. So it understands, "This is the task I need to do. How can I understand that I did that correctly?" And a lot of times that's like create a unit test and do the red-green-refactor thing. That can be it. It could also be like, "Oh, I need to do special logging and then execute the script," and then it'll log out some specific things and I can see, yes, it's actually doing what it does. So it's like an on-the-spot check that it can do. And it'll do that plus the reviewer. And if it runs into any issues, it sends it back and does another loop, another pass on that piece of the spec to get it going. And it'll only do that 3 times, or if it runs into an issue where it can't continue because it doesn't actually know, it's confused on something, then it will stop and go over to a human. And this is all recent changes, like this week changes that I've made, because I want it to run for as long as possible without interrupting me and asking me questions, and it's working pretty well so far.

**Neil**: Nice.

**Nick**: But then it gets to the end and it will write out a summary of what changes it made, where the state is at, and whether it's ready to continue to the next phase from there. It also does a little mini review there of, based on the things that we actually did, did we stick to the plan or do the subsequent phases need modification at all to catch up to where they're at? And so then there I usually commit and then clear the context and then start phase 2, "execute spec" on phase 2 or phase 3. Or what it does also is, if there's anything that can be done in parallel with the agent teams, it actually puts all of this information into the contract so you can keep the contract up in your editor, and it will say like, after you've run phase 2 here is a prompt that then you pass in. And that prompt will be like, "Phase 1 is now complete, phases 2 through 8 can all be done in parallel. You'll kick off these 4 agents that'll each do 2 things. There's this file that they all need to touch. They need to ask permission and do it in single-file order." Never have 2 people, or 2 agents, touching it at once. And then they do all of that communication and it can just run for 10, 15, 20 minutes and do all of the next 8 phases or whatever, and then get to the end. It just speeds up the workflow by a lot.

**Neil**: And then you do have some progressive disclosure in it as well, right? You have things split up a little bit in terms of your different files that you're using.

**Nick**: Yeah, for sure. It's got things like the rubric for what it means to be successful, what it means to understand what I'm asking for, what it means to understand how to do the things that I'm asking for, and things like that. And then it will also progressively disclose the templates for what a contract looks like, what a spec looks like, what a PRD looks like. If you skip the PRDs, it just never loads that into context. Things like that.

**Neil**: Well, that also makes me think that you could, if you wanted to, say, "Well, don't load the rubric from the file. I'm gonna create my own rubric that I want you to use." I've been messing with it and I pretty much tell it, "I actually want you to get to 99%." And it's like, "Okay." I haven't had any problems telling it that, even though it's not a system-level prompt. It's loading in the skill and doing what it's supposed to. I've had a lot of luck with just saying, "Don't actually load this file." So that's another little perk of that whole infrastructure as well, being able to do something like that.

**Nick**: And it's really great. I do these in a bunch of worktrees and I just have them going simultaneously, and then I just kind of hop back and forth between them. It's allowing me to really parallelize my work and get a lot done. And I also just end up sharing a lot of... I go search for news articles on new Claude things. There's a new Claude thing every single day, and then just kick off discussions. That's my kryptonite right now. I'm working, I've got 5 or 6 agents running at a time, and then while they're all working I get to a spot where I'm like, "Okay, let me go check the internet." And then the classic.

**Neil**: I think the [one skill I've been messing with recently](../directory/deepwiki-to-skill.md) is I've been trying to load stuff into context as much as possible for things that are not very well handled by the different LLMs. Because as good as they are, if you're not writing boilerplate React, you still have to hold its hand a little bit. And I think that'll always be true. I don't see someone creating 10 trillion parameter models that can have every single little nitpicky detail of programming. And so I like using [DeepWiki](../directory/deepwiki.md) a lot to go through docs. They have completely free search of any GitHub repository, public or private, if you add your own little authentication token. So you can query it with their MCP tool, and then you can even do a deep research query, which is pretty involved. It runs for several minutes. But just the documentation they create from the repositories is pretty good. So I created a little script that uses 2 other MCP tools. One lists the structure of the wiki document that it creates, and then you can actually download the entirety of the wiki page in markdown as well. So there's a script that goes through and finds the different markdown sections that correspond to the hierarchy from that call and then actually splits them up into reference files. And then when it's done, it passes that structure and all the file names back to the LLM and says, "Use this for the reference section of the skill. But then also find the most relevant documents and from those extract the main skill text for the top of the document. Give me what would be in the overview of this skill file based on everything you've downloaded." So then it creates a `SKILL.md` file based on the project and it lists every reference file. And then I just have automatic progressive disclosure based on a structure that they've already created. I need to publish it. I've just been messing around with it locally, but having an excuse to write a script has been really fun, because skills don't have a lot of scripts most of the time. A lot of the time they're used just for context. So that was really fun.

**Nick**: Yeah, that's fascinating. I haven't used DeepWiki yet. It really works well?

**Neil**: I think it's great. I think the wiki that it puts together is great. And then if you have a private repository, you can edit the structural document that says, "Well, these are going to be the pages and here's how they're nested." And then you can even give it additional context and say, "Well, you missed the nuance of how you explained this page." And then you can run it again and it'll rebuild the wiki based on the overview you gave it. I think if you're the repository owner, it has a `.devin/wiki.json` file that you can put a JSON document in that has this information in it. So as the project owner you can put that document in that explains... it's run by Devin, and they just recreate the wiki based on your instructions.

**Nick**: Fascinating. I'm confused though, because I thought that this was a Google project, but it's a Devin, a Cognition project?

**Neil**: Well, there's a Google version of it. I just like that it's completely free. It's a loss leader, I guess. You can just go to the website anytime and do a deep research question on the codebase and it'll go crazy and figure out a lot of what you're asking.

**Nick**: Okay, nice. And there is an MCP for it.

**Neil**: Yeah, the skill I have, you have to have the MCP for it to work. I couldn't actually find a way on the site to download the full markdown content, but the MCP just gives you the full markdown content. I have a little deep researcher sub-agent that I use that, depending on what I ask, will use [Context7](../directory/context7.md) and Perplexity and DeepWiki. Most of the problems I run into, even if I give it all the context in the world, it still can't figure it out. A lot of the problems I deal with are some weird race condition where you have to do this, then this, then this, and I imagine if you gave it a sandbox and let it iterate on a bunch of tests and bad ideas it might eventually figure it out. But right now I'm still smarter than the LLM when it comes to that stuff, luckily.

**Nick**: That reminds me of an article I saw from the [Amp](../directory/amp.md) people. Amp is another one of these coding agents. It was called [Feedback Loopable](https://ampcode.com/notes/feedback-loopable), and it's talking all about that, where it'd effectively be that, where you give it a sandbox and let it try and fail over and over and over until it identifies the pattern and then it can really go from there. I've been obsessed with that concept ever since reading that article.

**Neil**: I think as costs come down, that's definitely gonna be an interesting approach to dealing with stuff. Things are prohibitively expensive right now to do that. Someday. I've been messing around with some of the open source models. I think GLM-5 is pretty amazing. I went to NebraskaJS for your last meeting and we were talking there. I've been trying to run the ideation script with these models, and Kimi K2.5 is probably the next most capable model and it struggles. It does good, but it doesn't load the rubric, right? It's stuff like that where it's like, you should be able to do that, I think. But GLM-5's really been capable. It's been doing a good job of following pretty complicated instructions. We'll see how things go. It's exciting to think about some of the things that it'll be able to do when model costs come down.

**Nick**: Do you think model costs will come down?

**Neil**: I think there will always be a frontier model that is better, but you keep seeing these open source models that are just getting more and more capable for a quarter of the price a lot of the time.

**Nick**: Help me understand that then. How are you running it? You're not running it locally.

**Neil**: [Mastra Code](../directory/mastra-code.md) has been the most successful harness for that. There's another setup I like a lot called [Agent Zero](../directory/agent-zero.md), which I think is fascinating for a lot of different reasons. I would love to have the creator on sometime. In one of his recent episodes he kind of is like, "I invented skills." He had his own variation of it, but he had packaged up a system of prompts and command-line utilities and everything quite a while ago. He's a fun tinkerer to watch, just to see how he's solving some of these problems. Mastra released their observational memory system, which is fascinating, but he had done something similar where he situationally compresses parts of the discussion as it goes on longer and longer. So those have been... I think Mastra Code is probably the best harness right now, and that's only a couple weeks old at this point. It's actually really tweakable, their setup, because it really is just a bunch of agents under the hood. So you can just mess with the agents and give them different instructions and different tools and stuff like that.

**Nick**: It's built on `[pi.dev](../directory/pi-dev.md)`, which I think is the same thing that OpenClaw uses or whatever.

**Neil**: Yeah, it's fun watching some of the stuff emerge. I think Mastra Code's probably the best playground to use these different models right now. I think it does a better job of dealing with loading skills and talking to MCP servers and stuff like that, which makes sense. That's what their tooling is for.

**Nick**: That's interesting. So are you using that as your agent throughout the day, like Mastra Code?

**Neil**: No. I use Cursor throughout the day. Between the latest Google, the latest Anthropic, and the latest OpenAI models, they've crossed the threshold of writing good code. But it's fun to mess around with the other ones for code spelunking and especially stuff that I think will consume a lot of tokens. Giving it deep research tasks that I haven't been able to get other tools to do a good job with, I'll create a fun little environment and script and prompt for it to churn on a codebase or whatever issue I'm dealing with. I don't use it much to write code, is what I'm saying.

**Nick**: Okay. Somebody at my work was talking about... they're playing with `pi.dev` directly. And they triggered me because they said that to them Claude Code is like [VS Code](../directory/visual-studio-code.md) and pi is like [Neovim](../directory/neovim.md). And I'm like, "Oh, I gotta try this." It's closer to the metal.

**Neil**: It's your catnip.

**Nick**: And I'm just a tinkerer. I love messing with everything. And I feel like Claude Code is pretty tinkereable through Skills and things like that. But I think you can use all of that anywhere pretty much. So there's gonna be some time when I have time, probably this weekend, to dig into pi and see what I can do, see what it's about, and see how extensible it is and how willing I am to extend it.

**Neil**: So I think the last thing I wanted to talk about is what our plan is for the podcast moving forward.

**Nick**: Yeah, sounds good. What is our plan?

**Neil**: What I really want to do is have fun names for all of our segments. That is number 1 most important for me. I want our opening to be called "Front Matter," the first thing we talk about.

**Nick**: Love it.

**Neil**: We can have "Context Poisoning," at some point. I want to have a lot of guests. That's one of the reasons that I thought this was so fascinating, is that we both have gotten to know a lot of different people in tech over the years. We've both attended a lot of conferences and interviewed a lot of people at conferences. And I think there are so many people who have so many fascinating things to say. There are a lot of people that are releasing skills very recently that I think it would be great to have a platform for them to talk about them. When we met up, we talked about Convex releasing their skills, and then I saw LangChain released skills today. There's a lot of new stuff coming out all the time where people are starting to think more about how to inform LLMs about their projects. But I also want to get people in completely different fields that are using skills in different ways to do weird stuff. I would love to have writers and researchers and stuff like that that all rely on creating their own workflows to do stuff.

**Nick**: For sure. Branching out from just software dev, it would be fascinating to see how these tools are being picked up and used and customized.

**Neil**: Also, if we can get more people that are working on the different skill harnesses, that would be interesting as well. How they're ingesting them and what sort of loops they're using and stuff like that, I think is really interesting as well. Being able to reliably trigger skills seems like it's gonna be a huge deal, especially when you see a lot of people moving away from even being able to directly call them. They're kind of relying entirely on prompt-driven skill loading. I also created the email address [podcast@skilltree.fm](mailto:podcast@skilltree.fm), and so I would love to hear feedback about the show and corrections and guest ideas and all that stuff as well.

**Nick**: And about your skills. I want to try 'em.

**Neil**: We should talk about the website that I'm gonna be trying to put together as well. The idea for that, I don't know how well it's gonna work out, but if you go to [skilltree.fm](https://skilltree.fm) right now it redirects to the GitHub skill or the skill on GitHub. And the idea with that is that all of the guest profiles, all of the topics, all of the episode metadata and summaries will be there in markdown files with front matter and transcripts as well. We'll even have instructions for you and me for workflows for how we process the episodes, and probably have a little build scripts locally for outputting the assembled index files, for every episode that a certain topic's mentioned on. And then if someone installs the skill, we're gonna kind of try to sneakily set it up so that if they're talking about a certain topic, the `SKILL.md` file is gonna be pretty small, but it will check the different topics we've talked about and then search the transcript and be like, "They talked about this on this episode. Do you want to listen to it?" And kind of inject a little link into the chat transcript. It's trying to be like a skill for the podcast itself about skills.

**Nick**: That is so clever.

**Neil**: I don't know if it's gonna work or not, but I'm really gonna try hard to make it work. If nothing else, just having all the metadata in a consumable format should be fun for us.

**Nick**: Just natively ask questions about the podcast or about any of the skills that we talk about, and it'll just work. That's amazing. Love it. In a future episode, I want to talk about generating skills, auto-generating skills. I need skills.  I don't wanna write them. How do I generate them? How do I make sure that they are good, so evaluating them? And how do I prevent them from just being randomly rewritten every time I want to regenerate? Like only generate on changes. Things like that.

**Neil**: Have you looked at [Tessl](../directory/tessl.md)'s repository? Because I think they have an eval system that you can include evals with your skill and then they run tests on it.

**Nick**: I actually wrote my own framework for evaluating skills.

**Neil**: And I'm a [DSPy](../directory/dspy.md) fan, so that's always been my go-to eval framework.

**Nick**: Very cool. We'll have to talk about all of that, because I blindly just built one without knowing what I was doing, and it seems to work pretty well. And it's validated now that I'm doing things correctly. When I say I built one, I mean I grew one with Claude.

**Neil**: Tessl has their own podcast, and that's a really good resource. I don't know if they have a good episode on the nitty-gritty of their evals. The one I listened to was just generalizing the repository that they're putting together, but they might have done something more interesting since. But if not, maybe we can get them to come explain it here. I would love to have a deep dive into evaluating skills. I think that is really fascinating. Evals are so hard, though. I did a talk on DSPy optimization recently, and the way that I would explain evaluation is that you almost need to have 2 presentations, one on evaluations as a concept and one on writing good metrics, because they're such vastly different skills, to where even if you're like, "I need to test this, this, and this," well, come up with a good score. How are you gonna come up with one that's granular enough that you know that you're making progress? That's really tough. It's definitely an art.