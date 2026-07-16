**Neil**: I'm gonna make you the de facto MC. As is your lot in life.

**Nick**: Hoy hoy, welcome to another exciting Skill Tree podcast. I'm your host today, Nick Nisi, and I am joined, as always, by Neil Roberts. Neil, how's it going?

**Neil**: Hey, it's good.

**Nick**: You threw me off. You didn't say you were just happy to be here, and now I don't know if you—there we go.

**Neil**: It's an honor just to be nominated.

**Nick**: All right. Balance restored.

**Neil**: I felt bad because I made you start the intro and then I'm like, okay, well, I'm just making him set me up for a bit that I do. It feels unwarranted.

**Nick**: No, it threw me off. I needed it. I was craving it. The audience craves it.

**Neil**: Crave electrolytes.

**Nick**: Yeah. Sounds like we have more than enough fodder for today.

**Neil**: Yeah, that's what kinda started the pushing for you to get the [Notion](../directory/notion.md) out because I'm like, what are we gonna talk about? And then you're like, okay, well, no, that's fine.

**Nick**: I'm the worst. I'm sorry. I'm really coming around on Notion.

**Neil**: I was an early adopter and I've always really liked it.

**Nick**: I jumped ship to [Obsidian](../directory/obsidian.md) just because I wanted the local markdown.

**Neil**: Yeah, I'll be talking about Obsidian later. I like a lot of stuff that it does. I don't know, maybe just the flexibility of Obsidian has been nice.

**Nick**: Yes. Now nothing matters though because [Claude](../directory/claude-code.md) is very aware of Notion and it writes most of my Notion documents for me, so I just throw things into it and I'm like, Claude, go sort this. And it does a great job.

**Neil**: Do they have a good API for that? Notion, eh?

**Nick**: I don't know. It's just an MCP that Claude has.

**Neil**: I'll have to look into it.

**Nick**: Yeah. And it's zero setup because our org set it up. So, skills. [Skills](../directory/skills.md) have not slowed down since we last spoke, I don't think. There's a lot going on right now. A lot has changed for me, a lot has changed in how I work. We were just talking about our show contents for today and literally just saying that, oh, a lot has changed. There is one skill that's not on our list, so I hope you'll forgive me for adding it in, but it is now in [Codex](../directory/codex.md) and it is now in Claude. And I'm wondering if you know what I'm talking about.

**Neil**: Is it the goal?

**Nick**: Yes. The [Ralph Loop](../directory/ralph-loop.md), yeah. Have you tried it yet?

**Neil**: No, but I understand conceptually what it is. I've never been interested in it, but I'm excited that people are doing it in a more streamlined way, I guess. There are some situations where I would like to use it. But those situations, I have not used it and still got the outcome that I wanted. So I'm some sort of wizard, I guess, and I haven't needed it so far.

**Nick**: Yeah. I haven't used it practically yet, but when it came out, I was actually in the office, in our office in San Francisco, and just like, oh, I'm gonna play with this. And I just set it as a background task. And right then, it just came across my radar that the [Remix](../directory/remix.md) 3 beta is out. And they redid Remix and it's all not React. It's a hundred percent less React now in their own thing. I didn't dig into it, but I sure did point Codex at our [TanStack Start](../directory/tanstack-start.md) SDK, and I said, hey, we have this for TanStack Start. Here's the docs for Remix. Go and make me an SDK that perfectly matches. Slash goal. Go do this. And I came back and it said, I have been running for an hour and three minutes. Goal achieved. And it gave a small summary.

**Neil**: Nice.

**Nick**: And it worked 100%. I haven't shipped it yet because I want to thoroughly test it and actually look at the code, but it worked. It was great.

**Neil**: My non-Ralph story in that same vein is that I have a mobile app that I said a year ago that I was gonna release. And it just kind of has been for myself, but I hadn't been able to get it to run on Android. And I had written a bunch of tests with [Maestro](../directory/maestro.md) that would open the app and go through all the different tabs and press back and forward and make sure that the title's in the right place. And so I just told it, hey, run this until end-to-end tests pass. And I let it run and it fixed it and it worked. And it took quite a while. Took, you know, 20 minutes or something like that, but it kept going until it figured everything out and now I have it working on Android. My React Native app's running on Android.

**Nick**: That's amazing.

**Neil**: Yeah. No Ralph Loop, just I don't know.

**Nick**: Knowing how to use the tools, and knowing what they're good at and what you can kind of set it off on. I would put that in the similar vein to what I did in terms of it being like an easy mode for the agent. Because you have it working on iOS, right? So it has a working app.

**Neil**: Yep.

**Nick**: It just has to make it work somewhere else.

**Neil**: I have given it a clear goal already, which helps a lot.

**Nick**: Yeah, yeah. And on mine I had a working SDK and a working example. They're all bundled together in a pnpm workspace. And so I had that and it just knew that it had to make the example. It made the SDK so that it could make the example that did the exact same thing and looked the exact same. And so it was also just like, did it work? Nope. Did I make this page the same way? Nope. Okay, keep going. And it just, you know, it was easy mode for it.

