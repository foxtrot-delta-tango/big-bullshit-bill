<template>
    <div class="about">
        <section>
                <h1>Why?</h1>
                <p>
                    Look, we know digging through 800 pages of legal jargon isn’t exactly how most people want to spend their evening. Turns out, half of Congress seems to feel the same way!  For example, Georgia Representative <a href='https://www.youtube.com/shorts/Y9SSNqYGWTQ' target='_blank'>Marjorie Taylor Greene recently admitted</a> that she didn’t even read the Big Beautiful Bill before voting on it.  If the folks writing and passing these laws can’t be bothered to read them, the least we can do is make sure <strong><em>We, The People</em></strong> know what’s actually in it.</p>
                    <p>
                So, inspired by <a href='https://www.project2025.observer/' target='_blank'>the outstanding work put forth by the Project 2025 Tracker team</a>, we’re here to break it down for you. We can't trust our legislators to put in their due diligence, and as <a href='https://www.businessinsider.com/gop-congressman-calls-out-marjorie-taylor-greenes-stock-trades-2025-5' target="_blank">they've already proven</a>, they are in a unique position to take advantage of the political landscape to benefit their own pockets.  If we stop paying attention, they get away with even more.
            </p>
        </section>
        <section>
            <h1>How?</h1>
            <p class='center-text'>
                Fight 🔥 with 🐲.  We’re using AI to help us sift through the legalese and research everything <em>rápidamente</em>, because how the fuck are <strong><em>We, The People</em></strong> supposed to be able to read and comprehend this <a href='https://www.yahoo.com/news/trumps-big-beautiful-bill-over-235628822.html' target='_blank'>23,450 line Bill</a> in time to be able to give our representatives feedback before <a href='https://apnews.com/article/trump-big-bill-senate-gop-debt-a0679756c6af762ac0291be6cb647145' target='_blank' rel='noopener noreferrer'>the vote on the 4th of July</a> otherwise?!  I sure can't, so lets take advantage of Big Tech to help us fight back while we still can.
            </p>
            <p class='center-text inline'>
                Because AI cannot be trusted, we humans are going through every single section as quickly as possible and verifying them to ensure everything is both accurate and up-to-date.
            </p>
            <p class='inline'>
                Sections which are already verified by human beings will have a <i class='verified'>✔</i> before them.
            </p>
            <p class='inline'>
                Those which are unverified will have a <i>?</i>.
            </p>
            <p>
                If you would like to volunteer to join us (please, please help, lol), just send us a message at one of our contacts (listed below) with what you'd be available to help with, and we'll go from there.
            </p>
        </section>
        <section>
            <h1>Contact Us</h1>
            <a href='https://github.com/foxtrot-delta-tango' target='_blank'>GitHub</a>
            <a href='https://bsky.app/profile/big-bullshit-bill.bsky.social' target='_blank'>BlueSky</a>
        </section>
    </div>
</template>

<style scoped lang='scss'>
h1 {
    margin: 0;
    text-align: center;
}

.about {
    padding: 2em 15em;
    background: var(--color-section-bg);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: 1em;
}

section {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    align-items: center;


    h1 {
        text-transform: uppercase;
    }

    p {
        color: var(--color-text-light);
        line-height: 1.7;
        text-indent: 1.5em;

        &.center-text {
            text-align: center;
        }

        &.inline {
            margin: 0;
            line-height: unset;
            text-indent: 0;
            display: flex;
            justify-content: center;
            align-items: baseline;
            gap: 0.5em;
        }
        
        i {
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border: 3px solid;
            background-color: var(--color-bg);

            &.verified {
                border-color: var(--color-primary);
            }
        }
    }
}

strong {
    font-weight: 600;
}
</style>