**Neil**: Yeah, the way that I understand the Ralph Loop is really good is if you have kind of a deterministic workflow, if you have something where it's like, I'm gonna look at my issues, I'm gonna pick the top issue. I'm going to do this until it's finished and then I'm going to create this document. That's where I understand it being really helpful, having a process that you run over and over again.

**Nick**: That's where I think it'll be helpful, having a process you run over again where you're just changing the inputs.

**Neil**: Where you're just changing the inputs and outputs, more like what we both did, which is kind of like, make this thing work. In my head, I've always said I'm gonna use this concept as soon as I run into a situation where I've created this start-to-finish workflow that I'm going to just process and churn through until it comes to an end state that I've defined. Because I don't think that there's an agent that'll—a lot of the times it will forget the early steps it was working on through compaction and through even just lossy to-do lists and stuff like that.

**Nick**: Yes.

**Neil**: If you have this pretty clear workflow and you can set it up. If you're custom coding your own agent where you're injecting a system message every single time, then you can kind of get away from that. But if you're at a million context window, it still can be a problem.

**Nick**: That's where it can feel like a real detriment.

**Neil**: Yeah, so that's where I feel like the Ralph Loop is really good because I'm pretty sure it's just throwing out that context window and starting from the top of the loop and running through it again.

**Nick**: But it's cool that it did succeed in its goals. And now, yeah, it's that exact thing, intuitively what tasks I have generally day-to-day where I have this clear goal. Clear in that it can not bother me and know when it's done correctly. I don't have that level of trust quite yet. I'm getting there. I'm practicing. [Devin](../directory/devin.md) has been an eye-opener for me on that. I'm using Devin a lot more just to go do things. But mostly when I do things, I just want Devin to address the PR comments that come in. And then I'll come back later and be like, okay, we're good. And review that and make sure that it didn't just blindly do something. But for the most part it's been pretty decent. But I've also been busy this past couple of weeks building some tools to scratch my own itches on different things. And one of them is
 this cool tool that I built on my flight back from San Francisco, as I was very frustratingly trying to say that I'm a [Jujutsu](../directory/jujutsu.md) user now, which I am not yet, but I want to be. I'm an aspirational Jujutsu user. And I was disappointed in the way that it does work trees. It's just a wrapper on top of Git that does things differently than Git, but it also just works plainly with Git, so you can kind of jump back and forth and experiment, which is pretty cool. But I do a lot of work tree things, and I wrote [a blog post years ago, pre-AI, about how I do git work trees](https://nicknisi.com/posts/git-worktrees/). And it's still the number one thing on my blog, from analytics that gets hit every day. It's good, but the way I do it is I check out a bare repo. And so the working directory has nothing in it ever.

**Neil**: Yeah.

**Nick**: And then I fill it with folders, and all of those folders are the various work trees. And so I just have this one-stop shop where I go for that project. And I've got all of the branches that I have working checked out as folders in there. And that's how I work in them. And that works great. It's less ideal when you're working with Claude because Claude indexes the sessions that it keeps track of, the history, your chat transcripts, by the location on your disk.

**Neil**: Okay.

**Nick**: And so when I delete a work tree, those sessions are still there, but they're not accessible. And they're not something I can go find. I can build a tool to go search for them, which is exactly what I did. And so I built this tool called Sessions. What it does is it just lets you start typing, oh, I was talking about this environment variable or something. And I just type in that environment variable, whatever I'm fuzzy searching, and it will tell me what session that was in. What project, what agent—it knows about Claude, [Pi](../directory/pi-dev.md), and Codex—when it happened. So it'll give me the date. And from there, if I select it, it will tell me exactly how to get back to that. And if it's an existing work tree or place on my system, it'll just say, you want to CD here and then `claude --resume` this hash. And then it copies that to your clipboard so you can just paste it and go if you want to. And if it's a project that you deleted, a work tree that you deleted, all you have to do is make that folder again. It doesn't even have to have the original contents in it. It just has to exist there. So it'll put that command, like `mkdir -p` path to the location, and then `claude --resume` this session. I thought that's pretty cool. It's at least that good to know that I can find where I was talking about some specific thing. Because what I end up doing a lot is doing `/add-dir`. And I will be in one project, but I'll kind of start talking about another project, and it's semi-related.

**Neil**: Mm-hmm.

**Nick**: But then I totally can't remember, was I talking about auth `getSession` over here, or was I talking about TanStack Start over there? It just jumbles in my head. And so I built that out so that I could find what we were talking about and then resume those sessions, or at least get the information about where we left off, what we were doing, what we were planning, things like that. And then I took it a step further over the weekend and built an MCP server into it. And so now in any session I can just say, hey, when did we talk about this? And I can have a more conversational tone with it. And it can be like, oh, we talked about it over here. And here is exactly what we said and where we left off. It's not pulling in that whole conversation, but it will go find that transcript and find the context around what it found and then bring it back in.

**Neil**: Okay. The MCP tool does that.

**Nick**: The MCP tool does that. And so before it was just doing [`fzf`](../directory/fzf.md). And so every time you run `sessions`, it takes a couple seconds for it to start up because it was putting all of that into memory, every Claude session you have. And I defaulted my Claude sessions to not clean up for a year. I will have a year's worth of transcripts by the end of the year. So that's a lot. And so what it does now is every time it kicks off, it just builds a [SQLite](../directory/sqlite.md) index of the entire thing and it keeps timestamps of when it was last run. So it'll only re-index things that haven't been there. And it'll also do a cleanup. So if anything did go over a year or whatever for Codex or Pi, whenever they clean theirs up, it will drop those from the database as soon as it starts up. The initial one took a little while to do the indexing. Now it's super fast because it's not a ton that it has to add to the index. And now it's super fast also to retrieve that information via the MCP. So it's really nice. So I think the MCP is probably the primary way I'll use Sessions from now on because it's just really nice.

**Neil**: Yeah, why doesn't every agent tool have this sort of thing integrated? I don't know. I don't understand what people are prioritizing, but none of the stuff that I do is being helped along by the different agent tools that exist.

**Nick**: Yes. And my theory on that is it never will be. And so it is good to invest in your tools like this. Because this Sessions tool—even if Claude built it in, which I think they actually do have something like that—it won't work if I ever talk about something with Codex or Pi. So I'm always going to have to transcend that because Claude is never going to do anything to support those other ones. They still use `CLAUDE.md`, not `AGENTS.md`, right? They're very hostile towards the environment.

**Neil**: Oh yeah. Every time I'm doing a project that I want to have some sort of automatic setup, I'm like, create a shim called a `CLAUDE.md` that tells it to read `AGENTS.md`.

**Nick**: Yes. So annoying. But it's also—I built a whole bunch of tooling around [`tmux`](../directory/tmux.md) and how I manage all of the sessions that I have. I have all of this tooling to tell me where Claude's running, is it waiting for input from me, etc. And they just came out with Claude agents. You can just type that and it will give you a list of all the running agents that you have. And you can hit the back arrow, the left arrow twice, to go into that from any Claude session and then pick another session, go talk in that one, come back. Really cool, right?

**Neil**: Nice.

**Nick**: And I was like, oh man, well, there goes my cool setup. And then I'm like, wait a minute. No, it doesn't. Because I can support Pi and Codex, which I regularly jump into as well. So there will always be a need to transcend these tools because they won't do it themselves. They want to be the walled garden on everything.

**Neil**: Yeah, that has probably been my biggest frustration. I do want to have some tooling that spans more than one model. Does not seem to exist.

**Nick**: It's very annoying. I did take all of my Claude plugins, which I'm upset that I named the repo `claude-plugins`, because I made them all available and ready to go out of the box with Pi now as well. So it's a Claude marketplace, but now it's also a Pi marketplace, full of my plugins, and it works just as well, which is really great. I guess that's the one exception, right? Well, two exceptions. MCP is one and skills are the other that are kind of like universal standards now, which is great. But it still irks me that `CLAUDE.md` and `AGENTS.md`—I mean, `AGENTS.md` is for everyone but Claude.

**Neil**: It irks me that the skills format doesn't have agents. It has been very frustrating to want to—even in my personal stuff that I'm creating—not have a distributable package that I can give to someone. I have to just put the agents in as markdown files and then say, spawn an agent, if one of this type exists use that one, and then tell it to load this file.

**Nick**: Yeah. So annoying.

**Neil**: Yeah, so stepping off of that, one of the workflows I've really been trying to get really well honed is what I've been using to write blog posts. I got a couple out pretty quickly and then I kind of have been resting on my laurels, but I have a lot of ideas in the pipeline. And every time we record a podcast, it helps me come up with more ideas.


**Nick**: Awesome.

**Neil**: Which is kind of nice. But that's one where the different things that I do, I want to use different models for. It's like, if I'm just trying to scaffold my loose thoughts into something more organized, I want to use one model for that. If I want to try to look for back references that might work with what I'm gonna post, I might want to use a different model for that. And then the thing that really bothers me is that the best writing model in my opinion by far is [Gemini](../directory/gemini.md). I messed around with all of them and it is just the best one by far. But I don't like it as much for a lot of the other parts as the other models. And so I just wanted to be able to have an agent that is spawned by the tool that I'm using that is Gemini 3.1 Pro. So I can say, I'm going to create all of this context for you. I'm gonna do this, this, and this, and then just for the last mile, I want to take that context and give it to Gemini and have it actually do the writing. I have been looking for so many tools that let me do this that don't quite work the way that I want to. I did initially find Pi, which you had been getting into. I initially didn't use Pi at all because it says that it didn't have subagents, which is—

**Nick**: Yeah.

**Neil**: True, but it has a whole plugin and extension system that is really deep and people have created plugins that do subagents. And that do the kind of model-specific agents that I want to use. And so I actually did get my workflow working semi-well in Pi. And then the thing that ended up killing it for me is I ran into a situation where it had spawned a subagent and asked me questions at the same time and I couldn't navigate to look at what the subagent had done. There wasn't a keyboard ability for me to get there without closing out from the answers and going up through it and choosing it and then coming back and asking it to start over again.

**Nick**: Uh-huh.

**Neil**: And so I ended up trying [OpenCode](../directory/opencode.md), which has subagents built in, which is a crazy notion. And I was able to—you can use your mouse in OpenCode. And so you can actually click on something, even when there's something in front of it. It's an amazing technology advancement.

**Nick**: Yeah, that is cool. I didn't know it could do that. I've not played with OpenCode at all.

**Neil**: It seems similar to Pi to me.

**Nick**: I've opened it a couple times and I'm just so annoyed that it changes the background color of my terminal. I know that it's so vain, but I even liked it from that. And then I found Pi and it was just like that. You have to configure everything, including subagents.

**Neil**: So it worked for me for a while, and when I tried OpenCode, everything worked kind of perfectly out of the box. I was able to get my workflow set up really fast and get it all running. And then the other thing that I found out from there is that they have a web server that you can run. And the interface in the web view is really, really nice. And we can get to later how I set it up in a [Docker](../directory/docker.md) container because I liked it so much. And then that lets me do stuff from like when I'm on my phone.

**Nick**: But yeah, we'll get to that.

**Neil**: But yeah, once I found that I could do subagents really well, I could interrogate them and see what they had done really easily. The web server—I haven't done anything else since then. I haven't been able to find anything better than that setup. Although I'm not 100% happy with it. If something else comes along, podcast@skilltree.fm, let me know.

**Nick**: You know, I keep seeing all these tools like Fred K. Schott from [Astro](../directory/astro.md). He's at [Cloudflare](../directory/cloudflare.md) now, I think, because Cloudflare acquired Astro, but he just released something called [Flue](../directory/flue.md). Which is a way to make a sandboxed agent or something like that in TypeScript. I think I saw something like, here's a ten-line coding agent, your own coding agent in ten lines of code built on top of Flue. So maybe there's a route for you. I'm very interested in these tools and just how easy it is now for everything.

**Neil**: I think I've also tried out every potential IDE—or some people call them agent development environments—that exist. I've tried so many of them and they're all broken in some sort of way that really bothers me. I do feel like there's a lot of—so [Warp](../directory/warp.md) is one that I think is fairly popular.

**Nick**: Can you give us an example of one?

**Neil**: Where it's got your terminal, but then it has some sort of file browsing and being able to preview and edit markdown files and some version control and stuff like that. But the way that it does tabs doesn't make sense to me. You can be working in this one environment and then if you split the view, then it stays kind of in that environment. But if you open one of the files in a new tab, that new tab is a completely different user interface related to just that one file they're looking at. And I'm just like, I don't understand how any of this works. Things have been like where I can't scroll the terminal under certain conditions. Just little paper cut stuff, nothing that's super major.

**Nick**: Yeah, it's funny. That would drive me up the wall unless it's a paper cut I made because I don't know what I'm doing. Like in my dot files, you know. There's paper cuts in my dot files for a decade now, and those are my paper cuts. I know them.

**Neil**: It does feel like everything's vibe coded right now. It feels like I'm using so much software and I'm just like, I'm pretty sure this is supposed to work. I've used some of these tools where it didn't update my file tree as files were changed. And I'm like, okay, that seems like it should work. I don't know.

**Nick**: Yeah. That's wild. And that is the thing for sure. Claude is one we give a pass to. [GitHub](../directory/github.md) has just been hurting horribly because they claim they can't handle the load of all of the vibe coders, which is partially true, but also they fall over if the wind blows.

**Neil**: Yeah.

**Nick**: It's crazy right now. And they're being attacked. Like that cache poisoning thing with [TanStack](../directory/tanstack.md). I don't know if you saw that.

**Neil**: Yep.

**Nick**: That is terrifying.

**Neil**: Yeah, I was reading how it works and I'm like, this is even over my head a little bit.

**Nick**: So sophisticated. Yeah. I know someone on the TanStack team and I was asking him, and he was telling me, he's like, yeah, they just opened a PR and then immediately closed it, and that was enough to poison the cache, and then it leaked an OIDC token from there. All of that's in the write-up too.

**Neil**: Yeah, and then it's viral. Because it takes all the associated projects and—

**Nick**: Yeah. [Shai-Hulud](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised) is a good name for it. Yeah, it's wild.

**Neil**: So one of the other things I've been doing is I've been using [OpenCode Go](../directory/opencode-go.md). And so it has all of the open source models. I probably will get a $20 a month plan and use Opus every now and then for some of the hairier problems I run into, but otherwise be using ChatGPT for most of my normal work.

**Nick**: They are testing eliminating Claude Code entirely from the $20 a month plan.

**Neil**: My wife's been kind of following a lot of that community that is messing with Claude Code. Because for her, trying to get familiar with a lot of this stuff, that's the most accessible content. Non-programmer content, and they're all using Claude Code, right? They're all hooking up connections and running scheduling things and doing a bunch of stuff. And I feel like that market has just really added a lot to their bottom line. I also feel like that's the most fair-weather market.

**Nick**: Yeah.

**Neil**: Like if you make it difficult for them to use and they're having to think logistically about when can I do these different things and how do I do error recovery and stuff like that—it's interesting to see how they're gonna navigate
 that stuff.

**Nick**: Yeah. Well, I assume that they're just going to try and get you to use more tokens. And I know a perfect way to use more tokens. That's to ditch markdown for HTML. Did you see this post by—I think it's Thariq, I'm not sure how to pronounce his name, but he's on the Claude Code team and he has a post about [the unreasonable effectiveness of HTML](https://simonwillison.net/2026/May/8/unreasonable-effectiveness-of-html/).

**Neil**: Yeah, I think the first time I saw it, someone was like, hey, how weird is it that someone is pushing something that's going to use more tokens?

**Nick**: Yeah. That's definitely a take, and I mean they're not wrong. It does use it—by me and Claude talking about it, because I've been talking about it with Claude today, Claude's like, ah, it's only gonna use like eight percent more tokens to do what I want it to do. And yeah, that's a lot. But also it's not that much. So I do think if you really dig into it, there is some there there for sure. And I am fatigued. Just like he said in the article, he said he can't focus on a markdown file that's more than a hundred lines long.

**Neil**: Yeah.

**Nick**: I can't focus on a markdown file.

**Neil**: Or a hundred of them that are that long.

**Nick**: Right. Yeah, it's just all day. Vim is a glorified Markdown reader for me at this point, which is just wild. But it becomes a lot, right? I get lost in like, oh, I was reading this, and then I look over somewhere else, and then I have to find my place in there again. And it does a pretty good job with drawing little ASCII diagrams sometimes if it's trying to get a point across. And I appreciate when it does that for sure. But then also I'm just like, this article is right. Why am I fighting this? So I actually have a pull request open right now on my ideation skill to translate to HTML for the planning process of that. Up through it writing the contract, it now writes an HTML contract, so that it can deliver the details to you in a document that's easy and fun to read. It's got a little CSS animation to it, scrolling the page and a table of contents, and it draws diagrams—I think it's using mermaid or something. And it will get you the information with color, with diagrams, with images, with whatever. And when it's asking you a question, it still uses the ask user question tool, but if it's something that it could better describe in an HTML file—like here's three options, go pick the best one—

**Neil**: Yeah.

**Nick**: That's what the ask user tool will say. Like, did you like option A, option B, or option C?

**Neil**: Uh-huh.

**Nick**: And it will open up an HTML page and show you a tabbed interface where you can scroll back and forth through them and see an actual mock-up of maybe what you're trying to create.

**Neil**: Yep.

**Nick**: Super cool. That is worth it right there. And then once you approve it, then it takes that and it condenses it back to markdown to let Claude work with it because Claude doesn't care. The markdown's fine for it.

**Neil**: Yeah.

**Nick**: And it works really well. I'm hesitant to ship it because it's such a drastic change, but also it's really nice. It's a big quality of life improvement for me.

**Neil**: Back to this community that my wife's been—the different communities she ends up seeing when she's learning.

**Nick**: Yeah.

**Neil**: These communities have all been doing this. So it was funny when I saw this because, to be honest, I actually started doing it for some stuff because I saw some of the stuff that they were doing. They would just have something that would look at Reddit and Twitter and then they would tell it, create me a really good looking report. And so I was like, well, that looks great. I'm gonna do that for some of my stuff. So I've been doing this for a little while and I think it's great. But yeah, I think it's really good for output and reports and stuff like that.

**Nick**: Yeah, I think that's a good one.

**Neil**: And in high information context, it's not good for bidirectional stuff.

**Nick**: Mm-hmm. Yeah.

**Neil**: I mean it's fine, but with Markdown you can really just go in and actually tweak things a little bit more easily. To be specific with words. Which you don't have to do as much as you used to, but I still do it a lot. And then the funny thing that happened with the HTML stuff, because I've been watching it develop over the past few days, is I saw people start saying, well, hey, did you know that you can just create HTML and you can just use embedded styles, and then you can have an external style sheet and that really lowers the number of tokens that are sent back and forth—and just watching all these people discover web development.

**Nick**: Yeah.

**Neil**: Well, it's just funny because I think we've been doing web development long enough that we had to program under constraints at some points. I learned image optimization, right? I learned how to encode JPEGs and PNGs and stuff like that down to where—I think there was a special tool I used to use that would analyze the photo and say, this is the right output format to use. And you could get a megabyte image down to like 70k.

**Nick**: Yeah.

**Neil**: And it still looked fine. And there's even a little slider where you could tweak it and be like, well, here's where I notice that things are going wrong. And so I remember this whole period of having to figure this stuff out because we cared more—we were caring about mobile phone bandwidth back then and even some sort of slow internet back then.

**Nick**: Yes.

**Neil**: And it's the same thing again where the constraint is token output, which is literally the same thing, right? You're paying for download speeds.

**Nick**: Yeah.

**Neil**: And so you can do some clever stuff, right? Like you can have it put out HTML with classes, but you also can even tell it, hey, I'm going to be transcribing this format into HTML with these classes. The classes mean these things. And it can actually give you something that's probably smaller—and then you just have a little script that hydrates the nesting and class names and then adds the style sheet to it, and now you have a beautiful web page.

**Nick**: Mm-hmm.

**Neil**: Yeah. I mean, I think this is where I see things going. I think people are going to be using this sort of approach, but finding ways to make it more token efficient.

**Nick**: Yeah, there's definitely experiments around this too. I saw one at a demo a couple months ago from Cloudflare. They were presenting at this event I was at and they were talking about—I forgot what they specifically called it, but they had a comparison where they were showing AI doing a task and then AI using—I think they just called it [Cloudflare Code Mode](../directory/cloudflare-code-mode.md). And using that—you know, Claude Code doing this task that they asked it to do, it used something like 80,000 tokens to do it. But then the code mode one—it was something that Claude was also using, but they forced it to use that instead. And instead of working on the problem and doing it the way that it did it by itself, it focused all of its token usage on building a script to do the thing. And then it just fed the data into the script and did it. And it resulted in like 89% fewer tokens just by focusing on that instead. And it's just a throwaway script that it was done with once it was done.

**Neil**: Yeah, I'm a big fan of throwaway scripts. I think that's something that's not talked about enough.

**Nick**: For sure. 100%. They're so easy now too with Claude. Like you just describe it, and `make temp` is a thing that I use now to just throw things into my temp directory and not worry about it. It'll get cleaned up. This is gonna go away very quickly. I love that.


**Neil**: It's also—being a programmer and doing some of the stuff is really useful. I was helping my wife with this tool. It consumed a lot of markdown files. And I just wrote a little script and all it did was list the table of contents, list what line each of the headings is on, the name of the heading, the depth. And then how many lines it was. And so she could then look through all of these files way, way, way, way faster. And it consumed way less tokens and it was just like this huge win. And if you can kind of think about some of that in terms of dealing with your problems and not just vibe prompting, I guess.

**Nick**: Let's create a new term, vibe prompting.

**Neil**: If you can actually give it some procedure or scripting approach to it, man, things can be way faster and way, way better. Especially when you need correctness, it's really nice to have that stuff.

**Nick**: Oh yeah. Okay. There's another topic that I want to switch us to that I think is super interesting. And I saw you put it in here and it got ideas in my head too. Especially since we've been talking about Shai-Hulud.

**Neil**: Okay.

**Nick**: This whole new world of npm is a very scary place to me right now because at any point I could run `npm install` at the wrong time and I am affected. Just as an aside, did you hear about the dead man's switch that it was putting in there, this Shai-Hulud thing? Like it had something that was checking. And if it detected that you rotated your GitHub token or other things, it would just run `rm -rf` on your home directory. And so you could inadvertently just be like, well, I'm just gonna proactively switch things, and then—you didn't even know because all you did was run an `npm install` and you've got this little ticking time bomb there. It's terrifying.

**Neil**: So mean.

**Nick**: So wild. But there's a cure for that potentially. And I don't know that that's the way that you're using it, but it's—

**Neil**: Sure.

**Nick**: the way that I was thinking about it when I saw this topic in there, and that is your Docker setup. So I want to hear about this because maybe this is what we all have to do is just have these completely sterile environments that we work in.

**Neil**: This happened after I texted you one day and I was like, well, what do you do when you're on your phone?

**Nick**: Yeah.

**Neil**: Because I was really curious. And the answer is there's not really a great solution.

**Nick**: Yeah.

**Neil**: So that was fun. And so I had been looking for some approach for me to—mainly what I wanted to do is I've been using [ReadWise Reader](../directory/readwise-reader.md).

**Nick**: Love that tool.

**Neil**: since it was released. I was using ReadWise before that, where ReadWise is like a highlighting tool. And then they released Reader, which initially was more RSS focused, more feed focused, but has become a really good just general purpose bookmarking tool that I use. And they released their CLI and they released their MCP tooling.

**Nick**: They have a CLI and an MCP? Oh.

**Neil**: Yeah, they have a CLI. Oh, I'm gonna blow your mind with what I'm doing with it. And so they released it and I'm like, well, this is gonna be neat on my desktop, but so many of the times where I'm like, what article was this that I read about? Or like I bookmarked something recently and I've completely forgotten what it was. They don't have a good in-app search, which is funny. So much that happened on my phone that I'm like, well, I wish that I could get a good mobile setup. And I'd been messing with OpenCode. I think I just ran a search and was like, well, what are the different kind of mobile approaches to this? And they're like, well, OpenCode has a web interface. And I use the web interface and I'm like, this is almost nicer than running OpenCode itself. Their web interface is just very nice. It lets you—their question asking tool is a lot of times larger than the available space. And you can't click the next button. Next time it bites me, I'm gonna actually submit a PR or something like that to fix it.

**Nick**: Oh no.

**Neil**: But I've been able to work around it for the most part. But I'm like, okay, this is amazing. I want to run this, but I don't want to just have this mobile thing that has complete access to my whole computer. The way that the web tool works is it kind of gives you full disk access. So I'm like, okay, well, I have to shut this down somehow. And I have a network storage device. I've used Docker Compose a lot, and I think it's really easy and nice to use. And so let me just go through my whole setup, because it's a lot.

**Nick**: Yes.

**Neil**: I don't know if you've expanded it and are looking at the contents, but I'll go through it all. So the main thing that's running is OpenCode web, and that's fairly straightforward. I don't have notes about how all this actually works in my compose container. I think almost all of these are pre-built images.

**Nick**: Okay.

**Neil**: It was pretty easy to put together. I'm running [Tailscale](../directory/tailscale.md) on the network storage drive and all my computers.

**Nick**: Love Tailscale.

**Neil**: So they have a hostname service that you can run in Docker Compose. And so I actually gave every one of these services their own hostname and then I mapped port 443 with their automatic SSL certification to the actual port that it's running internally. So I don't need to remember any of the ports or anything like that. I can just copy the name in Tailscale and run it, which is really nice. So then I got [VS Code](../directory/visual-studio-code.md) running on it. So if I ever do want to actually do some serious coding in that environment, I'm able to load up VS Code and it goes right to the root directory where all of the different stuff that I'm working on runs. One of the big things I want to do is to be able to browse HTML files that it produces, which we were just talking about. I want to browse rendered markdown. I want to browse PDFs. So if it downloads a PDF, I want to be able to read it and not have to open up my laptop and go mount the drive and all that stuff. And so there's a project called [H5AI](../directory/h5ai.md), which has nothing to do with AI, but it's like a file browser. So that's running there. VS Code is nice, but it's hard to edit anything on your mobile device. There's a project called [File Browser](../directory/file-browser.md) that I have running that lets me edit files really, really easily. It's basically just a full screen editor for files. Then I have [CouchDB](../directory/couchdb.md) running on it with the Obsidian MCP server on top of that. And so this is all the services, right? Every 15 minutes I check the ReadWise Reader API for different things that I've saved. Which is mainly YouTube, because ReadWise pulls the transcript and then runs an enhancement on the transcript. It doesn't do it for live stuff, but for everything else it does. So I do YouTube videos. It can do the long form posting that people do on Twitter. ReadWise will grab that content as well. And then any other thing that I bookmark and tag "summarize" gets pulled in as well.
 And so it just every 15 minutes it looks for the last three within those filters. And then I have a summarization script. I've been working on that for a really long time. I used to have it in my iOS Shortcuts and I would run that through [Raycast](../directory/raycast.md) to be able to summarize stuff. And so I've been tweaking it to work exactly how I want to over the course of a year, probably. And so I was able to get that running as an agent in OpenCode. And then I'm just calling OpenCode through the command line to actually summarize those individual articles. And then it submits it through the Obsidian MCP to the CouchDB server. And then I have that CouchDB syncing with all my other Obsidian instances. I bookmark something, or I send something to Reader, and then later on in the day I open up Obsidian, and it's just all there, all summarized. I have this whole workflow going. But then yeah, I can just interact with it as well. I have another little setup where all of the stuff that wasn't in that category, I will check the last day of things in my feed and my inbox and create a little dispatch. So I have a little front end design that creates a little HTML file with different summaries of the different articles. So I can go on there and I can be like, create a dispatch for today. And it'll run all that, and then I can go to `h5ai.<my-tailscale-name>.net` or whatever. And then I can browse to that HTML file and it's just a web server. So I can read that whole thing.

**Nick**: Nice. That is a lot and also awesome. It sounds like in a roundabout way this is an OpenClaw. Is it? Or should it be?

**Neil**: I haven't given it a soul. I don't know. I think doing a setup like this is really nice. Right before this podcast, I was getting so frustrated with these different IDEs that I'm trying, and I was writing the notes down for wanting to talk about this and I'm like, I should just do this on my desktop. It's like I'm doing it on my mobile phone and it's so nice to use that I'm like, why? Because all I want to do is really—I want to do some version control, I want to be able to view files, and I want to run a nice looking agent setup. I tried using [Cursor](../directory/cursor.md) with a web view of the OpenCode web server and it just got really upset and slowed to a crawl. So these are all my little paper cuts.

**Nick**: Yeah, that's cool. I need to build something like this. I switched actually from OpenCode to [Hermes](../directory/hermes-agent.md), but I don't have it doing a ton yet. But this feels like I'm not taking advantage of all of these integrations. Like I've also used ReadWise Reader and ReadWise forever.

**Neil**: Yeah.

**Nick**: ReadWise Reader since it started. And it's super nice. I have so many articles in there though, and I need to go through them. And I've also been using [Raindrop.io](../directory/raindrop.md) as a separate bookmarking service.

**Neil**: Yeah, I tried that a while ago.

**Nick**: Are you just using ReadWise as the—

**Neil**: Just ReadWise now, yeah.

**Nick**: Okay. I've been kind of splitting between things that I feel like I want to read and then things that I just want to bookmark. I was putting them in my to-do list and I just bloated that out with all these to-dos that I'll never do. So now those go into Raindrop so that I can reference them someday. And—

**Neil**: Ignore them somewhere else.

**Nick**: Ignore them somewhere else. But it's been a little better because I did set up the Raindrop MCP. And so I do have it scheduled to go in there and sort anything that's unsorted. And it specifically looks for things that—I might be bookmarking something because I want my agent to read it, like Hermes to read it. And I don't have Hermes reading them yet, but I have it tagging them appropriately.

**Neil**: Mm-hmm.

**Nick**: So that I could feed them in there, and it's like things that I want it to learn or that I want to experiment with, like capabilities that it could do.

**Neil**: Yeah.

**Nick**: And also things for like Claude Code and, oh, you know, a skill that I might want to try or a command line or something like that.

**Neil**: Yep. The other nice thing is that the OpenCode server you can also attach to using the command line tool as well.

**Nick**: Oh really?

**Neil**: So I can do like `opencode attach` and then just paste the hostname in and it just connects to it.

**Nick**: Very cool.

**Neil**: Yeah, and so I can use it just the way that I did before. Although it's a little clumsy because depending on what directory you want to run in, you can't change directories inside of OpenCode. In the web view you can. The web view can switch to any arbitrary directory.

**Nick**: So—

**Neil**: So when you attach to it, you have to specify what directory you want it to run in, which is fine. It's just—I forget to do it sometimes if I'm attaching.

**Nick**: Mm-hmm.

**Neil**: I'm gonna convert you to OpenCode.

**Nick**: Maybe.

**Neil**: It's an average IDE. I don't know. In the grid of lawful, unlawful, and chaotic and neutral, it's right in the middle.

**Nick**: Yeah. I have a lot of respect for it.

**Neil**: I guess it's more like neutral good. I said it's neutral good, right? Like I don't get any vibe-code smell from it. Everything seems to work and be rock solid. Not everything's my preference, but everything seems to work the way that it's supposed to, which is huge.

**Nick**: Yeah, I have a lot of respect for the team that's building it. They're really cool and you can tell that they put a lot of effort into it and that it's really good. In those tools, Pi is the one I'm looking for, for sure.

**Neil**: Well, Pi's configurability is just unmatched.

**Nick**: That's why. Yeah.

**Neil**: I think that if there was a way for me to be able to do some sort of mouse interaction with it, because that's the thing that keeps killing me. You can get a lot of stuff done with the keyboard, but there's like two things that I need to do with the mouse, which is like long scrolls. The fact that I can scroll in OpenCode, just take my mouse and grab a scroll bar and scroll up to like a third of the history, is huge.

**Nick**: Yes.

**Neil**: Little things like that. I don't need that much. I would need to look into the subagent stuff, but with Pi, that's the thing—it's hard to integrate subagents after the fact, I think.

**Nick**: Yeah.

**Neil**: Unless you create an entire set of hooks dedicated to subagents, and then you're like, okay, well, you just added subagents to your IDE, I don't know.

**Nick**: Yeah. Cool. Yeah, well this is a great show.

**Neil**: Sounds good. I'm gonna drag it over to that column now.

**Nick**: Awesome. We now have an organized tree of topics. Topics tree, if you will.

**Neil**: Little by little, just like all AI stuff.

**Nick**: Yep. Constantly improving.

**Neil**: Constantly improving.

**Nick**: Yeah, well it was great talking to you, Neil, and we will see you next time.

**Neil**: I'm pretty bad too unless I really am like, okay, I have this thing coming up. What do I have to do to make it happen?

**Nick**: Exactly.

**Neil**: And then I can be a little bit more pushy and structured.

**Nick**: That is the main thing that makes me think I have ADHD, is like I cannot perform unless I have a looming deadline. And it's crazy. I always find some other distraction if it's like, oh, that's next week. Even talks. Like I went to London to give a talk and I gave a solo talk on Friday morning when I was there. And I woke up at 6 a.m. and that talk was not started yet. And it was a great talk. It was a really fun talk. I really liked how it turned out. Man, it was last minute. But the beauty of Claude is you can't tell it's last minute anymore because I don't have to worry about the design and I have the ideas and it helps me deliver on those.

**Neil**: Yeah. I wouldn't say it's ADHD. I think it's an intuitive approach to life. For me, it's more than just programming or tasks that I have to do. It's just I like to see what happens and I like to go with the flow and it's been pretty successful.

**Nick**: That's the problem. I don't learn my lesson, so I'm just like, well, keep going.

**Neil**: But that's the thing—if you're navigating life intuitively, I feel like there's still that... if you've been doing it your whole life like that, then there's always that thing in the back of your head that is actually making plans. And actually coming up with a strategy for how you're gonna pull it off even as you're procrastinating. Because there haven't been that many moments where I've procrastinated so far that I've failed at something. I've just put it off as long as possible.

**Nick**: Yeah.

**Neil**: If you're procrastinating and then you don't do the thing you're supposed to do because you don't have enough time, that's something different.

**Nick**: Yeah, true.

**Neil**: In intuitive living, that's where I like to be.
